package com.smartcrm.server;

import com.smartcrm.dao.UserDAO;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * AuthHandler — HTTP request handler for POST /api/auth/login
 *
 * Demonstrates OOP Concepts:
 *  - Interface Implementation (implements HttpHandler)
 *  - Single Responsibility Principle (only handles auth requests)
 *  - Dependency on UserDAO (DAO pattern integration)
 *  - JSON serialization without external libraries
 *
 * KTU CS OOP 2024 Scheme — SmartCRM Project
 */
public class AuthHandler implements HttpHandler {

    private final UserDAO userDAO = new UserDAO();

    /**
     * Entry point for every HTTP request hitting /api/auth/login.
     * Handles CORS preflight (OPTIONS) and the real POST login.
     *
     * @param exchange the HTTP request/response exchange object
     * @throws IOException on I/O failure
     */
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // ── CORS Headers ─────────────────────────────────────────────────────
        // Allow the React dev server (localhost:3000) to call this API
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin",  "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().add("Content-Type",                 "application/json; charset=utf-8");
        // ─────────────────────────────────────────────────────────────────────

        String method = exchange.getRequestMethod().toUpperCase();

        // Handle CORS pre-flight request
        if ("OPTIONS".equals(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // Only POST is allowed for login
        if (!"POST".equals(method)) {
            sendJson(exchange, 405, "{\"error\":\"Method Not Allowed. Use POST.\"}");
            return;
        }

        // ── Read request body ─────────────────────────────────────────────────
        String body;
        try (InputStream is = exchange.getRequestBody()) {
            body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }

        // ── Parse email and password from simple JSON ─────────────────────────
        String email    = extractJsonField(body, "email");
        String password = extractJsonField(body, "password");

        if (email == null || password == null || email.isBlank() || password.isBlank()) {
            sendJson(exchange, 400, "{\"error\":\"Both 'email' and 'password' fields are required.\"}");
            return;
        }

        // ── Authenticate via UserDAO (JDBC PreparedStatement) ─────────────────
        Map<String, String> user = userDAO.authenticate(email, password);

        if (user != null) {
            // Build avatar initials from name
            String name   = user.get("name");
            String avatar = name.length() >= 2
                            ? name.substring(0, 2).toUpperCase()
                            : name.toUpperCase();

            String json = String.format(
                "{\"success\":true,\"id\":\"%s\",\"name\":\"%s\",\"email\":\"%s\"," +
                "\"role\":\"%s\",\"designation\":\"%s\",\"avatar\":\"%s\"," +
                "\"authMethod\":\"JDBC/SQLite\",\"message\":\"Login successful\"}",
                escape(user.get("id")),
                escape(name),
                escape(user.get("email")),
                escape(user.get("role")),
                escape(user.get("designation")),
                avatar
            );
            sendJson(exchange, 200, json);
        } else {
            sendJson(exchange, 401, "{\"success\":false,\"error\":\"Invalid email or password.\"}");
        }
    }

    // ── Helper: send a JSON response ──────────────────────────────────────────
    private void sendJson(HttpExchange exchange, int statusCode, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    /**
     * Minimal JSON field extractor — parses "key":"value" or "key":value from a
     * flat JSON string without requiring an external library.
     *
     * Sufficient for the two fields we need (email, password).
     */
    private String extractJsonField(String json, String key) {
        // Look for "key":"value"
        String searchKey = "\"" + key + "\"";
        int keyIdx = json.indexOf(searchKey);
        if (keyIdx < 0) return null;

        int colonIdx = json.indexOf(':', keyIdx + searchKey.length());
        if (colonIdx < 0) return null;

        // Skip whitespace after the colon
        int valueStart = colonIdx + 1;
        while (valueStart < json.length() && Character.isWhitespace(json.charAt(valueStart))) {
            valueStart++;
        }

        if (valueStart >= json.length()) return null;

        if (json.charAt(valueStart) == '"') {
            // String value — find closing quote (naïve, no escape handling)
            int valueEnd = json.indexOf('"', valueStart + 1);
            if (valueEnd < 0) return null;
            return json.substring(valueStart + 1, valueEnd);
        } else {
            // Unquoted value — read until , or }
            int valueEnd = valueStart;
            while (valueEnd < json.length()
                   && json.charAt(valueEnd) != ','
                   && json.charAt(valueEnd) != '}') {
                valueEnd++;
            }
            return json.substring(valueStart, valueEnd).trim();
        }
    }

    /** Escapes backslash and double-quote characters for safe JSON embedding. */
    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
