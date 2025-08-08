// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider, createTheme, Box, CssBaseline } from "@mui/material";
import { useTheme } from "./context/ThemeContext";

import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminPanel from "./components/AdminPanel";
import CreateProduct from "./components/CreateProduct";
import Unauthorized from "./components/Unauthorized";
import { AuthProvider } from "./context/AuthContext";
import Cart from "./components/Cart";

const AppContent = () => {
  const { darkMode } = useTheme();
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Navigation />
        <Box component="main" sx={{
          flexGrow: 1,
          py: 3,
          px: { xs: 2, sm: 3 }
        }}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="SUPER_ADMIN"><AdminPanel /></ProtectedRoute>} />
            <Route path="/products/create" element={<ProtectedRoute requiredRole="SUPER_ADMIN"><CreateProduct /></ProtectedRoute>} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Box>
      </Box>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;