import { LoginRequest, TokenResponse, User } from './dtos'
import { axiosInstance } from './network'
import { ApiResponse } from './types'
import { RequestConfig } from './types/request-config'

const login = async (loginRequest: LoginRequest, config?: RequestConfig): Promise<TokenResponse> => {
  const apiResponse = await axiosInstance.post<LoginRequest, ApiResponse<TokenResponse>>(
    '/auth/login',
    loginRequest,
    config,
  )
  return apiResponse.data!
}

const getMyUser = async (config?: RequestConfig): Promise<User> => {
  const axiosResponse = await axiosInstance.get<never, ApiResponse<User>>('/users/me', config)
  return axiosResponse.data!
}

export const apiRequests = {
  login,
  getMyUser,
} as const
