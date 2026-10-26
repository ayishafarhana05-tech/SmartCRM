package com.smartcrm.server;

import java.sql.*;

/**
 * DatabaseConnection — JDBC Singleton for SmartCRM
 * 
 * Demonstrates OOP Concepts:
 *  - Singleton Pattern (only one DB connection instance)
 *  - Encapsulation (private constructor + static getInstance)
 *  - JDBC PreparedStatement usage
 * 
 * Database: SQLite (file-based, no separate DB server needed)
 * JDBC Driver: org.sqlite.JDBC (sqlite-jdbc.jar)
 * 
 * KTU CS OOP 2024 Scheme — SmartCRM Project
 */
public class DatabaseConnection {

    // SQLite file will be created in the server/ folder
    private static final String DB_URL = "jdbc:sqlite:smartcrm.db";

    // Singleton instance
    private static Connection instance = null;

    // Private constructor — prevents direct instantiation
    private DatabaseConnection() {}

    /**
     * Returns the single shared JDBC Connection.
     * Creates the connection and initialises tables on first call.
     *
     * @return active java.sql.Connection
     * @throws SQLException if the driver or file cannot be accessed
     */
    public static Connection getInstance() throws SQLException {
        if (instance == null || instance.isClosed()) {
            // Load the SQLite JDBC driver explicitly
            try {
                Class.forName("org.sqlite.JDBC");
            } catch (ClassNotFoundException e) {
                throw new SQLException("SQLite JDBC driver not found on classpath: " + e.getMessage());
            }
            instance = DriverManager.getConnection(DB_URL);
            // Ensure auto-commit is on (default, but explicit for clarity)
            instance.setAutoCommit(true);
            System.out.println("[JDBC] SQLite connection established → " + DB_URL);
            initSchema(instance);
        }
        return instance;
    }

    /**
     * Creates the users table and seeds default demo accounts
     * if the table does not yet exist.
     *
     * @param conn active Connection
     * @throws SQLException on SQL error
     */
    private static void initSchema(Connection conn) throws SQLException {
        String createUsers =
            "CREATE TABLE IF NOT EXISTS users (" +
            "  id          INTEGER PRIMARY KEY AUTOINCREMENT," +
            "  name        TEXT    NOT NULL," +
            "  email       TEXT    NOT NULL UNIQUE," +
            "  password    TEXT    NOT NULL," +
            "  role        TEXT    NOT NULL DEFAULT 'Sales Manager'," +
            "  designation TEXT," +
            "  created_at  TEXT    DEFAULT (datetime('now'))" +
            ");";
        conn.createStatement().execute(createUsers);

        // Seed default demo accounts (only if table is empty)
        ResultSet rs = conn.createStatement().executeQuery("SELECT COUNT(*) FROM users;");
        if (rs.next() && rs.getInt(1) == 0) {
            rs.close();
            String insertSql =
                "INSERT INTO users (name, email, password, role, designation) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement ps = conn.prepareStatement(insertSql);

            Object[][] seeds = {
                {"Adithya Kurian",  "admin@smartcrm.io",   "admin123",   "Admin",         "Chief Administrator"},
                {"Divya Nambiar",   "sales@smartcrm.io",   "sales123",   "Sales Manager", "Senior Sales Executive"},
                {"Meera Krishnan",  "support@smartcrm.io", "support123", "Support Lead",  "Helpdesk Team Lead"}
            };

            for (Object[] row : seeds) {
                ps.setString(1, (String) row[0]);
                ps.setString(2, (String) row[1]);
                ps.setString(3, (String) row[2]);
                ps.setString(4, (String) row[3]);
                ps.setString(5, (String) row[4]);
                ps.executeUpdate();
            }
            ps.close();
            System.out.println("[JDBC] Demo users seeded into database.");
        } else {
            rs.close();
        }

        System.out.println("[JDBC] Schema initialised successfully.");
    }

    /** Closes the singleton connection (call on server shutdown). */
    public static void close() {
        try {
            if (instance != null && !instance.isClosed()) {
                instance.close();
                System.out.println("[JDBC] Connection closed.");
            }
        } catch (SQLException e) {
            System.err.println("[JDBC] Error closing connection: " + e.getMessage());
        }
    }
}
