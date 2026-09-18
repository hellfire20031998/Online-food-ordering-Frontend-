import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { homeRouteForRole } from '../component/config/roles';

/**
 * Guards a route behind authentication and (optionally) a role.
 *
 * - No JWT at all -> redirect to the login modal route.
 * - A role restriction is set but the user profile has not loaded yet -> spinner
 *   (avoids a redirect flicker while GET /api/users/profile is in flight).
 * - Wrong role -> redirect to that user's own home.
 *
 * Pass either `requiredRole` (one role) or `allowedRoles` (a list).
 * Note: this is UX-level gating only; the backend enforces real authorization.
 */
const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
    const jwt = useSelector(store => store.auth.jwt) || localStorage.getItem('jwt');
    const user = useSelector(store => store.auth.user);

    if (!jwt) {
        return <Navigate to="/account/login" replace />;
    }

    const allowed = allowedRoles || (requiredRole ? [requiredRole] : null);

    if (allowed) {
        if (!user) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            );
        }
        if (!allowed.includes(user.role)) {
            return <Navigate to={homeRouteForRole(user.role)} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
