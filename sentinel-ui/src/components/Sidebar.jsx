import {Link, useLocation} from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const links = [
        {name: 'DASHBOARD', path: '/', icon: '📊'},
        {name: 'THREAT VAULT', path: '/threats', icon: '🛡️'}, 
        {name: 'ANALYTICS', path: '/vectors', icon: '📈'},   
    ];

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
            <h1 className="text-red-600 font-black tracking-tighter text-2xl mb-10">SENTINEL-AI</h1>
            <nav className="space-y-4">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`block p-3 rounded font-mono text-xs tracking-widest transition-all ${location.pathname === link.path
                                ? 'bg-red-600/10 text-red-500 border-l-2 border-red-500'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {link.icon} {link.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;