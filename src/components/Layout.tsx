import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white font-sans">
            <AppHeader />
            <main className="container mx-auto px-4 py-6 pb-24">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
