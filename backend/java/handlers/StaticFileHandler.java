package backend.java.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;

public class StaticFileHandler implements HttpHandler {
    private final String baseDir;

    public StaticFileHandler(String baseDir) {
        this.baseDir = baseDir;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        if (path.equals("/")) {
            path = "/index.html";
        }

        Path filePath = Paths.get(baseDir, path).normalize();
        File file = filePath.toFile();

        // Security check: ensure path is within baseDir
        if (!file.exists() || !file.getCanonicalPath().startsWith(new File(baseDir).getCanonicalPath())) {
            String resp = "404 File Not Found";
            exchange.sendResponseHeaders(404, resp.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(resp.getBytes());
            }
            return;
        }

        String mime = getMimeType(file.getName());
        exchange.getResponseHeaders().set("Content-Type", mime);
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(200, file.length());

        try (FileInputStream fis = new FileInputStream(file); OutputStream os = exchange.getResponseBody()) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
        }
    }

    private String getMimeType(String filename) {
        if (filename.endsWith(".html")) return "text/html; charset=UTF-8";
        if (filename.endsWith(".css")) return "text/css; charset=UTF-8";
        if (filename.endsWith(".js")) return "application/javascript; charset=UTF-8";
        if (filename.endsWith(".json")) return "application/json; charset=UTF-8";
        if (filename.endsWith(".png")) return "image/png";
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
        if (filename.endsWith(".svg")) return "image/svg+xml";
        return "text/plain";
    }
}
