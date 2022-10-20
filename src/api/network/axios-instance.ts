import { TokenRequest, TokenResponse } from 'api/dtos'
import { ApiResponse } from 'api/types'
import axios from 'axios'
import { config } from 'config'
import { StatusCodes } from 'http-status-codes'
import { storageUtil } from 'utils'

export const axiosInstance = axios.create({
  baseURL: config.api.API_URL,
  timeout: config.api.TIMEOUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
  validateStatus: status => status >= StatusCodes.OK && status < StatusCodes.BAD_REQUEST,
})

// Add an auth header using the token from the storage
axiosInstance.interceptors.request.use(
  async axiosConfig => {
    const token = storageUtil.get(config.storage.TOKEN_KEY)

    if (token) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        authorization: `Bearer ${token}`,
      }
    }

    return axiosConfig
  },
  error => {
    throw error
  },
)

// This interceptor will make sure to handle server errors and unwrap responses
axiosInstance.interceptors.response.use(
  async response => {
    if (!response.data?.success || !response.data?.data) {
      throw Error(response.data?.error || 'something went wrong')
    }
    return response.data
  },
  async error => {
    throw error
  },
)

let isRetryInProgress = false

// If the response is 401, try to refresh the token and resend the request
axiosInstance.interceptors.response.use(
  async response => response,
  async error => {
    const axiosConfig = error?.config

    if (error?.response?.status === StatusCodes.UNAUTHORIZED && !axiosConfig?.didRetry && !isRetryInProgress) {
      // If after retry we are still unauthorized, don't try again
      axiosConfig.didRetry = true
      // Prevent multiple requests from renewing the token
      isRetryInProgress = true

      try {
        const result = await refreshTokensAndSave()
        if (result?.token) {
          axiosConfig.headers = {
            ...axiosConfig.headers,
            authorization: `Bearer ${result?.token}`,
          }
        }
        return axios(axiosConfig)
      } catch {
        // If we do not manage to refresh the token, clear all storage and redirect to login
        storageUtil.clear()
        if (!['/login', '/register'].includes(window.location.pathname)) {
          window.location.href = '/login'
        }
      } finally {
        isRetryInProgress = false
      }
    }

    // If another request is already renewing the token, wait for it to finish
    if (isRetryInProgress) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(axios(axiosConfig))
        }, 100)
      })
    }

    throw error
  },
)

const fetchNewTokens = async (refreshToken: string): Promise<TokenResponse> => {
  const body: TokenRequest = {
    refreshToken: refreshToken,
  }

  const response = await axiosInstance.post<ApiResponse<TokenResponse>>('/auth/token', body)
  if (response.status >= StatusCodes.BAD_REQUEST || !response.data?.success || !response.data?.data) {
    throw new Error('No token received from server')
  }

  return response.data.data
}

const refreshTokensAndSave = async (): Promise<TokenResponse> => {
  const refreshToken = storageUtil.get(config.storage.REFRESH_TOKEN_KEY)
  if (!refreshToken) {
    throw new Error('No refresh token in storage')
  }
  const newTokens = await fetchNewTokens(refreshToken)
  storageUtil.set(config.storage.REFRESH_TOKEN_KEY, newTokens.refreshToken)
  storageUtil.set(config.storage.TOKEN_KEY, newTokens.token)
  return newTokens
}
