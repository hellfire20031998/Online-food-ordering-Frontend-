import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material'
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateRestaurantStatus } from '../../component/State/Restaurant/Action';

export default function RestaurantDetails() {
  const usersRestaurant = useSelector(store => store.restaurant.usersRestaurant);
  const dispatch = useDispatch();

  const handleRestaurantStatus = () => {
    if (!usersRestaurant?.id) return;
    // The success action already stores the updated restaurant; no refetch needed.
    dispatch(updateRestaurantStatus({ restaurantId: usersRestaurant.id }))
  }

  const restaurant = { usersRestaurant };
  return (
    <div className='lg:px-20 px-5 pb-10'>
        <div className='py-5 flex justify-center items-center gap-5'>
            <h1 className='text-2xl lg:text-7xl text-center font-bold p-5'>
                {restaurant.usersRestaurant?.name}
            </h1>
            <div>
                <Button color={!restaurant.usersRestaurant?.open ? "primary" :"error"} className='py-[1rem] px-[2rem]' onClick={handleRestaurantStatus} size='large' variant='contained' >
                    {restaurant.usersRestaurant?.open ?  "close" : "Open"}
                </Button>
            </div>

        </div>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={<span className='text-gray-300'>Restaurant</span>}/>
              <CardContent>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>Owner</p>
                    <p className='text-gray-400'>
                      
                      <span className='pr-5'>-</span>
                      {restaurant.usersRestaurant?.owner?.fullName}
                    </p>
                  </div>

                </div>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>Restaurant Name</p>
                    <p className='text-gray-400'>
                      
                      <span className='pr-5'>-</span>
                      {restaurant.usersRestaurant?.name}
                    </p>
                  </div>

                </div>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>Cuisine Type</p>
                    <p className='text-gray-400'>
                      
                      <span className='pr-5'>-</span>
                      {restaurant.usersRestaurant?.cuisineType}
                    </p>
                  </div>


                </div>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>Opening Hours</p>
                    <p className='text-gray-400'>
                      
                      <span className='pr-5'>-</span>
                      {restaurant.usersRestaurant?.openingHours}
                    </p>
                  </div>

                </div>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>Status</p>
                    <p className='text-gray-400'>
                      
                      <span className='pr-5'>-</span>
                      {restaurant.usersRestaurant?.open?<span className='px-5 py-2 rounded-full bg-green-400 text-gray-950'> Open</span>:
                      <span className='px-5 py-2 rounded-full bg-red-400 text-gray-950'> Close</span>}
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg ={6}>
            <Card>
              <CardHeader title={<span className='text-gray-300'>Address</span>}/>
              <CardContent>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>Country</p>
                    <p className='text-gray-400'>
                      
                      <span className='pr-5'>-</span>
                      {restaurant.usersRestaurant?.address?.country}
                    </p>
                  </div>

                </div>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>City</p>
                    <p className='text-gray-400'>
                      
                      <span className='pr-5'>-</span>
                      {restaurant.usersRestaurant?.address?.city}
                      </p>
                  </div>

                </div>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>Postal Code</p>
                    <p className='text-gray-400'>
                      
                      <span className='pr-5'>-</span>
                      {restaurant.usersRestaurant?.address?.pincode}
                    </p>
                  </div>


                </div>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>Street Address</p>
                    <p className='text-gray-400'>
                      
                      <span className='pr-5'>-</span>
                      {restaurant.usersRestaurant?.address?.streetAddress
                      }
                    </p>
                  </div>

                </div>
                
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader title={<span className='text-gray-300'>Contact</span>}/>
              <CardContent>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>Email</p>
                    <p className='text-gray-400'>
                      
                      <span className='pr-5'>-</span>
                      {restaurant.usersRestaurant?.contactInformation?.email}

                    </p>
                  </div>

                </div>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>Mobile</p>
                    <p className='text-gray-400'>
                      
                      <span className='pr-5'>-</span>
                      {restaurant.usersRestaurant?.contactInformation?.mobile}
                    </p>
                  </div>

                </div>
                <div className='space-y-4 text-gray-200'>
                  <div className='flex'>
                    <p className='w-48'>Social</p>
                    <div className='flex text-gray-400 items-center pb-3 gap-2'>
                      <span className='pr-5 '>-</span>
                      {restaurant.usersRestaurant?.contactInformation?.instagram && (
                        <a href={restaurant.usersRestaurant.contactInformation.instagram} target='_blank' rel='noreferrer'>
                          <InstagramIcon sx={{fontSize:'3rem'}}/>
                        </a>
                      )}

                      {restaurant.usersRestaurant?.contactInformation?.twitter && (
                        <a href={restaurant.usersRestaurant.contactInformation.twitter} target='_blank' rel='noreferrer'>
                          <XIcon sx={{fontSize:'3rem'}}/>
                        </a>
                      )}
                    </div>
                    
                  </div>


                </div>
                
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      
    </div>
  )
}
