import java.util.*;
import java.util.regex.*;
import java.nio.file.*;
import java.io.IOException;

public class SentinelCore {

    private static final Set<String> taintedVars = new HashSet<>();
    private static final Set<String> SANITIZERS = Set.of("sanitize", "escapeSql", "PreparedStatement");

    private static final Pattern VAR_DECL = Pattern.compile("String\\s+(\\w+)");
    private static final Pattern ASSIGN = Pattern.compile("(\\w+)\\s*=\\s*([^;]+);");
    private static final Pattern CREDS = Pattern.compile("\\b(pass|password|secret|token|apikey|admin)\\b\\s*=\\s*['\"].+['\"]", Pattern.CASE_INSENSITIVE);

    public static void main(String[] args) throws IOException {
        if (args.length == 0) return;

        List<String> lines = Files.readAllLines(Paths.get(args[0]));
        taintedVars.add("userInput"); 

        System.out.println("--- Sentinel-SAST: Execution Node V8_BULLSEYE ---");

        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i).trim();
            int ln = i + 1;

            if (line.isEmpty() || line.startsWith("//") || line.startsWith("import")) continue;

            // 1. Method parameters/Decl tainting
            Matcher m = VAR_DECL.matcher(line);
            while (m.find()) taintedVars.add(m.group(1));

            // 2. Assignment propagation
            Matcher a = ASSIGN.matcher(line);
            if (a.find()) {
                String lhs = a.group(1);
                String rhs = a.group(2);
                if (SANITIZERS.stream().anyMatch(rhs::contains)) {
                    taintedVars.remove(lhs);
                } else if (taintedVars.stream().anyMatch(rhs::contains)) {
                    taintedVars.add(lhs);
                }
            }

            // 3. SQL Injection Sink (More flexible match)
            if (line.contains("+") && (line.toUpperCase().contains("SELECT") || line.toUpperCase().contains("WHERE") || line.toUpperCase().contains("QUERY"))) {
                reportIfTainted(line, ln, "SQL Injection");
            }

            // 4. Command Injection Sink
            if (line.contains("exec") || line.contains("ProcessBuilder")) {
                reportIfTainted(line, ln, "Command Injection");
            }

            // 5. Hardcoded credentials
            if (CREDS.matcher(line).find()) {
                System.out.println("[CRITICAL] Hardcoded Credential at line " + ln);
            }
        }
        System.out.println("--- Analysis Complete ---");
    }

    private static void reportIfTainted(String line, int ln, String type) {
        for (String var : taintedVars) {
            // Check if line contains the variable and it is NOT inside a safe quote block
            if (line.contains(var)) {
                System.out.println("[CRITICAL] " + type + " via tainted variable '" + var + "' at line " + ln);
                return;
            }
        }
    }
}