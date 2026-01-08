import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Users, CreditCard, GraduationCap, LayoutDashboard, LogOut, UserCheck } from 'lucide-react';
import './Sidebar.css';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
    const { logout } = useAuth();
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

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
                    <span>{t('dashboard')}</span>
                </NavLink>
                <NavLink to="/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <User size={20} />
                    <span>{t('students')}</span>
                </NavLink>
                <NavLink to="/payments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <CreditCard size={20} />
                    <span>{t('payments')}</span>
                </NavLink>
                <NavLink to="/parents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    <span>{t('parents')}</span>
                </NavLink>
                <NavLink to="/teachers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <UserCheck size={20} />
                    <span>{t('teachers')}</span>
                </NavLink>
                <NavLink to="/class" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <GraduationCap size={20} />
                    <span>{t('class')}</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="language-selector">
                    <button
                        className={`lang-btn ${i18n.language === 'ru' ? 'active' : ''}`}
                        onClick={() => changeLanguage('ru')}
                    >
                        RU
                    </button>
                    <button
                        className={`lang-btn ${i18n.language === 'uz' ? 'active' : ''}`}
                        onClick={() => changeLanguage('uz')}
                    >
                        UZ
                    </button>
                    <button
                        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                        onClick={() => changeLanguage('en')}
                    >
                        EN
                    </button>
                </div>

                <div className="sidebar-divider"></div>

                <button onClick={handleLogout} className="nav-item logout-btn">
                    <LogOut size={20} />
                    <span>{t('logout')}</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
