import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Box,
  IconButton
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const updateCartItems = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    };

    updateCartItems();
    window.addEventListener('storage', updateCartItems);

    return () => {
      window.removeEventListener('storage', updateCartItems);
    };
  }, []);

  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('storage'));
  };

  const handleQuantityChange = (productId, change) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    updateCart(updatedItems);
  };

  const handleRemoveItem = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    updateCart(updatedItems);
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          Your cart is empty.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item.id} sx={{ display: 'flex', mb: 2, p: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 150, height: 150, objectFit: 'cover' }}
                  image={item.productImages && item.productImages.length > 0 ? item.productImages[0].url : 'https://via.placeholder.com/150'}
                  alt={item.name}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    ${item.price}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <IconButton onClick={() => handleQuantityChange(item.id, -1)} size="small">
                      <Remove />
                    </IconButton>
                    <Typography mx={2}>{item.quantity}</Typography>
                    <IconButton onClick={() => handleQuantityChange(item.id, 1)} size="small">
                      <Add />
                    </IconButton>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleRemoveItem(item.id)}
                      sx={{ ml: 2 }}
                    >
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              <Typography variant="h6">
                Total: ${total.toFixed(2)}
              </Typography>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                Proceed to Checkout
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;