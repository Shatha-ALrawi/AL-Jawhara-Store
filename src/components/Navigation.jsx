import { useNavigate, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useTheme } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DiamondIcon from '@mui/icons-material/Diamond'; 
import { useState, useEffect } from 'react';

const Navigation = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        {}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <IconButton color="inherit" component={Link} to="/home">
            <DiamondIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: 'inherit', textDecoration: 'none' }}>
            <Link to="/home" style={{ color: "inherit", textDecoration: "none" }}>
              Al-Jawhara
            </Link>
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }}></Box> {}
        
        <Button color="inherit" component={Link} to="/products" sx={{ mr: 2 }}>
          Products
        </Button>

        <IconButton
          color="inherit"
          aria-label="cart"
          component={Link}
          to="/cart"
        >
          <Badge badgeContent={cartCount} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>

        <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {isAuthenticated ? (
          <Box sx={{ ml: 2 }}>
            <Button color="inherit" component={Link} to="/admin" sx={{ mr: 1 }}>
              Admin
            </Button>
            <Button color="inherit" onClick={handleLogout}>
                Sign out ({user?.username})
            </Button>
          </Box>
        ) : (
          <Box sx={{ ml: 2 }}>
            <Button color="inherit" component={Link} to="/login">
              Log in
            </Button>
            <Button color="inherit" component={Link} to="/register">
              sign in
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;