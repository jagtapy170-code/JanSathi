package backend.java;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class DbClient {
    private static final String PHP_API_URL = "http://127.0.0.1:8000/api.php";

    public static String get(String action, String queryParams) {
        try {
            String fullUrl = PHP_API_URL + "?action=" + action + (queryParams.isEmpty() ? "" : "&" + queryParams);
            URL url = URI.create(fullUrl).toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            int responseCode = conn.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    responseCode >= 400 ? conn.getErrorStream() : conn.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder response = new StringBuilder();
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            return response.toString();
        } catch (Exception e) {
            return "{\"status\":\"error\",\"message\":\"PHP DB Connection Failed: " + e.getMessage().replace("\"", "'") + "\"}";
        }
    }

    public static String post(String action, String jsonPayload) {
        try {
            String fullUrl = PHP_API_URL + "?action=" + action;
            URL url = URI.create(fullUrl).toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json; utf-8");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);

            if (jsonPayload != null && !jsonPayload.trim().isEmpty()) {
                try (OutputStream os = conn.getOutputStream()) {
                    byte[] input = jsonPayload.getBytes(StandardCharsets.UTF_8);
                    os.write(input, 0, input.length);
                }
            }

            int responseCode = conn.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    responseCode >= 400 ? conn.getErrorStream() : conn.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder response = new StringBuilder();
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            return response.toString();
        } catch (Exception e) {
            return "{\"status\":\"error\",\"message\":\"PHP DB Connection Failed: " + e.getMessage().replace("\"", "'") + "\"}";
        }
    }
}
