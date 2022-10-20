export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  verifyPassword: string
  name: string
}

export interface RegisterResponse {
  name: string | null
  email: string
}

export interface TokenRequest {
  refreshToken: string
}

export interface TokenResponse {
  token: string
  refreshToken: string
}
