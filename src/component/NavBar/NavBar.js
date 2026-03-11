import { Avatar, Badge, IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { auth, cart } = useSelector(store => store);
  const { i18n } = useTranslation();

  const handleAvatarClick = () => {
    if (!auth.user) {
      navigate("/account/login");
      return;
    }
    if (auth.user.role !== "ADMIN") {
      navigate("/my-profile");
    } else {
      navigate("/admin/restaurant");
    }
  };
  const handleLanguageChange = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem('lang', lng);
};


  useEffect(() => {}, [auth, cart]);

  return (
    <div className='px-5 sticky top-0 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between'>
      {/* Logo */}
      <div className='lg:mr-10 cursor-pointer flex items-center space-x-4'>
        <li onClick={() => navigate('/')} className='logo font-semibold text-gray-300 text-2xl'>
          Foodiyapa
        </li>
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

        {/* Role (for ADMIN) */}
        <div>
          {auth.user?.role === 'ADMIN' && (
            <IconButton>
              {auth.user.role}
            </IconButton>
          )}
        </div>

        {/* Avatar or Login Icon */}
        <div>
          {auth.user ? (
            <Avatar onClick={handleAvatarClick} sx={{ bgcolor: "white", color: "pink.A400" }}>
              {(auth.user.fullName && auth.user.fullName[0]?.toUpperCase()) || auth.user.email?.[0]?.toUpperCase() || "U"}
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
              badgeContent={cart?.cartItems?.length || 0}
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
