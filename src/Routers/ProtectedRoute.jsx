import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

/**
 * Guards a route behind authentication and (optionally) a role.
 *
 * - No JWT at all -> redirect to the login modal route.
 * - requiredRole set but the user profile has not loaded yet -> spinner
 *   (avoids a redirect flicker while GET /api/users/profile is in flight).
 * - Wrong role -> redirect home.
 *
 * Note: this is UX-level gating only; the backend enforces real authorization.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
    const jwt = useSelector(store => store.auth.jwt) || localStorage.getItem('jwt');
    const user = useSelector(store => store.auth.user);

    if (!jwt) {
        return <Navigate to="/account/login" replace />;
    }

    if (requiredRole) {
        if (!user) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            );
        }
        if (user.role !== requiredRole) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
