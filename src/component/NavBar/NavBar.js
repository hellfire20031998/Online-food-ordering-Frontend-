import { Avatar, Badge, Button, IconButton, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Person } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isTeamRole } from '../config/roles';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(store => store.auth.user);
  const cartItems = useSelector(store => store.cart.cartItems);
  const [query, setQuery] = useState('');

  // Mirror the search page's query in the bar; clear it elsewhere.
  useEffect(() => {
    if (location.pathname === '/search') {
      setQuery(new URLSearchParams(location.search).get('q') || '');
    } else {
      setQuery('');
    }
  }, [location.pathname, location.search]);

  const handleAvatarClick = () => {
    if (!user) {
      navigate("/account/login");
      return;
    }
    if (isTeamRole(user.role)) {
      navigate("/team");
    } else if (user.role === "ADMIN") {
      navigate("/admin/restaurant");
    } else {
      navigate("/my-profile");
    }
  };

  const openSearch = (q = query) => {
    const trimmed = q.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    openSearch();
  };

  return (
    <div className='px-4 sticky top-0 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex items-center justify-between gap-3'>
      {/* Logo */}
      <div className='cursor-pointer flex items-center flex-none'>
        <span onClick={() => navigate('/')} className='logo font-semibold text-gray-300 text-2xl'>
          Foodiyapa
        </span>
      </div>

      {/* Inline search (tablet and up) */}
      <form
        onSubmit={handleSubmit}
        role='search'
        className='hidden md:flex items-center flex-1 max-w-xl mx-4 rounded-full bg-white/20 focus-within:bg-white/30 px-3'
      >
        <SearchIcon sx={{ color: 'white', opacity: 0.9 }} />
        <InputBase
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search restaurants, cuisines or dishes'
          inputProps={{ 'aria-label': 'Search restaurants and dishes' }}
          sx={{ ml: 1, flex: 1, color: 'white', '& input::placeholder': { color: 'white', opacity: 0.8 } }}
        />
      </form>

      {/* Right Side */}
      <div className='flex items-center space-x-1 lg:space-x-6 flex-none'>
        {/* Restaurant owner onboarding (hidden for platform team accounts) */}
        {!isTeamRole(user?.role) && (
          <Button
            size="small"
            onClick={() => navigate("/partner")}
            sx={{ color: "white", textTransform: "none", display: { xs: "none", lg: "inline-flex" }, whiteSpace: "nowrap" }}
          >
            {user?.role === "ADMIN" ? "My restaurant" : "Partner with us"}
          </Button>
        )}

        {/* Search icon (phones) */}
        <IconButton className='md:!hidden' aria-label='Search' onClick={() => openSearch()}>
          <SearchIcon sx={{ fontSize: "1.5rem" }} />
        </IconButton>

        {/* Avatar or Login Icon */}
        {user ? (
          <Avatar onClick={handleAvatarClick} sx={{ bgcolor: "white", color: "pink.A400", cursor: "pointer" }}>
            {(user.fullName && user.fullName[0]?.toUpperCase()) || user.email?.[0]?.toUpperCase() || "U"}
          </Avatar>
        ) : (
          <IconButton aria-label='Sign in' onClick={() => navigate("/account/login")}>
            <Person />
          </IconButton>
        )}

        {/* Cart */}
        <IconButton aria-label='Cart' onClick={() => navigate("/cart")}>
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
  );
};

export default NavBar;
