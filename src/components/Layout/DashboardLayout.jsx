import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className="mobile-header">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="mobile-logo">School Manager</div>
            </div>

            <div className={`sidebar-wrapper ${isSidebarOpen ? 'active' : ''}`}>
                <Sidebar closeMobileMenu={() => setIsSidebarOpen(false)} />
            </div>

            {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
