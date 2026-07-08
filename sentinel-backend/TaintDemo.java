import java.sql.*;

public class TaintDemo {
    public void executeQuery(String userInput) {
        try {
            // Line 5: Reassignment (Taint Propagation)
            String myData = userInput; 
            
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/db", "root", "");
            Statement stmt = conn.createStatement();
            
            // Line 7: The Sink (Should be flagged by Sentinel-AI)
            ResultSet rs = stmt.executeQuery("SELECT * FROM users WHERE id = " + myData); 
            
            while (rs.next()) {
                System.out.println(rs.getString("username"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}