export interface LoginRequest {
  email: string
  password: string
}

export interface TokenRequest {
  refreshToken: string
}

export interface TokenResponse {
  token: string
  refreshToken: string
}
