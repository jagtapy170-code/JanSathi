export const CHATBOT_SUGGESTIONS = [
  {
    textEn: "Scholarships for SC/ST/OBC students",
    textMr: "स्टूडंटसाठी कोणत्या स्कॉलरशिप योजना आहेत?",
    category: "education"
  },
  {
    textEn: "PM Kisan ₹6000 eligibility criteria",
    textMr: "पीएम किसान योजनेची माहिती व पात्रता",
    category: "agriculture"
  },
  {
    textEn: "Ladki Bahin Yojana details & application",
    textMr: "लाडकी बहीण योजनेचा अर्ज कसा करावा?",
    category: "women_child"
  },
  {
    textEn: "How to apply for PMAY Rural Housing?",
    textMr: "प्रधानमंत्री घरकुल योजनेचा लाभ कसा घ्यावा?",
    category: "housing"
  },
  {
    textEn: "Senior citizen & Shravanbal Pension",
    textMr: "ज्येष्ठ नागरिक निवृत्तीवेतन योजना माहिती",
    category: "senior_citizen"
  },
  {
    textEn: "Free hospital treatment (Ayushman Bharat)",
    textMr: "मोफत उपचारासाठी आयुष्मान भारत व म.फुले योजना",
    category: "healthcare"
  },
  {
    textEn: "How to register a village grievance?",
    textMr: "ग्रामपंचायत तक्रार कशी नोंदवावी?",
    category: "grievance"
  }
];

