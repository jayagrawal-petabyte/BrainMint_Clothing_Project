import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister, fetchCurrentUser, sendRegistrationOtp, verifyRegistrationOtp } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('princess_token'));
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = !!token;

  useEffect(() => {
    const hydrateSession = async () => {
      if (token) {
        localStorage.setItem('princess_token', token);
        const profile = await fetchCurrentUser(token);
        if (profile && profile.success !== false) {
          setUser(profile.data?.user || profile.user || profile.data || profile);
        } else {
          // Token might be expired
          localStorage.removeItem('princess_token');
          setToken(null);
          setUser(null);
        }
      } else {
        localStorage.removeItem('princess_token');
        setUser(null);
      }
    };
    hydrateSession();
  }, [token]);

  const login = async (phoneNumber, password) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(phoneNumber, password);
      
      // Based on typical auth API responses (e.g. { success: true, token, user })
      if (response && response.success !== false && (response.token || response.data?.token)) {
         const newToken = response.token || response.data?.token;
         setToken(newToken);
         
         if (response.user || response.data?.user) {
            setUser(response.user || response.data?.user);
         } else {
             // Fallback minimal user object if backend doesn't send it immediately
             setUser({ phoneNumber });
         }
         return { success: true };
      }
      return { success: false, error: response?.message || 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again later.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName, lastName, email, phoneNumber, password) => {
    setIsLoading(true);
    try {
      // API expects name, email, phoneNumber, password based on api.js
      const name = `${firstName} ${lastName}`.trim();
      const response = await apiRegister(name, email, phoneNumber, password);
      
      if (response && response.success !== false) {
         // Auto-login after register if token is provided, otherwise just return success
         if (response.token || response.data?.token) {
             const newToken = response.token || response.data?.token;
             setToken(newToken);
             setUser(response.user || response.data?.user || { phoneNumber, name });
         }
         return { success: true };
      }
      return { success: false, error: response?.message || 'Registration failed' };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again later.' };
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (userData) => {
    setIsLoading(true);
    try {
      const response = await sendRegistrationOtp(userData);
      if (response && response.success !== false) {
        return { success: true };
      }
      return { success: false, error: response?.message || 'Failed to send OTP' };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again later.' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setIsLoading(true);
    try {
      const response = await verifyRegistrationOtp(email, otp);
      if (response && response.success !== false) {
        // Since verification is complete, the user can log in on the next screen.
        // We do not auto-login here as the API response doesn't seem to return a token based on the user's description.
        return { success: true };
      }
      return { success: false, error: response?.message || 'Failed to verify OTP' };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again later.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('princess_token');
    localStorage.removeItem('adminToken'); // Ensure complete logout from admin as well
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn,
      isLoading,
      login,
      register,
      sendOtp,
      verifyOtp,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
