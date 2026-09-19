import React from 'react'
import MenuTable from '../Menu/MenuTable'
import OrderTable from '../Orders/OrderTable'

/** Owner landing page: orders first, then the menu. Stacked so each wide table keeps its columns. */
export default function RestaurantDashboard() {
  return (
    <div className='space-y-4'>
      <OrderTable />
      <MenuTable />
    </div>
  )
}
