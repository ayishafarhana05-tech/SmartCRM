package com.smartcrm.server;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

/**
 * CrmServer — Main entry point for the SmartCRM Java JDBC Backend
 *
 * Uses the JDK's built-in com.sun.net.httpserver.HttpServer — no Spring Boot
 * or external web framework needed. This keeps the project self-contained
 * and easy to compile and run with plain javac / java.
 *
 * Demonstrates OOP Concepts:
 *  - Class with a single responsibility (server bootstrap)
 *  - Composition (uses HttpServer, AuthHandler, DatabaseConnection)
 *  - Shutdown hook (clean resource release via Runtime.getRuntime().addShutdownHook)
 *
 * API Endpoints exposed:
 *  POST  http://localhost:8080/api/auth/login    — authenticate user via JDBC
 *  GET   http://localhost:8080/api/health        — health-check ping
 *
 * KTU CS OOP 2024 Scheme — SmartCRM Project
 */
public class CrmServer {

    private static final int PORT = 8080;

    public static void main(String[] args) throws IOException {
        System.out.println("╔══════════════════════════════════════════════════╗");
        System.out.println("║       SmartCRM — Java JDBC Backend Server        ║");
        System.out.println("║       KTU CS OOP 2024 Scheme                     ║");
        System.out.println("╚══════════════════════════════════════════════════╝");

        // ── 1. Initialise SQLite database via JDBC ────────────────────────────
        try {
            DatabaseConnection.getInstance(); // creates DB file + tables + seeds data
        } catch (Exception e) {
            System.err.println("[ERROR] Database initialisation failed: " + e.getMessage());
            System.exit(1);
        }

        // ── 2. Create HTTP server bound to all interfaces on PORT ─────────────
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // ── 3. Register route handlers ────────────────────────────────────────

        // POST /api/auth/login — JDBC-backed authentication
        server.createContext("/api/auth/login", new AuthHandler());

        // GET /api/health — simple health-check for testing connectivity
        server.createContext("/api/health", exchange -> {
            // CORS headers
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Content-Type", "application/json");

            String json = "{\"status\":\"OK\",\"server\":\"SmartCRM JDBC Backend\"," +
                          "\"database\":\"SQLite via JDBC\",\"port\":" + PORT + "}";
            byte[] bytes = json.getBytes();
            exchange.sendResponseHeaders(200, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.getResponseBody().close();
        });

        // ── 4. Thread pool executor for concurrent requests ───────────────────
        server.setExecutor(Executors.newFixedThreadPool(4));

        // ── 5. Shutdown hook — releases JDBC connection cleanly ───────────────
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\n[SERVER] Shutting down...");
            server.stop(1);
            DatabaseConnection.close();
            System.out.println("[SERVER] Goodbye!");
        }));

        // ── 6. Start the server ───────────────────────────────────────────────
        server.start();

        System.out.println();
        System.out.println("  ✓ Server running on  http://localhost:" + PORT);
        System.out.println("  ✓ Login endpoint   → POST http://localhost:" + PORT + "/api/auth/login");
        System.out.println("  ✓ Health check     → GET  http://localhost:" + PORT + "/api/health");
        System.out.println();
        System.out.println("  Demo credentials:");
        System.out.println("    admin@smartcrm.io   / admin123   (Admin)");
        System.out.println("    sales@smartcrm.io   / sales123   (Sales Manager)");
        System.out.println("    support@smartcrm.io / support123 (Support Lead)");
        System.out.println();
        System.out.println("  Press Ctrl+C to stop.");
        System.out.println("──────────────────────────────────────────────────");
    }
}
