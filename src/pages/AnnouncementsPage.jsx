import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Layers, Calendar, Pin, Search, Building2, Bell } from 'lucide-react';

export default function AnnouncementsPage() {
  const { lang, t } = useLanguage();
  const { announcements } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAnnouncements = announcements.filter(ann => {
    const text = `${ann.titleEn} ${ann.titleMr} ${ann.contentEn} ${ann.contentMr}`.toLowerCase();
    return !searchQuery.trim() || text.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 30px auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          📢 {lang === 'mr' ? 'ग्रामपंचायत सूचना व जाहीर निवेदने' : 'Gram Panchayat Announcements & Notices'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          {lang === 'mr'
            ? 'ग्रामसभा बैठका, आरोग्य शिबिरे, नळ योजना व सरकारी निविदांविषयी अधिकृत माहिती'
            : 'Official notices, Gram Sabha meetings, health camps, and water supply announcements'
          }
        </p>
      </div>

      {/* Search Input */}
      <div style={{ maxWidth: '500px', margin: '0 auto 30px auto', position: 'relative' }}>
        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'mr' ? 'सूचना शोधा...' : 'Search announcements...'}
          style={{
            width: '100%',
            padding: '12px 14px 12px 42px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            fontSize: '0.95rem',
            outline: 'none',
            background: 'white'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '850px', margin: '0 auto' }}>
        {filteredAnnouncements.map(ann => (
          <div
            key={ann.id}
            className="glass-card"
            style={{
              padding: '24px',
              borderRadius: '20px',
              background: 'white',
              borderLeft: ann.isPinned ? '6px solid #f97316' : '6px solid #2563eb'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-saffron">{lang === 'mr' ? (ann.categoryMr || ann.category) : ann.category}</span>
                {ann.isPinned && (
                  <span style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Pin size={12} /> {lang === 'mr' ? 'पिन केलेली सूचना' : 'Pinned'}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>📅 {ann.date}</span>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              {lang === 'mr' ? ann.titleMr : ann.titleEn}
            </h3>

            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
              {lang === 'mr' ? ann.contentMr : ann.contentEn}
            </p>

            <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={14} />
              <span>{lang === 'mr' ? `प्रसिद्धीकर्ते: ${ann.publishedBy}` : `Published by: ${ann.publishedBy}`}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
