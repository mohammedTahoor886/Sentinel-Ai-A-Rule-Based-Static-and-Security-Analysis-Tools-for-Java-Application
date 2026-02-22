import React from 'react';

const StatCards = ({scanResults}) => {
    const criticalCount = scanResults.filter(r => r.severity === 'Critical').length;
    const scanScore = scanResults.length === 0 ? 100 : Math.max(0, 100 - (scanResults.length * 15));

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Security Score</p>
                <div className="flex items-center gap-4">
                    <span className={`text-4xl font-mono ${scanScore > 70 ? 'text-green-500' : 'text-red-500'}`}>{scanScore}%</span>
                    <div className="flex-1 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${scanScore > 70 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${scanScore}%`}}></div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Critical Threats</p>
                <span className="text-4xl font-mono text-red-500">{criticalCount}</span>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Engine Nodes</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-slate-200 font-mono">CORE_ACTIVE</span>
                </div>
            </div>
        </div>
    );
};

export default StatCards;