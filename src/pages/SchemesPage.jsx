import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { SCHEME_CATEGORIES } from '../data/schemesData';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Bookmark, 
  Share2, 
  X, 
  Building2, 
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';

export default function SchemesPage({ initialCategory, selectedScheme, onClearSelectedScheme }) {
  const { lang, t } = useLanguage();
  const { currentUser } = useAuth();
  const { schemes, bookmarks, toggleBookmark } = useApp();

  const [activeCategory, setActiveCategory] = useState(initialCategory || 'all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [govtLevelFilter, setGovtLevelFilter] = useState('all');
  const [stateUtFilter, setStateUtFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalScheme, setActiveModalScheme] = useState(selectedScheme || null);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (selectedScheme) {
      setActiveModalScheme(selectedScheme);
    }
  }, [selectedScheme]);

  // Filter schemes (SRS 3.3 - Category, Government Level, State/UT, Role, Search)
  const filteredSchemes = schemes.filter(sch => {
    if (!sch.published) return false;

    const matchesCategory = activeCategory === 'all' || sch.category === activeCategory;
    const matchesRole = roleFilter === 'all' || sch.targetUser === roleFilter || sch.targetUser === 'all';
    const matchesGovtLevel = govtLevelFilter === 'all' || (sch.govtLevel || sch.govt_level || 'Central') === govtLevelFilter;
    const matchesStateUt = stateUtFilter === 'all' || (sch.stateUt || sch.state_ut || 'All India').toLowerCase().includes(stateUtFilter.toLowerCase()) || (sch.stateUt || sch.state_ut) === 'All India';

    const textToSearch = `${sch.nameEn} ${sch.nameMr} ${sch.departmentEn} ${sch.departmentMr} ${sch.descriptionEn} ${sch.descriptionMr} ${sch.govtLevel} ${sch.stateUt}`.toLowerCase();
    const matchesSearch = !searchQuery.trim() || textToSearch.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesRole && matchesGovtLevel && matchesStateUt && matchesSearch;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          {lang === 'mr' ? 'सरकारी योजना निर्देशिका' : 'Government Schemes Directory'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          {lang === 'mr' ? 'पात्रता निकष, आवश्यक कागदपत्रे आणि अधिकृत अर्ज लिंक्स एकाच ठिकाणी' : 'Verified government welfare schemes, required documents, and official application portals'}
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', marginBottom: '30px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              style={{
                width: '100%',
                padding: '12px 14px 12px 44px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                outline: 'none',
                background: 'white'
              }}
            />
          </div>

          {/* Government Level Filter Tabs (SRS 3.3) */}
          <div style={{ display: 'flex', gap: '6px', background: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => setGovtLevelFilter('all')}
              style={{
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                background: govtLevelFilter === 'all' ? '#0f172a' : 'transparent',
                fontWeight: 700,
                color: govtLevelFilter === 'all' ? 'white' : '#475569',
                cursor: 'pointer',
                fontSize: '0.82rem'
              }}
            >
              {lang === 'mr' ? 'सर्व पातळी' : 'All Levels'}
            </button>
            <button
              onClick={() => setGovtLevelFilter('Central')}
              style={{
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                background: govtLevelFilter === 'Central' ? '#3b82f6' : 'transparent',
                fontWeight: 700,
                color: govtLevelFilter === 'Central' ? 'white' : '#475569',
                cursor: 'pointer',
                fontSize: '0.82rem'
              }}
            >
              🏛️ {lang === 'mr' ? 'केंद्र सरकार' : 'Central Schemes'}
            </button>
            <button
              onClick={() => setGovtLevelFilter('State/UT')}
              style={{
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                background: govtLevelFilter === 'State/UT' ? '#10b981' : 'transparent',
                fontWeight: 700,
                color: govtLevelFilter === 'State/UT' ? 'white' : '#475569',
                cursor: 'pointer',
                fontSize: '0.82rem'
              }}
            >
              🏞️ {lang === 'mr' ? 'राज्य / UT योजना' : 'State/UT Schemes'}
            </button>
          </div>

          {/* State/UT Selector Dropdown (SRS 3.3) */}
          <div style={{ minWidth: '160px' }}>
            <select
              value={stateUtFilter}
              onChange={(e) => setStateUtFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#334155',
                background: 'white',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">📍 All States / UTs</option>
              <option value="All India">🇮🇳 All India (National)</option>
              <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
              <option value="Delhi">Delhi (दिल्ली)</option>
              <option value="Gujarat">Gujarat (गुजरात)</option>
              <option value="Punjab">Punjab (पंजाब)</option>
              <option value="Karnataka">Karnataka (कर्नाटक)</option>
              <option value="Tamil Nadu">Tamil Nadu (तमिळनाडू)</option>
              <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
            </select>
          </div>

          {/* Role Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => setRoleFilter('all')}
              style={{
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                background: roleFilter === 'all' ? 'white' : 'transparent',
                fontWeight: roleFilter === 'all' ? 700 : 600,
                color: roleFilter === 'all' ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {lang === 'mr' ? 'सर्व नागरिक' : 'All Citizens'}
            </button>
            <button
              onClick={() => setRoleFilter('student')}
              style={{
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                background: roleFilter === 'student' ? 'white' : 'transparent',
                fontWeight: roleFilter === 'student' ? 700 : 600,
                color: roleFilter === 'student' ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              🎓 {lang === 'mr' ? 'विद्यार्थी' : 'Students'}
            </button>
            <button
              onClick={() => setRoleFilter('farmer')}
              style={{
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                background: roleFilter === 'farmer' ? 'white' : 'transparent',
                fontWeight: roleFilter === 'farmer' ? 700 : 600,
                color: roleFilter === 'farmer' ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              🌾 {lang === 'mr' ? 'शेतकरी' : 'Farmers'}
            </button>
          </div>
        </div>

        {/* Category Horizontal Pill List */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '6px'
        }}>
          {SCHEME_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`pill-filter ${activeCategory === cat.id ? 'active' : ''}`}
            >
              <span>{lang === 'mr' ? cat.nameMr : cat.nameEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600 }}>
          {lang === 'mr'
            ? `${filteredSchemes.length} योजना सापडल्या`
            : `Showing ${filteredSchemes.length} verified schemes`
          }
        </div>
      </div>

      {/* Schemes Cards Grid */}
      <div className="grid-cards">
        {filteredSchemes.map(sch => {
          const isBookmarked = bookmarks.includes(sch.id);

          return (
            <div
              key={sch.id}
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Header Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-primary">
                    {SCHEME_CATEGORIES.find(c => c.id === sch.category)?.[lang === 'mr' ? 'nameMr' : 'nameEn']}
                  </span>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(sch.id); }}
                    title="Bookmark Scheme"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: isBookmarked ? '#f97316' : '#94a3b8'
                    }}
                  >
                    <Bookmark size={20} fill={isBookmarked ? '#f97316' : 'none'} />
                  </button>
                </div>

                {/* Scheme Title */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', lineHeight: 1.35 }}>
                  {lang === 'mr' ? sch.nameMr : sch.nameEn}
                </h3>

                <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building2 size={14} />
                  <span>{lang === 'mr' ? sch.departmentMr : sch.departmentEn}</span>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: '0.88rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {lang === 'mr' ? sch.descriptionMr : sch.descriptionEn}
                </p>
              </div>

              {/* Benefits Banner */}
              <div>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '0.82rem',
                  color: '#0f172a',
                  fontWeight: 600,
                  marginBottom: '16px'
                }}>
                  💰 <strong>{lang === 'mr' ? 'लाभ:' : 'Benefit:'}</strong> {lang === 'mr' ? sch.benefitsMr : sch.benefitsEn}
                </div>

                {/* Dates & Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    📅 {lang === 'mr' ? `अंतिम मुदत: ${sch.closingDate}` : `Deadline: ${sch.closingDate}`}
                  </div>

                  <button
                    onClick={() => setActiveModalScheme(sch)}
                    className="btn btn-primary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    <span>{t('viewDetails')}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Scheme Modal Dialog */}
      {activeModalScheme && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 1500,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '1px solid #cbd5e1',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px 28px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'flex-start',
              justify: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <div>
                <span className="badge badge-saffron" style={{ marginBottom: '8px' }}>
                  {SCHEME_CATEGORIES.find(c => c.id === activeModalScheme.category)?.[lang === 'mr' ? 'nameMr' : 'nameEn']}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.3 }}>
                  {lang === 'mr' ? activeModalScheme.nameMr : activeModalScheme.nameEn}
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#93c5fd', marginTop: '4px' }}>
                  {lang === 'mr' ? activeModalScheme.departmentMr : activeModalScheme.departmentEn}
                </div>
              </div>

              <button
                onClick={() => { setActiveModalScheme(null); if (onClearSelectedScheme) onClearSelectedScheme(); }}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px' }}>
              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  📝 {lang === 'mr' ? 'योजनेविषयी सविस्तर माहिती' : 'About the Scheme'}
                </h4>
                <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {lang === 'mr' ? activeModalScheme.descriptionMr : activeModalScheme.descriptionEn}
                </p>
              </div>

              {/* Benefits */}
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#065f46', marginBottom: '6px' }}>
                  🎁 {lang === 'mr' ? 'प्रमुख फायदे व आर्थिक मदत' : 'Key Benefits & Financial Aid'}
                </h4>
                <div style={{ color: '#047857', fontWeight: 600, fontSize: '0.92rem' }}>
                  {lang === 'mr' ? activeModalScheme.benefitsMr : activeModalScheme.benefitsEn}
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  🎯 {lang === 'mr' ? 'पात्रता निकष' : 'Eligibility Criteria'}
                </h4>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '0.9rem',
                  color: '#334155',
                  lineHeight: 1.6
                }}>
                  {lang === 'mr' ? activeModalScheme.eligibilityTextMr : activeModalScheme.eligibilityTextEn}
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                  📄 {t('requiredDocs')}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {(lang === 'mr' ? activeModalScheme.requiredDocumentsMr : activeModalScheme.requiredDocumentsEn).map((doc, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        background: '#f1f5f9',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#1e293b'
                      }}
                    >
                      <CheckCircle2 size={16} color="#10b981" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Process Steps */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                  🚀 {t('applicationSteps')}
                </h4>
                <div style={{
                  background: '#fff7ed',
                  border: '1px solid #ffedd5',
                  borderRadius: '14px',
                  padding: '16px',
                  fontSize: '0.9rem',
                  color: '#9a3412',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.7
                }}>
                  {lang === 'mr' ? activeModalScheme.applicationProcessMr : activeModalScheme.applicationProcessEn}
                </div>
              </div>

              {/* Verified Application Button Launcher */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  🔒 {lang === 'mr' ? 'अधिकृत शासन व्हेरीफाईड लिंक' : 'Official Verified Govt Portal'}
                </div>

                <a
                  href={activeModalScheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '0.95rem' }}
                >
                  <span>{t('applyOfficial')}</span>
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
