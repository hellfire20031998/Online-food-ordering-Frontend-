import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminRoute from './AdminRoute'
import CustomerRoute from './CustomerRoute'
import ProtectedRoute from './ProtectedRoute'

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
      <Route path='/*' element={<CustomerRoute />} />
    </Routes>
  )
}
