package backend.java.handlers;

import backend.java.DbClient;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;

public class EligibilityHandler extends BaseHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handleCorsOptions(exchange)) return;

        if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            String body = readRequestBody(exchange);
            String dbResponse = DbClient.post("check_eligibility", body);
            sendResponse(exchange, 200, dbResponse);
        } else {
            sendResponse(exchange, 405, "{\"status\":\"error\",\"message\":\"Method Not Allowed\"}");
        }
    }
}
