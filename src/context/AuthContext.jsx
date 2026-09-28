import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

const DEMO_PROFILES = {
  student: {
    id: 'usr-student-01',
    name: 'Aniket Patil (अनिकेत पाटील)',
    email: 'aniket.student@jansathi.in',
    role: 'student',
    age: 20,
    annualIncome: 150000,
    casteCategory: 'OBC',
    gender: 'Male',
    educationLevel: 'Graduate 2nd Year (BE Computer)',
    landHolding: 0,
    disabilityStatus: false,
    district: 'Latur',
    village: 'Janpuri'
  },
  farmer: {
    id: 'usr-farmer-01',
    name: 'Ganesh Deshmukh (गणेश देशमुख)',
    email: 'ganesh.farmer@jansathi.in',
    role: 'farmer',
    age: 42,
    annualIncome: 180000,
    casteCategory: 'General / Open',
    gender: 'Male',
    educationLevel: '10th Pass',
    landHolding: 3.5, // acres
    disabilityStatus: false,
    district: 'Yavatmal',
    village: 'Janpuri'
  },
  citizen: {
    id: 'usr-citizen-01',
    name: 'Sunita Kamble (सुनिता कांबळे)',
    email: 'sunita.citizen@jansathi.in',
    role: 'citizen',
    age: 34,
    annualIncome: 120000,
    casteCategory: 'SC',
    gender: 'Female',
    educationLevel: '12th Pass',
    landHolding: 0,
    disabilityStatus: false,
    district: 'Solapur',
    village: 'Janpuri'
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Gram Sevak Administrator (प्रशासक)',
    email: 'admin@jansathi.gov.in',
    role: 'admin',
    age: 40,
    district: 'Village Panchayat HQ',
    village: 'Janpuri'
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('jansathi_user');
    return saved ? JSON.parse(saved) : DEMO_PROFILES.citizen; // Default demo citizen logged in
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jansathi_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jansathi_user');
    }
  }, [currentUser]);

  const loginAsDemo = (roleKey) => {
    if (DEMO_PROFILES[roleKey]) {
      setCurrentUser(DEMO_PROFILES[roleKey]);
    }
  };

  const loginWithBackend = async (email, password) => {
    const res = await apiService.login(email, password);
    if (res.status === 'success' && res.user) {
      setCurrentUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const registerWithBackend = async (userData) => {
    const res = await apiService.register(userData);
    if (res.status === 'success' && res.user) {
      setCurrentUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedData) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  const registerUser = (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      ...userData
    };
    setCurrentUser(newUser);
    return newUser;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      loginAsDemo,
      loginWithBackend,
      registerWithBackend,
      logout,
      updateProfile,
      registerUser,
      isAdmin: currentUser?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
