import * as aws from '@pulumi/aws'
import { local } from '@pulumi/command'
import * as pulumi from '@pulumi/pulumi'
import * as synced_folder from '@pulumi/synced-folder'
import { v4 as uuidv4 } from 'uuid'

// Import the program's configuration settings.
const config = new pulumi.Config()
const indexDocument = config.get('indexDocument') || 'index.html'
const errorDocument = config.get('errorDocument') || 'index.html'
const timeoutMs = config.getNumber('timeoutMs') || 5000

const backendStack = new pulumi.StackReference('backend.dev')
const backendURL = backendStack.getOutput('url')

// Create an S3 bucket and configure it as a website.
const bucket = new aws.s3.Bucket('bucket', {
  acl: 'public-read',
  website: {
    indexDocument: indexDocument,
    errorDocument: errorDocument,
  },
})

const buildCommand = new local.Command('build-command', {
  dir: '../',
  create: 'npm run build',
  environment: { REACT_APP_TIMEOUT: timeoutMs.toString(), REACT_APP_API_URL: backendURL },
  assetPaths: ['build/**'],
  triggers: [uuidv4()],
})

// Use a synced folder to manage the files of the website.
const bucketFolder = new synced_folder.S3BucketFolder('bucket-synced-folder', {
  path: '../build',
  bucketName: bucket.bucket,
  acl: 'public-read',
})

// Create a CloudFront CDN to distribute and cache the website.
const cdn = new aws.cloudfront.Distribution('cdn', {
  enabled: true,
  origins: [
    {
      originId: bucket.arn,
      domainName: bucket.websiteEndpoint,
      customOriginConfig: {
        originProtocolPolicy: 'http-only',
        httpPort: 80,
        httpsPort: 443,
        originSslProtocols: ['TLSv1.2'],
      },
    },
  ],
  defaultCacheBehavior: {
    targetOriginId: bucket.arn,
    viewerProtocolPolicy: 'redirect-to-https',
    allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
    cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
    defaultTtl: 600,
    maxTtl: 600,
    minTtl: 600,
    forwardedValues: {
      queryString: true,
      cookies: {
        forward: 'all',
      },
    },
  },
  priceClass: 'PriceClass_100',
  customErrorResponses: [
    {
      errorCode: 404,
      responseCode: 404,
      responsePagePath: `/${errorDocument}`,
    },
  ],
  restrictions: {
    geoRestriction: {
      restrictionType: 'none',
    },
  },
  viewerCertificate: {
    cloudfrontDefaultCertificate: true,
  },
})

// TODO: invalidate cdn cache for index.html

// Export the URLs and hostnames of the bucket and distribution.
export const originURL = pulumi.interpolate`http://${bucket.websiteEndpoint}`
export const originHostname = bucket.websiteEndpoint
export const cdnURL = pulumi.interpolate`https://${cdn.domainName}`
export const cdnHostname = cdn.domainName
