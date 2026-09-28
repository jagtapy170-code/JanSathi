import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { SCHEME_CATEGORIES } from '../data/schemesData';
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Users, 
  FileText, 
  ArrowRight, 
  GraduationCap, 
  Sprout, 
  HeartPulse, 
  Baby, 
  Home, 
  Briefcase, 
  Accessibility, 
  Bus, 
  Landmark,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

const ICON_MAP = {
  GraduationCap,
  Sprout,
  HeartPulse,
  Baby,
  Home,
  Briefcase,
  Users,
  Accessibility,
  Bus,
  Landmark
};

export default function HomePage({ setActiveTab, onSelectCategory, onSelectScheme }) {
  const { lang, t } = useLanguage();
  const { schemes, announcements, grievances } = useApp();

  const featuredSchemes = schemes.filter(s => s.featured || s.published).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '60px 0 50px 0',
        background: 'radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.12) 0%, rgba(249, 115, 22, 0.08) 50%, transparent 100%)',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* Hero Left Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'white',
                border: '1px solid #bfdbfe',
                boxShadow: '0 2px 10px rgba(37, 99, 235, 0.1)',
                color: '#1d4ed8',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '20px'
              }}>
                <span className="live-indicator" />
                <span>{lang === 'mr' ? 'ग्रामपंचायत जनसेवा अभियान २०२६' : 'Gram Panchayat Citizen Digital Initiative 2026'}</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: '800',
                lineHeight: 1.2,
                color: '#0f172a',
                marginBottom: '20px',
                letterSpacing: '-0.02em'
              }}>
                {t('heroTitle')}
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: '#475569',
                lineHeight: 1.7,
                marginBottom: '32px'
              }}>
                {t('heroSubtitle')}
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                <button
                  onClick={() => setActiveTab('eligibility')}
                  className="btn btn-primary"
                  style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '14px' }}
                >
                  <Sparkles size={20} />
                  <span>{t('checkEligibility')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('schemes')}
                  className="btn btn-saffron"
                  style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '14px' }}
                >
                  <Search size={20} />
                  <span>{t('exploreSchemes')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('grievance')}
                  className="btn btn-outline"
                  style={{ padding: '14px 24px', fontSize: '1rem', borderRadius: '14px' }}
                >
                  <AlertCircle size={18} />
                  <span>{t('navGrievance')}</span>
                </button>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="glass-panel" style={{
              padding: '30px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.85) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 40px rgba(37, 99, 235, 0.12)'
            }}>
              <div style={{
                fontSize: '0.82rem',
                fontWeight: '800',
                color: '#2563eb',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px'
              }}>
                🌟 {lang === 'mr' ? 'आजच्या प्रमुख योजना सूची' : 'Today’s Highlights'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {featuredSchemes.map(sch => (
                  <div
                    key={sch.id}
                    onClick={() => { onSelectScheme(sch); setActiveTab('schemes'); }}
                    style={{
                      background: 'white',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                    className="glass-card"
                  >
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>
                        {lang === 'mr' ? sch.nameMr : sch.nameEn}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {lang === 'mr' ? sch.departmentMr : sch.departmentEn}
                      </div>
                    </div>
                    <ArrowRight size={18} color="#2563eb" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Counters */}
      <section style={{ padding: '30px 0', background: 'white', borderVertical: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            textAlign: 'center'
          }}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#2563eb' }}>{schemes.length}+</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{t('statSchemes')}</div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#f97316' }}>1,250+</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{t('statCitizens')}</div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#10b981' }}>{grievances.length + 42}</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{t('statGrievances')}</div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#8b5cf6' }}>98.5%</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{t('statMatchAccuracy')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
              {lang === 'mr' ? 'शासकीय योजना श्रेणीनुसार शोधा' : 'Browse Schemes by Category'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              {lang === 'mr' ? 'शेतकरी, विद्यार्थी, महिला व दिव्यांगांसाठी वर्गीकरण केलेल्या योजना' : 'Categorized government welfare programs for quick access'}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {SCHEME_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
              const Icon = ICON_MAP[cat.icon] || FileText;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setActiveTab('schemes');
                  }}
                  className="glass-card"
                  style={{
                    padding: '24px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    background: 'white'
                  }}
                >
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    margin: '0 auto 16px auto'
                  }}>
                    <Icon size={28} />
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a', marginBottom: '4px' }}>
                    {lang === 'mr' ? cat.nameMr : cat.nameEn}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {schemes.filter(s => s.category === cat.id).length} {lang === 'mr' ? 'योजना उपलब्ध' : 'Active Schemes'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Announcements Ticker */}
      <section style={{ padding: '40px 0', background: '#eff6ff' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={22} color="#2563eb" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                {lang === 'mr' ? 'ग्रामपंचायत ताज्या सूचना व निवेदने' : 'Latest Village Announcements'}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('announcements')}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#2563eb',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{lang === 'mr' ? 'सर्व सूचना पहा' : 'View All Notices'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {announcements.slice(0, 3).map(ann => (
              <div
                key={ann.id}
                style={{
                  background: 'white',
                  borderRadius: '14px',
                  padding: '18px',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-saffron">{lang === 'mr' ? (ann.categoryMr || ann.category) : ann.category}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>📅 {ann.date}</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  {lang === 'mr' ? ann.titleMr : ann.titleEn}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {lang === 'mr' ? ann.contentMr : ann.contentEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
