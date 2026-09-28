import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

export default function EligibilityCheckerPage({ onSelectScheme, setActiveTab }) {
  const { lang, t } = useLanguage();
  const { currentUser } = useAuth();
  const { schemes } = useApp();

  // Form state pre-filled from current user if logged in
  const [formData, setFormData] = useState({
    age: currentUser?.age || 22,
    annualIncome: currentUser?.annualIncome || 150000,
    userRole: currentUser?.role || 'student',
    casteCategory: currentUser?.casteCategory || 'OBC',
    gender: currentUser?.gender || 'Female',
    landHolding: currentUser?.landHolding || 0,
    disabilityStatus: currentUser?.disabilityStatus || false
  });

  const [matchedResults, setMatchedResults] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateEligibility = (e) => {
    if (e) e.preventDefault();

    const results = schemes.map(sch => {
      let score = 100;
      const criteria = sch.eligibilityCriteria;
      const reasons = [];

      // Age check
      const userAge = Number(formData.age);
      if (criteria.minAge && userAge < criteria.minAge) {
        score -= 40;
        reasons.push(lang === 'mr' ? `वय ${criteria.minAge} वर्षांपेक्षा कमी` : `Age below ${criteria.minAge}`);
      }
      if (criteria.maxAge && userAge > criteria.maxAge) {
        score -= 40;
        reasons.push(lang === 'mr' ? `वय ${criteria.maxAge} वर्षांपेक्षा जास्त` : `Age above ${criteria.maxAge}`);
      }

      // Income check
      const userInc = Number(formData.annualIncome);
      if (criteria.maxIncome && userInc > criteria.maxIncome) {
        score -= 35;
        reasons.push(lang === 'mr' ? `उत्पन्न मर्यादा ₹${criteria.maxIncome.toLocaleString('en-IN')} पेक्षा जास्त` : `Income exceeds ₹${criteria.maxIncome.toLocaleString('en-IN')}`);
      }

      // Role check
      if (criteria.userRoles && !criteria.userRoles.includes(formData.userRole) && !criteria.userRoles.includes('all')) {
        score -= 30;
        reasons.push(lang === 'mr' ? `केवळ ${criteria.userRoles.join('/')} यांच्यासाठी` : `Targeted for ${criteria.userRoles.join('/')}`);
      }

      // Gender check
      if (criteria.gender && criteria.gender !== 'All' && criteria.gender !== formData.gender) {
        score -= 50;
        reasons.push(lang === 'mr' ? `केवळ महिलांसाठी योजना` : `Exclusive for Female applicants`);
      }

      // Disability check
      if (criteria.disabilityStatusRequired && !formData.disabilityStatus) {
        score -= 60;
        reasons.push(lang === 'mr' ? `दिव्यांग प्रमाणपत्र आवश्यक` : `Disability certificate required`);
      }

      // Land check for farmers
      const land = Number(formData.landHolding);
      if (criteria.maxLandHolding && land > criteria.maxLandHolding) {
        score -= 30;
        reasons.push(lang === 'mr' ? `जमीन ${criteria.maxLandHolding} एकरापेक्षा जास्त` : `Land exceeds ${criteria.maxLandHolding} acres`);
      }

      const finalScore = Math.max(0, Math.min(100, score));

      return {
        scheme: sch,
        score: finalScore,
        isEligible: finalScore >= 70,
        reasons
      };
    });

    results.sort((a, b) => b.score - a.score);
    setMatchedResults(results);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: '#dbeafe',
          color: '#1e40af',
          fontWeight: 700,
          fontSize: '0.85rem',
          marginBottom: '12px'
        }}>
          <Sparkles size={16} />
          <span>{lang === 'mr' ? 'एआय योजना मॅचिंग इंजिन' : 'AI Scheme Matcher Engine'}</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
          {t('matcherTitle')}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
          {t('matcherDesc')}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: matchedResults ? '1fr 1.3fr' : '1fr',
        gap: '30px',
        maxWidth: matchedResults ? '1200px' : '750px',
        margin: '0 auto'
      }}>
        {/* Form Card */}
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'white' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
            📋 {lang === 'mr' ? 'तुमचे प्रोफाईल तपशील भरा' : 'Fill Profile Details'}
          </h3>

          <form onSubmit={calculateEligibility} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* User Type / Role */}
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                {t('userTypeLabel')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {['student', 'farmer', 'citizen'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userRole: role }))}
                    style={{
                      padding: '12px 10px',
                      borderRadius: '12px',
                      border: formData.userRole === role ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: formData.userRole === role ? '#eff6ff' : '#f8fafc',
                      color: formData.userRole === role ? '#1d4ed8' : '#475569',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {role === 'student' ? '🎓 Student' : role === 'farmer' ? '🌾 Farmer' : '👩 Citizen'}
                  </button>
                ))}
              </div>
            </div>

            {/* Age & Annual Income */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  {t('ageLabel')}
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  {t('incomeLabel')}
                </label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  step="10000"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Caste Category & Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  {t('categoryLabel')}
                </label>
                <select
                  name="casteCategory"
                  value={formData.casteCategory}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                >
                  <option value="SC">SC (अनुसूचित जाती)</option>
                  <option value="ST">ST (अनुसूचित जमाती)</option>
                  <option value="OBC">OBC (इतर मागासवर्ग)</option>
                  <option value="VJNT">VJNT / NT</option>
                  <option value="SBC">SBC</option>
                  <option value="EWS">EWS</option>
                  <option value="General / Open">General / Open</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Gender (लिंग)
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                >
                  <option value="Female">Female (महिला)</option>
                  <option value="Male">Male (पुरुष)</option>
                </select>
              </div>
            </div>

            {/* Land Holding for Farmer */}
            {formData.userRole === 'farmer' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  {t('landLabel')}
                </label>
                <input
                  type="number"
                  name="landHolding"
                  value={formData.landHolding}
                  onChange={handleChange}
                  step="0.5"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            )}

            {/* Disability Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <input
                type="checkbox"
                id="disabilityStatus"
                name="disabilityStatus"
                checked={formData.disabilityStatus}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="disabilityStatus" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}>
                {t('disabilityLabel')}
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '1.05rem', marginTop: '10px' }}
            >
              <Sparkles size={20} />
              <span>{t('calculateButton')}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        {matchedResults && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                🎉 {lang === 'mr' ? 'तुमच्यासाठी पात्र योजना निकाल' : 'Matched Schemes Results'}
              </h3>
              <span className="badge badge-emerald">
                {matchedResults.filter(r => r.isEligible).length} {lang === 'mr' ? 'योजनांसाठी पात्र' : 'Fully Qualified'}
              </span>
            </div>

            {matchedResults.map(res => (
              <div
                key={res.scheme.id}
                className="glass-card"
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: res.isEligible ? '#ffffff' : '#f8fafc',
                  borderLeft: `6px solid ${res.isEligible ? '#10b981' : res.score >= 50 ? '#f59e0b' : '#cbd5e1'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                      {lang === 'mr' ? res.scheme.nameMr : res.scheme.nameEn}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {lang === 'mr' ? res.scheme.departmentMr : res.scheme.departmentEn}
                    </div>
                  </div>

                  {/* Score Pill */}
                  <div style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    background: res.isEligible ? '#d1fae5' : res.score >= 50 ? '#fef3c7' : '#f1f5f9',
                    color: res.isEligible ? '#065f46' : res.score >= 50 ? '#92400e' : '#64748b',
                    fontWeight: '800',
                    fontSize: '0.85rem'
                  }}>
                    {res.score}% {lang === 'mr' ? 'पात्रता' : 'Match'}
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '12px', lineHeight: 1.5 }}>
                  💰 <strong>{lang === 'mr' ? 'लाभ:' : 'Benefit:'}</strong> {lang === 'mr' ? res.scheme.benefitsMr : res.scheme.benefitsEn}
                </div>

                {/* Reasons if not 100% */}
                {res.reasons.length > 0 && (
                  <div style={{ fontSize: '0.78rem', color: '#dc2626', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {res.reasons.map((r, idx) => (
                      <span key={idx}>⚠️ {r}</span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    onSelectScheme(res.scheme);
                    setActiveTab('schemes');
                  }}
                  className="btn btn-outline"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', width: '100%', justifyContent: 'center' }}
                >
                  <span>{t('viewDetails')}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
