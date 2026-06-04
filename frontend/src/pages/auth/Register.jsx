import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, User, Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const { sendOtp, verifyOtp, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      setError('Please fill out all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    const name = `${firstName} ${lastName}`.trim();
    const result = await sendOtp({ name, email, phoneNumber, password });
    
    if (result.success) {
      setStep(2);
    } else {
      setError(result.error || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    const result = await verifyOtp(email, otp);
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'Failed to verify OTP. Please try again.');
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
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
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
            Join our community and get access to exclusive collections and offers.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        
        {/* Mobile Back Arrow */}
        <div className="absolute top-6 left-6 lg:hidden">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-admin-bg dark:bg-[#1a1a1a] border border-admin-border dark:border-admin-border-dark text-admin-text dark:text-admin-text-dark shadow-sm hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md space-y-8 bg-white dark:bg-admin-card-dark p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-admin-border dark:border-admin-border-dark transition-all duration-300 mt-12 lg:mt-0"
        >
          
          <div className="text-center">
            <h2 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-2">Create Account</h2>
            <p className="text-sm text-admin-text dark:text-admin-text-dark">Please register using your details below.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          {step === 1 ? (
            <motion.form 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-4 mt-8" 
              onSubmit={handleSendOtp}
            >
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariant}>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all duration-200"
                    placeholder="John"
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariant}>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all duration-200"
                    placeholder="Doe"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariant}>
              <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all duration-200"
                  placeholder="john@example.com"
                />
              </div>
            </motion.div>

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

            <motion.button
              variants={itemVariant}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center py-3.5 px-4 mt-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-admin-accent hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-accent disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </motion.form>
          ) : (
            <motion.form 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-4 mt-8" 
              onSubmit={handleVerifyOtp}
            >
              <motion.div variants={itemVariant}>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2 text-center">
                  Enter the OTP sent to <strong>{email}</strong>
                </label>
                <div className="relative max-w-xs mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="block w-full pl-11 pr-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all duration-200 tracking-[0.5em] text-center text-lg font-bold"
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>
              </motion.div>

              <motion.button
                variants={itemVariant}
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center items-center py-3.5 px-4 mt-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-admin-accent hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-accent disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Verify & Create Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
              
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-admin-text dark:text-admin-text-dark hover:text-admin-accent transition-colors"
                >
                  Back to Registration
                </button>
              </div>
            </motion.form>
          )}

          <motion.div variants={itemVariant} className="mt-6 text-center">
            <p className="text-sm text-admin-text dark:text-admin-text-dark">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-admin-accent hover:text-red-400 transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
          
        </motion.div>
      </div>
      
    </div>
  );
};

export default Register;
