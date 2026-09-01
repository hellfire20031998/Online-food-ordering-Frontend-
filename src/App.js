import './App.css';
import { ThemeProvider } from '@emotion/react';
import { darkTheme } from './Theme/DarkTheme';
import { CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './component/State/Authentication/Action';
import { findCart } from './component/State/Cart/Action';
import Routers from './Routers/Routers';
import { getRestaurantByUserId } from './component/State/Restaurant/Action';

function App() {
  const dispatch = useDispatch();
  const jwt = useSelector(store => store.auth.jwt);
  const user = useSelector(store => store.auth.user);
  const token = jwt || localStorage.getItem("jwt");

  useEffect(() => {
    if (!token) return;
    dispatch(getUser());
    dispatch(findCart());
  }, [dispatch, token]);

  useEffect(() => {
    // Only restaurant owners/admins have a restaurant to load.
    if (!token || user?.role !== "ADMIN") return;
    dispatch(getRestaurantByUserId());
  }, [dispatch, token, user]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routers />
    </ThemeProvider>
  );
}

export default App;
