export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  stackTrace?: string
  version: string
  service: string
}
