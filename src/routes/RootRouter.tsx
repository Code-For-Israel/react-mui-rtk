import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Login } from '../pages/Login'
import { paths } from './paths'
import { ProtectedRoute } from './ProtectedRoute'

export const RootRouter: React.FC = () => {
  return (
    <Routes>
      <Route path={paths.LOGIN} element={<Login />} />
      <Route path="/" element={<ProtectedRoute />}>
        {/* All routes that require auth should be here */}
        <Route path={paths.HOME} element={<div>Home 🏠</div>} />
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Routes>
  )
}
