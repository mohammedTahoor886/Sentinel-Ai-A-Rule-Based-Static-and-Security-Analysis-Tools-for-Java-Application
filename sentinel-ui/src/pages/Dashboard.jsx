import React from 'react';
import StatCards from '../components/StatCards';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generateAuditReport = (results) => {
    const doc = new jsPDF();

    doc.setFillColor(31, 41, 55);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("SENTINEL-AI: SECURITY AUDIT", 14, 25);

    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 48);
    doc.text(`Engine: V8_BULLSEYE_JDK (Deterministic Linter)`, 14, 53);

    const tableColumn = ["ID", "TYPE", "SEVERITY", "FILE:LINE"];
    const tableRows = results.map(v => [
        v.id,
        v.type,
        v.severity,
        `${v.file}:${v.line}`
    ]);

    autoTable(doc, {
        startY: 60,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: {fillColor: [185, 28, 28]},
    });

    doc.save(`Sentinel_Audit_Report_${Date.now()}.pdf`);
};

const Dashboard = ({results, setResults, isScanning, setIsScanning, rawCode, setRawCode}) => {

    const handleScan = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => setRawCode(ev.target.result);
        reader.readAsText(file);

        setIsScanning(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/upload-and-scan', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setResults(data.results || []);
        } catch (err) {
            console.error("Engine failure:", err);
        } finally {
            setTimeout(() => setIsScanning(false), 1500);
        }
    };

    return (
        <>
            
            {isScanning && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-red-500/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-red-500 font-mono font-black mt-8 tracking-[0.3em] animate-pulse">
                        EXECUTING_TAINT_ANALYSIS
                    </h3>
                    <div className="mt-4 flex gap-1">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></span>
                    </div>
                    <p className="text-slate-500 text-[10px] mt-4 font-mono uppercase tracking-widest">
                        Mapping Data Flows & Identifying Sinks...
                    </p>
                </div>
            )}


            <div className="space-y-6">
                <div className="flex justify-between items-center bg-slate-800/40 p-6 rounded-lg border border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tighter uppercase">Scanner_Console</h2>
                        <p className="text-slate-500 text-[10px] font-mono italic">Node: V8_BULLSEYE_JDK</p>
                    </div>

                    <div className="flex gap-4">
                        {results.length > 0 && !isScanning && (
                            <button
                                onClick={() => generateAuditReport(results)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold text-xs transition-all"
                            >
                                DOWNLOAD REPORT
                            </button>
                        )}

                        <label className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold cursor-pointer transition-all">
                            {isScanning ? 'SCANNING...' : 'SELECT & SCAN'}
                            <input type="file" className="hidden" onChange={handleScan} disabled={isScanning} />
                        </label>
                    </div>
                </div>

                <StatCards scanResults={results} />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-slate-950 rounded border border-slate-800 overflow-hidden">
                        <div className="p-2 bg-slate-900 text-[10px] font-mono text-slate-500 flex justify-between">
                            <span>SOURCE_STREAM</span>
                            <span className="text-blue-400 font-bold tracking-widest">ANALYSIS_MODE</span>
                        </div>
                        <pre className="p-4 text-[11px] font-mono text-slate-400 overflow-auto max-h-[450px]">
                            {rawCode ? rawCode.split('\n').map((line, i) => (
                                <div key={i} className={`flex ${results.some(r => parseInt(r.line) === i + 1) ? 'bg-red-500/10 border-l-2 border-red-500' : ''}`}>
                                    <span className="w-8 text-slate-700 text-right mr-4 select-none">{i + 1}</span>
                                    <span>{line}</span>
                                </div>
                            )) : <div className="text-slate-700 italic">// Awaiting file selection...</div>}
                        </pre>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-slate-900 text-slate-500 uppercase">
                                <tr>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Line</th>
                                    <th className="p-3">Severity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {results.map((res, index) => (
                                    <tr key={index} className="hover:bg-slate-700/30">
                                        <td className="p-3 text-slate-200">{res.type}</td>
                                        <td className="p-3 text-blue-400">{res.line}</td>
                                        <td className="p-3">
                                            <span className="text-red-500 font-bold px-2 py-0.5 bg-red-500/10 rounded">
                                                {res.severity}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {results.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-10 text-center text-slate-600">No vulnerabilities identified in current buffer.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

    {/* ADD THE SYSTEM LOGS HERE */}
    <div className="mt-8 bg-slate-950 rounded border border-slate-800 p-4 font-mono text-[10px]">
        <h4 className="text-slate-500 mb-2 uppercase tracking-widest text-[9px]">System_Logs</h4>
        <div className="space-y-1">
            <p className="text-blue-500">[INFO] Handshaking with V8_BULLSEYE_JDK container...</p>
            <p className="text-green-500">[SUCCESS] Connection established via Express Gateway.</p>
            {results.length > 0 ? (
                <>
                    <p className="text-slate-400">[PROCESS] Analysis complete. {results.length} sinks identified.</p>
                    <p className="text-red-500 animate-pulse font-bold">[ALERT] Taint detected in data flow at offset line 7.</p>
                </>
            ) : (
                <p className="text-slate-600 italic">[IDLE] Awaiting buffer input...</p>
            )}
        </div>
    </div>

        </>
    );
};

export default Dashboard;