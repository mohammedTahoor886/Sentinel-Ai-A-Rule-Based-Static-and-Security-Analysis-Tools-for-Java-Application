import java.sql.*;

public class SecureScan {
    public void executeSecureQuery(String userInput) {
        String query = "SELECT * FROM users WHERE id = ?";
        
        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/db", "user", "pass");
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            // Using Parameterized Mapping (Secure)
            pstmt.setString(1, userInput);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                System.out.println(rs.getString("username"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}