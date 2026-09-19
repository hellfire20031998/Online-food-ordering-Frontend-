import { Button, Card, CardContent, CardHeader, Chip } from '@mui/material'
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateRestaurantStatus } from '../../component/State/Restaurant/Action';
import PayoutAccountCard from './PayoutAccountCard';

/** Label / value line that stacks on phones and sits side by side from small screens up. */
const Row = ({ label, children }) => (
  <div className='flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-4 py-1.5'>
    <p className='sm:w-40 flex-none text-gray-400 text-sm sm:text-base'>{label}</p>
    <div className='text-gray-200 break-words min-w-0'>{children ?? '—'}</div>
  </div>
);

export default function RestaurantDetails() {
  const restaurant = useSelector(store => store.restaurant.usersRestaurant);
  const dispatch = useDispatch();

  const handleRestaurantStatus = () => {
    if (!restaurant?.id) return;
    // The success action already stores the updated restaurant; no refetch needed.
    dispatch(updateRestaurantStatus({ restaurantId: restaurant.id }))
  }

  if (!restaurant) return null;
  const contact = restaurant.contactInformation || {};
  const address = restaurant.address || {};

  return (
    <div className='pb-10 space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2'>
        <div>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold'>{restaurant.name}</h1>
          <p className='text-gray-400 text-sm'>{restaurant.cuisineType}</p>
        </div>
        <div className='flex items-center gap-3'>
          <Chip label={restaurant.open ? 'Open for orders' : 'Closed'} color={restaurant.open ? 'success' : 'default'} />
          <Button
            color={restaurant.open ? 'error' : 'primary'}
            variant='contained'
            onClick={handleRestaurantStatus}
          >
            {restaurant.open ? 'Close now' : 'Open now'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader title={<span className='text-gray-300'>Restaurant</span>} />
        <CardContent sx={{ pt: 0 }}>
          <Row label='Owner'>{restaurant.owner?.fullName}</Row>
          <Row label='Restaurant name'>{restaurant.name}</Row>
          <Row label='Cuisine type'>{restaurant.cuisineType}</Row>
          <Row label='Opening hours'>{restaurant.openingHours}</Row>
          <Row label='Description'>{restaurant.description}</Row>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Card>
          <CardHeader title={<span className='text-gray-300'>Address</span>} />
          <CardContent sx={{ pt: 0 }}>
            <Row label='Street'>{address.streetAddress}</Row>
            <Row label='City'>{address.city}</Row>
            <Row label='State'>{address.state}</Row>
            <Row label='Postal code'>{address.pincode}</Row>
            <Row label='Country'>{address.country}</Row>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title={<span className='text-gray-300'>Contact</span>} />
          <CardContent sx={{ pt: 0 }}>
            <Row label='Email'>{contact.email}</Row>
            <Row label='Mobile'>{contact.mobile}</Row>
            <Row label='Social'>
              {(contact.instagram || contact.twitter) ? (
                <div className='flex items-center gap-3'>
                  {contact.instagram && (
                    <a href={contact.instagram} target='_blank' rel='noreferrer' aria-label='Instagram'>
                      <InstagramIcon sx={{ fontSize: '2rem' }} />
                    </a>
                  )}
                  {contact.twitter && (
                    <a href={contact.twitter} target='_blank' rel='noreferrer' aria-label='X'>
                      <XIcon sx={{ fontSize: '2rem' }} />
                    </a>
                  )}
                </div>
              ) : '—'}
            </Row>
          </CardContent>
        </Card>
      </div>

      <PayoutAccountCard restaurantId={restaurant.id} />
    </div>
  )
}
