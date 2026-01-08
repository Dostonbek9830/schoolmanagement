import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Users, CreditCard, GraduationCap, LayoutDashboard, LogOut } from 'lucide-react';
import './Sidebar.css';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    // Using a function related to the user intent
    const handleLogout = async () => {
        try {
            // Assuming logout is async or just void
            if (logout) await logout();
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">
                    <GraduationCap size={32} color="#fff" />
                </div>
                <h2>School Manager</h2>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <User size={20} />
                    <span>Students</span>
                </NavLink>
                <NavLink to="/payments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <CreditCard size={20} />
                    <span>Payments</span>
                </NavLink>
                <NavLink to="/parents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    <span>Parents</span>
                </NavLink>
                <NavLink to="/class" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <GraduationCap size={20} />
                    <span>Class</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="nav-item logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
