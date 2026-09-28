import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SCHEMES } from '../data/schemesData';
import { INITIAL_ANNOUNCEMENTS } from '../data/announcementsData';
import { apiService } from '../services/api';

const AppContext = createContext();

const INITIAL_GRIEVANCES = [
  {
    id: 'GRV-2026-1042',
    category: 'Drinking Water (पिण्याचे पाणी)',
    titleEn: 'Low water pressure in Sector 3 pipeline',
    titleMr: 'भाग ३ मधील नळ योजनेचे पाणी कमी दाबाने येत आहे',
    descriptionEn: 'The drinking water supply pipeline has leakages near the primary school ground resulting in low pressure for 40 households.',
    descriptionMr: 'प्राथमिक शाळेजवळ पिण्याच्या पाण्याच्या पाईपलाईनला गळती लागल्याने ४० कुटुंबांना पाणी कमी दाबाने मिळत आहे.',
    location: 'Ward No 3, Near ZP School, Janpuri',
    contactName: 'Ganesh Deshmukh',
    contactPhone: '+91 94221 88990',
    status: 'In Action',
    createdAt: '2026-09-12 10:30 AM',
    updatedAt: '2026-09-14 02:15 PM',
    adminNotesEn: 'Water Department Technician inspected site. Replacement pipe arriving by 18th Sept.',
    adminNotesMr: 'पाणी पुरवठा तंत्रज्ञांनी पाहणी केली आहे. नवीन पाईप १८ सप्टेंबरपर्यंत बसवला जाईल.'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    schemeId: 'sch-002',
    titleEn: 'State Student Scholarship Deadline Closing Soon!',
    titleMr: 'महाडीबीटी शिष्यवृत्ती अर्जाची अंतिम मुदत लवकरच!',
    messageEn: 'The Post-Matric Scholarship application window closes on 30th November 2026. Submit your documents.',
    messageMr: 'मॅट्रिकोत्तर शिष्यवृत्ती अर्जाची अंतिम मुदत जवळ येत आहे. आपले अर्ज महाडीबीटीवर त्वरा करून भरा.',
    type: 'deadline',
    date: '2026-09-16',
    read: false
  }
];

