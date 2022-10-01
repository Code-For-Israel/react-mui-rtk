import { Navigate, Outlet } from 'react-router-dom'
import { selectUserState, useAppSelector } from '../store'
import { paths } from './paths'

export const ProtectedRoute = () => {
  const user = useAppSelector(selectUserState)
  return user ? <Outlet /> : <Navigate to={paths.LOGIN} replace />
}
