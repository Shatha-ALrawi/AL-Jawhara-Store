import api from "../config/axios";

// تسجيل الدخول
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data.data; // ✅ هذا هو التصحيح
};

// تسجيل مستخدم جديد
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data.data; // ✅ التصحيح هنا أيضًا
};
