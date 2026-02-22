import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ThreatVault from "./pages/ThreatVault";
import VectorAnalytics from "./pages/VectorAnalytics";
import Sidebar from "./components/Sidebar";

function App() {
 
  const [scanResults, setScanResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [rawCode, setRawCode] = useState("");

  return (
    <Router>
      <div className="flex bg-[#0f172a] min-h-screen text-slate-200">
        <Sidebar />

        <div className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  results={scanResults}
                  setResults={setScanResults}
                  isScanning={isScanning}
                  setIsScanning={setIsScanning}
                  rawCode={rawCode}
                  setRawCode={setRawCode}
                />
              }
            />
            <Route
              path="/threats"
              element={<ThreatVault results={scanResults} />}
            />
            <Route
              path="/vectors"
              element={<VectorAnalytics results={scanResults} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;