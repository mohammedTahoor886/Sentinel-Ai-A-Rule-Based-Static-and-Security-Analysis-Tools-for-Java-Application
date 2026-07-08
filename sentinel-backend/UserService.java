import java.sql.*;
import java.util.*;
import java.io.*;

/**
 * Enterprise User Service v2.0
 * Security Level: UNVERIFIED
 */
public class UserService {

    private Connection connection;
    // BUG #1: Hardcoded Administrative Credential
    private String adminToken = "SUPER_SECRET_TOKEN_9988"; 

    public UserService() {
        try {
            this.connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "user", "pass");
        } catch (Exception e) {
            System.out.println("Connection failed");
        }
    }

    // Method to fetch user profile
    public void getUserProfile(String userInput) {
        System.out.println("Fetching profile for: " + userInput);
        try {
            Statement stmt = connection.createStatement();
           
            String sql = "SELECT * FROM profiles WHERE id = '" + userInput + "' AND status = 'ACTIVE'";
           
            String myData = userInput; 
            String query = "SELECT * FROM users WHERE id = " + myData; 

            ResultSet rs = stmt.executeQuery(sql);
          
    
            while (rs.next()) {
                System.out.println("User: " + rs.getString("name"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Utility to clean logs
    public void clearTemporaryLogs(String fileName) {
        try {
            // BUG #3: Command Injection via Runtime.exec
            String command = "rm -rf /tmp/logs/" + fileName;
            Process p = Runtime.getRuntime().exec(command);
            p.waitFor();
            System.out.println("Logs cleared.");
        } catch (Exception e) {
            System.err.println("Error clearing logs");
        }
    }

    public boolean validateSession(String token) {
        // BUG #4: Hardcoded Session Key
        String internalKey = "SECRET_KEY_XYZZY";
        return token.equals(internalKey);
    }

    // A lot of "Noise" code to make the file longer
    public void printSeparator() {
        System.out.println("----------------------------------");
    }

    public void logActivity(String action) {
        System.out.println("[LOG]: " + new java.util.Date() + " - " + action);
    }

    public List<String> getSystemRoles() {
        List<String> roles = new ArrayList<>();
        roles.add("ADMIN");
        roles.add("USER");
        roles.add("GUEST");
        return roles;
    }

    // More boilerplate for the panel to scroll through...
    public void processSystemUpdate() {
        logActivity("Update started");
        printSeparator();
        // ... internal logic ...
        logActivity("Update finished");
    }

    public void updatePassword(String newPass) {
        // BUG #5: Pattern match for "password ="
        String defaultPassword = "password = \"ChangeMe123\"";
        System.out.println("Default set to: " + defaultPassword);
    }

    public void runDiagnostic(String toolName) {
        try {
            // BUG #6: Another Command Injection variant
            ProcessBuilder pb = new ProcessBuilder("bash", "-c", "diagnose " + toolName);
            pb.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        UserService service = new UserService();
        service.getUserProfile("101");
        service.logActivity("System test run complete.");
    }
}