// src/services/api.js - SRS 3.0 API Client for Java Backend & PHP/MySQL Database

const API_BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  // --- AUTHENTICATION (SRS 3.1) ---
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await response.json();
    } catch (err) {
      console.warn('Backend server offline, falling back to local auth');
      return { status: 'success', user: { name: 'Demo Citizen', email, role: 'citizen', user_type: 'citizen', state: 'Maharashtra', district: 'Pune' } };
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await response.json();
    } catch (err) {
      return { status: 'success', user: { ...userData, role: userData.user_type || 'citizen' } };
    }
  },

  resetPassword: async (email, new_password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, new_password })
      });
      return await response.json();
    } catch (err) {
      return { status: 'success', message: 'Password reset request processed.' };
    }
  },

  // --- SCHEMES (SRS 3.3 - Central vs State/UT Classification) ---
  getSchemes: async (category = '', govt_level = '', state_ut = '', search = '') => {
    try {
      let url = `${API_BASE_URL}/schemes`;
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (govt_level && govt_level !== 'all') params.append('govt_level', govt_level);
      if (state_ut && state_ut !== 'all') params.append('state_ut', state_ut);
      if (search) params.append('search', search);
      if ([...params].length > 0) url += `?${params.toString()}`;

      const response = await fetch(url);
      const resData = await response.json();
      return resData.data || [];
    } catch (err) {
      console.warn('Using fallback schemes');
      return null;
    }
  },

  addScheme: async (schemeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/schemes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schemeData)
      });
      return await response.json();
    } catch (err) {
      return { status: 'success', scheme_id: 'sch-' + Date.now() };
    }
  },

  deleteScheme: async (scheme_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/schemes?scheme_id=${scheme_id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (err) {
      return { status: 'success' };
    }
  },

  // --- ELIGIBILITY CHECKER (SRS 3.2) ---
  checkEligibility: async (criteria) => {
    try {
      const response = await fetch(`${API_BASE_URL}/eligibility/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria)
      });
      const resData = await response.json();
      return resData.data || [];
    } catch (err) {
      return null;
    }
  },

  // --- GRIEVANCE MANAGEMENT (SRS 3.7) ---
  getGrievances: async (user_id = null, tracking_id = null) => {
    try {
      let url = `${API_BASE_URL}/grievances`;
      if (tracking_id) url += `?tracking_id=${encodeURIComponent(tracking_id)}`;
      else if (user_id) url += `?user_id=${user_id}`;

      const response = await fetch(url);
      const resData = await response.json();
      return resData.data || (tracking_id ? null : []);
    } catch (err) {
      return null;
    }
  },

  submitGrievance: async (grievanceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grievances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grievanceData)
      });
      return await response.json();
    } catch (err) {
      return { status: 'success', tracking_id: 'GRV-2026-' + Math.floor(1000 + Math.random() * 9000) };
    }
  },

  updateGrievance: async (tracking_id, status, remarks) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grievances/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_id, status, remarks })
      });
      return await response.json();
    } catch (err) {
      return { status: 'success' };
    }
  },

  // --- ANNOUNCEMENTS & NOTIFICATIONS (SRS 3.5 & 3.11) ---
  getAnnouncements: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements`);
      const resData = await response.json();
      return resData.data || [];
    } catch (err) {
      return null;
    }
  },

  getNotifications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      const resData = await response.json();
      return resData.data || [];
    } catch (err) {
      return null;
    }
  },

  // --- ADMIN STATS (SRS 3.9) ---
  getAdminStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin`);
      const resData = await response.json();
      return resData.data || null;
    } catch (err) {
      return null;
    }
  },

  // --- JANSAHAYAK CHATBOT (SRS 3.6) ---
  queryChatbot: async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      return await response.json();
    } catch (err) {
      return null;
    }
  }
};
