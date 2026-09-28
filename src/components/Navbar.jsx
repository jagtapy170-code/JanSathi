import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  BookOpen, 
  Sparkles, 
  AlertCircle, 
  Building2, 
  Bell, 
  ShieldCheck, 
  Globe, 
  UserCheck, 
  Menu, 
  X, 
  LogOut, 
  ChevronDown,
  Layers
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { lang, setLang, t } = useLanguage();
  const { currentUser, logout, loginAsDemo, isAdmin } = useAuth();
  const { notifications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'schemes', label: t('navSchemes'), icon: BookOpen },
    { id: 'eligibility', label: t('navEligibility'), icon: Sparkles },
    { id: 'resources', label: t('navResources'), icon: Building2 },
    { id: 'notifications', label: t('navNotifications'), icon: Bell, badge: unreadCount },
    { id: 'admin', label: t('navAdmin'), icon: ShieldCheck, adminOnly: true }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Top Govt Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #ea580c 100%)',
        color: 'white',
        fontSize: '0.78rem',
        padding: '4px 20px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        fontWeight: 500
      }}>
        <div>
          🏛️ {lang === 'mr' ? 'ग्रामपंचायत डिजिटल सेवा पोर्टल | जनसाथी स्मार्ट सहाय्यक' : 'Gram Panchayat Digital Services | JanSathi Smart Assistant'}
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>📞 Toll-Free Helpline: 1800-120-8040</span>
          <span>📍 Village: Janpuri (जनपुरी)</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        height: '70px'
      }}>
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f97316 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: 'white',
            fontWeight: '800',
            fontSize: '1.4rem',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
          }}>
            JS
          </div>
          <div>
            <div style={{
              fontSize: '1.45rem',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              JanSathi <span style={{ fontSize: '0.9rem', color: '#f97316', fontWeight: 700 }}>जनसाथी</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
              {t('tagline')}
            </div>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }} className="desktop-nav">
          {navItems.map(item => {
            if (item.adminOnly && !isAdmin) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#2563eb' : '#475569',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={17} color={isActive ? '#2563eb' : '#64748b'} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: '#f43f5e',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Controls: Language Switcher & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Multilingual Language Selector (English | मराठी | हिन्दी) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#eff6ff',
            borderRadius: '20px',
            padding: '2px',
            border: '1px solid #bfdbfe'
          }}>
            <span style={{ padding: '0 6px', color: '#2563eb', display: 'flex', alignItems: 'center' }}>
              <Globe size={15} />
            </span>
            <button
              onClick={() => setLang('en')}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: 'none',
                background: lang === 'en' ? '#2563eb' : 'transparent',
                color: lang === 'en' ? 'white' : '#1e40af',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              English
            </button>
            <button
              onClick={() => setLang('mr')}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: 'none',
                background: lang === 'mr' ? '#ea580c' : 'transparent',
                color: lang === 'mr' ? 'white' : '#9a3412',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              मराठी
            </button>
            <button
              onClick={() => setLang('hi')}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: 'none',
                background: lang === 'hi' ? '#7c3aed' : 'transparent',
                color: lang === 'hi' ? 'white' : '#5b21b6',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              हिन्दी
            </button>
          </div>

          {/* User Profile Badge & Quick Switcher */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentUser.role === 'admin' ? '#8b5cf6' : currentUser.role === 'farmer' ? '#10b981' : currentUser.role === 'student' ? '#2563eb' : '#f97316',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}>
                  {currentUser.name.charAt(0)}
                </div>
                <div style={{ textAlign: 'left', display: 'none' }} className="user-text">
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {t(`role${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}`)}
                  </div>
                </div>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '240px',
                  background: 'white',
                  borderRadius: '14px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: '12px',
                  zIndex: 1100
                }}>
                  <div style={{ paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{currentUser.email}</div>
                  </div>

                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {lang === 'mr' ? 'डेमो प्रोफाईल बदला' : 'Switch Demo Profile'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button 
                      onClick={() => { loginAsDemo('student'); setUserDropdownOpen(false); }} 
                      style={{ textAlign: 'left', padding: '6px 10px', border: 'none', background: currentUser.role === 'student' ? '#eff6ff' : 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>
                      🎓 Student (अनिकेत - विद्यार्थी)
                    </button>
                    <button 
                      onClick={() => { loginAsDemo('farmer'); setUserDropdownOpen(false); }} 
                      style={{ textAlign: 'left', padding: '6px 10px', border: 'none', background: currentUser.role === 'farmer' ? '#ecfdf5' : 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>
                      🌾 Farmer (गणेश - शेतकरी)
                    </button>
                    <button 
                      onClick={() => { loginAsDemo('citizen'); setUserDropdownOpen(false); }} 
                      style={{ textAlign: 'left', padding: '6px 10px', border: 'none', background: currentUser.role === 'citizen' ? '#fff7ed' : 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>
                      👩 Citizen (सुनिता - महिला)
                    </button>
                    <button 
                      onClick={() => { loginAsDemo('admin'); setUserDropdownOpen(false); }} 
                      style={{ textAlign: 'left', padding: '6px 10px', border: 'none', background: currentUser.role === 'admin' ? '#ede9fe' : 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '700', color: '#6d28d9' }}>
                      🛡️ Administrator (ग्रामसेवक)
                    </button>
                  </div>

                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        border: 'none',
                        background: '#ffe4e6',
                        color: '#e11d48',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '0.82rem'
                      }}
                    >
                      <LogOut size={14} />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <UserCheck size={16} />
              <span>{t('login')}</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 640px) {
          .user-text { display: block !important; }
        }
      `}</style>
    </header>
  );
}
