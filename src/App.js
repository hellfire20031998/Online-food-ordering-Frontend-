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
  const { auth } = useSelector(store => store);
  const token = auth.jwt || localStorage.getItem("jwt");

  useEffect(() => {
    if (!token) return;
    dispatch(getUser(token));
    dispatch(findCart(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (!token || !auth.user) return;
    dispatch(getRestaurantByUserId(token));
  }, [dispatch, token, auth.user]);
  // console.log("auth ", auth)
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routers />
    </ThemeProvider>
  );
}

export default App;
