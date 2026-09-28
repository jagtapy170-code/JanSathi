package backend.java.handlers;

import backend.java.DbClient;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;

public class SchemeHandler extends BaseHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handleCorsOptions(exchange)) return;

        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        String query = exchange.getRequestURI().getRawQuery();
        String q = query != null ? query : "";

        if (path.endsWith("/check_duplicates")) {
            if ("POST".equalsIgnoreCase(method)) {
                String body = readRequestBody(exchange);
                String dbResponse = DbClient.post("check_duplicates", body);
                sendResponse(exchange, 200, dbResponse);
            } else {
                String dbResponse = DbClient.get("check_duplicates", q);
                sendResponse(exchange, 200, dbResponse);
            }
            return;
        }

        if (path.endsWith("/bulk_import")) {
            String body = readRequestBody(exchange);
            String dbResponse = DbClient.post("bulk_import", body);
            sendResponse(exchange, 200, dbResponse);
            return;
        }

        if ("GET".equalsIgnoreCase(method)) {
            String dbResponse = DbClient.get("get_schemes", q);
            sendResponse(exchange, 200, dbResponse);
        } else if ("POST".equalsIgnoreCase(method)) {
            String body = readRequestBody(exchange);
            String dbResponse = DbClient.post("add_scheme", body);
            sendResponse(exchange, 200, dbResponse);
        } else if ("DELETE".equalsIgnoreCase(method)) {
            String dbResponse = DbClient.get("delete_scheme", q);
            sendResponse(exchange, 200, dbResponse);
        } else {
            sendResponse(exchange, 405, "{\"status\":\"error\",\"message\":\"Method Not Allowed\"}");
        }
    }
}
