import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MANDI_RATES, HEALTHCARE_RESOURCES, EDUCATION_RESOURCES, TRANSPORT_TIMETABLES } from '../data/resourcesData';
import { Sprout, HeartPulse, GraduationCap, Bus, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function ResourcesPage() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('agriculture');

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 30px auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          🏢 {lang === 'mr' ? 'ग्राम संसाधने व माहिती केंद्र' : 'Village Resources & Information Hub'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          {lang === 'mr'
            ? 'शेतीचे बाजारभाव (मंडी), आरोग्य केंद्रे, वाचनालय व एसटी बस वेळापत्रक'
            : 'Mandi market crop prices, healthcare centers, digital library, and bus schedules'
          }
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <div style={{ background: '#f1f5f9', padding: '6px', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('agriculture')}
            className={`pill-filter ${activeTab === 'agriculture' ? 'active' : ''}`}
          >
            <Sprout size={18} />
            <span>🌾 {lang === 'mr' ? 'शेती बाजारभाव (मंडी)' : 'Agriculture Mandi'}</span>
          </button>
          <button
            onClick={() => setActiveTab('healthcare')}
            className={`pill-filter ${activeTab === 'healthcare' ? 'active' : ''}`}
          >
            <HeartPulse size={18} />
            <span>🏥 {lang === 'mr' ? 'आरोग्य केंद्रे व वैद्यकीय' : 'Healthcare & PHC'}</span>
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`pill-filter ${activeTab === 'education' ? 'active' : ''}`}
          >
            <GraduationCap size={18} />
            <span>🎓 {lang === 'mr' ? 'वाचनालय व अभ्यासिका' : 'Education & Library'}</span>
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`pill-filter ${activeTab === 'transport' ? 'active' : ''}`}
          >
            <Bus size={18} />
            <span>🚌 {lang === 'mr' ? 'एस.टी. बस वेळापत्रक' : 'Bus Timetables'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MANDI MARKET RATES */}
      {activeTab === 'agriculture' && (
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              🌾 {lang === 'mr' ? 'कृषी उत्पन्न बाजार समिती (APMC) दैनंदिन दर' : 'Daily APMC Market Commodity Rates'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>📅 {lang === 'mr' ? 'आजचे सुधारित दर' : 'Updated Today'}</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'पिक (Crop)' : 'Crop Name'}</th>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'बाजार समिती (APMC)' : 'Mandi Location'}</th>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'किमान दर (₹)' : 'Min Rate (₹)'}</th>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'कमाल दर (₹)' : 'Max Rate (₹)'}</th>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'सरासरी दर (₹)' : 'Modal Price (₹)'}</th>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'एकक' : 'Unit'}</th>
                </tr>
              </thead>
              <tbody>
                {MANDI_RATES.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>
                      {lang === 'mr' ? item.cropMr : item.cropEn}
                    </td>
                    <td style={{ padding: '14px', color: '#2563eb', fontWeight: 600 }}>
                      {lang === 'mr' ? item.mandiMr : item.mandiEn}
                    </td>
                    <td style={{ padding: '14px', color: '#dc2626', fontWeight: 700 }}>₹{item.minPrice.toLocaleString()}</td>
                    <td style={{ padding: '14px', color: '#16a34a', fontWeight: 700 }}>₹{item.maxPrice.toLocaleString()}</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '6px', fontWeight: 800 }}>
                        ₹{item.modalPrice.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: '#64748b' }}>/{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: HEALTHCARE */}
      {activeTab === 'healthcare' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {HEALTHCARE_RESOURCES.map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px', borderRadius: '20px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge badge-emerald">{lang === 'mr' ? item.typeMr : item.typeEn}</span>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>🟢 24x7 Active</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                {lang === 'mr' ? item.nameMr : item.nameEn}
              </h3>

              <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 700, marginBottom: '14px' }}>
                👨‍⚕️ {lang === 'mr' ? item.doctorMr : item.doctorEn}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>🕒 <strong>{lang === 'mr' ? 'वेळ:' : 'Timing:'}</strong> {lang === 'mr' ? item.timingMr : item.timingEn}</div>
                <div>📍 <strong>{lang === 'mr' ? 'पत्ता:' : 'Address:'}</strong> {lang === 'mr' ? item.addressMr : item.addressEn}</div>
                <div>📞 <strong>{lang === 'mr' ? 'संपर्क:' : 'Contact:'}</strong> <a href={`tel:${item.contact}`} style={{ color: '#2563eb', fontWeight: 700 }}>{item.contact}</a></div>
              </div>

              <div style={{ paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', marginBottom: '6px' }}>
                  {lang === 'mr' ? 'उपलब्ध मोफत सेवा:' : 'Free Available Services:'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(lang === 'mr' ? item.servicesMr : item.servicesEn).map((s, i) => (
                    <span key={i} style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: EDUCATION */}
      {activeTab === 'education' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {EDUCATION_RESOURCES.map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px', borderRadius: '20px', background: 'white' }}>
              <span className="badge badge-primary" style={{ marginBottom: '10px' }}>
                {lang === 'mr' ? 'स्पर्धा परीक्षा केंद्र' : 'Study Center'}
              </span>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                {lang === 'mr' ? item.titleMr : item.titleEn}
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                📖 {lang === 'mr' ? item.facilityMr : item.facilityEn}
              </p>

              <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>🕒 <strong>{lang === 'mr' ? 'वेळ:' : 'Timing:'}</strong> {lang === 'mr' ? item.timingMr : item.timingEn}</div>
                <div>📍 <strong>{lang === 'mr' ? 'ठिकाण:' : 'Address:'}</strong> {lang === 'mr' ? item.addressMr : item.addressEn}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: TRANSPORT */}
      {activeTab === 'transport' && (
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px', background: 'white' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
            🚌 {lang === 'mr' ? 'महाराष्ट्र राज्य मार्ग परिवहन महामंडळ (MSRTC) एसटी बस वेळापत्रक' : 'MSRTC Bus Routes & Departure Timetable'}
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'बस क्र.' : 'Bus No.'}</th>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'मार्ग (Route)' : 'Route Name'}</th>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'सुटण्याची वेळ' : 'Departure'}</th>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'पोहोचण्याची वेळ' : 'Arrival'}</th>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'फेरी' : 'Frequency'}</th>
                  <th style={{ padding: '14px' }}>{lang === 'mr' ? 'तिकीट दर' : 'Ticket Fare'}</th>
                </tr>
              </thead>
              <tbody>
                {TRANSPORT_TIMETABLES.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontWeight: 800, color: '#f97316' }}>{item.busNo}</td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>
                      {lang === 'mr' ? item.routeMr : item.routeEn}
                    </td>
                    <td style={{ padding: '14px', color: '#16a34a', fontWeight: 700 }}>⏰ {item.departure}</td>
                    <td style={{ padding: '14px', color: '#64748b' }}>{item.arrival}</td>
                    <td style={{ padding: '14px', color: '#2563eb' }}>{lang === 'mr' ? item.frequencyMr : item.frequencyEn}</td>
                    <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>{item.fare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
