import java.sql.*;
import java.util.Scanner;

public class VulnerableApp {
    // 1. HARDCODED SECRET (Should be flagged by Regex Signature Matching)
    private static final String API_KEY = "AIzaSyB-8932_XYZ_CONFIDENTIAL"; 

    public void processUser(String userId) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root", "password");
            
            // 2. SQL INJECTION (Should be flagged by Taint Tracking)
            // The 'userId' is an untrusted SOURCE flowing into an executeQuery SINK
            String query = "SELECT * FROM users WHERE id = '" + userId + "'";
            Statement statement = conn.createStatement();
            ResultSet rs = statement.executeQuery(query); 

            while (rs.next()) {
                System.out.println("User found: " + rs.getString("name"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void runSystemCommand(String type) {
        try {
            // 3. COMMAND INJECTION (Dangerous Sink)
            Runtime.getRuntime().exec("report_gen.sh " + type);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}