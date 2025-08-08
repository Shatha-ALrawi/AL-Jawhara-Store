// src/components/Products.jsx
import { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, CardMedia, Typography, Button,
  TextField, Box, Chip, Pagination, Stack, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [view, setView] = useState('grid');
  const { user } = useAuth();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const skeletonBaseColor = isDarkMode ? '#2c2c2c' : '#a5cdedff';
  const skeletonHighlightColor = isDarkMode ? '#3d3d3d' : '#a6e2f3ff';

  const isAdmin = user?.role === "SUPER_ADMIN";

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.data.data);
        setFilteredProducts(res.data.data.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
    setCurrentPage(1);
  }, [searchTerm, products]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  };

  const safeFilteredProducts = Array.isArray(filteredProducts) ? filteredProducts : [];
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = safeFilteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(safeFilteredProducts.length / productsPerPage);
  const handlePageChange = (event, value) => setCurrentPage(value);

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ minHeight: "100vh", px: 5 }}>
        <Typography variant="h4" gutterBottom>Products</Typography>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
                <Skeleton height={200} width="350px " baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Skeleton height={30} width="80%" sx={{ mb: 1 }} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  <Skeleton height={20} width="95%" sx={{ mb: 1 }} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  <Skeleton height={20} width="95%" sx={{ mb: 1 }} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  <Skeleton height={20} width="95%" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                </CardContent>
                <Box sx={{ px: 2, pb: 2 }}>
                  <Skeleton height={36} width="100%" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Products ({safeFilteredProducts.length})</Typography>

        {isAdmin && (
          <Box mb={2}>
            <Button variant="contained" color="success" component={Link} to="/products/create">
              Create New Product
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              label="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} color="primary">
            <ToggleButton value="grid" sx={{ p: 1.5 }}><ViewModuleIcon /></ToggleButton>
            <ToggleButton value="list" sx={{ p: 1.5 }}><ViewListIcon /></ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {view === 'grid' ? (
          <Grid container spacing={3}>
            {currentProducts.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                  <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.productImages && product.productImages.length > 0 ? product.productImages[0].url : 'https://via.placeholder.com/200'}
                      alt={product.name}
                    />
                  </Link>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
                    </Typography>
                    {product.category && <Chip label={product.category} size="small" sx={{ mb: 1 }} />}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description.length > 100
                        ? `${product.description.substring(0, 100)}...`
                        : product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      ${product.price}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => addToCart(product)}
                      sx={{ mt: 'auto', mb: 2 }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/products/${product.id}`}
                      fullWidth
                    >
                      Show Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={2}>
            {currentProducts.map((product) => (
              <Card key={product.id} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Link
                  to={`/products/${product.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    flex: 1
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 2 }}
                    image={product.productImages && product.productImages.length > 0 ? product.productImages[0].url : 'https://via.placeholder.com/120'}
                    alt={product.name}
                  />
                  <Box sx={{ flex: 1, ml: 2 }}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description.length > 80
                        ? `${product.description.substring(0, 80)}...`
                        : product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${product.price}
                    </Typography>
                  </Box>
                </Link>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => addToCart(product)}
                  sx={{ ml: 2 }}
                >
                  Add to Cart
                </Button>
              </Card>
            ))}
          </Stack>
        )}

        {totalPages > 1 && (
          <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="text.secondary">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, safeFilteredProducts.length)} of {safeFilteredProducts.length} products
            </Typography>
          </Stack>
        )}

        {safeFilteredProducts.length === 0 && (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No products found
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Products;