import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, GraduationCap } from 'lucide-react';

const AuthSystem = ({ onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    grade: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === '') return `${fieldName} is required`;
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignUp) {
      const nameValidation = validateRequired(formData.fullName, 'Full name');
      if (nameValidation) newErrors.fullName = nameValidation;
      
      const gradeValidation = validateRequired(formData.grade, 'Grade');
      if (gradeValidation) newErrors.grade = gradeValidation;
    }
    
    const emailValidation = validateEmail(formData.email);
    if (emailValidation) newErrors.email = emailValidation;
    
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation) newErrors.password = passwordValidation;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setMessage('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isSignUp) {
        setMessage('Account created successfully! Please sign in.');
        setTimeout(() => {
          setIsSignUp(false);
          setFormData(prev => ({ ...prev, fullName: '', grade: '' }));
        }, 1500);
      } else {
        const user = { fullName: formData.email.split('@')[0], email: formData.email };
        setMessage(`Welcome back, ${user.fullName}!`);
        if (onAuthSuccess) {
          setTimeout(() => onAuthSuccess(user), 1000);
        }
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({ fullName: '', grade: '', email: '', password: '' });
    setErrors({});
    setMessage('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated 3D Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        {/* Geometric shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(234, 179, 8, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 179, 8, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Floating 3D cubes */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-yellow-500/30 transform rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border-2 border-green-400/30 transform rotate-45 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors z-10 p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          )}
          
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-green-800 to-green-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">IvyX.AI</h1>
                <p className="text-green-100 text-sm">Your Path to Excellence</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold mt-4">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-green-100 text-sm mt-1">
              {isSignUp ? 'Start your journey to Ivy League success' : 'Continue your journey to excellence'}
            </p>
          </div>
          
          <div className="p-8">
            <div className="space-y-5" onKeyPress={handleKeyPress}>
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                          errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                        } focus:outline-none focus:border-green-800 focus:bg-white transition-all`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <GraduationCap size={20} />
                      </div>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                          errors.grade ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                        } focus:outline-none focus:border-green-800 focus:bg-white transition-all appearance-none cursor-pointer`}
                      >
                        <option value="">Select Your Grade</option>
                        <option value="6">Grade 6</option>
                        <option value="7">Grade 7</option>
                        <option value="8">Grade 8</option>
                        <option value="9">Grade 9</option>
                        <option value="10">Grade 10</option>
                        <option value="11">Grade 11</option>
                        <option value="12">Grade 12</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.grade && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.grade}</p>
                    )}
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                    } focus:outline-none focus:border-green-800 focus:bg-white transition-all`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                    } focus:outline-none focus:border-green-800 focus:bg-white transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password}</p>
                )}
                {!errors.password && isSignUp && (
                  <p className="text-gray-500 text-xs mt-1.5 ml-1">Minimum 6 characters required</p>
                )}
              </div>
              
              {message && (
                <div className={`p-4 rounded-xl text-sm font-medium ${
                  message.includes('success') || message.includes('Welcome') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={toggleForm}
                className="text-green-800 hover:text-green-700 font-semibold text-sm transition-colors inline-flex items-center gap-1 group"
              >
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"}
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {!isSignUp && (
              <div className="mt-4 text-center">
                <button className="text-gray-500 hover:text-gray-700 text-xs transition-colors">
                  Forgot your password?
                </button>
              </div>
            )}
          </div>

          {/* Footer badges */}
          <div className="px-8 pb-6 flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Trusted
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 text-center text-white/80 text-xs">
          <p>Trusted by 10,000+ students worldwide</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthSystem;