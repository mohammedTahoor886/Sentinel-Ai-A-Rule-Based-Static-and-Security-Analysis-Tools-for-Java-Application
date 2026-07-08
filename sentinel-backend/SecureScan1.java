import java.sql.*;
import java.util.regex.Pattern;

public class SecureApp {
    // 1. SECURE SECRET (Fetched from Environment, not hardcoded)
    private static final String API_KEY = System.getenv("SECURE_API_KEY");

    public void processUser(String userId) {
        // Validation: Ensure userId is strictly alphanumeric (Sanitization)
        if (!Pattern.matches("^[a-zA-Z0-9]+$", userId)) {
            return; 
        }

        String query = "SELECT * FROM users WHERE id = ?";
        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "user", "pass");
             // 2. PREPARED STATEMENT (Prevents SQL Injection)
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, userId);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                System.out.println("User found: " + rs.getString("name"));
            }
        } catch (SQLException e) {
            System.err.println("Database error occurred.");
        }
    }

    public void runSystemCommand(String type) {
        // 3. NO RUNTIME EXEC (Avoids Command Injection by using safe logic)
        if ("PDF".equals(type) || "CSV".equals(type)) {
            System.out.println("Generating " + type + " report...");
        }
    }
}