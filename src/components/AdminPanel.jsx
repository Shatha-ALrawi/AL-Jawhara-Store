// src/components/AdminPanel.jsx
import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../config/axios';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        // ✅ الخطأ: كان setProducts(res.data)
        // ✅ التصحيح: يجب أن يكون setProducts(res.data.data.data) لكي تحصل على مصفوفة المنتجات الصحيحة.
        setProducts(res.data.data.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Product Management 🫵🏻 </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/products/create"
        >
          ADD PRODUCT
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* ✅ تأكد من أن products مصفوفة قبل عمل map */}
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      // ✅ الخطأ: كان product.image
                      // ✅ التصحيح: يجب الوصول للصورة من مصفوفة الصور
                      src={product.productImages && product.productImages.length > 0 ? product.productImages[0].url : '/no-image.png'}
                      alt={product.name}
                      width="50"
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category || 'No category'}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/products/edit/${product.id}`}
                      size="small"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminPanel;