import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ minHeight: "1000vh" }}>
      <Box mt={10} textAlign="center">
        <Typography variant="h3" color="error" gutterBottom>
          غير مصرح لك بالدخول
        </Typography>
        <Typography variant="body1" mb={4}>
          ليس لديك صلاحية لعرض هذه الصفحة.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/products")}
        >
          العودة إلى المنتجات
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;
