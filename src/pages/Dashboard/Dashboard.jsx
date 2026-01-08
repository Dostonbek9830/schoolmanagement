import React from 'react';
import { Users, GraduationCap, DollarSign, UserCheck, UserX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';

const Dashboard = () => {
    const { t } = useTranslation();

    // Mock Data
    const stats = [
        {
            title: t('dashboard_page.total_students'),
            value: '120',
            icon: <GraduationCap size={24} />,
            color: 'blue',
        },
        {
            title: t('dashboard_page.total_teachers'),
            value: '12',
            icon: <Users size={24} />,
            color: 'purple',
        },
        {
            title: t('dashboard_page.profit'),
            value: '45,000,000 UZS',
            icon: <DollarSign size={24} />,
            color: 'green',
        },
        {
            title: t('dashboard_page.paid_students'),
            value: '85',
            icon: <UserCheck size={24} />,
            color: 'emerald',
        },
        {
            title: t('dashboard_page.unpaid_students'),
            value: '35',
            icon: <UserX size={24} />,
            color: 'red',
        }
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('dashboard_page.title')}</h1>
                    <p className="page-subtitle">{t('dashboard_page.subtitle')}</p>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className={`stat-card card-${stat.color}`}>
                        <div className="stat-header">
                            <div className="stat-icon p-2 rounded-lg bg-opacity-20">
                                {stat.icon}
                            </div>
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-value">{stat.value}</h3>
                            <p className="stat-title">{stat.title}</p>
                            <p className="stat-trend">{stat.trend}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