export function AppProvider({ children }) {
  const [schemes, setSchemes] = useState(INITIAL_SCHEMES);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [grievances, setGrievances] = useState(INITIAL_GRIEVANCES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('jansathi_bookmarks');
    return saved ? JSON.parse(saved) : ['sch-001', 'sch-003'];
  });

  // Fetch live backend data from Java HTTP Server (Java -> PHP -> MySQL)
  useEffect(() => {
    async function loadBackendData() {
      try {
        const backendSchemes = await apiService.getSchemes();
        if (backendSchemes && backendSchemes.length > 0) {
          // Normalize DB schemes format for frontend compatibility (SRS 3.0)
          const normalized = backendSchemes.map(sch => {
            const catLower = (sch.category || '').toLowerCase();
            let catKey = 'general';
            if (catLower.includes('educat') || catLower.includes('youth') || catLower.includes('student')) catKey = 'education';
            else if (catLower.includes('agri') || catLower.includes('farmer') || catLower.includes('krishi') || catLower.includes('machin')) catKey = 'agriculture';
            else if (catLower.includes('health') || catLower.includes('insuran') || catLower.includes('medica')) catKey = 'healthcare';
            else if (catLower.includes('women') || catLower.includes('child') || catLower.includes('girl') || catLower.includes('ladki')) catKey = 'women_child';
            else if (catLower.includes('hous') || catLower.includes('awas') || catLower.includes('urban')) catKey = 'housing';
            else if (catLower.includes('employ') || catLower.includes('skill') || catLower.includes('vendor') || catLower.includes('business') || catLower.includes('artisan')) catKey = 'employment';
            else if (catLower.includes('senior') || catLower.includes('pension') || catLower.includes('niradhar')) catKey = 'senior_citizen';
            else if (catLower.includes('disab') || catLower.includes('divyang') || catLower.includes('udid')) catKey = 'disability';
            else if (catLower.includes('transp') || catLower.includes('bus') || catLower.includes('travel')) catKey = 'transport';

            const occLower = (sch.target_occupation || '').toLowerCase();
            let userRole = 'all';
            if (occLower.includes('student')) userRole = 'student';
            else if (occLower.includes('farmer')) userRole = 'farmer';
            else if (occLower.includes('citizen') || occLower.includes('vendor') || occLower.includes('artisan')) userRole = 'citizen';

            return {
              id: sch.scheme_id || `sch-${sch.id}`,
              scheme_id: sch.scheme_id,
              category: catKey,
              targetUser: userRole,
              govtLevel: sch.govt_level || 'Central',
              stateUt: sch.state_ut || sch.target_state || 'All India',
              nameEn: sch.title,
              nameMr: sch.title,
              departmentEn: (sch.govt_level === 'Central' ? 'Ministry of ' : sch.state_ut + ' Govt ') + sch.sector,
              departmentMr: (sch.govt_level === 'Central' ? 'केंद्रीय ' : sch.state_ut + ' शासन ') + sch.sector,
              descriptionEn: sch.description,
              descriptionMr: sch.description,
              benefitsEn: sch.benefits,
              benefitsMr: sch.benefits,
              eligibilityCriteria: {
                minAge: parseInt(sch.min_age) || 0,
                maxAge: parseInt(sch.max_age) || 100,
                maxIncome: parseInt(sch.max_income) || 1000000,
                userRoles: [userRole],
                casteCategory: ['All'],
                gender: sch.target_gender || 'All'
              },
              eligibilityTextEn: `Target: ${sch.target_occupation}, Age: ${sch.min_age}-${sch.max_age} yrs, Max Income: ₹${sch.max_income}`,
              eligibilityTextMr: `पात्रता: ${sch.target_occupation}, वयोमर्यादा: ${sch.min_age}-${sch.max_age} वर्षे, उत्पन्न मर्यादा: ₹${sch.max_income}`,
              requiredDocumentsEn: sch.documents ? sch.documents.split(',') : ['Aadhaar Card', 'Bank Passbook'],
              requiredDocumentsMr: sch.documents ? sch.documents.split(',') : ['आधार कार्ड', 'बँक पासबुक'],
              applicationProcessEn: `Apply online at ${sch.link} or visit your local Gram Panchayat / Seva Kendra.`,
              applicationProcessMr: `${sch.link} वर ऑनलाईन अर्ज करा किंवा जवळच्या सेतू केंद्रात संपर्क साधा.`,
              officialUrl: sch.link || '#',
              openingDate: sch.opening_date || '2026-01-01',
              closingDate: sch.closing_date || '2026-12-31',
              lastUpdated: sch.last_updated || '2026-09-15',
              published: true,
              featured: true
            };
          });
          setSchemes(normalized);
        }

        const dbGrievances = await apiService.getGrievances();
        if (dbGrievances && dbGrievances.length > 0) {
          const mappedGrv = dbGrievances.map(g => ({
            id: g.tracking_id,
            category: g.category,
            titleEn: g.title,
            titleMr: g.title,
            descriptionEn: g.description,
            descriptionMr: g.description,
            location: g.location,
            contactName: g.name,
            contactPhone: g.phone,
            status: g.status,
            createdAt: g.created_at,
            updatedAt: g.created_at,
            adminNotesEn: g.remarks || 'Under processing',
            adminNotesMr: g.remarks || 'प्रक्रियेत आहे'
          }));
          setGrievances(mappedGrv);
        }
      } catch (e) {
        console.log('Backend sync notice:', e);
      }
    }
    loadBackendData();
  }, []);

  useEffect(() => {
    localStorage.setItem('jansathi_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('jansathi_grievances', JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem('jansathi_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('jansathi_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Actions
  const toggleBookmark = (schemeId) => {
    setBookmarks(prev => 
      prev.includes(schemeId) ? prev.filter(id => id !== schemeId) : [...prev, schemeId]
    );
  };

  const addGrievance = async (grievanceData) => {
    // Send to Java Backend -> PHP MySQL API
    const res = await apiService.submitGrievance({
      name: grievanceData.contactName || 'Citizen',
      phone: grievanceData.contactPhone || '',
      category: grievanceData.category || 'General',
      title: grievanceData.titleEn || grievanceData.titleMr || 'Grievance',
      description: grievanceData.descriptionEn || grievanceData.descriptionMr || '',
      location: grievanceData.location || 'Maharashtra'
    });

    const newId = res.tracking_id || `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrievance = {
      id: newId,
      ...grievanceData,
      status: 'Submitted',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      adminNotesEn: 'Received by Gram Panchayat. Officer assignment in progress.',
      adminNotesMr: 'तक्रार प्राप्त झाली. अधिकारी नियुक्ती प्रक्रिया सुरू आहे.'
    };

    setGrievances(prev => [newGrievance, ...prev]);

    // Add notification alert
    const newNotif = {
      id: `notif-${Date.now()}`,
      titleEn: `Grievance Submitted #${newId}`,
      titleMr: `तक्रार नोंदणी यशस्वी #${newId}`,
      messageEn: `Your grievance "${grievanceData.titleEn || grievanceData.titleMr}" has been lodged. Track status using ID: ${newId}`,
      messageMr: `तुमची तक्रार नोंदवली गेली आहे. आयडी: ${newId} वापरून स्थिती तपासा.`,
      type: 'grievance',
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newGrievance;
  };

  const updateGrievanceStatus = async (id, newStatus, notesEn, notesMr) => {
    await apiService.updateGrievance(id, newStatus, notesEn || notesMr);
    setGrievances(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          adminNotesEn: notesEn || item.adminNotesEn,
          adminNotesMr: notesMr || item.adminNotesMr,
          updatedAt: new Date().toLocaleString()
        };
      }
      return item;
    }));
  };

  const addScheme = (schemeData) => {
    const newScheme = {
      id: `sch-${String(schemes.length + 1).padStart(3, '0')}`,
      ...schemeData,
      lastUpdated: new Date().toISOString().split('T')[0],
      published: true
    };
    setSchemes(prev => [newScheme, ...prev]);
    return newScheme;
  };

  const updateScheme = (id, updatedFields) => {
    setSchemes(prev => prev.map(sch => sch.id === id ? { ...sch, ...updatedFields, lastUpdated: new Date().toISOString().split('T')[0] } : sch));
  };

  const addAnnouncement = (annData) => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      ...annData,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      schemes,
      announcements,
      grievances,
      notifications,
      bookmarks,
      toggleBookmark,
      addGrievance,
      updateGrievanceStatus,
      addScheme,
      updateScheme,
      addAnnouncement,
      markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
