import { Container, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box textAlign="center" sx={{ my: 4 }}>
        <Typography variant="h3" gutterBottom>
          💎 مرحبًا بك في المتجر
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          سجل الدخول أو أنشئ حسابك لتبدأ التسوق.
        </Typography>
        <Box mt={4}>
          <Button variant="contained" color="primary" component={Link} to="/login" sx={{ mx: 1 }}>
          Log in
          </Button>
          <Button variant="outlined" component={Link} to="/register" sx={{ mx: 1 }}>
            Create a new account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;