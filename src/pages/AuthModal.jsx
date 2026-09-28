import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { X, GraduationCap, Sprout, UserCheck, ShieldCheck, KeyRound } from 'lucide-react';

export default function AuthModal({ onClose }) {
  const { lang, t } = useLanguage();
  const { loginAsDemo, loginWithBackend, registerWithBackend } = useAuth();
  const [viewMode, setViewMode] = useState('login'); // 'login', 'register', 'reset'
  const [userClass, setUserClass] = useState('citizen'); // 'student', 'farmer', 'citizen'

  const [resetEmail, setResetEmail] = useState('');
  const [resetPass, setResetPass] = useState('');
  const [resetMsg, setResetMsg] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'citizen',
    age: 25,
    state: 'Maharashtra',
    district: 'Pune',
    caste_category: 'General',
    gender: 'All',
    education_level: 'Graduate',
    land_holding: 0,
    disability_status: false,
    income: 180000
  });

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      user_type: userClass,
      role: userClass
    };
    const res = await registerWithBackend(payload);
    if (res.success) {
      alert(lang === 'mr' ? 'नोंदणी यशस्वी झाली!' : 'Registration successful!');
      onClose();
    } else {
      alert(res.message);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const res = await apiService.resetPassword(resetEmail, resetPass);
    if (res.status === 'success') {
      setResetMsg(lang === 'mr' ? 'पासवर्ड यशस्वीरित्या बदलला!' : 'Password reset successfully!');
      setTimeout(() => setViewMode('login'), 2000);
    } else {
      setResetMsg(res.message || 'Password reset failed.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15,23,42,0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        maxWidth: '540px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        border: '1px solid #cbd5e1',
        padding: '28px'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              {viewMode === 'register' && (lang === 'mr' ? 'नवीन नागरिक / विद्यार्थी नोंदणी' : 'New User Registration')}
              {viewMode === 'login' && (lang === 'mr' ? 'खात्यात प्रवेश करा' : 'Sign In to JanSathi')}
              {viewMode === 'reset' && (lang === 'mr' ? 'पासवर्ड पुन्हा सेट करा' : 'Reset Account Password')}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {lang === 'mr' ? 'योजनांच्या पात्रता जुळवणीसाठी आपले प्रोफाईल निवडा' : 'Pan-India Citizen Service Platform (SRS v3.0)'}
            </p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={22} color="#64748b" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => setViewMode('login')}
            style={{
              flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
              background: viewMode === 'login' ? 'white' : 'transparent',
              fontWeight: viewMode === 'login' ? 800 : 600,
              color: viewMode === 'login' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.82rem'
            }}
          >
            {t('login')}
          </button>
          <button
            onClick={() => setViewMode('register')}
            style={{
              flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
              background: viewMode === 'register' ? 'white' : 'transparent',
              fontWeight: viewMode === 'register' ? 800 : 600,
              color: viewMode === 'register' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.82rem'
            }}
          >
            {lang === 'mr' ? 'नवीन नोंदणी' : 'Register'}
          </button>
          <button
            onClick={() => setViewMode('reset')}
            style={{
              flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
              background: viewMode === 'reset' ? 'white' : 'transparent',
              fontWeight: viewMode === 'reset' ? 800 : 600,
              color: viewMode === 'reset' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.82rem'
            }}
          >
            🔑 {lang === 'mr' ? 'पासवर्ड मदत' : 'Forgot Pass'}
          </button>
        </div>

        {/* --- LOGIN VIEW --- */}
        {viewMode === 'login' && (
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
              ⚡ {lang === 'mr' ? 'त्वरित डेमो लॉगिन (Quick Presets)' : 'Quick Preset Personas'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <button onClick={() => { loginAsDemo('student'); onClose(); }} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #bfdbfe', background: '#eff6ff', textAlign: 'left', cursor: 'pointer' }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1d4ed8' }}>🎓 Student</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>अनिकेत पाटील (Student)</div>
              </button>
              <button onClick={() => { loginAsDemo('farmer'); onClose(); }} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #a7f3d0', background: '#ecfdf5', textAlign: 'left', cursor: 'pointer' }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#047857' }}>🌾 Farmer</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>गणेश देशमुख (Farmer)</div>
              </button>
              <button onClick={() => { loginAsDemo('citizen'); onClose(); }} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #fed7aa', background: '#fff7ed', textAlign: 'left', cursor: 'pointer' }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#c2410c' }}>👩 Citizen</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>सुनिता कांबळे (Citizen)</div>
              </button>
              <button onClick={() => { loginAsDemo('admin'); onClose(); }} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #ddd6fe', background: '#f5f3ff', textAlign: 'left', cursor: 'pointer' }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#6d28d9' }}>🛡️ Admin</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>ग्रामसेवक प्रशासक</div>
              </button>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const res = await loginWithBackend(e.target.email.value, e.target.password.value);
                if (res.success) onClose();
                else alert(res.message);
              }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Email Address</label>
                  <input name="email" type="email" placeholder="rahul@example.com" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Password</label>
                  <input name="password" type="password" placeholder="user123" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '11px', marginTop: '6px' }}>
                  Login via Java & MySQL
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- REGISTER VIEW (SRS 3.1 - Student, Farmer, Citizen User Classes) --- */}
        {viewMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                {lang === 'mr' ? 'वापरकर्ता प्रकार निवडा (User Category)' : 'Select User Category'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setUserClass('student')}
                  style={{
                    padding: '8px', borderRadius: '8px', border: userClass === 'student' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: userClass === 'student' ? '#eff6ff' : 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                  }}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setUserClass('farmer')}
                  style={{
                    padding: '8px', borderRadius: '8px', border: userClass === 'farmer' ? '2px solid #059669' : '1px solid #cbd5e1',
                    background: userClass === 'farmer' ? '#ecfdf5' : 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                  }}
                >
                  🌾 Farmer
                </button>
                <button
                  type="button"
                  onClick={() => setUserClass('citizen')}
                  style={{
                    padding: '8px', borderRadius: '8px', border: userClass === 'citizen' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                    background: userClass === 'citizen' ? '#fff7ed' : 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                  }}
                >
                  👩 Citizen
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Phone Number</label>
                <input type="text" required value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            {/* SRS Profile Attributes: State/UT & District */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>State / UT</label>
                <select value={formData.state} onChange={e => setFormData(p => ({ ...p, state: e.target.value }))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>District</label>
                <input type="text" required value={formData.district} onChange={e => setFormData(p => ({ ...p, district: e.target.value }))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            {/* Specific Attributes based on User Category */}
            {userClass === 'student' && (
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Education Level</label>
                <select value={formData.education_level} onChange={e => setFormData(p => ({ ...p, education_level: e.target.value }))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Diploma / ITI">Diploma / ITI</option>
                  <option value="Undergraduate (BE/BSc/BA)">Undergraduate (BE/BSc/BA)</option>
                  <option value="Postgraduate / Ph.D.">Postgraduate / Ph.D.</option>
                </select>
              </div>
            )}

            {userClass === 'farmer' && (
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Land Holding (in Acres)</label>
                <input type="number" step="0.5" value={formData.land_holding} onChange={e => setFormData(p => ({ ...p, land_holding: e.target.value }))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ padding: '11px', marginTop: '6px' }}>
              Complete {userClass.toUpperCase()} Registration
            </button>
          </form>
        )}

        {/* --- RESET PASSWORD VIEW (SRS 3.1) --- */}
        {viewMode === 'reset' && (
          <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {resetMsg && (
              <div style={{ padding: '10px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.85rem', fontWeight: 700 }}>
                {resetMsg}
              </div>
            )}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Account Email</label>
              <input type="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="Enter registered email" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>New Password</label>
              <input type="password" required value={resetPass} onChange={e => setResetPass(e.target.value)} placeholder="Enter new password" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '11px' }}>
              Reset Password via Java API
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
