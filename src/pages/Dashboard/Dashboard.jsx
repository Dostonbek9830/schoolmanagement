import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, DollarSign, UserCheck, UserX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';
import { dashboardAPI } from '../../services/api';

const Dashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardAPI.getStats();
            setStats(data);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = stats ? [
        {
            title: t('dashboard_page.total_students'),
            value: stats.totalStudents.toString(),
            icon: <GraduationCap size={24} />,
            color: 'blue',
        },
        {
            title: t('dashboard_page.total_teachers'),
            value: stats.totalTeachers.toString(),
            icon: <Users size={24} />,
            color: 'purple',
        },
        {
            title: t('dashboard_page.profit'),
            value: `${stats.profit.toLocaleString()} UZS`,
            icon: <DollarSign size={24} />,
            color: 'green',
        },
        {
            title: t('dashboard_page.paid_students'),
            value: stats.paidStudents.toString(),
            icon: <UserCheck size={24} />,
            color: 'emerald',
        },
        {
            title: t('dashboard_page.unpaid_students'),
            value: stats.unpaidStudents.toString(),
            icon: <UserX size={24} />,
            color: 'red',
        }
    ] : [];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('dashboard_page.title')}</h1>
                    <p className="page-subtitle">{t('dashboard_page.subtitle')}</p>
                </div>
            </div>

            <div className="stats-grid">
                {loading ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                        <p>Loading statistics...</p>
                    </div>
                ) : error ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                        <p style={{ color: 'red' }}>Error: {error}</p>
                        <button className="btn btn-primary" onClick={fetchStats} style={{ marginTop: '1rem' }}>Retry</button>
                    </div>
                ) : (
                    statsCards.map((stat, index) => (
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
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
