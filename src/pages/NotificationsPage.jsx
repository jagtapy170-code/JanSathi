import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function NotificationsPage({ onNavigateScheme }) {
  const { lang, t } = useLanguage();
  const { notifications, markNotificationRead } = useApp();

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 30px auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          🔔 {t('navNotifications')}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          {lang === 'mr'
            ? 'योजना अंतिम मुदत स्मरणपत्रे (१५ दिवस, ७ दिवस, १ दिवस) व तक्रार निवारण अपडेट्स'
            : 'Scheme deadline countdown reminders (15 days, 7 days, 1 day) and grievance alerts'
          }
        </p>
      </div>

      <div style={{ maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className="glass-card"
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: n.read ? '#ffffff' : '#f0f9ff',
              borderLeft: n.type === 'deadline' ? '6px solid #f43f5e' : '6px solid #2563eb',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={n.type === 'deadline' ? 'badge badge-rose' : 'badge badge-primary'}>
                  {n.type === 'deadline' ? (lang === 'mr' ? 'मुदत स्मरणपत्र' : 'Deadline Alert') : (lang === 'mr' ? 'नवीन माहिती' : 'Match Alert')}
                </span>
                {!n.read && <span style={{ fontSize: '0.72rem', background: '#2563eb', color: 'white', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>NEW</span>}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>📅 {n.date}</span>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              {lang === 'mr' ? n.titleMr : n.titleEn}
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '10px' }}>
              {lang === 'mr' ? n.messageMr : n.messageEn}
            </p>

            {n.schemeId && (
              <button
                onClick={(e) => { e.stopPropagation(); onNavigateScheme(n.schemeId); }}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <span>{lang === 'mr' ? 'योजना पहा' : 'View Scheme'}</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
