package com.smartcrm.dao;

import com.smartcrm.server.DatabaseConnection;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;

/**
 * UserDAO — Data Access Object for User authentication
 *
 * Demonstrates OOP Concepts:
 *  - DAO Design Pattern (separates DB logic from business/controller logic)
 *  - Encapsulation (SQL kept inside DAO methods)
 *  - PreparedStatement (prevents SQL Injection)
 *  - Abstraction (callers don't know SQL details)
 *
 * KTU CS OOP 2024 Scheme — SmartCRM Project
 */
public class UserDAO {

    /**
     * Authenticates a user by email and password.
     *
     * Uses PreparedStatement to prevent SQL Injection attacks.
     *
     * @param email    user's email address
     * @param password plain-text password (for academic demo; hash in production)
     * @return Map with user fields {id, name, email, role, designation}, or null if not found
     */
    public Map<String, String> authenticate(String email, String password) {
        // PreparedStatement with parameterized query — safe from SQL injection
        String sql = "SELECT id, name, email, role, designation FROM users " +
                     "WHERE email = ? AND password = ? LIMIT 1;";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email.trim().toLowerCase());
            stmt.setString(2, password);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                // Build result map — analogous to returning a User object
                Map<String, String> user = new HashMap<>();
                user.put("id",          String.valueOf(rs.getInt("id")));
                user.put("name",        rs.getString("name"));
                user.put("email",       rs.getString("email"));
                user.put("role",        rs.getString("role"));
                user.put("designation", rs.getString("designation"));
                System.out.println("[DAO] Authentication SUCCESS for: " + email);
                return user;
            }

        } catch (SQLException e) {
            System.err.println("[DAO] SQL error during authentication: " + e.getMessage());
        }

        System.out.println("[DAO] Authentication FAILED for: " + email);
        return null; // credentials not matched
    }

    /**
     * Finds a user record by email only (for profile lookup).
     *
     * @param email user's email
     * @return Map with user fields, or null if not found
     */
    public Map<String, String> findByEmail(String email) {
        String sql = "SELECT id, name, email, role, designation FROM users WHERE email = ? LIMIT 1;";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email.trim().toLowerCase());
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                Map<String, String> user = new HashMap<>();
                user.put("id",          String.valueOf(rs.getInt("id")));
                user.put("name",        rs.getString("name"));
                user.put("email",       rs.getString("email"));
                user.put("role",        rs.getString("role"));
                user.put("designation", rs.getString("designation"));
                return user;
            }

        } catch (SQLException e) {
            System.err.println("[DAO] SQL error in findByEmail: " + e.getMessage());
        }

        return null;
    }
}