export const INTENT_RESPONSES = [
  {
    id: 'scholarship',
    keywords: [
      'scholarship', 'student', 'students', 'education', 'state_scholarship', 'college', 'fee', 'school',
      'शिष्यवृत्ती', 'विद्यार्थी', 'शिक्षण', 'कॉलेज', 'फी', 'शाळा', 'स्टूडंट', 'स्टूडन्ट', 'स्टूडेंट', 'स्टुडंट',
      'स्कॉलरशिप', 'विद्यार्थ्यांसाठी', 'मुलांसाठी', 'मुलींसाठी', 'वसतीगृह', 'अध्यापन'
    ],
    responseEn: `🎓 **Post-Matric Scholarship Scheme**:
- **Eligibility**: SC/ST/OBC/EBC college students in Maharashtra.
- **Benefit**: 50% to 100% Tuition & Examination Fee Waiver directly transferred via DBT.
👉 Click the button below to view full details or apply on State Direct Benefit portal!`,
    responseMr: `🎓 **मॅट्रिकोत्तर शिष्यवृत्ती योजना**:
• **लाभ**: १००% शैक्षणिक व परीक्षा शुल्क माफी + महिन्याला ₹१,५०० पर्यंत निर्वाह भत्ता.
• **पात्रता**: महाराष्ट्रातील ११ वी ते पदव्युत्तर शिक्षण घेणारे विद्यार्थी, कौटुंबिक उत्पन्न ₹२.५ लाखांपेक्षा कमी.
• **कागदपत्रे**: उत्पन्नाचा दाखला, जात प्रमाणपत्र, आधार कार्ड, मागील वर्षाचे गुणपत्रक, डोमिसाईल.
👉 सविस्तर माहितीसाठी खालील **'योजना सविस्तर पहा'** बटनावर क्लिक करा!`,
    schemeId: 'sch-002'
  },
  {
    id: 'pm_kisan',
    keywords: [
      'kisan', 'farmer', 'farmers', 'pm-kisan', 'pmkisan', 'agriculture', '7/12', '712', 'land',
      'किसान', 'शेतकरी', 'शेती', '७/१२', 'उतारा', 'पीएम-किसान', 'पीएम किसान', 'हप्ता', 'पीएमकिसान',
      'शेतकऱ्यांसाठी', 'पैसे', '६०००', '६००० रु', 'पीक', 'खत', 'तलाठी', 'फार्मर'
    ],
    responseEn: `🌾 **PM-KISAN Samman Nidhi Yojana**:
• **Benefits**: Direct financial assistance of ₹6,000 per year in 3 equal installments of ₹2,000.
• **Eligibility**: Land-owning small and marginal farmer families holding up to 5 acres cultivable land.
• **Required Documents**: Aadhaar Card, 7/12 & 8-A Land Extract, Bank Passbook, Passport Photo.
👉 Click below to view PM-KISAN guidelines and official application portal!`,
    responseMr: `🌾 **पीएम-किसान सन्मान निधी योजना**:
• **लाभ**: प्रतिवर्ष ₹६,००० थेट बँक खात्यात (₹२,००० च्या ३ हप्त्यांमध्ये).
• **पात्रता**: ५ एकरपर्यंत शेतजमीन असणारे लहान व अल्पभूधारक शेतकरी कुटुंब.
• **कागदपत्रे**: आधार कार्ड, ७/१२ आणि ८-अ उतारा, बँक पासबुकची प्रत, पासपोर्ट फोटो.
👉 सविस्तर माहितीसाठी खालील **'योजना सविस्तर पहा'** बटनावर क्लिक करा!`,
    schemeId: 'sch-001'
  },
  {
    id: 'karjmukti',
    keywords: [
      'karjmukti', 'loan waiver', 'crop loan', 'mahatma phule', 'loan', ' कर्ज', 'कर्जमाफी', 'कर्जमुक्ती',
      'महात्मा फुले', 'पीक कर्ज', 'पीककर्ज', 'सहकार', 'बँक कर्ज', '५० हजार', '५००००', '२ लाख'
    ],
    responseEn: `🌾 **Mahatma Jyotirao Phule Shetkari Karjmukti Yojana**:
• **Benefits**: Crop loan waiver up to ₹2,00,000 + ₹50,000 bonus incentive for regular re-payers.
• **Eligibility**: Farmers who have taken short-term crop loans from cooperative or nationalized banks.
• **Required Docs**: Aadhaar Card, Loan Passbook, 7/12 land extract, Aadhaar Biometric authentication.
👉 Click below to view full details!`,
    responseMr: `🌾 **महात्मा ज्योतिराव फुले शेतकरी कर्जमुक्ती योजना**:
• **लाभ**: ₹२ लाखांपर्यंत थकीत पीककर्ज पूर्ण माफ + नियमित परतफेड करणाऱ्यांना ₹५०,००० प्रोत्साहन अनुदान.
• **पात्रता**: बँक किंवा सेवा सहकारी संस्थांकडून पीककर्ज घेतलेले महाराष्ट्रातील शेतकरी.
• **कागदपत्रे**: आधार कार्ड, कर्ज पासबुक, ७/१२ उतारा, आधार थंब केवायसी.
👉 सविस्तर माहितीसाठी खालील **'योजना सविस्तर पहा'** बटनावर क्लिक करा!`,
    schemeId: 'sch-006'
  },
  {
    id: 'ladki_bahin',
    keywords: [
      'ladki', 'bahin', 'women', 'female', 'nari', 'girl', '1500', '18000',
      'लाडकी', 'बहीण', 'बहिण', 'महिला', 'स्त्री', 'नारी', 'महिलांसाठी', 'लाडकी बहीण', '१५००', '१८०००',
      'मुली', 'लेक', 'अंगणवाडी', 'नारी शक्ती'
    ],
    responseEn: `👩 **Mukhyamantri Majhi Ladki Bahin Yojana**:
• **Monthly Benefit**: ₹1,500 directly in bank account (₹18,000 annually).
• **Eligibility**: Resident women of Maharashtra aged 21 to 65 years with family income up to ₹2.5 Lakh.
• **Required Documents**: Aadhaar Card, Domicile/Ration Card, DBT active Bank Passbook, Undertaking form.
👉 Apply via Nari Shakti Doot App or check details below!`,
    responseMr: `👩 **मुख्यमंत्री माझी लाडकी बहीण योजना**:
• **दरमहा लाभ**: ₹१,५०० थेट बँक खात्यात जमा (वार्षिक ₹१८,०००).
• **पात्रता**: महाराष्ट्रातील २१ ते ६५ वयोगटातील महिला, कौटुंबिक वार्षिक उत्पन्न ₹२.५ लाखांपर्यंत.
• **कागदपत्रे**: आधार कार्ड, अधिवास दाखला/रेशन कार्ड, बँक पासबुक (DBT सक्रिय), हमीपत्र.
👉 अर्ज नारी शक्ती दूत ॲपवर करा किंवा सविस्तर माहिती पाहण्यासाठी खालील बटनावर क्लिक करा!`,
    schemeId: 'sch-003'
  },
  {
    id: 'housing',
    keywords: [
      'housing', 'pmay', 'home', 'house', 'gharkul', 'kutcha', 'pucca',
      'घरकुल', 'घर', 'गृहनिर्माण', 'प्रधानमंत्री आवास', 'आवास योजना', 'घरकुलासाठी', 'कच्चे घर', 'अनुदान', '१२००००'
    ],
    responseEn: `🏠 **Pradhan Mantri Awas Yojana - Gramin (PMAY-G)**:
• **Benefits**: Financial grant of ₹1,20,000 to ₹1,30,000 for house construction + ₹24,000 MGNREGA wages + ₹12,000 toilet grant.
• **Eligibility**: Homeless rural families or those living in kutcha/dilapidated homes.
• **Required Documents**: Aadhaar Card, MGNREGA Job Card, Bank Passbook, Land Ownership/NOC.
👉 Click below to view eligibility & registration process!`,
    responseMr: `🏠 **प्रधानमंत्री आवास योजना - ग्रामीण (घरकुल योजना)**:
• **लाभ**: पक्के घर बांधण्यासाठी ₹१.२० लाख ते ₹१.३० लाख अनुदान + मनरेगा मजुरी (₹२४,०००) + शौचालय अनुदान (₹१२,०००).
• **पात्रता**: ग्रामीण भागातील बेघर व कच्च्या घरात राहणारी कुटुंबे.
• **कागदपत्रे**: आधार कार्ड, मनरेगा जॉब कार्ड, बँक पासbook, जागेचा उतारा / नमुना ८.
👉 सविस्तर माहिती पाहण्यासाठी खालील **'योजना सविस्तर पहा'** बटनावर क्लिक करा!`,
    schemeId: 'sch-005'
  },
  {
    id: 'pension',
    keywords: [
      'pension', 'senior', 'elderly', 'shravanbal', 'sanjay gandhi', 'destitute', 'widow',
      'पेन्शन', 'निवृत्तीवेतन', 'ज्येष्ठ', 'नागरिक', 'श्रावणबाळ', 'संजय गांधी', 'निराधार', 'वृद्ध', 'वय ६५', '६५ वर्षे', 'विधवा'
    ],
    responseEn: `👴 **Sanjay Gandhi Niradhar & Shravanbal Pension Scheme**:
• **Benefits**: ₹1,500 per month lifetime pension credited directly to beneficiary's bank account.
• **Eligibility**: Destitute senior citizens aged 65+, widows, or disabled individuals with annual income < ₹50,000.
• **Required Documents**: Age proof, Income Certificate, Domicile Certificate (15 yrs resident), Aadhaar & Bank Details.
👉 Click below to check full eligibility criteria!`,
    responseMr: `👴 **संजय गांधी निराधार व श्रावणबाळ निवृत्तीवेतन योजना**:
• **लाभ**: दरमहा ₹१,५०० थेट बँक खात्यात निवृत्तीवेतन मदत.
• **पात्रता**: ६५ वर्षांवरील निराधार ज्येष्ठ नागरिक, विधवा महिला व दिव्यांग, उत्पन्न ₹५०,००० पेक्षा कमी.
• **कागदपत्रे**: वयाचा दाखला, उत्पन्नाचा दाखला, १५ वर्षांचा रहिवासी दाखला, आधार व बँक पासबुक.
👉 सविस्तर माहिती पाहण्यासाठी खालील **'योजना सविस्तर पहा'** बटनावर क्लिक करा!`,
    schemeId: 'sch-007'
  },
  {
    id: 'disability',
    keywords: [
      'divyang', 'handicapped', 'disabled', 'udid', 'wheelchair', 'tricycle',
      'दिव्यांग', 'अपंग', 'स्वावलंबन', 'युडीआयडी', 'दिव्यांगांसाठी', 'तीन चाकी सायकल', 'अपंगत्व', '४०%'
    ],
    responseEn: `♿ **Divyang Swavalamban & UDID Scheme**:
• **Benefits**: Free motorized tricycle, hearing aids, & self-employment grants/loans up to ₹2 Lakh with 80% subsidy.
• **Eligibility**: Persons with benchmark disability of 40% or more certified by Civil Surgeon.
• **Required Documents**: Disability Certificate / UDID Card, Aadhaar, Income Certificate, Photo.
👉 Click below to explore Divyang welfare benefits!`,
    responseMr: `♿ **दिव्यांग स्वावलंबन योजना व युडीआयडी (UDID) योजना**:
• **लाभ**: मोफत तीन चाकी सायकल, श्रवणयंत्रे व स्वयंरोजगारासाठी ८०% अनुदानावर ₹२ लाखांपर्यंत कर्ज.
• **पात्रता**: सिव्हिल सर्जन कडून किमान ४०% दिव्यांगत्वाचे प्रमाणपत्र धारक व्यक्ती.
• **कागदपत्रे**: दिव्यांग प्रमाणपत्र / UDID कार्ड, आधार कार्ड, उत्पन्नाचा दाखला, फोटो.
👉 सविस्तर माहिती पाहण्यासाठी खालील **'योजना सविस्तर पहा'** बटनावर क्लिक करा!`,
    schemeId: 'sch-008'
  },
  {
    id: 'employment',
    keywords: [
      'skill', 'job', 'employment', 'training', 'pramod mahajan', 'iti', 'course',
      'कौशल्य', 'रोजगार', 'नोकरी', 'प्रशिक्षण', 'आयटीआय', 'बेरोजगार', 'जॉब', 'प्रमोद महाजन', 'कौशल्य विकास', 'कोर्स'
    ],
    responseEn: `💼 **Pramod Mahajan Skill & Entrepreneurship Mission**:
• **Benefits**: 100% Free practical training courses in IT, CNC, Solar, Nursing + ₹1,500/month stipend + Job placement.
• **Eligibility**: Unemployed youth aged 18 to 45 (8th/10th/12th pass or ITI/Diploma).
• **Required Documents**: Educational Marksheets, Aadhaar Card, Domicile Certificate, Bank Account.
👉 Click below to view training courses & registration details!`,
    responseMr: `💼 **प्रमोद महाजन कौशल्य व उद्योजकता विकास अभियान**:
• **लाभ**: आयटी, सोलर, नर्सिंग, टेलरिंग मध्ये १००% मोफत प्रशिक्षण + ₹१,५०० मासिक विद्यावेतन + १००% नोकरीची संधी.
• **पात्रता**: १८ ते ४५ वयोगटातील तरुण (८ वी, १० वी, १२ वी उत्तीर्ण किंवा आयटीआय).
• **कागदपत्रे**: गुणपत्रक, आधार कार्ड, डोमिसाईल दाखला, बँक पासबुक.
👉 सविस्तर माहिती पाहण्यासाठी खालील **'योजना सविस्तर पहा'** बटनावर क्लिक करा!`,
    schemeId: 'sch-009'
  },
  {
    id: 'transport',
    keywords: [
      'bus', 'msrtc', 'st', 'travel', 'concession', 'ticket', 'half ticket',
      'एसटी', 'एस.टी.', 'बस', 'प्रवास', 'तिकीट', 'सवलत', 'हाफ तिकीट', 'महिला प्रवास', 'ज्येष्ठ प्रवास'
    ],
    responseEn: `🚌 **MSRTC Mahila Samman & Senior Citizen Bus Concession**:
• **Benefits**: 50% discount on ticket fares for ALL women; 100% FREE unlimited travel for seniors aged 75+ years.
• **Eligibility**: Female residents of Maharashtra & senior citizens aged 65+ (50% off) / 75+ (100% free).
• **Required Documents**: Aadhaar Card or MSRTC Smart Card.
👉 Click below to view MSRTC travel rules!`,
    responseMr: `🚌 **एस.टी. बस ५०% महिला सन्मान व ज्येष्ठ नागरिक मोफत प्रवास योजना**:
• **लाभ**: सर्व महिलांना एस.टी. प्रवासात ५०% तिकीट सवलत; ७५ वर्षांवरील ज्येष्ठांना १००% मोफत प्रवास.
• **पात्रता**: महाराष्ट्रातील महिला रहिवासी आणि ६५+ ज्येष्ठ नागरिक (५०% सवलत) किंवा ७५+ ज्येष्ठ नागरिक (१००% मोफत).
• **कागदपत्रे**: आधार कार्ड / एस.टी. स्मार्ट कार्ड.
👉 सविस्तर माहिती पाहण्यासाठी खालील **'योजना सविस्तर पहा'** बटनावर क्लिक करा!`,
    schemeId: 'sch-010'
  },
  {
    id: 'health',
    keywords: [
      'health', 'hospital', 'ayushman', 'doctor', 'treatment', 'mupjay', 'medical',
      'आरोग्य', 'दवाखाना', 'रुग्णालय', 'उपचार', 'डॉक्टर', 'हॉस्पिटल', 'आयुष्मान', 'कॅशलेस', 'ऑपरेशन', 'केशरी कार्ड', 'पिवळे कार्ड', 'मोफत उपचार'
    ],
    responseEn: `🏥 **Ayushman Bharat & Mahatma Jyotirao Phule Jan Arogya Yojana**:
• **Benefits**: Cashless hospital treatment and surgeries up to ₹5,00,000 per family per year across 1,900+ procedures.
• **Eligibility**: Families holding Yellow or Orange Ration Cards in Maharashtra.
• **Required Documents**: Ration Card, Aadhaar Card of all family members.
👉 Visit Arogya Mitra desk at network hospitals or view scheme below!`,
    responseMr: `🏥 **आयुष्मान भारत - महात्मा ज्योतिराव फुले जन आरोग्य योजना**:
• **लाभ**: १९००+ आजारांवर व शस्त्रक्रियांवर प्रतिवर्ष ₹५,००,००० पर्यंत पूर्णपणे मोफत (कॅशलेस) उपचार.
• **पात्रता**: पिवळे किंवा केशरी रेशन कार्डधारक कुटुंबे.
• **कागदपत्रे**: रेशन कार्ड (पिवळे/केशरी) आणि सर्व सदस्यांचे आधार कार्ड.
👉 सविस्तर माहिती पाहण्यासाठी खालील **'योजना सविस्तर पहा'** बटनावर क्लिक करा!`,
    schemeId: 'sch-004'
  },
  {
    id: 'grievance',
    keywords: [
      'grievance', 'complaint', 'problem', 'issue', 'water', 'road', 'electricity', 'light', 'cleanliness',
      'तक्रार', 'समस्या', 'रस्ता', 'पाणी', 'वीज', 'लाईट', 'लाइट', 'कचरा', 'गटार', 'तक्रार निवारण', 'ग्रामसेवक', 'रस्ते', 'पिण्याचे पाणी'
    ],
    responseEn: `📌 **Village Grievance Registration & Resolution**:
You can easily lodge grievances regarding roads, drinking water, streetlights, or sanitation on JanSathi.
1. Click on **'Grievance'** in the navigation menu or button below.
2. Select category and describe your issue.
3. Track resolution status in real-time using your unique **Tracking ID**.`,
    responseMr: `📌 **ग्रामपंचायत तक्रार नोंदणी व निवारण**:
तुमच्या गावातील रस्ते, पिण्याचे पाणी, स्ट्रीट लाईट किंवा स्वच्छतेबाबत तक्रार नोंदवू शकता:
१. खालील **'तक्रार निवारण कक्षात जा'** बटनावर क्लिक करा.
२. समस्येचा प्रकार व तपशील भरून तक्रार सबमिट करा.
३. मिळालेल्या **ट्रॅकिंग आयडी** द्वारे तक्रारीची सद्यस्थिती तपासा!`,
    action: 'navigate_grievance'
  }
];

