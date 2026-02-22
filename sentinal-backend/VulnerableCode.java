public class VulnerableCode {
    public void processData(String inputId, String userCommand) {
        // 1. SQL Injection (Should flag on Line 4)
        // Detected because 'inputId' is now auto-tainted
        String query = "SELECT * FROM users WHERE id = " + inputId; 
        
        // 2. Hardcoded Password (Should flag on Line 7)
        // Detected because we added 'pass' to the regex
        String Password = "admin123"; 

        // 3. Command Injection (Should flag on Line 10)
        // Detected because 'userCommand' is now auto-tainted
        try {
            Runtime.getRuntime().exec(userCommand); 
        } catch(Exception e) {}
    }
}