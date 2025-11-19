// src/services/authService.js

//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = 'https://ivyx-test.onrender.com/api';
console.log(API_URL)
// Sign Up
export const signUp = async (userData) => {
  
  try {
    
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token and user
    localStorage.setItem('ivyx_token', data.token);
    localStorage.setItem('ivyx_currentUser', JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw error;
  }
};

// Sign In
export const signIn = async (email, password) => {
  try {
    console.log(API_URL)
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token and user
    localStorage.setItem('temp',API_URL);
    localStorage.setItem('ivyx_token', data.token);
    localStorage.setItem('ivyx_currentUser', JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw error;
  }
};

// Get Current User
export const getMe = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get All Users (Admin only)
export const getAllUsers = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/auth/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Sign Out
export const signOut = () => {
  localStorage.removeItem('ivyx_currentUser');
  localStorage.removeItem('ivyx_token');
};

// Get Current User from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('ivyx_currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('ivyx_token');
};

// Get Auth Token
export const getToken = () => {
  return localStorage.getItem('ivyx_token');
};

// Export as default object as well for flexibility
const authService = {
  signUp,
  signIn,
  getMe,
  getAllUsers,
  signOut,
  getCurrentUser,
  isAuthenticated,
  getToken,
};

export default authService;