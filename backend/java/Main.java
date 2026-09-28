package backend.java;

import backend.java.handlers.*;
import com.sun.net.httpserver.HttpServer;
import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class Main {
    private static final int PORT = 8080;

    public static void main(String[] args) {
        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
            String workingDir = new File(".").getAbsolutePath();

            // Register existing API handlers (Preserved)
            server.createContext("/api/auth", new AuthHandler());
            server.createContext("/api/schemes", new SchemeHandler());
            server.createContext("/api/eligibility", new EligibilityHandler());
            server.createContext("/api/grievances", new GrievanceHandler());
            server.createContext("/api/announcements", new AnnouncementsHandler());
            server.createContext("/api/notifications", new NotificationsHandler());
            server.createContext("/api/admin", new AdminHandler());
            server.createContext("/api/chatbot", new ChatbotHandler());

            // Register Interoperability API Handlers (SIR-01 to SIR-09)
            InteroperabilityApiHandler interopHandler = new InteroperabilityApiHandler();
            server.createContext("/api/profile", interopHandler);
            server.createContext("/api/consents", interopHandler);
            server.createContext("/api/connectors", interopHandler);
            server.createContext("/api/applications", interopHandler);
            server.createContext("/api/workflows", interopHandler);
            server.createContext("/api/audit", interopHandler);
            server.createContext("/api/monitoring", interopHandler);
            server.createContext("/api/mock-dept", interopHandler);

            // Static Web Content Handler (HTML, CSS, JS)
            server.createContext("/", new StaticFileHandler(workingDir));

            server.setExecutor(Executors.newFixedThreadPool(10));
            server.start();

            System.out.println("=================================================");
            System.out.println("  JanSathi Interoperability Platform Running");
            System.out.println("  Frontend & API: http://localhost:" + PORT);
            System.out.println("  PHP MySQL Data API: http://localhost:8000/api.php");
            System.out.println("=================================================");
        } catch (IOException e) {
            System.err.println("Failed to start Java server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
