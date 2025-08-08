import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

const CreateProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

const user = JSON.parse(localStorage.getItem('user') || '{}');

if (user.role !== 'SUPER_ADMIN') {
  return (
    <Container sx={{ mt: 5 }}>
      <Alert severity="error">🚫 Access denied. Only SUPER_ADMIN can create products.</Alert>
    </Container>
  );
}


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/products', formData);
      setSuccess('✅ Product created successfully!');
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      console.error('Error creating product:', err);
      setError('❌ Failed to create product.');
    }
  };

  return (
      <Container maxWidth={false} sx={{ minHeight: "100vh", px: 5, mt: 5 }}>

      <Typography variant="h4" gutterBottom>
        Create New Product
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          name="name"
          label="Product Name"
          fullWidth
          margin="normal"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          name="price"
          label="Price"
          fullWidth
          margin="normal"
          required
          type="number"
          value={formData.price}
          onChange={handleChange}
        />
        <TextField
          name="category"
          label="Category"
          fullWidth
          margin="normal"
          value={formData.category}
          onChange={handleChange}
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="normal"
          multiline
          minRows={3}
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          name="image"
          label="Image URL (optional)"
          fullWidth
          margin="normal"
          value={formData.image}
          onChange={handleChange}
        />

        <Box mt={3}>
          <Button type="submit" variant="contained" color="success" fullWidth>
            Create Product
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateProduct;