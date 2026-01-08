import React from 'react';
import { Users, GraduationCap, DollarSign, UserCheck, UserX } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    // Mock Data
    const stats = [
        {
            title: 'Total Students',
            value: '120',
            icon: <GraduationCap size={24} />,
            color: 'blue',
            trend: '+12% from last month'
        },
        {
            title: 'Total Teachers',
            value: '12',
            icon: <Users size={24} />,
            color: 'purple',
            trend: 'Stable'
        },
        {
            title: 'Profit',
            value: '45,000,000 UZS',
            icon: <DollarSign size={24} />,
            color: 'green',
            trend: '+8% from last month'
        },
        {
            title: 'Paid Students',
            value: '85',
            icon: <UserCheck size={24} />,
            color: 'emerald',
            trend: '70% of total'
        },
        {
            title: 'Unpaid Students',
            value: '35',
            icon: <UserX size={24} />,
            color: 'red',
            trend: 'Action needed'
        }
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Overview of school performance</p>
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
