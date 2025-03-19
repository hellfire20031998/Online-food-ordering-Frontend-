import logo from './logo.svg';
import './App.css';
import NavBar from './component/NavBar/NavBar';
import { ThemeProvider } from '@emotion/react';
import { darkTheme } from './Theme/DarkTheme';
import { CssBaseline } from '@mui/material';
import Home from './component/Home/Home';
import RestaurantDetails from './component/Restaurant/RestaurantDetails';
import Cart from './component/Cart/Cart';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <NavBar/>
      {/* <Home/> */}
      {/* <RestaurantDetails/> */}
      <Cart/>
    </ThemeProvider>
  );
}

export default App;
