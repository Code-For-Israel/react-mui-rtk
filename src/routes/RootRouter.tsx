import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from '../pages/Home/Home'
import { Login } from '../pages/Login/Login'
import { Register } from '../pages/Register/Register'
import { paths } from './paths'
import { ProtectedRoute } from './ProtectedRoute'

export const RootRouter: React.FC = () => {
  return (
    <Routes>
      <Route path={paths.LOGIN} element={<Login />} />
      <Route path={paths.REGISTER} element={<Register />} />
      <Route path="/" element={<ProtectedRoute />}>
        {/* All routes that require auth should be here */}
        <Route path={paths.HOME} element={<Home />} />
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Routes>
  )
}
