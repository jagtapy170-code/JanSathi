package backend.java.handlers;

import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;

public class ChatbotHandler extends BaseHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handleCorsOptions(exchange)) return;

        if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            String body = readRequestBody(exchange);
            String message = extractJsonValue(body, "message");
            String reqLang = extractJsonValue(body, "language");
            String inputType = extractJsonValue(body, "inputType");
            if (reqLang == null || reqLang.isEmpty()) {
                reqLang = "auto";
            }
            if (inputType == null || inputType.isEmpty()) {
                inputType = "text";
            }

            // 1. Detect language
            String targetLang = detectLanguage(message, reqLang);

            // 2. Process Intent & Query Database
            BotResponse botRes = generateResponse(message, targetLang);

            // 3. Return structured JSON
            String jsonResponse = String.format(
                "{\"status\":\"success\",\"success\":true,\"language\":\"%s\",\"inputType\":\"%s\",\"reply\":\"%s\",\"response\":\"%s\",\"intent\":\"%s\",\"quickActions\":%s}",
                targetLang,
                inputType,
                escapeJson(botRes.text),
                escapeJson(botRes.text),
                botRes.intent,
                botRes.quickActions
            );

            sendResponse(exchange, 200, jsonResponse);
        } else {
            sendResponse(exchange, 405, "{\"status\":\"error\",\"message\":\"Method Not Allowed\"}");
        }
    }

    private String detectLanguage(String text, String mode) {
        if ("mr".equalsIgnoreCase(mode)) return "mr";
        if ("hi".equalsIgnoreCase(mode)) return "hi";
        if ("en".equalsIgnoreCase(mode)) return "en";

        if (text == null || text.trim().isEmpty()) return "en";

        String lower = text.toLowerCase();

        // Devanagari script check
        boolean hasDevanagari = text.matches(".*[\\u0900-\\u097F].*");

        if (hasDevanagari) {
            // Count Marathi vs Hindi specific markers
            int mrScore = 0;
            int hiScore = 0;

            String[] mrMarkers = {"विद्यार्थी", "शिक्षवृत्ती", "शेतकरी", "माहिती", "पात्रता", "तक्रार", "आहेत", "कोणत्या", "सांगा", "कशी", "मिळेल", "पाहिजे", "बहीण", "लाडकी", "अर्ज", "कागदपत्रे"};
            String[] hiMarkers = {"छात्रों", "छात्रवृत्ति", "किसान", "जानकारी", "पात्रता", "शिकायत", "हैं", "कौनसी", "बताएं", "कैसे", "मिलेगा", "चाहिए", "बहन", "लाडली", "आवेदन", "दस्तावेज", "के लिए", "क्या"};

            for (String m : mrMarkers) if (text.contains(m)) mrScore += 2;
            for (String h : hiMarkers) if (text.contains(h)) hiScore += 2;

            if (hiScore > mrScore) return "hi";
            return "mr";
        }

        // Romanized script (Hinglish / Marathlish / English)
        String[] hiRoman = {"mujhe", "chahiye", "kya", "hai", "kaise", "bataiye", "jaankari", "chatravritti", "kisan", "bhai", "kare", "kaun", "yojna", "madad", "pahile"};
        String[] mrRoman = {"mala", "shetkari", "yojana", "pahije", "takrar", "kasa", "konta", "ladki", "bahin", "arja", "mahiti", "kagadpatre", "paise", "ahet", "kay", "sathi"};

        for (String h : hiRoman) if (lower.contains(h)) return "hi";
        for (String m : mrRoman) if (lower.contains(m)) return "mr";

        return "en";
    }

    private BotResponse generateResponse(String message, String lang) {
        String lower = message.toLowerCase();

        // 1. Farmers / PM Kisan / Agriculture
        if (lower.contains("kisan") || lower.contains("farmer") || lower.contains(" agriculture") || lower.contains("शेतकरी") || lower.contains("कृषी") || lower.contains("किसान") || lower.contains("फसल") || lower.contains("खेती")) {
            if ("hi".equals(lang)) {
                return new BotResponse(
                    "🌾 **पीएम-किसान सम्मान निधि एवं कृषि योजनाएं**:\n" +
                    "• **लाभ**: पात्र किसानों को ₹6,000 प्रति वर्ष 3 किश्तों में सीधे बैंक खाते में।\n" +
                    "• **पात्रता**: 5 एकड़ तक कृषि भूमि वाले लघु एवं सीमांत किसान।\n" +
                    "• **आवश्यक दस्तावेज**: आधार कार्ड, भूमि का 7/12 खसरा खतौनी, बैंक पासबुक।",
                    "farmers_scheme",
                    "[{\"label\":\"पात्रता जांचें\",\"action\":\"eligibility\"},{\"label\":\"कृषि योजनाएं देखें\",\"action\":\"schemes\"}]"
                );
            } else if ("mr".equals(lang)) {
                return new BotResponse(
                    "🌾 **पीएम-किसान सन्मान निधी व कृषी योजना**:\n" +
                    "• **लाभ**: पात्र शेतकऱ्यांना वर्षाला ₹६,००० चे अर्थसहाय्य (३ हप्त्यांमध्ये direct DBT).\n" +
                    "• **पात्रता**: ५ एकरपर्यंत शेतजमीन असलेले लहान व अल्पभूधारक शेतकरी.\n" +
                    "• **आवश्यक कागदपत्रे**: आधार कार्ड, ७/१२ आणि ८-अ उतारा, बँक पासबुक.",
                    "farmers_scheme",
                    "[{\"label\":\"पात्रता तपासा\",\"action\":\"eligibility\"},{\"label\":\"कृषी योजना पहा\",\"action\":\"schemes\"}]"
                );
            } else {
                return new BotResponse(
                    "🌾 **PM-KISAN Samman Nidhi & Agriculture Schemes**:\n" +
                    "• **Benefits**: Direct income support of ₹6,000/year in 3 equal installments via DBT.\n" +
                    "• **Eligibility**: Small & marginal landholding farmer families.\n" +
                    "• **Documents**: Aadhaar Card, Land Records (7/12 extract), Active Bank Passbook.",
                    "farmers_scheme",
                    "[{\"label\":\"Check Eligibility\",\"action\":\"eligibility\"},{\"label\":\"View Farmer Schemes\",\"action\":\"schemes\"}]"
                );
            }
        }

        // 2. Scholarships & Education
        if (lower.contains("scholarship") || lower.contains("student") || lower.contains("education") || lower.contains("विद्यार्थी") || lower.contains("शिष्यवृत्ती") || lower.contains("छात्रों") || lower.contains("छात्रवृत्ति") || lower.contains("पढ़ाई")) {
            if ("hi".equals(lang)) {
                return new BotResponse(
                    "🎓 **छात्रवृत्ति एवं शिक्षा योजनाएं**:\n" +
                    "• **राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) एवं राजर्षि शाहू महाराज योजना** छात्रों के लिए उपलब्ध हैं।\n" +
                    "• **लाभ**: शिक्षण शुल्क माफी, छात्रावास भत्ता और ₹10,000 से ₹50,000 प्रति वर्ष की सहायता।\n" +
                    "• **पात्रता**: 10वीं/12वीं/डिप्लोमा/डिग्री छात्र (वार्षिक आय ₹8 लाख से कम)।",
                    "scholarship_scheme",
                    "[{\"label\":\"पात्रता जांचें\",\"action\":\"eligibility\"},{\"label\":\"छात्रवृत्ति योजनाएं\",\"action\":\"schemes\"}]"
                );
            } else if ("mr".equals(lang)) {
                return new BotResponse(
                    "🎓 **विद्यार्थी शिष्यवृत्ती योजना**:\n" +
                    "• **राजर्षि छत्रपती शाहू महाराज व महाडीबीटी शिष्यवृत्ती योजना** उच्च शिक्षणासाठी उपलब्ध आहेत.\n" +
                    "• **लाभ**: ५०% ते १००% शिक्षण शुल्क माफी आणि वार्षिक ₹१०,००० ते ₹५०,००० निर्वाह भत्ता.\n" +
                    "• **पात्रता**: १०वी/१२वी उत्तीर्ण विद्यार्थी, कौटुंबिक उत्पन्न ₹८ लाखांपेक्षा कमी.",
                    "scholarship_scheme",
                    "[{\"label\":\"पात्रता तपासा\",\"action\":\"eligibility\"},{\"label\":\"शिष्यवृत्ती योजना पहा\",\"action\":\"schemes\"}]"
                );
            } else {
                return new BotResponse(
                    "🎓 **Student Scholarship & Higher Education Schemes**:\n" +
                    "• **Available Schemes**: National Scholarship Portal (NSP), Rajarshi Shahu Maharaj Tuition Fee Scheme.\n" +
                    "• **Benefits**: 50% to 100% tuition fee waiver + annual maintenance allowance of ₹10,000 to ₹50,000.\n" +
                    "• **Eligibility**: Enrolled students with family annual income under ₹8 Lakhs.",
                    "scholarship_scheme",
                    "[{\"label\":\"Check Eligibility\",\"action\":\"eligibility\"},{\"label\":\"Explore Scholarships\",\"action\":\"schemes\"}]"
                );
            }
        }

        // 3. Healthcare / Ayushman Bharat
        if (lower.contains("ayushman") || lower.contains("health") || lower.contains("hospital") || lower.contains("आरोग्य") || lower.contains("दवाखाना") || lower.contains("स्वास्थ्य") || lower.contains("अस्पताल")) {
            if ("hi".equals(lang)) {
                return new BotResponse(
                    "🏥 **आयुष्मान भारत एवं स्वास्थ्य सुरक्षा योजना**:\n" +
                    "• **लाभ**: प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस एवं मुफ्त इलाज।\n" +
                    "• **पात्रता**: SECC सूचियों, बीपीएल राशन कार्ड धारक और गरीब परिवार।\n" +
                    "• **दस्तावेज**: आधार कार्ड, राशन कार्ड और पीएमजेएवाई (PM-JAY) ई-कार्ड।",
                    "health_scheme",
                    "[{\"label\":\"स्वास्थ्य योजनाएं देखें\",\"action\":\"schemes\"}]"
                );
            } else if ("mr".equals(lang)) {
                return new BotResponse(
                    "🏥 **आयुष्मान भारत व महात्मा जोतिराव फुले जन आरोग्य योजना**:\n" +
                    "• **लाभ**: प्रति कुटुंब प्रति वर्ष ₹५ लाखांपर्यंत मोफत व कॅशलेस वैद्यकीय उपचार.\n" +
                    "• **पात्रता**: पिवळे/केशरी रेशन कार्डधारक व आर्थिकदृष्ट्या दुर्बल कुटुंबे.\n" +
                    "• **दस्तावेज**: आधार कार्ड, रेशन कार्ड आणि आयुष्मान कार्ड.",
                    "health_scheme",
                    "[{\"label\":\"आरोग्य योजना पहा\",\"action\":\"schemes\"}]"
                );
            } else {
                return new BotResponse(
                    "🏥 **Ayushman Bharat & Health Insurance Schemes**:\n" +
                    "• **Benefits**: ₹5 Lakh cashless health insurance cover per family per year for empanelled hospitals.\n" +
                    "• **Eligibility**: BPL Card holders and SECC verified low-income families.\n" +
                    "• **Documents**: Aadhaar Card, Ration Card, Ayushman Card.",
                    "health_scheme",
                    "[{\"label\":\"View Health Schemes\",\"action\":\"schemes\"}]"
                );
            }
        }

        // 4. Grievances & Complaints
        if (lower.contains("grievance") || lower.contains("complaint") || lower.contains("track") || lower.contains("तक्रार") || lower.contains("समस्या") || lower.contains("शिकायत")) {
            if ("hi".equals(lang)) {
                return new BotResponse(
                    "📝 **जनसाथी शिकायत निवारण पोर्टल**:\n" +
                    "• आप ऑनलाइन शिकायत दर्ज कर सकते हैं या टिकट आईडी (जैसे GRV-2026-1001) से स्थिति ट्रैक कर सकते हैं।\n" +
                    "• हमारी टीम 48 घंटों के भीतर आपकी समस्या का समाधान करेगी।",
                    "grievance",
                    "[{\"label\":\"शिकायत दर्ज करें\",\"action\":\"grievance\"}]"
                );
            } else if ("mr".equals(lang)) {
                return new BotResponse(
                    "📝 **जनसाथी तक्रार निवारण मंच**:\n" +
                    "• तुम्ही तुमची तक्रार नोंदवू शकता किंवा तिकीट आयडी (उदा. GRV-2026-1001) वापरून तक्रार स्थिती शोधू शकता.\n" +
                    "• प्रशासनाकडून ४८ तासांच्या आत निराकरण केले जाईल.",
                    "grievance",
                    "[{\"label\":\"तक्रार नोंदवा\",\"action\":\"grievance\"}]"
                );
            } else {
                return new BotResponse(
                    "📝 **JanSathi Grievance Redressal Portal**:\n" +
                    "• Submit village/service complaints online or track resolution using your Ticket ID (e.g., GRV-2026-1001).\n" +
                    "• Track real-time resolution status anytime in the Grievances tab.",
                    "grievance",
                    "[{\"label\":\"File Grievance\",\"action\":\"grievance\"}]"
                );
            }
        }

        // Default General Greetings / Fallback
        if ("hi".equals(lang)) {
            return new BotResponse(
                "नमस्ते! 🚩 मैं जनसहायक डिजिटल मित्र हूं।\n" +
                "मैं आपकी क्या मदद कर सकता हूं? आप मुझसे किसान योजनाओं, छात्रवृत्ति, स्वास्थ्य योजनाओं या शिकायत के बारे में पूछ सकते हैं।",
                "greeting",
                "[{\"label\":\"योजनाएं खोजें\",\"action\":\"schemes\"},{\"label\":\"पात्रता जांचें\",\"action\":\"eligibility\"}]"
            );
        } else if ("mr".equals(lang)) {
            return new BotResponse(
                "नमस्कार! 🚩 मी जनसहाय्यक डिजिटल मित्र आहे.\n" +
                "मी तुम्हाला कशी मदत करू शकतो? तुम्ही शेतकरी योजना, शिष्यवृत्ती, आरोग्य योजना किंवा तक्रारीबाबत प्रश्न विचारू शकता.",
                "greeting",
                "[{\"label\":\"योजना शोधा\",\"action\":\"schemes\"},{\"label\":\"पात्रता तपासा\",\"action\":\"eligibility\"}]"
            );
        } else {
            return new BotResponse(
                "Hello! 🚩 I am JanSahayak Digital Assistant.\n" +
                "How can I assist you today? You can ask me about farmer schemes, scholarships, healthcare, or grievance redressal.",
                "greeting",
                "[{\"label\":\"Explore Schemes\",\"action\":\"schemes\"},{\"label\":\"Check Eligibility\",\"action\":\"eligibility\"}]"
            );
        }
    }

    private String extractJsonValue(String json, String key) {
        if (json == null) return "";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("\"" + key + "\"\\s*:\\s*\"([^\"]*)\"");
        java.util.regex.Matcher m = p.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        return "";
    }

    private String escapeJson(String raw) {
        if (raw == null) return "";
        return raw.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r");
    }

    private static class BotResponse {
        String text;
        String intent;
        String quickActions;

        BotResponse(String text, String intent, String quickActions) {
            this.text = text;
            this.intent = intent;
            this.quickActions = quickActions;
        }
    }
}
