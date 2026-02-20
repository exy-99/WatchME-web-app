import clsx from 'clsx';
import { Clapperboard, Film, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AppHeader = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Home', icon: Film },
        { path: '/search', label: 'Search', icon: Search },
        { path: '/saved', label: 'Saved', icon: User },
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                        <Clapperboard size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        MovieApp
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                                    active
                                        ? "bg-white/10 text-white font-medium"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Menu Icon (Placeholder) */}
                <div className="md:hidden">
                    {/* Expandable menu could go here */}
                </div>
            </div>

            {/* Mobile Bottom Nav (Optional, mimicking app) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-white/10 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                                    active ? "text-indigo-400" : "text-gray-500"
                                )}
                            >
                                <Icon size={20} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
