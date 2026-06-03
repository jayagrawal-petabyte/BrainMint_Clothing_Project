import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

 
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber || !password) {
      setError('Please enter both phone number and password.');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    const result = await login(phoneNumber, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Failed to login. Please try again.');
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex min-h-screen bg-admin-bg dark:bg-admin-bg-dark font-rubik text-admin-text dark:text-admin-text-dark transition-colors duration-300">
      
      {/* Left side - Image/Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative bg-admin-card dark:bg-admin-card-dark overflow-hidden"
      >
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop" 
            alt="Fashion Background" 
            className="w-full h-full object-cover opacity-80 dark:opacity-40 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col justify-center px-16 w-full h-full"
        >
          <motion.h1 variants={itemVariant} className="text-5xl font-bold font-montserrat text-white tracking-wide mb-6">
            URBAN<span className="text-admin-accent">WEAR</span>
          </motion.h1>
          <motion.p variants={itemVariant} className="text-xl text-gray-200 font-light max-w-md">
            Discover the latest trends in fashion and elevate your everyday style.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md space-y-8 bg-white dark:bg-admin-card-dark p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-admin-border dark:border-admin-border-dark transition-all duration-300"
        >
          
          <div className="text-center">
            <h2 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-2">Welcome Back</h2>
            <p className="text-sm text-admin-text dark:text-admin-text-dark">Please sign in to access your account.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <motion.form 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-6 mt-8" 
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              
              <motion.div variants={itemVariant}>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="block w-full pl-11 pr-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all duration-200"
                    placeholder="10-digit phone number"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariant}>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>

            </div>

            <motion.div variants={itemVariant} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-admin-border text-admin-accent focus:ring-admin-accent"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-admin-text dark:text-admin-text-dark">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-admin-accent hover:text-red-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </motion.div>

            <motion.button
              variants={itemVariant}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-admin-accent hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-accent disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div variants={itemVariant} className="mt-6 text-center">
            <p className="text-sm text-admin-text dark:text-admin-text-dark">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-admin-accent hover:text-red-400 transition-colors">
                Create account
              </Link>
            </p>
          </motion.div>
          
        </motion.div>
      </div>
      
    </div>
  );
};

export default Login;
