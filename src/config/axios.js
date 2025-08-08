import axios from "axios";

const api = axios.create({
  baseURL: "https://api.ecommerce.qafdev.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ إرسال التوكن تلقائيًا في كل طلب
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
