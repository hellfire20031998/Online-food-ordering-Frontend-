import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { topMeal } from './topMeal';
import CarouselItem from './CarouselItem';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  pauseOnHover: true,
  // Fewer slides on narrower screens so items never overlap or overflow.
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 4 } },
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 640, settings: { slidesToShow: 2, arrows: false } },
  ],
};

/** Top Meals carousel. Tapping a meal opens the search page with that meal as the query. */
const MultiItemCarousel = () => {
  const navigate = useNavigate();
  const search = (item) => navigate(`/search?q=${encodeURIComponent(item.query || item.title)}`);

  return (
    <div className="top-meals overflow-hidden px-2 sm:px-8">
      <Slider {...settings}>
        {topMeal.map((item) => (
          <CarouselItem key={item.title} image={item.image} title={item.title} onSelect={() => search(item)} />
        ))}
      </Slider>
    </div>
  )
}

export default MultiItemCarousel
