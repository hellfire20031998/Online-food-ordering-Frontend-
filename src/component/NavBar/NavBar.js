import { Avatar, Badge, IconButton } from '@mui/material';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const user = useSelector(store => store.auth.user);
  const cartItems = useSelector(store => store.cart.cartItems);
  const { i18n } = useTranslation();

  const handleAvatarClick = () => {
    if (!user) {
      navigate("/account/login");
      return;
    }
    if (user.role === "ADMIN") {
      navigate("/admin/restaurant");
    } else {
      navigate("/my-profile");
    }
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div className='px-5 sticky top-0 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between'>
      {/* Logo */}
      <div className='lg:mr-10 cursor-pointer flex items-center space-x-4'>
        <span onClick={() => navigate('/')} className='logo font-semibold text-gray-300 text-2xl'>
          Foodiyapa
        </span>
      </div>

      {/* Right Side */}
      <div className='flex items-center space-x-2 lg:space-x-10'>
        {/* Search */}
        <div>
          <IconButton>
            <SearchIcon sx={{ fontSize: "1.5rem" }} />
          </IconButton>
        </div>

        {/* Language Toggle */}
        <div>
          <button
            onClick={() => handleLanguageChange(i18n.language === 'en' ? 'hi' : 'en')}
            className='text-white font-medium bg-black px-3 py-1 rounded'
          >
            {i18n.language === 'hi' ? 'हिन्दी' : 'English'}
          </button>
        </div>

        {/* Avatar or Login Icon */}
        <div>
          {user ? (
            <Avatar onClick={handleAvatarClick} sx={{ bgcolor: "white", color: "pink.A400", cursor: "pointer" }}>
              {(user.fullName && user.fullName[0]?.toUpperCase()) || user.email?.[0]?.toUpperCase() || "U"}
            </Avatar>
          ) : (
            <IconButton onClick={() => navigate("/account/login")}>
              <Person />
            </IconButton>
          )}
        </div>

        {/* Cart */}
        <div>
          <IconButton onClick={() => navigate("/cart")}>
            <Badge
              badgeContent={cartItems?.length || 0}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: "1.5rem" }} />
            </Badge>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
