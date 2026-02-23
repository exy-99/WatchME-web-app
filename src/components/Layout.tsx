import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppHeader from './AppHeader';
import PageTransition from './ui/PageTransition';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white font-sans">
            <AppHeader />
            <main className="container mx-auto px-4 py-6 pb-24">
                <AnimatePresence mode="wait">
                    <PageTransition key={location.pathname}>
                        <Outlet />
                    </PageTransition>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
