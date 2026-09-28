package backend.java.handlers;

import backend.java.connectors.*;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;

public class InteroperabilityApiHandler extends BaseHandler {

    private final EducationConnector educationConn = new EducationConnector();
    private final AgricultureConnector agricultureConn = new AgricultureConnector();
    private final HealthcareConnector healthcareConn = new HealthcareConnector();
    private final TransportConnector transportConn = new TransportConnector();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handleCorsOptions(exchange)) return;

        String path = exchange.getRequestURI().getPath();
        String query = exchange.getRequestURI().getQuery();
        String method = exchange.getRequestMethod();

        // 1. UNIFIED CITIZEN PROFILE (SIR-02)
        if (path.startsWith("/api/profile")) {
            String citizenId = getQueryParam(query, "citizen_id", "CIT-1001");
            if ("POST".equalsIgnoreCase(method)) {
                sendResponse(exchange, 200, "{\"success\":true,\"status\":\"success\",\"message\":\"Unified citizen profile updated successfully under SIR-02.\"}");
            } else {
                sendResponse(exchange, 200, "{\"success\":true,\"profile\":{\"citizen_id\":\"" + citizenId + "\",\"name\":\"Sunita Kamble\",\"age\":34,\"education\":\"12th Pass\",\"category_caste\":\"SC\",\"address\":\"Ward No 3, Janpuri\",\"state\":\"Maharashtra\",\"district\":\"Solapur\",\"occupation\":\"Citizen\",\"mobile\":\"9812345678\",\"email\":\"sunita.citizen@jansathi.in\",\"annual_income\":120000,\"land_holding\":0.0,\"aadhaar_verified\":true}}");
            }
            return;
        }

        // 2. CONSENT MANAGEMENT (SIR-03)
        if (path.startsWith("/api/consents")) {
            String citizenId = getQueryParam(query, "citizen_id", "CIT-1001");
            if ("POST".equalsIgnoreCase(method)) {
                sendResponse(exchange, 200, "{\"success\":true,\"status\":\"success\",\"message\":\"Consent updated under SIR-03.\"}");
            } else {
                sendResponse(exchange, 200, "{\"success\":true,\"consents\":[{\"id\":1,\"citizen_id\":\"" + citizenId + "\",\"department\":\"Education Department\",\"data_requested\":\"Name, Age, Income, Education\",\"purpose\":\"Scholarship eligibility verification\",\"status\":\"ALLOWED\"},{\"id\":2,\"citizen_id\":\"" + citizenId + "\",\"department\":\"Agriculture Department\",\"data_requested\":\"Name, Address, Land Holding\",\"purpose\":\"PM-Kisan & Fasal Bima Subsidy\",\"status\":\"ALLOWED\"},{\"id\":3,\"citizen_id\":\"" + citizenId + "\",\"department\":\"Healthcare Department\",\"data_requested\":\"Name, Age, Gender, Mobile\",\"purpose\":\"Ayushman Bharat Health Card\",\"status\":\"ALLOWED\"},{\"id\":4,\"citizen_id\":\"" + citizenId + "\",\"department\":\"Transport Department\",\"data_requested\":\"Name, Age, Education Proof\",\"purpose\":\"MSRTC Bus Pass\",\"status\":\"ALLOWED\"}]}");
            }
            return;
        }

        // 3. DEPARTMENT CONNECTORS (SIR-05 & SIR-01)
        if (path.startsWith("/api/connectors")) {
            String dept = getQueryParam(query, "dept", "education");
            String citizenId = getQueryParam(query, "citizen_id", "CIT-1001");
            String ssoToken = getQueryParam(query, "sso_token", "JS-SSO-TOKEN-1001");
            String consentToken = getQueryParam(query, "consent_token", "ALLOWED");

            if ("education".equalsIgnoreCase(dept)) {
                sendResponse(exchange, 200, educationConn.getCitizenData(citizenId, ssoToken, consentToken));
            } else if ("agriculture".equalsIgnoreCase(dept)) {
                sendResponse(exchange, 200, agricultureConn.getCitizenData(citizenId, ssoToken, consentToken));
            } else if ("healthcare".equalsIgnoreCase(dept)) {
                sendResponse(exchange, 200, healthcareConn.getCitizenData(citizenId, ssoToken, consentToken));
            } else if ("transport".equalsIgnoreCase(dept)) {
                sendResponse(exchange, 200, transportConn.getCitizenData(citizenId, ssoToken, consentToken));
            } else {
                sendResponse(exchange, 200, "{\"success\":true,\"connectors\":[\"EducationConnector\",\"AgricultureConnector\",\"HealthcareConnector\",\"TransportConnector\"]}");
            }
            return;
        }

        // 4. UNIFIED APPLICATION TRACKING (SIR-06)
        if (path.startsWith("/api/applications")) {
            String citizenId = getQueryParam(query, "citizen_id", "CIT-1001");
            if ("POST".equalsIgnoreCase(method)) {
                String appId = "APP-" + (1000 + (int)(Math.random() * 9000));
                sendResponse(exchange, 200, "{\"success\":true,\"application_id\":\"" + appId + "\",\"status\":\"SUBMITTED\",\"message\":\"Application submitted across integrated systems.\"}");
            } else {
                sendResponse(exchange, 200, "{\"success\":true,\"applications\":[{\"application_id\":\"EDU1024\",\"citizen_id\":\"" + citizenId + "\",\"department\":\"Education Department\",\"scheme_service\":\"Post-Matric Scholarship\",\"submission_date\":\"2026-09-15\",\"status\":\"UNDER_REVIEW\"},{\"application_id\":\"AGR2045\",\"citizen_id\":\"" + citizenId + "\",\"department\":\"Agriculture Department\",\"scheme_service\":\"PM-Kisan Samman Nidhi\",\"submission_date\":\"2026-09-10\",\"status\":\"APPROVED\"},{\"application_id\":\"HLT3056\",\"citizen_id\":\"" + citizenId + "\",\"department\":\"Healthcare Department\",\"scheme_service\":\"Ayushman Bharat Card\",\"submission_date\":\"2026-09-20\",\"status\":\"SUBMITTED\"},{\"application_id\":\"TRP4088\",\"citizen_id\":\"" + citizenId + "\",\"department\":\"Transport Department\",\"scheme_service\":\"MSRTC Concession Pass\",\"submission_date\":\"2026-09-18\",\"status\":\"COMPLETED\"}]}");
            }
            return;
        }

        // 5. WORKFLOW ENGINE (SIR-07)
        if (path.startsWith("/api/workflows")) {
            String appId = getQueryParam(query, "application_id", "EDU1024");
            sendResponse(exchange, 200, "{\"success\":true,\"application_id\":\"" + appId + "\",\"workflow\":[{\"stage\":\"SUBMITTED\",\"by\":\"Citizen Portal\",\"comments\":\"Application lodged online\"},{\"stage\":\"UNDER_VERIFICATION\",\"by\":\"Automated Engine\",\"comments\":\"Verified Aadhaar and Income Certificate\"},{\"stage\":\"UNDER_REVIEW\",\"by\":\"Nodal Officer\",\"comments\":\"College income endorsement verified\"}]}");
            return;
        }

        // 6. AUDIT LOGS (SIR-08)
        if (path.startsWith("/api/audit")) {
            sendResponse(exchange, 200, "{\"success\":true,\"audit_logs\":[{\"user_id\":\"CIT-1001\",\"role\":\"Citizen\",\"action\":\"Login\",\"resource\":\"JanSathi SSO\",\"timestamp\":\"2026-09-28 08:30:00\",\"status\":\"SUCCESS\",\"details\":\"SSO authentication via JanSathi Credential Manager\"},{\"user_id\":\"CIT-1001\",\"role\":\"Citizen\",\"action\":\"Consent Given\",\"resource\":\"Consent\",\"department\":\"Education Department\",\"timestamp\":\"2026-09-28 08:35:00\",\"status\":\"SUCCESS\",\"details\":\"Granted access for Post-Matric Scholarship\"},{\"user_id\":\"CIT-1001\",\"role\":\"Citizen\",\"action\":\"Application Submitted\",\"resource\":\"Application\",\"resource_id\":\"EDU1024\",\"department\":\"Education Department\",\"timestamp\":\"2026-09-28 08:40:00\",\"status\":\"SUCCESS\",\"details\":\"Submitted via EducationConnector\"}]}");
            return;
        }

        // 7. INTEGRATION MONITORING (SIR-09)
        if (path.startsWith("/api/monitoring")) {
            sendResponse(exchange, 200, "{\"success\":true,\"metrics\":{\"availability\":\"99.85%\",\"avg_response_ms\":42,\"total_requests\":1250,\"successful_requests\":1232,\"failed_requests\":18,\"pending_requests\":7,\"connectors\":[{\"code\":\"EducationConnector\",\"status\":\"CONNECTED\",\"latency_ms\":45},{\"code\":\"AgricultureConnector\",\"status\":\"CONNECTED\",\"latency_ms\":62},{\"code\":\"HealthcareConnector\",\"status\":\"CONNECTED\",\"latency_ms\":38},{\"code\":\"TransportConnector\",\"status\":\"CONNECTED\",\"latency_ms\":51}]}}");
            return;
        }

        // 8. MOCK GOVERNMENT DEPARTMENT APIS (SIR-01)
        if (path.startsWith("/api/mock-dept/education")) {
            sendResponse(exchange, 200, "{\"success\":true,\"department\":\"Education Department\",\"verified\":true,\"enrollment_no\":\"BE-2024-991\",\"scholarship_eligible\":true}");
            return;
        }
        if (path.startsWith("/api/mock-dept/agriculture")) {
            sendResponse(exchange, 200, "{\"success\":true,\"department\":\"Agriculture Department\",\"verified\":true,\"kisan_id\":\"PMK-9921-MAH\",\"land_record_712\":\"3.5 Acres Verified\"}");
            return;
        }
        if (path.startsWith("/api/mock-dept/healthcare")) {
            sendResponse(exchange, 200, "{\"success\":true,\"department\":\"Healthcare Department\",\"verified\":true,\"abha_id\":\"sunita@abha\",\"health_cover\":\"₹5,00,000 Active\"}");
            return;
        }
        if (path.startsWith("/api/mock-dept/transport")) {
            sendResponse(exchange, 200, "{\"success\":true,\"department\":\"Transport Department\",\"verified\":true,\"pass_no\":\"TRP-MSRTC-4410\",\"discount\":\"100% Free Travel Pass\"}");
            return;
        }

        // Default response
        sendResponse(exchange, 200, "{\"success\":true,\"platform\":\"JanSathi Interoperability Platform\",\"version\":\"2.0.0\"}");
    }

    private String getQueryParam(String query, String param, String defaultValue) {
        if (query == null || query.isEmpty()) return defaultValue;
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] kv = pair.split("=");
            if (kv.length > 1 && kv[0].equalsIgnoreCase(param)) {
                return kv[1];
            }
        }
        return defaultValue;
    }
}
