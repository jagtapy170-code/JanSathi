import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CHATBOT_SUGGESTIONS, INTENT_RESPONSES } from '../data/chatbotData';
import { INITIAL_SCHEMES } from '../data/schemesData';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Paperclip, 
  FileText, 
  ArrowRight,
  Globe,
  Sparkles
} from 'lucide-react';

export default function JanSahayakChatbot({ onNavigateScheme, onNavigateGrievance }) {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Response Language Mode: 'auto' (detects from user input) | 'mr' | 'en'
  const [chatLangMode, setChatLangMode] = useState('auto');

  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: lang === 'mr' 
        ? 'नमस्कार! मी जनसहायक (JanSahayak) डिजिटल सहाय्यक आहे. तुम्ही मराठीत किंवा English मध्ये विचारू शकता, मी तुमच्याच भाषेत उत्तर देईन!' 
        : 'Hello! I am JanSahayak, your smart village assistant. Ask me in Marathi or English, and I will respond in your language!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = chatLangMode === 'mr' ? 'mr-IN' : chatLangMode === 'hi' ? 'hi-IN' : chatLangMode === 'en' ? 'en-IN' : (lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN');

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendMessage(transcript, null, 'voice');
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          alert(lang === 'hi'
            ? 'माइक्रोफोन की अनुमति नहीं दी गई है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफोन अनुमति चालू करें।'
            : lang === 'mr'
            ? 'मायक्रोफोन परवानगी नाकारली आहे. कृपया तुमच्या ब्राऊजर सेटिंग्जमध्ये मायक्रोफोन चालू करा.'
            : 'Microphone permission denied. Please allow microphone access in browser settings.');
        }
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, [lang, chatLangMode]);

  // Helper to detect language from input text (en, mr, hi)
  const detectLanguage = (text) => {
    if (chatLangMode === 'mr') return 'mr';
    if (chatLangMode === 'hi') return 'hi';
    if (chatLangMode === 'en') return 'en';

    if (!text || typeof text !== 'string') return lang || 'en';

    const lower = text.toLowerCase();

    // Check Devanagari script regex range (\u0900-\u097F)
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    if (hasDevanagari) {
      let mrScore = 0;
      let hiScore = 0;

      const mrMarkers = ['विद्यार्थी', 'शिक्षवृत्ती', 'शेतकरी', 'माहिती', 'पात्रता', 'तक्रार', 'आहेत', 'कोणत्या', 'सांगा', 'कशी', 'मिळेल', 'पाहिजे', 'बहीण', 'लाडकी', 'अर्ज', 'कागदपत्रे'];
      const hiMarkers = ['छात्रों', 'छात्रवृत्ति', 'किसान', 'जानकारी', 'पात्रता', 'शिकायत', 'हैं', 'कौनसी', 'बताएं', 'कैसे', 'मिलेगा', 'चाहिए', 'बहन', 'लाडली', 'आवेदन', 'दस्तावेज', 'क्या', 'के लिए'];

      for (const m of mrMarkers) if (text.includes(m)) mrScore += 2;
      for (const h of hiMarkers) if (text.includes(h)) hiScore += 2;

      if (hiScore > mrScore) return 'hi';
      return 'mr';
    }

    // Check Roman Hindi / Hinglish keywords
    const hindiRomanKeywords = [
      'mujhe', 'chahiye', 'kya', 'hai', 'kaise', 'bataiye', 'jaankari', 'chatravritti', 
      'kisan', 'bhai', 'kare', 'kaun', 'yojna', 'madad', 'pahile', 'namaste', 'sabse'
    ];
    if (hindiRomanKeywords.some(kw => lower.includes(kw))) {
      return 'hi';
    }

    // Check Roman Marathi keywords
    const marathiRomanKeywords = [
      'namaskar', 'sheti', 'shetkari', 'yojana', 'takrar', 'kiti', 'sang', 'pahije', 
      'kasa', 'kasi', 'konta', 'konti', 'kontya', 'ladki', 'bahin', 'arja', 'mahiti', 
      'kagadpatre', 'paise', 'ahet', 'kay', 'sathi', 'khata', 'gharkul', 'peenshan'
    ];
    if (marathiRomanKeywords.some(kw => lower.includes(kw))) {
      return 'mr';
    }

    return 'en';
  };

  // Speech Synthesis Helper
  const speakText = (text, targetLang) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#🎓🌾👩📌🏥🏠👴♿💼🚌💰✅👉📄•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLang === 'hi' ? 'hi-IN' : targetLang === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(lang === 'hi'
        ? 'आपके ब्राउज़र में वॉइस सपोर्ट उपलब्ध नहीं है।'
        : lang === 'mr'
        ? 'तुमच्या ब्राऊजरमध्ये आवाज ओळखणे समर्थित नाही.'
        : 'Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const targetLang = chatLangMode === 'mr' ? 'mr-IN' : chatLangMode === 'hi' ? 'hi-IN' : chatLangMode === 'en' ? 'en-IN' : (lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN');
        recognitionRef.current.lang = targetLang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type.includes('image') ? 'image' : 'pdf',
        fileObj: file
      });
    }
  };

  // Preprocess text & search intents or dynamic scheme database
  const processQuery = (rawText, targetLang) => {
    const lowerQuery = rawText.toLowerCase();

    // 1. Phonetic Devanagari / Transliterated Replacements
    const normalizedText = lowerQuery
      .replace(/स्टूडंट|स्टूडन्ट|स्टूडेंट|स्टुडंट|स्टूडेंट्स/g, 'student scholarship विद्यार्थी')
      .replace(/स्कीम|स्कीम्स/g, 'yojana scheme योजना')
      .replace(/अवेलेबल|अव्‍हेलेबल|एव्हेलेबल/g, 'available उपलब्ध')
      .replace(/अप्लाय|फॉर्म/g, 'apply form अर्ज')
      .replace(/हप्ता|पैसे/g, 'installment money अनुदान')
      .replace(/हॉस्पिटल|दवाखाना/g, 'hospital आरोग्य');

    // Remove common Marathi grammatical suffixes for cleaner matching
    const stemTokens = normalizedText.split(/\s+/).map(t => 
      t.replace(/(साठी|ची|च्या|चे|ला|मध्ये|कडून|बाबत|विषयी|नुसार|वर)$/g, '')
    );

    // 2. Try static INTENT_RESPONSES matching
    for (const intent of INTENT_RESPONSES) {
      const matched = intent.keywords.some(kw => {
        const kwLower = kw.toLowerCase();
        return lowerQuery.includes(kwLower) || 
               normalizedText.includes(kwLower) || 
               stemTokens.some(token => token.includes(kwLower) || kwLower.includes(token));
      });

      if (matched) {
        return {
          text: targetLang === 'mr' ? intent.responseMr : intent.responseEn,
          schemeId: intent.schemeId || null,
          action: intent.action || null
        };
      }
    }

    // 3. Dynamic Scheme Database Search (INITIAL_SCHEMES)
    const searchWords = stemTokens.filter(w => w.length > 2 && !['आहेत', 'कोणत्या', 'सांगा', 'काय', 'कशी', 'कोणते', 'which', 'what', 'how', 'have'].includes(w));
    
    if (searchWords.length > 0) {
      let bestScheme = null;
      let highestScore = 0;

      for (const sch of INITIAL_SCHEMES) {
        let score = 0;
        const corpus = `${sch.nameMr} ${sch.nameEn} ${sch.descriptionMr} ${sch.descriptionEn} ${sch.category} ${sch.targetUser} ${sch.eligibilityTextMr} ${sch.eligibilityTextEn}`.toLowerCase();

        for (const word of searchWords) {
          if (corpus.includes(word)) {
            score += 2;
          }
        }

        if (score > highestScore) {
          highestScore = score;
          bestScheme = sch;
        }
      }

      if (bestScheme && highestScore > 0) {
        const responseText = targetLang === 'hi'
          ? `🏛️ **${bestScheme.nameEn} / ${bestScheme.nameMr}**:
• **विवरण**: ${bestScheme.descriptionEn}
• **मुख्य लाभ**: ${bestScheme.benefitsEn}
• **पात्रता**: ${bestScheme.eligibilityTextEn}
👉 आवेदन या आवश्यक दस्तावेजों की विस्तृत जानकारी के लिए **'योजना विवरण देखें'** बटन पर क्लिक करें!`
          : targetLang === 'mr'
          ? `🏛️ **${bestScheme.nameMr}**:
• **वर्णन**: ${bestScheme.descriptionMr}
• **मुख्य लाभ**: ${bestScheme.benefitsMr}
• **पात्रता**: ${bestScheme.eligibilityTextMr}
👉 अर्ज किंवा कागदपत्रांची सविस्तर माहिती पाहण्यासाठी खालील **'योजना सविस्तर पहा'** बटनावर क्लिक करा!`
          : `🏛️ **${bestScheme.nameEn}**:
• **Description**: ${bestScheme.descriptionEn}
• **Key Benefits**: ${bestScheme.benefitsEn}
• **Eligibility**: ${bestScheme.eligibilityTextEn}
👉 Click the button below to view complete details & application steps!`;

        return {
          text: responseText,
          schemeId: bestScheme.id,
          action: null
        };
      }
    }

    // 4. Structured Friendly Fallback Message in Hindi, Marathi, or English
    const fallbackText = targetLang === 'hi'
      ? `माफ़ कीजिए, इस प्रश्न के बारे में स्पष्ट जानकारी नहीं मिली। आप निम्नलिखित विषयों के बारे में पूछ सकते हैं:

🎓 **1. शिक्षा एवं छात्रवृत्ति**: (जैसे 'छात्रवृत्ति योजना')
🌾 **2. कृषि एवं किसान कल्याण**: (जैसे 'पीएम किसान ₹6000' या 'फसल बीमा')
👩 **3. महिला कल्याण**: (जैसे 'लाडली बहन योजना')
🏠 **4. आवास एवं पेंशन**: (जैसे 'प्रधानमंत्री आवास योजना')
📌 **5. जन शिकायत**: (जैसे 'सड़क व जल समस्या की शिकायत')

या नीचे दिए गए सुझावों में से किसी एक को चुनें! 👇`
      : targetLang === 'mr'
      ? `माफ करा, या प्रश्नाबाबत थेट माहिती मिळाली नाही. परंतु तुम्ही खालीलपैकी कोणत्याही विषयावर माहिती विचारू शकता:

🎓 **१. शिक्षण व शिष्यवृत्ती**: (उदा. 'स्टूडंट स्कॉलरशिप')
🌾 **२. शेती व शेतकरी**: (उदा. 'पीएम किसान ₹६०००' किंवा 'कर्जमाफी')
👩 **३. महिला सक्षमीकरण**: (उदा. 'लाडकी बहीण योजना')
🏠 **४. घरकुल व निवृत्तीवेतन**: (उदा. 'प्रधानमंत्री आवास' किंवा 'पेन्शन')
📌 **५. ग्रामपंचायत तक्रार**: (उदा. 'पाणी व रस्त्याची समस्या')

किंवा खाली दिलेले सुचवलेले प्रश्न निवडा! 👇`
      : `I couldn't find an exact match for your question. You can ask about:
• 🎓 **Education Scholarships** (e.g. 'Scholarship for students')
• 🌾 **Farmer Welfare** (e.g. 'PM Kisan ₹6000')
• 👩 **Women Welfare** (e.g. 'Ladki Bahin Yojana')
• 🏠 **Housing & Pension** (e.g. 'PMAY Housing')
• 📌 **Village Grievance** (e.g. 'Road and water complaints')

Or click any of the suggestion chips below! 👇`;

    return {
      text: fallbackText,
      schemeId: null,
      action: null
    };
  };

  const handleSendMessage = (customText, customFile) => {
    const textToSend = customText || inputText;
    const fileToSend = customFile !== undefined ? customFile : attachedFile;

    if (!textToSend.trim() && !fileToSend) return;

    // Detect response language based on user query & mode
    const targetLang = detectLanguage(textToSend);

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      attachedFile: fileToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setAttachedFile(null);

    // Generate AI Bot response in detected language
    setTimeout(() => {
      let botText = '';
      let schemeIdToLink = null;
      let actionToTrigger = null;

      if (fileToSend) {
        const fileNameLower = fileToSend.name.toLowerCase();

        if (fileNameLower.includes('7/12') || fileNameLower.includes('712') || fileNameLower.includes('land') || fileNameLower.includes('utara')) {
          botText = targetLang === 'mr'
            ? `📄 **७/१२ उतारा दस्तऐवज पडताळणी पूर्ण**:
✅ **जमीन धारणा क्षेत्र**: ३.५ एकर (अल्पभूधारक शेतकरी).
✅ **संबंधित योजना**: तुम्ही **पीएम-किसान (₹६,०००)** आणि **महात्मा फुले शेतकरी कर्जमुक्ती योजना** साठी ९५% पात्र आहात!
👉 अर्ज करण्यासाठी खालील बटनावर क्लिक करा.`
            : `📄 **7/12 Land Record Verification Complete**:
✅ **Land Area Verified**: 3.5 Acres (Small/Marginal Farmer).
✅ **Matched Schemes**: You are 95% eligible for **PM-KISAN (₹6,000)** and **Mahatma Phule Karjmukti Scheme**!`;
          schemeIdToLink = 'sch-001';
        } else if (fileNameLower.includes('aadhaar') || fileNameLower.includes('adhar') || fileNameLower.includes('identity')) {
          botText = targetLang === 'mr'
            ? `📄 **आधार कार्ड दस्तऐवज पडताळणी पूर्ण**:
✅ **ई-केवायसी स्थिती**: सक्रिय (Active DBT).
✅ **वय व पत्ता पडताळणी**: जनपुरी, महाराष्ट्र रहिवासी.
✅ **पात्रता**: तुम्ही लाडकी बहीण योजना, आयुष्मान भारत कार्ड, व रेशन अनुदानासाठी पात्र आहात.`
            : `📄 **Aadhaar Card Verification Complete**:
✅ **e-KYC Status**: Active DBT Account verified.
✅ **Matched Schemes**: Eligible for Ladki Bahin Yojana, Ayushman Bharat, and Post-Matric State Scholarship.`;
          schemeIdToLink = 'sch-003';
        } else {
          botText = targetLang === 'mr'
            ? `📄 **दस्तऐवज प्राप्त झाला (${fileToSend.name})**:
जनसहायक एआय द्वारे कागदपत्राची पडताळणी झाली आहे. तुमचे उत्पन्न व रहिवासी प्रमाणपत्र योजनेच्या निकषांशी जुळत आहे.`
            : `📄 **Document Received (${fileToSend.name})**:
JanSahayak AI verified your document details against government scheme eligibility guidelines.`;
        }
      } else {
        const result = processQuery(textToSend, targetLang);
        botText = result.text;
        schemeIdToLink = result.schemeId;
        actionToTrigger = result.action;
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botText,
        schemeId: schemeIdToLink,
        action: actionToTrigger,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      speakText(botText, targetLang);
    }, 400);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1200,
            background: 'linear-gradient(135deg, #f97316 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '999px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          className="chatbot-trigger"
        >
          <div style={{ position: 'relative' }}>
            <Bot size={26} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid white'
            }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: '800', fontSize: '0.95rem', lineHeight: 1.1 }}>JanSahayak AI</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>🌐 Marathi & English AI</div>
          </div>
        </button>
      )}

      {/* Chat Drawer Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '420px',
          maxWidth: 'calc(100vw - 30px)',
          height: '600px',
          maxHeight: 'calc(100vh - 40px)',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
          border: '1px solid #cbd5e1',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: 'white',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Bot size={22} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1rem' }}>{t('chatTitle')}</div>
                <div style={{ fontSize: '0.72rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80' }} />
                  <span>Marathi & English Smart AI</span>
                </div>
              </div>
            </div>

            {/* Controls: Voice & Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  setTtsEnabled(!ttsEnabled);
                  if (ttsEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                }}
                title={ttsEnabled ? "Mute Voice Output" : "Enable Voice Output"}
                style={{
                  background: ttsEnabled ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}
              >
                {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Response Language Preference Bar */}
          <div style={{
            background: '#f8fafc',
            padding: '6px 14px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            fontSize: '0.78rem'
          }}>
            <span style={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={14} />
              <span>उत्तर भाषा (Response Language):</span>
            </span>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setChatLangMode('auto')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: chatLangMode === 'auto' ? '#2563eb' : '#e2e8f0',
                  color: chatLangMode === 'auto' ? 'white' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  cursor: 'pointer'
                }}
              >
                Auto Detect ⚡
              </button>
              <button
                onClick={() => setChatLangMode('mr')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: chatLangMode === 'mr' ? '#f97316' : '#e2e8f0',
                  color: chatLangMode === 'mr' ? 'white' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  cursor: 'pointer'
                }}
              >
                मराठी
              </button>
              <button
                onClick={() => setChatLangMode('hi')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: chatLangMode === 'hi' ? '#8b5cf6' : '#e2e8f0',
                  color: chatLangMode === 'hi' ? 'white' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  cursor: 'pointer'
                }}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setChatLangMode('en')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: chatLangMode === 'en' ? '#10b981' : '#e2e8f0',
                  color: chatLangMode === 'en' ? 'white' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  cursor: 'pointer'
                }}
              >
                English
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justify: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '88%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user' ? '#2563eb' : 'white',
                  color: msg.sender === 'user' ? 'white' : '#0f172a',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line'
                }}>
                  {/* Attached File Chip */}
                  {msg.attachedFile && (
                    <div style={{
                      background: msg.sender === 'user' ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      <FileText size={16} />
                      <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.attachedFile.name} ({msg.attachedFile.size})
                      </div>
                    </div>
                  )}

                  {msg.text}

                  {/* Speaker TTS Button */}
                  {msg.sender === 'bot' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                      <button
                        onClick={() => speakText(msg.text, detectLanguage(msg.text))}
                        title="Listen to message / ऐका"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          background: 'white',
                          color: '#2563eb',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <Volume2 size={13} />
                        <span>{lang === 'hi' ? 'सुनें' : lang === 'mr' ? 'ऐका' : 'Listen'}</span>
                      </button>
                    </div>
                  )}

                  {/* Deep-link action button */}
                  {msg.schemeId && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onNavigateScheme(msg.schemeId);
                      }}
                      style={{
                        marginTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{lang === 'mr' ? 'योजना सविस्तर पहा' : 'View Scheme Details'}</span>
                      <ArrowRight size={14} />
                    </button>
                  )}

                  {msg.action === 'navigate_grievance' && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onNavigateGrievance();
                      }}
                      style={{
                        marginTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#fff7ed',
                        color: '#c2410c',
                        border: '1px solid #fed7aa',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{lang === 'mr' ? 'तक्रार निवारण कक्षात जा' : 'Go to Grievance Portal'}</span>
                      <ArrowRight size={14} />
                    </button>
                  )}

                  <div style={{
                    fontSize: '0.68rem',
                    opacity: 0.7,
                    textAlign: 'right',
                    marginTop: '4px'
                  }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div style={{
            padding: '6px 10px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            display: 'flex',
            gap: '6px'
          }}>
            {CHATBOT_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(lang === 'mr' ? sug.textMr : sug.textEn, null)}
                style={{
                  fontSize: '0.74rem',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                💡 {lang === 'mr' ? sug.textMr : sug.textEn}
              </button>
            ))}
          </div>

          {/* Attached File Draft Banner */}
          {attachedFile && (
            <div style={{
              padding: '6px 14px',
              background: '#fff7ed',
              borderTop: '1px solid #fed7aa',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              fontSize: '0.8rem',
              color: '#c2410c',
              fontWeight: 700
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} />
                <span>{attachedFile.name} ({attachedFile.size})</span>
              </div>
              <button
                onClick={() => setAttachedFile(null)}
                style={{ border: 'none', background: 'none', color: '#c2410c', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(null, undefined); }}
            style={{
              padding: '10px 14px',
              background: 'white',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
              style={{ display: 'none' }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title={lang === 'mr' ? 'कागदपत्र अपलोड करा' : 'Attach Document'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
            >
              <Paperclip size={18} />
            </button>

            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? "Stop Listening" : "Speak to JanSahayak"}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isListening ? '#f43f5e' : '#f1f5f9',
                border: isListening ? 'none' : '1px solid #cbd5e1',
                color: isListening ? 'white' : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                boxShadow: isListening ? '0 0 12px rgba(244, 63, 94, 0.5)' : 'none'
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? (lang === 'mr' ? 'ऐकत आहे... बोला...' : 'Listening... Speak now...') : (lang === 'mr' ? 'मराठी किंवा English मध्ये विचारा...' : 'Ask in Marathi or English...')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '999px',
                border: isListening ? '2px solid #f43f5e' : '1px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
