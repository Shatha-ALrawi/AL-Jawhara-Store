// src/components/ProductDetails.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import { ArrowBack, ShoppingCart } from '@mui/icons-material';
import api from '../config/axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product) return; // حماية في حال كان المنتج غير موجود

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography mt={2}>Loading product...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5" color="error">
          Product not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back
      </Button>

      <Card>
        <CardMedia
          component="img"
          height="400"
          image={product.productImages && product.productImages.length > 0 ? product.productImages[0].url : 'https://via.placeholder.com/400'}
          alt={product.name}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          {product.category && <Chip label={product.category} sx={{ mb: 2 }} />}
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Typography variant="h5" color="primary">
            ${product.price}
          </Typography>
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCart />}
              onClick={addToCart}
            >
              Add to Cart
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetails;