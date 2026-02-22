# Sentinel-Ai-A-Rule-Based-Static-and-Security-Analysis-Tools-for-Java-Application
# Sentinel-AI: Rule-Based Static Security Analysis

Sentinel-AI is a SAST (Static Application Security Testing) tool designed to detect OWASP Top 10 vulnerabilities in Java applications using Intra-method Taint Tracking.

## 🛠️ Tech Stack
- **Analysis Core**: Java (Taint Tracking Engine)
- **Backend**: Node.js / Express
- **Frontend**: React.js / Tailwind CSS
- **Deployment**: Docker & Docker-Compose

## 🚀 How to Run the Demo
1. **Clone**: `git clone [Link]`
2. **Environment**: Ensure Docker Desktop is running.
3. **Launch**: Run `docker-compose up --build` in the root directory.
4. **Access**: Open `http://localhost:3000` in your browser.

## 🛡️ Key Features
- **Deterministic Logic**: Uses a HashSet to track variable states.
- **Line-Level Detection**: Pinpoints exact source and sink locations.
- **Actionable Reports**: Generates remediation suggestions for developers.
