import React from 'react'

const CarouselItem = ({ image, title }) => (
  <div className='flex flex-col justify-center items-center px-2'>
    <img
      className='w-28 h-28 sm:w-36 sm:h-36 lg:w-[13rem] lg:h-[13rem] rounded-full object-cover object-center'
      src={image}
      alt={title}
    />
    <span className='py-4 font-semibold text-base sm:text-lg lg:text-xl text-gray-400 text-center'>{title}</span>
  </div>
)

export default CarouselItem
