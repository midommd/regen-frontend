import axios from 'axios';
import config from './apiConfig';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const authService = {
  register: async (userData) => {
    // for testing
    if (config.IS_MOCK) {
      console.log("⚠️ MOCK REGISTER - Data not sent to database");
      return { success: true, user: { ...userData, id: 999 } }; 
    }

    // Laravel Connection
    try {
      const response = await api.post('/register', userData);
 
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return { success: true, user: response.data.user };
      
    } catch (error) {
      console.error("Register Error:", error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || "Registration failed" 
      };
    }
  },

  login: async (credentials) => {
    if (config.IS_MOCK) return { success: true, user: { name: "Mock User" } };

    try {
      const response = await api.post('/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data.user; 
      
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.warn("Server logout failed or token expired. Clearing local session.");
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};