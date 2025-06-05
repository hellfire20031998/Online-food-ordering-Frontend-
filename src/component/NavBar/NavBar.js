import { Avatar, Badge, IconButton } from '@mui/material'
import React, { useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import "./NavBar.css"
import { Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const NavBar = () => {
    const navigate = useNavigate();
    const { auth, cart } = useSelector(store => store)
    const handleAvatarClick = () => {
        if (auth.user.role !== "ADMIN") {
            navigate("/my-profile")
        } else {
            // navigate("/my-profile")
            navigate("/admin/restaurant")
        }
    }
    useEffect(() => {

    }, [auth, cart])
    // console.log("auth ", auth)
    return (
        <div className='px-5 sticky top-0 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between'>

            <div className='lg:mr-10 cursor-pointer flex items-center space-x-4'>
                <li onClick={() => navigate('/')} className='logo font-semibold text-gray-300 text-2xl'>
                    Foodiyapa
                </li>
            </div>


            <div className='flex items-center space-x-2 lg:space-x-10 '>
                <div className=''>
                    <IconButton >
                        <SearchIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                </div>
                <div className=''>

                {auth.user?.role === 'ADMIN' && (
    <IconButton>
      {auth.user.role}
    </IconButton>
  )}
                </div>

                <div className=''>
                    {auth.user ? <Avatar onClick={handleAvatarClick} sx={{ bgcolor: "white", color: "pink.A400" }}>
                        {auth.user.fullName[0].toUpperCase()}
                    </Avatar>
                        :
                        <IconButton onClick={() => navigate("/account/login")}>
                            <Person />
                        </IconButton>

                    }
                </div>
                <div className=''>
                <IconButton onClick={() => navigate("/cart")}>
  <Badge
    badgeContent={cart.cartItems.length || 0}
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
    )
}

export default NavBar
