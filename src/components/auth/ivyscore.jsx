
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, Mail, Lock, User, GraduationCap, Globe } from 'lucide-react';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// Auth Modal Component (no background, just the card)
const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    grade: '',
    email: '',
    password: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'China',
    'Germany', 'France', 'Japan', 'South Korea', 'Singapore', 'UAE',
    'Saudi Arabia', 'Pakistan', 'Bangladesh', 'Nepal', 'Sri Lanka',
    'Malaysia', 'Indonesia', 'Thailand', 'Philippines', 'Vietnam',
    'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Nigeria', 'Kenya',
    'Other'
  ];

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    
    if (savedEmail && savedPassword) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        password: savedPassword
      }));
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
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

      const countryValidation = validateRequired(formData.country, 'Country');
      if (countryValidation) newErrors.country = countryValidation;
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
      const endpoint = isSignUp ? 'api/auth/signup' : 'api/auth/login';
      const payload = isSignUp 
        ? { 
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            grade: formData.grade,
            country: formData.country
          }
        : { 
            email: formData.email,
            password: formData.password
          };
      console.log(API_URL)
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isSignUp) {
        setMessage('Account created successfully! Please sign in.');
        setTimeout(() => {
          setIsSignUp(false);
          setFormData(prev => ({ 
            ...prev, 
            fullName: '', 
            grade: '', 
            country: '',
            password: '' 
          }));
          setMessage('');
        }, 1500);
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
          localStorage.setItem('rememberedPassword', formData.password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }
        
        setMessage(`Welcome back, ${data.user.fullName}!`);
        
        if (onAuthSuccess) {
          setTimeout(() => onAuthSuccess(data.user), 1000);
        }
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.');
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
    setFormData({ fullName: '', grade: '', email: '', password: '', country: '' });
    setErrors({});
    setMessage('');
    
    if (!isSignUp) {
      const savedEmail = localStorage.getItem('rememberedEmail');
      const savedPassword = localStorage.getItem('rememberedPassword');
      
      if (savedEmail && savedPassword) {
        setFormData(prev => ({
          ...prev,
          email: savedEmail,
          password: savedPassword
        }));
        setRememberMe(true);
      }
    }
  };

  return (
    <>
      {/* Modal Overlay with blur effect */}
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      >
        {/* Modal Card */}
        <div 
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: 'modalSlideIn 0.3s ease-out',
            maxHeight: '90vh'
          }}
        >
          <style>{`
            @keyframes modalSlideIn {
              from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors z-10 p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
          
          {/* Header */}
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
          
          {/* Form Content - Scrollable */}
          <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
            <div className="space-y-5" onKeyPress={handleKeyPress}>
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Grade Level</label>
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Globe size={20} />
                      </div>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                          errors.country ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                        } focus:outline-none focus:border-green-800 focus:bg-white transition-all appearance-none cursor-pointer`}
                      >
                        <option value="">Select Your Country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.country && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.country}</p>
                    )}
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
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
                  <p className="text-gray-500 text-xs mt-1.5 ml-1">Minimum 8 characters with uppercase, lowercase, and number</p>
                )}
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-green-800 border-gray-300 rounded focus:ring-green-800 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 font-medium">Remember me</span>
                  </label>
                  <button className="text-gray-500 hover:text-gray-700 text-xs transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}
              
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
          </div>

          {/* Footer badges */}
          <div className="px-8 pb-6 flex items-center justify-center gap-6 text-xs text-gray-500 border-t border-gray-100 pt-4">
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
      </div>
    </>
  );
};
//APP component
const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setShowAuth(false);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Prevent background scrolling when auth modal is open
  useEffect(() => {
    if (showAuth) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAuth]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleCloseAuth = () => {
    // If user closes auth without logging in, redirect to homepage
    navigate('/');
  };

  return (
    <div className="relative">
      {/* Main App - Blurred when auth is showing */}
      <div className={showAuth ? 'filter blur-md pointer-events-none' : ''}>
        <IvyScoreCalculator user={user} onLogout={handleLogout} />
      </div>

      {/* Auth Modal Overlay */}
      {showAuth && (
        <AuthModal 
          onClose={handleCloseAuth}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

// Ivy Score Calculator Component (imported from your third document)
function IvyScoreCalculator({ user, onLogout }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [formData, setFormData] = useState({
    grade9: '',
    grade10: '',
    grade11: '',
    grade12: '',
    advancedCourses: '',
    scholarAwards: '',
    satScore: '',
    extracurriculars: '',
    leadership: '',
    volunteerWork: '',
    uniqueSkills: '',
    internationalExperience: ''
  });

  const currentUser = user || { fullName: 'Student', email: 'student@example.com', country: '' };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const expandableCards = [
    { 
      id: 'academic', 
      title: 'Academic Performance',
      description: 'Focus on consistency and upward trends. Take challenging courses like AP, IB, or honors. Maintain high GPAs and show academic rigor. Strong standardized test scores (SAT/ACT) are crucial. Ivy League schools look for students who challenge themselves academically and demonstrate excellence across all subjects.'
    },
    { 
      id: 'extracurricular', 
      title: 'Extracurricular Activities',
      description: 'Quality over quantity matters. Show deep commitment and leadership in 2-3 activities rather than superficial involvement in many. Demonstrate impact, awards, and progression. Include sports, clubs, arts, or student government. Ivy League admissions favor "spike" students who excel deeply in specific areas.'
    },
    { 
      id: 'voluntary', 
      title: 'Voluntary Work and Social Impact',
      description: 'Demonstrate genuine commitment to community service and social causes. Long-term involvement is more valuable than short volunteer stints. Show measurable impact - how many people did you help? What changed because of your work? Leadership in service projects is highly valued by Ivy League schools.'
    },
    { 
      id: 'creative', 
      title: 'Creative and Unique Skills',
      description: 'Showcase talents that make you stand out: artistic abilities, musical talent, coding projects, entrepreneurship, research, publications, or unique hobbies. Ivy League schools seek students who bring diverse perspectives and exceptional talents. Patents, apps, businesses, or artistic recognition can significantly strengthen your profile.'
    },
    { 
      id: 'softskills', 
      title: 'Soft Skills and Personality Traits',
      description: 'Leadership, resilience, intellectual curiosity, and emotional intelligence matter greatly. Show how you\'ve overcome challenges, led teams, or made a difference. Your essays and recommendations should highlight qualities like integrity, empathy, collaboration, and innovative thinking that align with Ivy League values.'
    },
    { 
      id: 'global', 
      title: 'Global and Cultural Exposure',
      description: 'Demonstrate international awareness and cross-cultural competence. This includes language proficiency, study abroad experiences, international competitions, global projects, or meaningful engagement with diverse communities. Ivy League schools value students who can thrive in diverse environments and contribute to global discourse.'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateIvyScore = async () => {
    setLoading(true);
    setResults(null);

    const prompt = `You are an expert college admissions counselor specializing in Ivy League and prestigious universities. Analyze this student profile and provide a comprehensive assessment.

STUDENT: ${currentUser.fullName} from ${currentUser.country || 'Not specified'}

ACADEMIC PERFORMANCE:
- Grade 9: ${formData.grade9 || 'Not provided'}%
- Grade 10: ${formData.grade10 || 'Not provided'}%
- Grade 11: ${formData.grade11 || 'Not provided'}%
- Grade 12 (Projected): ${formData.grade12 || 'Not provided'}%
- Advanced Courses: ${formData.advancedCourses || 'Not provided'}
- Scholar Awards: ${formData.scholarAwards || 'Not provided'}
- SAT Score: ${formData.satScore || 'Not provided'}

EXTRACURRICULAR & ADDITIONAL INFO:
- Extracurricular Activities: ${formData.extracurriculars || 'Not provided'}
- Leadership Roles: ${formData.leadership || 'Not provided'}
- Volunteer Work: ${formData.volunteerWork || 'Not provided'}
- Unique Skills/Achievements: ${formData.uniqueSkills || 'Not provided'}
- International Experience: ${formData.internationalExperience || 'Not provided'}

IMPORTANT: You MUST respond with ONLY a valid JSON object (no markdown, no extra text). Use this exact structure:
{
  "overallScore": <number 0-100>,
  "academicScore": <number 0-100>,
  "extracurricularScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>", "<improvement 4>"],
  "recommendations": ["<detailed action step 1>", "<detailed action step 2>", "<detailed action step 3>", "<detailed action step 4>"],
  "targetSchools": [
    {"name": "<University Name>", "reasoning": "<brief explanation why this school matches their profile>"},
    {"name": "<University Name>", "reasoning": "<brief explanation>"},
    {"name": "<University Name>", "reasoning": "<brief explanation>"},
    {"name": "<University Name>", "reasoning": "<brief explanation>"}
  ]
}`;

    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API Error');
      }

      let parsedResults;
      try {
        const cleanedResponse = data.reply.replace(/```json\n?|\n?```/g, '').trim();
        parsedResults = JSON.parse(cleanedResponse);
        setIsAIGenerated(true);
      } catch (e) {
        console.error('JSON Parse Error:', e);
        setIsAIGenerated(false);
        parsedResults = {
          overallScore: 75,
          academicScore: 80,
          extracurricularScore: 70,
          summary: "Based on the provided information, you show strong academic foundation with room for growth in extracurricular depth and standardized testing.",
          strengths: [
            "Consistent academic performance across grades",
            "Demonstrated commitment to education",
            "Well-rounded profile with multiple interests",
            "Clear potential for growth"
          ],
          improvements: [
            "Increase depth in 2-3 key extracurricular activities",
            "Develop stronger leadership roles with measurable impact",
            "Focus on SAT/ACT preparation to reach 1500+ range",
            "Build a more distinctive specialized excellence area"
          ],
          recommendations: [
            "Take 4-6 AP courses in areas aligned with your intended major",
            "Seek leadership positions in your top 2 extracurriculars",
            "Start a passion project that demonstrates innovation",
            "Dedicate 3-4 months to intensive SAT prep"
          ],
          targetSchools: [
            { name: "Top State Universities (UC Berkeley, UMich, UVA)", reasoning: "Strong match for current profile" },
            { name: "Selective Liberal Arts Colleges", reasoning: "Holistic admissions may favor your approach" },
            { name: "Target Ivy League Schools (Cornell, Brown)", reasoning: "Competitive with improvements" },
            { name: "Honors Programs at Strong Universities", reasoning: "Excellent opportunities with merit aid" }
          ]
        };
      }

      setResults(parsedResults);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}\n\nPlease make sure your backend server is running on http://localhost:5000`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.grade9 && !formData.grade10 && !formData.grade11) {
      alert('Please fill in at least your grade scores to get an assessment.');
      return;
    }
    calculateIvyScore();
  };
const handleNewAssessment = () => {
  // Clear all form data
  setFormData({
    grade9: '',
    grade10: '',
    grade11: '',
    grade12: '',
    advancedCourses: '',
    scholarAwards: '',
    satScore: '',
    extracurriculars: '',
    leadership: '',
    volunteerWork: '',
    uniqueSkills: '',
    internationalExperience: ''
  });
  
  // Clear results
  setResults(null);
  
  // Reset AI generated flag
  setIsAIGenerated(false);
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 85) return 'bg-green-100 border-green-500';
    if (score >= 70) return 'bg-yellow-100 border-yellow-500';
    return 'bg-red-100 border-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
              I
            </div>
            <h1 className="text-2xl font-bold text-red-900">IvyX.AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm text-gray-600">Welcome,</span>
              <span className="font-semibold text-red-900">{currentUser.fullName}</span>
              {currentUser.country && (
                <span className="text-xs text-gray-500">{currentUser.country}</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 px-4 lg:px-8 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-red-900 mb-4 leading-tight">
            IVY SCORE™ CALCULATOR
          </h1>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
            Get AI-powered insights into your Ivy League admission chances with personalized recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12 max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 h-full">
            <div className="bg-green-900 text-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-4">Your Journey to Excellence</h2>
              <p className="text-green-50 leading-relaxed">
                An Ivy League education transforms potential into greatness, opening doors to 
                global leadership, innovation, and a legacy that inspires generations.
              </p>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
              <div className="flex-1 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80" 
                  alt="Students studying"
                  className="w-full h-full object-cover min-h-[300px]"
                />
              </div>
              <div className="p-6 text-center bg-white">
                <h3 className="text-xl font-bold text-red-900">Where Dreams Become Reality</h3>
              </div>
            </div>
          </div>

          <div className="space-y-4 flex flex-col">
            {expandableCards.map((card) => (
              <div 
                key={card.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <button
                  onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                  className="w-full flex items-center justify-between p-6"
                >
                  <h3 className="text-xl font-bold text-red-900 text-left">{card.title}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {expandedCard === card.id ? (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </button>
                {expandedCard === card.id && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                      <p className="font-semibold text-red-900 mb-2">Pro Tips:</p>
                      <p className="text-gray-700 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-red-900 mb-8 text-center">
            Complete Profile Assessment
          </h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Fill in as much information as possible for a more accurate assessment. The AI will analyze your complete profile.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                Academic Performance
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Grade 9th Score (%)</label>
                  <input
                    type="number"
                    name="grade9"
                    value={formData.grade9}
                    onChange={handleInputChange}
                    placeholder="e.g., 85"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Grade 10th Score (%)</label>
                  <input
                    type="number"
                    name="grade10"
                    value={formData.grade10}
                    onChange={handleInputChange}
                    placeholder="e.g., 90"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Grade 11th Score (%)</label>
                  <input
                    type="number"
                    name="grade11"
                    value={formData.grade11}
                    onChange={handleInputChange}
                    placeholder="e.g., 91"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Grade 12th Score (%) - Projected</label>
                  <input
                    type="number"
                    name="grade12"
                    value={formData.grade12}
                    onChange={handleInputChange}
                    placeholder="e.g., 85"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">IB/AP/Advanced Courses</label>
                  <input
                    type="text"
                    name="advancedCourses"
                    value={formData.advancedCourses}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 AP courses, IB Diploma"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Scholar Awards</label>
                  <input
                    type="text"
                    name="scholarAwards"
                    value={formData.scholarAwards}
                    onChange={handleInputChange}
                    placeholder="e.g., National Merit Scholar"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-700 font-semibold mb-2">SAT Score (Optional)</label>
                <input
                  type="number"
                  name="satScore"
                  value={formData.satScore}
                  onChange={handleInputChange}
                  placeholder="e.g., 1450"
                  min="400"
                  max="1600"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Beyond Academics
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Extracurricular Activities</label>
                  <textarea
                    name="extracurriculars"
                    value={formData.extracurriculars}
                    onChange={handleInputChange}
                    placeholder="e.g., Debate team captain, varsity soccer, school newspaper editor"
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Leadership Roles</label>
                  <textarea
                    name="leadership"
                    value={formData.leadership}
                    onChange={handleInputChange}
                    placeholder="e.g., Student council president, founded coding club"
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Volunteer Work & Community Service</label>
                  <textarea
                    name="volunteerWork"
                    value={formData.volunteerWork}
                    onChange={handleInputChange}
                    placeholder="e.g., 200+ hours at local hospital, organized food drives"
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Unique Skills & Achievements</label>
                  <textarea
                    name="uniqueSkills"
                    value={formData.uniqueSkills}
                    onChange={handleInputChange}
                    placeholder="e.g., Published research paper, developed mobile app, state-level chess champion"
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">International Experience & Cultural Exposure</label>
                  <textarea
                    name="internationalExperience"
                    value={formData.internationalExperience}
                    onChange={handleInputChange}
                    placeholder="e.g., Study abroad in France, fluent in Spanish, participated in Model UN"
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg py-4 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Your Profile...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Get My AI-Powered Ivy Score Assessment
                </>
              )}
            </button>
          </div>
        </div>

        {results && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className={`rounded-xl p-4 shadow-md border-2 ${
              isAIGenerated 
                ? 'bg-green-50 border-green-400' 
                : 'bg-yellow-50 border-yellow-400'
            }`}>
              <div className="flex items-center gap-3">
                {isAIGenerated ? (
                  <>
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-green-900">AI-Generated Assessment ✨</p>
                      <p className="text-sm text-green-700">Personalized analysis for {currentUser.fullName}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-yellow-500 text-white rounded-full p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-yellow-900">Sample Assessment</p>
                      <p className="text-sm text-yellow-700">Showing generic assessment</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className={`rounded-2xl p-6 shadow-xl border-4 ${getScoreBgColor(results.overallScore)}`}>
                <div className="text-center">
                  <p className="text-gray-700 font-semibold mb-2">Overall Ivy Score</p>
                  <p className={`text-6xl font-bold ${getScoreColor(results.overallScore)}`}>
                    {results.overallScore}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">out of 100</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-200">
                <div className="text-center">
                  <p className="text-gray-700 font-semibold mb-2">Academic Score</p>
                  <p className={`text-6xl font-bold ${getScoreColor(results.academicScore)}`}>
                    {results.academicScore}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">out of 100</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-200">
                <div className="text-center">
                  <p className="text-gray-700 font-semibold mb-2">Extracurricular Score</p>
                  <p className={`text-6xl font-bold ${getScoreColor(results.extracurricularScore)}`}>
                    {results.extracurricularScore}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">out of 100</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-red-900 mb-4">Assessment Summary</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{results.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-2xl p-8 shadow-xl border-2 border-green-200">
                <h3 className="text-2xl font-bold text-green-900 mb-6">Your Strengths</h3>
                <div className="space-y-4">
                  {results.strengths && results.strengths.map((strength, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                      <span className="text-green-600 font-bold text-xl flex-shrink-0">✓</span>
                      <span className="text-gray-700 leading-relaxed">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-8 shadow-xl border-2 border-orange-200">
                <h3 className="text-2xl font-bold text-orange-900 mb-6">Areas to Improve</h3>
                <div className="space-y-4">
                  {results.improvements && results.improvements.map((improvement, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                      <span className="text-orange-600 font-bold text-xl flex-shrink-0">→</span>
                      <span className="text-gray-700 leading-relaxed">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 shadow-xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Your Personalized Action Plan</h3>
              <div className="space-y-4">
                {results.recommendations && results.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <p className="text-gray-800 leading-relaxed text-base">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-8 shadow-xl border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-purple-900 mb-6">Recommended Target Schools</h3>
              <div className="space-y-4">
                {results.targetSchools && results.targetSchools.map((school, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-xl mb-2">
                          {typeof school === 'string' ? school : school.name || school}
                        </h4>
                        {typeof school === 'object' && school.reasoning && (
                          <p className="text-gray-600 leading-relaxed text-base">{school.reasoning}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900 to-blue-900 text-white rounded-2xl p-8 shadow-xl">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">You Have What It Takes! 🎓</h3>
                <p className="text-lg text-green-50 leading-relaxed max-w-3xl mx-auto mb-6">
                  Remember, Ivy League admissions are holistic. Your unique story, passion, and dedication 
                  matter just as much as your scores. Stay focused, work strategically, and believe in your journey.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full">
                    <p className="font-semibold">Keep Learning</p>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full">
                    <p className="font-semibold">Stay Committed</p>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full">
                    <p className="font-semibold">Dream Big</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-8 shadow-xl border-2 border-yellow-300 text-center">
              <h3 className="text-2xl font-bold text-yellow-900 mb-4">Ready to Take Action?</h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Save this assessment and revisit it monthly to track your progress. Update your profile 
                as you achieve new milestones and watch your Ivy Score improve!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => window.print()}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all"
                >
                  Print Assessment
                </button>
               <button 
  onClick={handleNewAssessment}
  className="bg-green-900 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all"
>
  Start New Assessment
</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <h4 className="font-bold text-xl mb-3 text-yellow-500">IvyX.AI</h4>
              <p className="text-gray-400 text-sm">
                Empowering students to achieve their dreams of Ivy League education through AI-powered guidance.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Profile Optimizer</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">University Tracker</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            <p>&copy; 2025 IvyX.AI. All rights reserved. Made with ❤️ for aspiring scholars.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;