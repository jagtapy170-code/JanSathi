package backend.java.handlers;

import backend.java.DbClient;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;

public class AnnouncementsHandler extends BaseHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handleCorsOptions(exchange)) return;

        if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            String dbResponse = DbClient.get("get_announcements", "");
            sendResponse(exchange, 200, dbResponse);
        } else {
            sendResponse(exchange, 405, "{\"status\":\"error\",\"message\":\"Method Not Allowed\"}");
        }
    }
}
