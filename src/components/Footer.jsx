import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PhoneCall, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const { lang, t } = useLanguage();

  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      paddingTop: '50px',
      paddingBottom: '30px',
      marginTop: '60px',
      borderTop: '4px solid #2563eb'
    }}>
      <div className="container">
        {/* Emergency Helpline Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #334155',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justify: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              color: 'white'
            }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                {lang === 'mr' ? '२४x७ आपत्कालीन ग्राम हेल्पलाईन नंबर' : '24x7 Emergency Village Helplines'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {lang === 'mr' ? 'तातडीच्या सेवेसाठी थेट मोफत कॉल करा' : 'Instant emergency toll-free assistance'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ background: '#1e293b', padding: '6px 12px', borderRadius: '8px', border: '1px solid #475569', color: '#f8fafc', fontSize: '0.85rem' }}>
              🚑 {lang === 'mr' ? 'रुग्णवाहिका' : 'Ambulance'}: <strong style={{ color: '#38bdf8' }}>108</strong>
            </span>
            <span style={{ background: '#1e293b', padding: '6px 12px', borderRadius: '8px', border: '1px solid #475569', color: '#f8fafc', fontSize: '0.85rem' }}>
              🚓 {lang === 'mr' ? 'पोलीस' : 'Police'}: <strong style={{ color: '#38bdf8' }}>100</strong>
            </span>
            <span style={{ background: '#1e293b', padding: '6px 12px', borderRadius: '8px', border: '1px solid #475569', color: '#f8fafc', fontSize: '0.85rem' }}>
              👩 {lang === 'mr' ? 'महिला हेल्पलाईन' : 'Women Helpline'}: <strong style={{ color: '#f472b6' }}>181</strong>
            </span>
            <span style={{ background: '#1e293b', padding: '6px 12px', borderRadius: '8px', border: '1px solid #475569', color: '#f8fafc', fontSize: '0.85rem' }}>
              🌾 {lang === 'mr' ? 'किसान कॉल सेंटर' : 'Kisan Call'}: <strong style={{ color: '#4ade80' }}>1800-180-1551</strong>
            </span>
          </div>
        </div>

        {/* 4 Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', marginBottom: '12px' }}>
              JanSathi <span style={{ color: '#f97316' }}>जनसाथी</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px' }}>
              {lang === 'mr'
                ? 'ग्रामस्थ, शेतकरी व विद्यार्थ्यांसाठी सर्व सरकारी योजना व ग्रामपंचायत सेवा पुरवणारे स्मार्ट डिजिटल सहाय्यक व्यासपीठ.'
                : 'Smart digital assistant platform simplifying government schemes and village administration for citizens.'
              }
            </p>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              © 2026 Student Project Team | College Community Project
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '14px' }}>
              {lang === 'mr' ? 'योजना श्रेणी' : 'Scheme Categories'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#schemes" onClick={() => setActiveTab('schemes')} style={{ color: '#94a3b8', textDecoration: 'none' }}>🎓 {lang === 'mr' ? 'शिक्षण शिष्यवृत्ती' : 'Education Scholarships'}</a></li>
              <li><a href="#schemes" onClick={() => setActiveTab('schemes')} style={{ color: '#94a3b8', textDecoration: 'none' }}>🌾 {lang === 'mr' ? 'कृषी व पीककर्ज' : 'Agriculture & Crop Loans'}</a></li>
              <li><a href="#schemes" onClick={() => setActiveTab('schemes')} style={{ color: '#94a3b8', textDecoration: 'none' }}>👩 {lang === 'mr' ? 'महिला व बालविकास' : 'Women & Child Welfare'}</a></li>
              <li><a href="#schemes" onClick={() => setActiveTab('schemes')} style={{ color: '#94a3b8', textDecoration: 'none' }}>🏥 {lang === 'mr' ? 'आरोग्य व मोफत उपचार' : 'Healthcare & Ayushman'}</a></li>
              <li><a href="#schemes" onClick={() => setActiveTab('schemes')} style={{ color: '#94a3b8', textDecoration: 'none' }}>🏠 {lang === 'mr' ? 'ग्रामीण घरकुल योजना' : 'Rural Housing Grants'}</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '14px' }}>
              {lang === 'mr' ? 'महत्त्वाच्या सेतू लिंक्स' : 'Official Portals'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="https://sjsa.maharashtra.gov.in" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>State Direct Benefit Portal <ExternalLink size={12} /></a></li>
              <li><a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>PM-KISAN Samman <ExternalLink size={12} /></a></li>
              <li><a href="https://mahabhumi.gov.in" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Mahabhumi 7/12 Online <ExternalLink size={12} /></a></li>
              <li><a href="https://ladkibahin.maharashtra.gov.in" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Ladki Bahin Portal <ExternalLink size={12} /></a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '14px' }}>
              {lang === 'mr' ? 'पारदर्शकता व हेतू' : 'Notice & Disclaimer'}
            </div>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#64748b' }}>
              {lang === 'mr'
                ? 'हे व्यासपीठ माहिती व मार्गदर्शनासाठी तयार केलेले शैक्षणिक प्रकल्प मॉडेल आहे. शासकीय अर्जासाठी नेहमी अधिकृत शासन पोर्टल्स वापरावेत.'
                : 'JanSathi is an informational screening and guidance platform. It links directly to verified government application portals.'
              }
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#64748b',
          display: 'flex',
          flexWrap: 'wrap',
          justify: 'space-between',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div>Designed with <Heart size={14} color="#f43f5e" style={{ display: 'inline', verticalAlign: 'middle' }} /> for Maharashtra Villages</div>
          <div>Version 2.0 | SRS Compliant</div>
        </div>
      </div>
    </footer>
  );
}
