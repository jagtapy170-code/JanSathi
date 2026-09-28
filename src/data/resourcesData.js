export const MANDI_RATES = [
  { cropEn: 'Soybean (सोयाबीन)', cropMr: 'सोयाबीन', mandiEn: 'Latur APMC', mandiMr: 'लातूर कृषी उत्पन्न बाजार समिती', minPrice: 4350, maxPrice: 4850, modalPrice: 4680, unit: 'Quintal', date: '2026-09-17' },
  { cropEn: 'Cotton (कापूस)', cropMr: 'कापूस', mandiEn: 'Yavatmal APMC', mandiMr: 'यवतमाळ बाजार समिती', minPrice: 6800, maxPrice: 7650, modalPrice: 7300, unit: 'Quintal', date: '2026-09-17' },
  { cropEn: 'Onion (कांदा)', cropMr: 'कांदा', mandiEn: 'Lasalgaon APMC', mandiMr: 'लासलगाव बाजार समिती', minPrice: 1400, maxPrice: 2200, modalPrice: 1850, unit: 'Quintal', date: '2026-09-17' },
  { cropEn: 'Wheat (गहू)', cropMr: 'गहू', mandiEn: 'Pune APMC', mandiMr: 'पुणे बाजार समिती', minPrice: 2400, maxPrice: 2900, modalPrice: 2750, unit: 'Quintal', date: '2026-09-17' },
  { cropEn: 'Sugarcane (ऊस)', cropMr: 'ऊस', mandiEn: 'Kolhapur Mandi', mandiMr: 'कोल्हापूर मंडी', minPrice: 3100, maxPrice: 3400, modalPrice: 3250, unit: 'Ton', date: '2026-09-17' },
  { cropEn: 'Gram / Chana (हरभरा)', cropMr: 'हरभरा (चना)', mandiEn: 'Akola APMC', mandiMr: 'अकोला बाजार समिती', minPrice: 5100, maxPrice: 5800, modalPrice: 5550, unit: 'Quintal', date: '2026-09-17' }
];

export const HEALTHCARE_RESOURCES = [
  {
    nameEn: 'Primary Health Centre (PHC) Janpuri',
    nameMr: 'प्राथमिक आरोग्य केंद्र (PHC) जनपुरी',
    typeEn: 'Government Primary Health Centre',
    typeMr: 'शासकीय प्राथमिक आरोग्य केंद्र',
    doctorEn: 'Dr. Ramesh Patil (MBBS)',
    doctorMr: 'डॉ. रमेश पाटील (एम.बी.बी.एस.)',
    timingEn: '8:00 AM - 4:00 PM (Emergency 24x7)',
    timingMr: 'सकाळी ८:०० ते दुपारी ४:०० (आपत्कालीन २४ तास)',
    contact: '+91 98230 11223',
    servicesEn: ['Maternal Health', 'Vaccination', 'Free Medicines', 'Snakebite Treatment', 'Emergency Ambulance'],
    servicesMr: ['माता व बालसंगोपन', 'लसीकरण', 'मोफत औषधे', 'सर्पदंश उपचार', 'रुग्णवाहिका सेवा'],
    addressEn: 'Main Gram Panchayat Road, Village Janpuri',
    addressMr: 'मुख्य ग्रामपंचायत रस्ता, जनपुरी गाव'
  },
  {
    nameEn: 'Sub-District Civil Hospital',
    nameMr: 'उपजिल्हा ग्रामीण रुग्णालय',
    typeEn: 'Government Hospital (MUPJAY Empaneled)',
    typeMr: 'शासकीय रुग्णालय (महात्मा फुले योजना संलग्न)',
    doctorEn: 'Dr. Sunita Deshmukh (MD Gynaecology)',
    doctorMr: 'डॉ. सुनीता देशमुख (स्त्रीरोग तज्ज्ञ)',
    timingEn: '24 Hours Open',
    timingMr: '२४ तास उघडे',
    contact: '108 / +91 94221 44556',
    servicesEn: ['24x7 Emergency', 'Surgery', 'ICU', 'Blood Bank', 'Free Ayushman Card Counter'],
    servicesMr: ['२४ तास आपत्कालीन सेवा', 'ऑपरेशन थिएटर', 'आयसीयू', 'ब्लड बँक', 'आयुष्मान कार्ड कक्ष'],
    addressEn: 'Taluka Headquarters, Near Bus Stand',
    addressMr: 'तालुका केंद्र, बस स्थानकाजवळ'
  }
];

export const EDUCATION_RESOURCES = [
  {
    titleEn: 'Gram Panchayat Digital Library & Study Center',
    titleMr: 'ग्रामपंचायत डिजिटल वाचनालय व अभ्यासिका',
    facilityEn: 'Free Wi-Fi, 15 Computers, Competitive Exam books (MPSC, UPSC, Banking, Army Bharti).',
    facilityMr: 'मोफत वाय-फाय, १५ संगणक, एमपीएससी/यूपीएससी स्पर्धा परीक्षा पुस्तके.',
    timingEn: '6:00 AM - 10:00 PM Daily',
    timingMr: 'दररोज सकाळी ६:०० ते रात्री १०:००',
    contact: 'Gram Sevak Office',
    addressEn: 'Community Center 2nd Floor, Janpuri',
    addressMr: 'समाज मंदिर दुसरा मजला, जनपुरी'
  },
  {
    titleEn: 'MPSC & Police Bharti Free Guidance Class',
    titleMr: 'पोलीस भरती व स्पर्धा परीक्षा विनामूल्य मार्गदर्शन वर्ग',
    facilityEn: 'Weekly expert lectures, physical fitness training, and mock tests conducted by retired officers.',
    facilityMr: 'दर रविवारी तज्ज्ञांचे व्याख्यान, शारीरिक क्षमता चाचणी व सराव परीक्षा.',
    timingEn: 'Every Sunday 9:00 AM - 12:00 PM',
    timingMr: 'प्रत्येक रविवारी सकाळी ९:०० ते १२:००',
    contact: '+91 97654 33211',
    addressEn: 'Zilla Parishad High School Ground',
    addressMr: 'जिल्हा परिषद हायस्कूल मैदान'
  }
];

export const TRANSPORT_TIMETABLES = [
  { busNo: 'MH-20-4321', routeEn: 'Janpuri Village ➔ Taluka Bus Stand', routeMr: 'जनपुरी गाव ➔ तालुका बस स्थानक', departure: '07:30 AM', arrival: '08:15 AM', frequencyEn: 'Daily', frequencyMr: 'दररोज', fare: '₹25' },
  { busNo: 'MH-20-5678', routeEn: 'Janpuri ➔ District City Express', routeMr: 'जनपुरी ➔ जिल्हा शहर एक्सप्रेस', departure: '09:00 AM', arrival: '10:30 AM', frequencyEn: 'Daily', frequencyMr: 'दररोज', fare: '₹60' },
  { busNo: 'MH-20-8910', routeEn: 'Janpuri ➔ APMC Agriculture Market', routeMr: 'जनपुरी ➔ कृषी उत्पन्न बाजार समिती (मंडी)', departure: '11:15 AM', arrival: '12:00 PM', frequencyEn: 'Daily (Market Special)', frequencyMr: 'दररोज (बाजार विशेष)', fare: '₹30' },
  { busNo: 'MH-20-1122', routeEn: 'District City ➔ Janpuri Village Return', routeMr: 'जिल्हा शहर ➔ जनपुरी गाव परतीची बस', departure: '05:30 PM', arrival: '07:00 PM', frequencyEn: 'Daily Evening', frequencyMr: 'दररोज सायंकाळी', fare: '₹60' }
];
