export enum Role {
  User = 'User',
  Admin = 'Admin',
}

export interface RegisterRequest {
  email: string
  password: string
  verifyPassword: string
  name?: string
}

export interface User {
  id: number
  email: string
  name?: string
  role: Role
}
