import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    appName: "JanSathi",
    tagline: "Smart Digital Assistant for Village Citizens",
    chatbotName: "JanSahayak",
    navHome: "Home",
    navSchemes: "Government Schemes",
    navEligibility: "Scheme Matcher",
    navGrievance: "Grievances",
    navResources: "Village Resources",
    navAnnouncements: "Notices",
    navNotifications: "Notifications",
    navInterop: "Interoperability Hub",
    navAdmin: "Admin Dashboard",
    login: "Login / Register",
    logout: "Logout",
    welcome: "Welcome",
    roleStudent: "Student",
    roleFarmer: "Farmer",
    roleCitizen: "Citizen",
    roleAdmin: "Administrator",
    
    // Home
    heroTitle: "Empowering Villages with Smart Access to Government Welfare",
    heroSubtitle: "Discover schemes matched to your profile, apply with official links, submit village complaints, and get instant guidance in English, Marathi & Hindi.",
    exploreSchemes: "Find Eligible Schemes",
    askChatbot: "Ask JanSahayak Chatbot",
    checkEligibility: "Check Your Compatibility",
    
    // Stats
    statSchemes: "Active Govt Schemes",
    statCitizens: "Registered Citizens",
    statGrievances: "Grievances Resolved",
    statMatchAccuracy: "Eligibility Match Rate",
    
    // Schemes
    searchPlaceholder: "Search scheme by name, benefit, or department...",
    allCategories: "All Categories",
    filterByRole: "Filter by Role",
    eligibilityMatch: "Match Score",
    viewDetails: "View Details & Apply",
    requiredDocs: "Required Documents",
    applicationSteps: "Step-by-Step Guidance",
    applyOfficial: "Go to Official Application Portal",
    closingSoon: "Closing Soon!",
    
    // Eligibility Matcher
    matcherTitle: "Smart Scheme Eligibility Finder",
    matcherDesc: "Answer a few questions about your profile to discover government schemes tailored for you.",
    ageLabel: "Your Age (Years)",
    incomeLabel: "Annual Family Income (₹)",
    userTypeLabel: "I am a...",
    categoryLabel: "Caste / Social Category",
    landLabel: "Land Holding (Acres) - For Farmers",
    disabilityLabel: "Do you have a Disability Certificate (>40%)?",
    calculateButton: "Match Eligible Schemes Now",
    eligibleBadge: "You qualify for this scheme",
    
    // Grievance
    grievanceTitle: "Village Citizen Grievance Portal",
    submitNewGrievance: "Submit New Grievance",
    trackGrievance: "Track Existing Grievance",
    grievanceCategory: "Issue Category",
    grievanceDesc: "Describe your issue in detail",
    grievanceLocation: "Village Location / Landmark",
    grievanceContact: "Contact Number",
    submitButton: "Lodge Grievance",
    trackingIdLabel: "Enter Reference ID (e.g., GRV-2026-8942)",
    trackButton: "Check Status",
    statusSubmitted: "Submitted",
    statusUnderReview: "Under Review",
    statusInAction: "Department Action Initiated",
    statusResolved: "Resolved & Closed",
    
    // Chatbot
    chatTitle: "JanSahayak Assistant",
    chatSubtitle: "Multilingual Virtual Guide (English, मराठी, हिन्दी)",
    chatInputPlaceholder: "Ask anything about schemes, eligibility, documents, or grievances...",
    send: "Send",
    
    // Admin
    adminTitle: "JanSathi Administration Portal",
    manageSchemesTab: "Manage Schemes",
    manageGrievancesTab: "Grievances Officer",
    manageNoticesTab: "Village Notices",
    manageChatbotTab: "Chatbot Knowledge",
    addScheme: "+ Add New Scheme",
    addNotice: "+ Add Notice",
    totalUsers: "Registered System Users",
    
    // Common
    yes: "Yes",
    no: "No",
    status: "Status",
    date: "Date",
    action: "Action",
    close: "Close"
  },
  mr: {
    appName: "जनसाथी",
    tagline: "ग्रामीण नागरिकांसाठी स्मार्ट डिजिटल सहाय्यक",
    chatbotName: "जनसहायक",
    navHome: "मुख्यपृष्ठ",
    navSchemes: "सरकारी योजना",
    navEligibility: "पात्रता चाचणी",
    navGrievance: "तक्रार निवारण",
    navResources: "ग्राम संसाधने",
    navAnnouncements: "सूचना फलक",
    navNotifications: "सूचना व स्मरणपत्रे",
    navInterop: "सिस्टम सुसंगतता हब",
    navAdmin: "ॲडमिन डॅशबोर्ड",
    login: "लॉगिन / नोंदणी",
    logout: "बाहेर पडा",
    welcome: "सुस्वागतम",
    roleStudent: "विद्यार्थी",
    roleFarmer: "शेतकरी",
    roleCitizen: "नागरिक",
    roleAdmin: "प्रशासक (ॲडमिन)",
    
    // Home
    heroTitle: "सरकारी योजना आणि सेवा आता एकाच क्लिकवर आपल्या गावात",
    heroSubtitle: "तुमच्या प्रोफाईलनुसार पात्र योजना शोधा, अधिकृत लिक्सद्वारे अर्ज करा, ग्रामपंचायत तक्रार नोंदवा आणि इंग्रजी, मराठी व हिंदीत मार्गदर्शन मिळवा.",
    exploreSchemes: "पात्र योजना शोधा",
    askChatbot: "जनसहायक चॅटबॉटला विचार",
    checkEligibility: "माझी पात्रता तपासा",
    
    // Stats
    statSchemes: "सक्रिय सरकारी योजना",
    statCitizens: "नोंदणीकृत नागरिक",
    statGrievances: "निवारण झालेल्या तक्रारी",
    statMatchAccuracy: "पात्रता अचूकता",
    
    // Schemes
    searchPlaceholder: "योजनेचे नाव, लाभ किंवा विभागाद्वारे शोधा...",
    allCategories: "सर्व श्रेणी",
    filterByRole: "भूमिकेनुसार फिल्टर",
    eligibilityMatch: "पात्रता टक्केवारी",
    viewDetails: "तपशील व अर्ज मार्गदर्शक",
    requiredDocs: "आवश्यक कागदपत्रे",
    applicationSteps: "टप्प्याटप्प्याने अर्ज प्रक्रिया",
    applyOfficial: "अधिकृत अर्ज पोर्टलवर जा",
    closingSoon: "अंतिम मुदत लवकरच!",
    
    // Eligibility Matcher
    matcherTitle: "स्मार्ट योजना पात्रता शोधक",
    matcherDesc: "तुमच्यासाठी योग्य असलेल्या सरकारी योजना शोधण्यासाठी खालील सोप्या प्रश्नांची उत्तरे द्या.",
    ageLabel: "तुमचे वय (वर्षे)",
    incomeLabel: "वार्षिक कौटुंबिक उत्पन्न (₹)",
    userTypeLabel: "मी एक...",
    categoryLabel: "जात / सामाजिक प्रवर्ग",
    landLabel: "जमीन धारणा (एकर) - शेतकऱ्यांसाठी",
    disabilityLabel: "दिव्यांगत्व प्रमाणपत्र आहे का (>४०%)?",
    calculateButton: "पात्र योजना शोधा",
    eligibleBadge: "तुम्ही या योजनेसाठी पात्र आहात",
    
    // Grievance
    grievanceTitle: "ग्राम नागरिक तक्रार निवारण कक्ष",
    submitNewGrievance: "नवीन तक्रार नोंदवा",
    trackGrievance: "तक्रारीची सद्यस्थिती तपासा",
    grievanceCategory: "समस्येचा प्रकार",
    grievanceDesc: "तुमची समस्या सविस्तर सांगा",
    grievanceLocation: "गावातील ठिकाण / परिसर",
    grievanceContact: "संपर्क क्रमांक",
    submitButton: "तक्रार सबमिट करा",
    trackingIdLabel: "तक्रार संदर्भ आयडी टाका (उदा. GRV-2026-8942)",
    trackButton: "स्थिती तपासा",
    statusSubmitted: "तक्रार प्राप्त झाली",
    statusUnderReview: "छाननी सुरू आहे",
    statusInAction: "विभागीय कार्यवाही सुरू",
    statusResolved: "समस्या निवारण पूर्ण",
    
    // Chatbot
    chatTitle: "जनसहायक डिजिटल मित्र",
    chatSubtitle: "बहुभाषिक व्हर्च्युअल मार्गदर्शक (English, मराठी, हिन्दी)",
    chatInputPlaceholder: "योजना, पात्रता, कागदपत्रे किंवा तक्रारींबाबत काहीही विचारा...",
    send: "पाठवा",
    
    // Admin
    adminTitle: "जनसाथी प्रशासन पोर्टल",
    manageSchemesTab: "योजना व्यवस्थापन",
    manageGrievancesTab: "तक्रार निवारण कक्ष",
    manageNoticesTab: "ग्रामपंचायत सूचना",
    manageChatbotTab: "चॅटबॉट ज्ञानकोश",
    addScheme: "+ नवीन योजना जोडा",
    addNotice: "+ नवीन सूचना टाका",
    totalUsers: "एकूण नोंदणीकृत नागरिक",

    // Common
    yes: "होय",
    no: "नाही",
    status: "स्थिती",
    date: "दिनांक",
    action: "कृती",
    close: "बंद करा"
  },
  hi: {
    appName: "जनसाथी",
    tagline: "ग्रामीण नागरिकों के लिए स्मार्ट डिजिटल सहायक",
    chatbotName: "जनसहायक",
    navHome: "मुख्य पृष्ठ",
    navSchemes: "सरकारी योजनाएं",
    navEligibility: "पात्रता परीक्षण",
    navGrievance: "शिकायत निवारण",
    navResources: "ग्राम संसाधन",
    navAnnouncements: "सूचना पटल",
    navNotifications: "सूचनाएं व अनुस्मारक",
    navInterop: "सिस्टम एकीकरण हब",
    navAdmin: "एडमिन डैशबोर्ड",
    login: "लॉगिन / पंजीकरण",
    logout: "लॉगआउट",
    welcome: "स्वागत है",
    roleStudent: "छात्र",
    roleFarmer: "किसान",
    roleCitizen: "नागरिक",
    roleAdmin: "प्रशासक (एडमिन)",
    
    // Home
    heroTitle: "सरकारी योजनाएं एवं सेवाएं अब आपके गांव में एक क्लिक पर",
    heroSubtitle: "अपनी प्रोफाइल के अनुसार पात्र योजनाएं खोजें, आधिकारिक लिंक द्वारा आवेदन करें, शिकायत दर्ज करें तथा अंग्रेजी, मराठी एवं हिंदी में सहायता प्राप्त करें।",
    exploreSchemes: "पात्र योजनाएं खोजें",
    askChatbot: "जनसहायक चैटबॉट से पूछें",
    checkEligibility: "पात्रता की जांच करें",
    
    // Stats
    statSchemes: "सक्रिय सरकारी योजनाएं",
    statCitizens: "पंजीकृत नागरिक",
    statGrievances: "निवारित शिकायतें",
    statMatchAccuracy: "पात्रता सटीकता",
    
    // Schemes
    searchPlaceholder: "योजना का नाम, लाभ या विभाग द्वारा खोजें...",
    allCategories: "सभी श्रेणियां",
    filterByRole: "भूमिका के अनुसार फ़िल्टर",
    eligibilityMatch: "पात्रता प्रतिशत",
    viewDetails: "विवरण एवं आवेदन गाइड",
    requiredDocs: "आवश्यक दस्तावेज",
    applicationSteps: "चरण-दर-चरण आवेदन प्रक्रिया",
    applyOfficial: "आधिकारिक आवेदन पोर्टल पर जाएं",
    closingSoon: "अंतिम तिथि शीघ्र!",
    
    // Eligibility Matcher
    matcherTitle: "स्मार्ट योजना पात्रता खोजक",
    matcherDesc: "उपयुक्त सरकारी योजनाओं की खोज के लिए निम्नलिखित प्रश्नों के उत्तर दें।",
    ageLabel: "आपकी आयु (वर्ष)",
    incomeLabel: "वार्षिक पारिवारिक आय (₹)",
    userTypeLabel: "मैं एक...",
    categoryLabel: "जाति / सामाजिक श्रेणी",
    landLabel: "कृषि भूमि (एकड़) - किसानों के लिए",
    disabilityLabel: "क्या विकलांगता प्रमाण पत्र उपलब्ध है (>40%)?",
    calculateButton: "पात्र योजनाएं खोजें",
    eligibleBadge: "आप इस योजना के लिए पात्र हैं",
    
    // Grievance
    grievanceTitle: "ग्राम नागरिक शिकायत निवारण पोर्टल",
    submitNewGrievance: "नवीन शिकायत दर्ज करें",
    trackGrievance: "शिकायत की स्थिति जांचें",
    grievanceCategory: "समस्या की श्रेणी",
    grievanceDesc: "अपनी समस्या का विस्तृत विवरण दें",
    grievanceLocation: "गांव का स्थान / लैंडमार्क",
    grievanceContact: "संपर्क नंबर",
    submitButton: "शिकायत सबमिट करें",
    trackingIdLabel: "शिकायत संदर्भ आईडी दर्ज करें (उदा. GRV-2026-8942)",
    trackButton: "स्थिति जांचें",
    statusSubmitted: "शिकायत प्राप्त हुई",
    statusUnderReview: "समीक्षा जारी है",
    statusInAction: "विभागीय कार्रवाई शुरू",
    statusResolved: "समाधान पूर्ण एवं बंद",
    
    // Chatbot
    chatTitle: "जनसहायक डिजिटल मित्र",
    chatSubtitle: "बहुभाषी वर्चुअल मार्गदर्शक (English, मराठी, हिन्दी)",
    chatInputPlaceholder: "योजना, पात्रता, दस्तावेज या शिकायत के बारे में पूछें...",
    send: "भेजें",
    
    // Admin
    adminTitle: "जनसाथी प्रशासन पोर्टल",
    manageSchemesTab: "योजना प्रबंधन",
    manageGrievancesTab: "शिकायत निवारण कक्ष",
    manageNoticesTab: "ग्राम सूचना पटल",
    manageChatbotTab: "चैटबॉट ज्ञानकोश",
    addScheme: "+ नई योजना जोड़ें",
    addNotice: "+ नई सूचना जारी करें",
    totalUsers: "कुल पंजीकृत नागरिक",

    // Common
    yes: "हाँ",
    no: "नहीं",
    status: "स्थिति",
    date: "दिनांक",
    action: "कार्रवाई",
    close: "बंद करें"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('jansathi_lang') || 'mr');

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('jansathi_lang', newLang);
  };

  useEffect(() => {
    localStorage.setItem('jansathi_lang', lang);
    if (lang === 'mr') {
      document.body.classList.add('lang-mr');
      document.body.classList.remove('lang-hi');
    } else if (lang === 'hi') {
      document.body.classList.add('lang-hi');
      document.body.classList.remove('lang-mr');
    } else {
      document.body.classList.remove('lang-mr', 'lang-hi');
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLangState(prev => {
      const next = prev === 'en' ? 'mr' : prev === 'mr' ? 'hi' : 'en';
      localStorage.setItem('jansathi_lang', next);
      return next;
    });
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
