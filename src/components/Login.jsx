import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authAPI";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("superadmin@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token || data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuth({ ...data.user, token: data.token || data.access_token });
      navigate("/products");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(    err.response?.data?.message || 
    "فشل تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور."
  );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
          borderRadius: 2
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Log in
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, py: 1.5 }}
          >
            Log in
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;