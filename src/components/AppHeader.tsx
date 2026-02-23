import clsx from 'clsx';
import { Clapperboard, Film, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const AppHeader = () => {
    const location = useLocation();
    const prefersReducedMotion = useReducedMotion();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Home', icon: Film },
        { path: '/search', label: 'Search', icon: Search },
        { path: '/saved', label: 'Saved', icon: User },
    ];

    return (
        <header
            className="sticky top-0 z-50 border-b"
            style={{
                background: 'rgba(10, 10, 15, 0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.06)',
            }}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED] rounded-lg"
                    aria-label="WatchMe Home"
                >
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform"
                        style={{
                            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                            boxShadow: '0 0 24px rgba(124, 58, 237, 0.4)',
                        }}
                    >
                        <Clapperboard size={20} className="text-white" />
                    </div>
                    <span className="font-display text-2xl tracking-wider text-white">
                        WatchMe
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-2 relative">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <div key={item.path} className="relative">
                                {active && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                                        }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                            duration: prefersReducedMotion ? 0.01 : 0.3,
                                        }}
                                    />
                                )}
                                <Link
                                    to={item.path}
                                    className={clsx(
                                        'flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-200 relative z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]',
                                        active
                                            ? 'text-white font-medium'
                                            : 'text-text-muted hover:text-white hover:bg-white/10'
                                    )}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            </div>
                        );
                    })}
                </nav>

                {/* Mobile Menu Icon (Placeholder) */}
                <div className="md:hidden">
                    {/* Expandable menu could go here */}
                </div>
            </div>

            {/* Mobile Floating Pill Nav */}
            <nav
                className="md:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-4 py-2 rounded-full border"
                style={{
                    background: 'rgba(20, 20, 32, 0.9)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
                role="navigation"
                aria-label="Mobile navigation"
            >
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <motion.div
                            key={item.path}
                            className="relative"
                            whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                        >
                            {active && (
                                <motion.div
                                    layoutId="mobile-active-pill"
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30,
                                        duration: prefersReducedMotion ? 0.01 : 0.3,
                                    }}
                                />
                            )}
                            <Link
                                to={item.path}
                                className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
                                aria-current={active ? 'page' : undefined}
                            >
                                <Icon size={20} className={active ? 'text-white' : 'text-gray-500'} />
                                {active && (
                                    <motion.span
                                        initial={{ opacity: 0, width: prefersReducedMotion ? 'auto' : 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: prefersReducedMotion ? 'auto' : 0 }}
                                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                                        className="text-sm font-medium text-white whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>
        </header>
    );
};

export default AppHeader;
