import React from 'react';

const ThreatVault = ({results}) => {
    const criticals = results.filter(r => r.severity === 'Critical');

    // Remediation Logic mapping detection types to industry-standard fixes
    const getFix = (type) => {
        if (type.includes('SQL Injection')) {
            return {
                issue: "Untrusted data is being concatenated into a SQL query via string formatting.",
                fix: "Implement Parameterized Queries using 'java.sql.PreparedStatement'. This ensures the database driver treats input strictly as data, not executable code."
            };
        }
        if (type.includes('Password') || type.includes('Credential')) {
            return {
                issue: "Plaintext sensitive credentials (secrets) are embedded directly in the source code.",
                fix: "Externalize secrets using environment variables or a secure Secrets Management service like HashiCorp Vault."
            };
        }
        return {
            issue: "A potentially dangerous execution sink was identified through intra-method taint tracking.",
            fix: "Sanitize all user-controlled input and avoid high-risk methods like Runtime.exec() where possible."
        };
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b border-slate-800 pb-4 mb-8">
                <h2 className="text-2xl font-bold text-slate-100 uppercase tracking-tighter font-mono">THREAT_VAULT</h2>
                <span className="text-red-500 font-mono text-xs animate-pulse font-bold">{criticals.length} CRITICAL_FINDINGS</span>
            </div>

            <div className="space-y-4">
                {criticals.length > 0 ? criticals.map((threat) => {
                    const remediation = getFix(threat.type);
                    return (
                        <div key={threat.id} className="bg-slate-800/40 p-6 rounded-lg border border-slate-700 hover:border-red-500/50 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-red-500 font-black text-[10px] font-mono tracking-widest">DETECTION_ID: {threat.id}</span>
                                    <h3 className="text-lg font-bold text-slate-200">{threat.type}</h3>
                                </div>
                                <span className="bg-red-600/10 text-red-400 px-3 py-1 rounded text-[10px] font-bold border border-red-600/20 uppercase">Action Required</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="p-4 bg-red-900/10 rounded border border-red-900/20">
                                    <p className="text-red-400 text-[10px] font-black mb-1 uppercase">Analysis:</p>
                                    <p className="text-slate-400 text-xs italic leading-relaxed">{remediation.issue}</p>
                                </div>
                                <div className="p-4 bg-green-900/10 rounded border border-green-900/20">
                                    <p className="text-green-400 text-[10px] font-black mb-1 uppercase">Remediation Guide:</p>
                                    <p className="text-slate-300 text-xs leading-relaxed">{remediation.fix}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 text-[10px] font-mono mt-4 uppercase">Target: {threat.file} (Line: {threat.line})</p>
                        </div>
                    );
                }) : (
                    <div className="text-center py-20 bg-slate-800/10 border-2 border-dashed border-slate-800 rounded-xl">
                        <p className="text-slate-600 font-mono text-sm uppercase tracking-widest">Vault Secure. No Critical Data Indexed.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThreatVault;