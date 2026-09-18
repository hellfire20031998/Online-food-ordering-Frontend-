import { Box, IconButton, Modal } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import { consumePostLoginRedirect, isPublicPath } from '../config/session';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxWidth: 'calc(100vw - 2rem)',
    bgcolor: 'background.paper',
    outline: "none",
    boxShadow: 24,
    p: 4,
};

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Closing without signing in returns the visitor to where they were (e.g. the cart), but never
    // to a protected page: its guard would reopen this modal at once.
    const handleOnClose = () => {
        const returnTo = consumePostLoginRedirect()
        navigate(isPublicPath(returnTo) ? returnTo : "/", { replace: true })
    }

    return (
        <>
            <Modal onClose={handleOnClose} open={
                location.pathname === "/account/register"
                || location.pathname === "/account/login"
            }>
                <Box sx={style}>
                    <IconButton
                        aria-label="Close"
                        onClick={handleOnClose}
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8, color: 'text.secondary' }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {location.pathname === "/account/register" ? <RegisterForm /> : <LoginForm />}
                </Box>
            </Modal>
        </>
    )
}

export default Auth
