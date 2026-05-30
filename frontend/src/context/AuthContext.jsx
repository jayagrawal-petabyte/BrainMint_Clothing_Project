import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('urbanwear_token'));
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = !!token;

  useEffect(() => {
    // If we have a token, we could potentially fetch the user profile here
    // For now, we'll just rely on the token for logged-in state
    if (token) {
      localStorage.setItem('urbanwear_token', token);
    } else {
      localStorage.removeItem('urbanwear_token');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(email, password);
      
      // Based on typical auth API responses (e.g. { success: true, token, user })
      if (response && response.success !== false && (response.token || response.data?.token)) {
         const newToken = response.token || response.data?.token;
         setToken(newToken);
         
         if (response.user || response.data?.user) {
            setUser(response.user || response.data?.user);
         } else {
             // Fallback minimal user object if backend doesn't send it immediately
             setUser({ email });
         }
         return { success: true };
      }
      return { success: false, error: response?.message || 'Invalid credentials' };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: 'Network error. Please try again later.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password) => {
    setIsLoading(true);
    try {
      // API expects name, email, password based on api.js
      const name = `${firstName} ${lastName}`.trim();
      const response = await apiRegister(name, email, password);
      
      if (response && response.success !== false) {
         // Auto-login after register if token is provided, otherwise just return success
         if (response.token || response.data?.token) {
             const newToken = response.token || response.data?.token;
             setToken(newToken);
             setUser(response.user || response.data?.user || { email, name });
         }
         return { success: true };
      }
      return { success: false, error: response?.message || 'Registration failed' };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, error: 'Network error. Please try again later.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('urbanwear_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
