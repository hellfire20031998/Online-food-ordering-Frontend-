import React from 'react'

/** One tile in the Top Meals carousel. Acts as a button that runs a search for the meal. */
const CarouselItem = ({ image, title, onSelect }) => (
  <button
    type='button'
    onClick={onSelect}
    aria-label={`Search for ${title}`}
    className='group flex flex-col justify-center items-center px-2 w-full bg-transparent border-0 cursor-pointer focus:outline-none'
  >
    <img
      className='w-28 h-28 sm:w-36 sm:h-36 lg:w-[13rem] lg:h-[13rem] rounded-full object-cover object-center ring-2 ring-transparent transition group-hover:ring-pink-500 group-hover:scale-105 group-focus-visible:ring-pink-500'
      src={image}
      alt=''
    />
    <span className='py-4 font-semibold text-base sm:text-lg lg:text-xl text-gray-400 group-hover:text-white text-center'>{title}</span>
  </button>
)

export default CarouselItem
