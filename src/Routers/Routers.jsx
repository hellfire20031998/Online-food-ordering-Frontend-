import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminRoute from './AdminRoute'
import CustomerRoute from './CustomerRoute'
import ProtectedRoute from './ProtectedRoute'
import TeamRoute from '../TeamComponent/TeamRoute'
import { TEAM_ROLES } from '../component/config/roles'

export default function Routers() {
  return (
    <Routes>
      <Route
        path='/admin/restaurant/*'
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path='/team/*'
        element={
          <ProtectedRoute allowedRoles={TEAM_ROLES}>
            <TeamRoute />
          </ProtectedRoute>
        }
      />
      <Route path='/*' element={<CustomerRoute />} />
    </Routes>
  )
}
