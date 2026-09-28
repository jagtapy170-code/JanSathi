package backend.java.handlers;

import backend.java.DbClient;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;

public class AuthHandler extends BaseHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handleCorsOptions(exchange)) return;

        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();
        String body = readRequestBody(exchange);

        if (path.endsWith("/login") && "POST".equalsIgnoreCase(method)) {
            String dbResponse = DbClient.post("login", body);
            sendResponse(exchange, dbResponse.contains("\"error\"") ? 401 : 200, dbResponse);
        } else if (path.endsWith("/register") && "POST".equalsIgnoreCase(method)) {
            String dbResponse = DbClient.post("register", body);
            sendResponse(exchange, dbResponse.contains("\"error\"") ? 400 : 200, dbResponse);
        } else if (path.endsWith("/reset-password") && "POST".equalsIgnoreCase(method)) {
            String dbResponse = DbClient.post("reset_password", body);
            sendResponse(exchange, dbResponse.contains("\"error\"") ? 404 : 200, dbResponse);
        } else {
            sendResponse(exchange, 404, "{\"status\":\"error\",\"message\":\"Auth route not found\"}");
        }
    }
}
