const config = {
  storage: {
    REFRESH_TOKEN_KEY: 'AUTH_REFRESH_TOKEN',
    TOKEN_KEY: 'AUTH_TOKEN',
    USER_KEY: 'AUTH_USER',
  },
  api: {
    API_URL: process.env.REACT_APP_API_URL!,
    TIMEOUT: parseInt(process.env.REACT_APP_TIMEOUT!),
  },
} as const

export { config }
