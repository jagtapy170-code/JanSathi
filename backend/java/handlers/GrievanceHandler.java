package backend.java.handlers;

import backend.java.DbClient;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;

public class GrievanceHandler extends BaseHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handleCorsOptions(exchange)) return;

        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        String query = exchange.getRequestURI().getRawQuery();

        if ("GET".equalsIgnoreCase(method)) {
            String q = query != null ? query : "";
            String dbResponse = DbClient.get("get_grievances", q);
            sendResponse(exchange, 200, dbResponse);
        } else if ("POST".equalsIgnoreCase(method)) {
            String body = readRequestBody(exchange);
            if (path.contains("/update")) {
                String dbResponse = DbClient.post("update_grievance", body);
                sendResponse(exchange, 200, dbResponse);
            } else {
                String dbResponse = DbClient.post("submit_grievance", body);
                sendResponse(exchange, 200, dbResponse);
            }
        } else {
            sendResponse(exchange, 405, "{\"status\":\"error\",\"message\":\"Method Not Allowed\"}");
        }
    }
}
