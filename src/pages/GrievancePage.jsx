import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  AlertCircle, 
  Send, 
  Search, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User 
} from 'lucide-react';

export default function GrievancePage() {
  const { lang, t } = useLanguage();
  const { currentUser } = useAuth();
  const { grievances, addGrievance } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('submit'); // 'submit' | 'track'
  const [searchTrackId, setSearchTrackId] = useState('');
  const [trackedItem, setTrackedItem] = useState(null);
  const [submittedSuccessId, setSubmittedSuccessId] = useState(null);

  const [formData, setFormData] = useState({
    category: 'Drinking Water (पिण्याचे पाणी)',
    titleEn: '',
    titleMr: '',
    descriptionEn: '',
    descriptionMr: '',
    location: '',
    contactName: currentUser?.name || '',
    contactPhone: '+91 '
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const titleText = formData.titleMr || formData.titleEn || 'Village Issue';
    const descText = formData.descriptionMr || formData.descriptionEn || 'No details provided';

    const newTicket = addGrievance({
      category: formData.category,
      titleEn: titleText,
      titleMr: titleText,
      descriptionEn: descText,
      descriptionMr: descText,
      location: formData.location,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone
    });

    setSubmittedSuccessId(newTicket.id);
    setFormData({
      category: 'Drinking Water (पिण्याचे पाणी)',
      titleEn: '',
      titleMr: '',
      descriptionEn: '',
      descriptionMr: '',
      location: '',
      contactName: currentUser?.name || '',
      contactPhone: '+91 '
    });
  };

  const handleTrackSearch = (e) => {
    if (e) e.preventDefault();
    const found = grievances.find(g => g.id.toLowerCase() === searchTrackId.trim().toLowerCase());
    setTrackedItem(found || 'not_found');
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'Under Review': return 1;
      case 'In Action': return 2;
      case 'Resolved': return 3;
      default: return 0;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 30px auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          📌 {t('grievanceTitle')}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          {lang === 'mr'
            ? 'पिण्याचे पाणी, रस्ते, वीज, आणि स्वच्छतेबाबत ग्रामपंचायत स्तरावर तक्रार नोंदवा व ऑनलाइन ट्रॅक करा'
            : 'Register and track village infrastructure, sanitation, drinking water, and public service complaints online'
          }
        </p>
      </div>

      {/* Sub-Tab Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <div style={{ background: '#e2e8f0', padding: '4px', borderRadius: '16px', display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveSubTab('submit')}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              border: 'none',
              background: activeSubTab === 'submit' ? 'white' : 'transparent',
              color: activeSubTab === 'submit' ? '#2563eb' : '#64748b',
              fontWeight: activeSubTab === 'submit' ? 800 : 600,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            ✏️ {t('submitNewGrievance')}
          </button>
          <button
            onClick={() => setActiveSubTab('track')}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              border: 'none',
              background: activeSubTab === 'track' ? 'white' : 'transparent',
              color: activeSubTab === 'track' ? '#2563eb' : '#64748b',
              fontWeight: activeSubTab === 'track' ? 800 : 600,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            🔍 {t('trackGrievance')}
          </button>
        </div>
      </div>

      {/* TAB 1: SUBMIT FORM */}
      {activeSubTab === 'submit' && (
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          {submittedSuccessId && (
            <div style={{
              background: '#ecfdf5',
              border: '2px solid #10b981',
              borderRadius: '18px',
              padding: '24px',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#065f46', marginBottom: '6px' }}>
                {lang === 'mr' ? 'तक्रार यशस्वीरित्या नोंदवली गेली!' : 'Grievance Submitted Successfully!'}
              </h3>
              <p style={{ color: '#047857', fontSize: '0.95rem', marginBottom: '14px' }}>
                {lang === 'mr' ? 'तुमचा तक्रार संदर्भ आयडी खालीलप्रमाणे आहे:' : 'Your unique Tracking Reference ID is:'}
              </p>
              <div style={{
                display: 'inline-block',
                background: 'white',
                border: '2px dashed #10b981',
                padding: '10px 24px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '1.4rem',
                color: '#065f46',
                marginBottom: '16px'
              }}>
                {submittedSuccessId}
              </div>
              <div>
                <button
                  onClick={() => { setSearchTrackId(submittedSuccessId); setActiveSubTab('track'); handleTrackSearch(); }}
                  className="btn btn-emerald"
                >
                  <span>{lang === 'mr' ? 'तक्रारीची स्थिती तपासा' : 'Track Status Now'}</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="glass-panel" style={{ padding: '32px', borderRadius: '24px', background: 'white' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>
              📝 {lang === 'mr' ? 'नवीन तक्रार अर्ज' : 'Lodge New Grievance'}
            </h3>

            {/* Category Select */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                {t('grievanceCategory')}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', background: 'white' }}
              >
                <option value="Drinking Water (पिण्याचे पाणी)">💧 Drinking Water (पिण्याचे पाणी)</option>
                <option value="Streetlight & Electricity (रस्ते व वीज)">💡 Streetlight & Electricity (रस्ते व वीज)</option>
                <option value="Roads & Drainage (रस्ते व गटारे)">🛣️ Roads & Drainage (रस्ते व गटारे)</option>
                <option value="Sanitation & Garbage (स्वच्छता व कचरा)">🧹 Sanitation & Garbage (स्वच्छता व कचरा)</option>
                <option value="Health & Anganwadi (आरोग्य व अंगणवाडी)">🏥 Health & Anganwadi (आरोग्य व अंगणवाडी)</option>
                <option value="Ration & PDS (रेशन दुकान व अन्नपुरवठा)">🌾 Ration & PDS (रेशन दुकान व अन्नपुरवठा)</option>
                <option value="Agriculture & Land (शेती व पानंद रस्ते)">🚜 Agriculture & Land (शेती व पानंद रस्ते)</option>
              </select>
            </div>

            {/* Issue Title */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                {lang === 'mr' ? 'समस्येचे शीर्षक / विषय' : 'Issue Subject'}
              </label>
              <input
                type="text"
                required
                value={lang === 'mr' ? formData.titleMr : formData.titleEn}
                onChange={(e) => setFormData(prev => ({ ...prev, titleMr: e.target.value, titleEn: e.target.value }))}
                placeholder={lang === 'mr' ? 'उदा. मंदिर रस्त्यावरील नळ गळती समस्या' : 'e.g. Water pipeline leakage near high school'}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            {/* Location */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                {t('grievanceLocation')}
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder={lang === 'mr' ? 'उदा. प्रभाग क्र. ३, हनुमान मंदिराजवळ, जनपुरी' : 'e.g. Ward No. 3, Near Temple Square'}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                {t('grievanceDesc')}
              </label>
              <textarea
                rows={4}
                required
                value={lang === 'mr' ? formData.descriptionMr : formData.descriptionEn}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionMr: e.target.value, descriptionEn: e.target.value }))}
                placeholder={lang === 'mr' ? 'समस्येचे सविस्तर वर्णन करा...' : 'Describe your problem in detail...'}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            {/* Contact Name & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  {lang === 'mr' ? 'तक्रारदाराचे नाव' : 'Applicant Name'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  {t('grievanceContact')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-saffron"
              style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '1.05rem' }}
            >
              <Send size={18} />
              <span>{t('submitButton')}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: TRACK STATUS */}
      {activeSubTab === 'track' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Search Box */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', background: 'white', marginBottom: '30px' }}>
            <form onSubmit={handleTrackSearch} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={searchTrackId}
                onChange={(e) => setSearchTrackId(e.target.value)}
                placeholder={t('trackingIdLabel')}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                <Search size={18} />
                <span>{t('trackButton')}</span>
              </button>
            </form>

            {/* Quick Chips of user's grievances */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                {lang === 'mr' ? 'अलीकडील तक्रारी:' : 'Recent Complaints:'}
              </span>
              {grievances.map(g => (
                <button
                  key={g.id}
                  onClick={() => { setSearchTrackId(g.id); setTrackedItem(g); }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {g.id}
                </button>
              ))}
            </div>
          </div>

          {/* Tracked Item Timeline Card */}
          {trackedItem && trackedItem !== 'not_found' && (
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <span className="badge badge-saffron" style={{ marginBottom: '6px' }}>{trackedItem.category}</span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                    {lang === 'mr' ? trackedItem.titleMr : trackedItem.titleEn}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                    📍 {trackedItem.location} | 📅 {trackedItem.createdAt}
                  </div>
                </div>

                <div style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: trackedItem.status === 'Resolved' ? '#d1fae5' : '#fef3c7',
                  color: trackedItem.status === 'Resolved' ? '#065f46' : '#92400e',
                  fontWeight: 800,
                  fontSize: '0.88rem'
                }}>
                  {trackedItem.status}
                </div>
              </div>

              {/* Status Timeline Bar */}
              <div style={{ margin: '40px 0', padding: '0 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {/* Connecting Line */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '5%',
                    right: '5%',
                    height: '4px',
                    background: '#e2e8f0',
                    zIndex: 1
                  }} />

                  {[
                    { label: t('statusSubmitted'), desc: 'Ticket Created' },
                    { label: t('statusUnderReview'), desc: 'Officer Reviewing' },
                    { label: t('statusInAction'), desc: 'Technician Dispatched' },
                    { label: t('statusResolved'), desc: 'Issue Fixed' }
                  ].map((step, idx) => {
                    const currentIndex = getStatusStepIndex(trackedItem.status);
                    const isPassed = idx <= currentIndex;

                    return (
                      <div key={idx} style={{ textAlign: 'center', zIndex: 2, position: 'relative', width: '22%' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: isPassed ? '#10b981' : '#cbd5e1',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          margin: '0 auto 8px auto',
                          fontWeight: '800',
                          boxShadow: isPassed ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none'
                        }}>
                          {isPassed ? <CheckCircle2 size={20} /> : (idx + 1)}
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: isPassed ? 800 : 600, color: isPassed ? '#0f172a' : '#94a3b8' }}>
                          {step.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Admin Officer Resolution Notes */}
              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '14px',
                padding: '16px 20px',
                marginTop: '20px'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e40af', marginBottom: '4px' }}>
                  💬 {lang === 'mr' ? 'ग्रामपंचायत अधिकारी स्पष्टीकरण / रिपार्ट:' : 'Official Gram Panchayat Officer Remarks:'}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#1e3a8a', lineHeight: 1.5 }}>
                  {lang === 'mr' ? trackedItem.adminNotesMr : trackedItem.adminNotesEn}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                  {lang === 'mr' ? `अंतिम अद्यतन: ${trackedItem.updatedAt}` : `Last Updated: ${trackedItem.updatedAt}`}
                </div>
              </div>
            </div>
          )}

          {trackedItem === 'not_found' && (
            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px' }}>
              <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                {lang === 'mr' ? 'या आयडीची कोणतीही तक्रार सापडली नाही' : 'No Complaint Found with this ID'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
