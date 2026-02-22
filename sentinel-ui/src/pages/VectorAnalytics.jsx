import React from 'react';

const VectorAnalytics = ({results}) => {
    const total = results.length;

    // Mapping the Java Engine types to security categories
    const categories = {
        "Injection Vectors": results.filter(r => r.type.includes('Injection')).length,
        "Broken Access Control": results.filter(r => r.type.includes('Access') || r.type.includes('Auth')).length,
        "Sensitive Data Leaks": results.filter(r => r.type.includes('Password') || r.type.includes('Token')).length,
        "Miscellaneous Sinks": results.filter(r => !r.type.includes('Injection') && !r.type.includes('Access')).length,
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-700">
            <div className="border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase font-mono">VECTOR_DISTRIBUTION</h2>
                <p className="text-slate-500 text-xs font-mono italic">Analysis of {total} identified vulnerabilities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-800/20 p-6 rounded-xl border border-slate-700 space-y-6">
                    {Object.entries(categories).map(([name, count]) => (
                        <div key={name}>
                            <div className="flex justify-between text-[10px] font-mono mb-2">
                                <span className="text-slate-400">{name.toUpperCase()}</span>
                                <span className="text-red-500 font-bold">{count}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${count > 0 ? 'bg-red-600' : 'bg-slate-800'}`}
                                    style={{width: total > 0 ? `${(count / total) * 100}%` : '0%'}}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-red-900/10 p-8 rounded-xl border border-red-900/20 flex flex-col justify-center text-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Risk_Index</p>
                    <h4 className={`text-6xl font-black font-mono ${total > 0 ? 'text-red-600 animate-pulse' : 'text-green-500'}`}>
                        {total > 10 ? 'CRIT' : total > 0 ? 'WARN' : 'SAFE'}
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default VectorAnalytics;