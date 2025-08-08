// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext'; // ✅ استيراد ThemeProvider
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider> {/* ✅ لف التطبيق بـ ThemeProvider */}
      <App />
    </ThemeProvider>
  </StrictMode>
);