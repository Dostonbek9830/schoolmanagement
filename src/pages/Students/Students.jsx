import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, User, Trash2 } from 'lucide-react';
import './Students.css';
import StudentForm from './StudentForm';
import { exportToFile, exportToCSV } from '../../utils/exportUtils';
import { studentsAPI } from '../../services/api';

const Students = () => {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Fetch students from backend on component mount
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await studentsAPI.getAll();
            setStudents(data);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch students:', err);
        } finally {
            setLoading(false);
        }
    };

    // Derived data for filters
    const classes = ['All', ...new Set(students.map(student => student.grade || student.class))];
    const paymentStatuses = ['All', 'Paid', 'Unpaid', 'Due to deadline'];

    const handleAddStudent = async (newStudent) => {
        try {
            const createdStudent = await studentsAPI.create(newStudent);
            setStudents([createdStudent, ...students]);
            setShowForm(false);
        } catch (err) {
            alert('Failed to add student: ' + err.message);
            console.error('Error adding student:', err);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!confirm(t('students_page.confirm_delete') || 'Are you sure you want to delete this student?')) {
            return;
        }

        try {
            await studentsAPI.delete(id);
            setStudents(students.filter(s => s.id !== id));
        } catch (err) {
            alert('Failed to delete student: ' + err.message);
            console.error('Error deleting student:', err);
        }
    };

    const filteredStudents = students.filter(student => {
        const name = student.name || `${student.firstName} ${student.lastName}`;
        const grade = student.grade || student.class;
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesClass = selectedClass === 'All' || grade === selectedClass;
        const matchesPayment = selectedPaymentStatus === 'All' || student.paymentStatus === selectedPaymentStatus;

        return matchesSearch && matchesClass && matchesPayment;
    });

    const handleExport = (format) => {
        const dataToExport = filteredStudents.map(s => ({
            "ID": s.id,
            "First Name": s.firstName,
            "Last Name": s.lastName,
            "Class": s.class,
            "Parent Name": s.parentName,
            "Payment Status": s.paymentStatus || 'N/A'
        }));

        if (format === 'excel') {
            exportToFile(dataToExport, 'students_list');
        } else {
            exportToCSV(dataToExport, 'students_list');
        }
        setShowExportMenu(false);
    };

    return (
        <div className="students-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('students_page.title')}</h1>
                    <p className="page-subtitle">{t('students_page.subtitle')}</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? t('common.cancel') : (
                        <>
                            <Plus size={20} />
                            {t('students_page.add_title')}
                        </>
                    )}
                </button>
            </div>

            {showForm ? (
                <div className="form-container fade-in">
                    <StudentForm onSubmit={handleAddStudent} />
                </div>
            ) : (
                <div className="students-list fade-in">
                    {/* Filters and Search */}
                    <div className="filters-bar">
                        <div className="search-bar">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder={t('students_page.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="filter-select"
                            >
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls === 'All' ? t('students_page.filter_all_classes') : cls}</option>
                                ))}
                            </select>

                            <select
                                value={selectedPaymentStatus}
                                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                className="filter-select"
                            >
                                {paymentStatuses.map(status => (
                                    <option key={status} value={status}>
                                        {status === 'All' ? t('students_page.filter_all_payment') :
                                            status === 'Paid' ? t('payment_statuses.paid') :
                                                status === 'Unpaid' ? t('payment_statuses.unpaid') :
                                                    t('payment_statuses.due_to_deadline')}
                                    </option>
                                ))}
                            </select>

                            <div className="export-dropdown">
                                <button
                                    className="btn-outline"
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                >
                                    {t('students_page.export')}
                                </button>
                                {showExportMenu && (
                                    <div className="dropdown-menu">
                                        <button onClick={() => handleExport('excel')}>Excel</button>
                                        <button onClick={() => handleExport('csv')}>CSV</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        {loading ? (
                            <div className="empty-state">
                                <p>Loading students...</p>
                            </div>
                        ) : error ? (
                            <div className="empty-state">
                                <p style={{ color: 'red' }}>Error: {error}</p>
                                <button className="btn btn-primary" onClick={fetchStudents}>Retry</button>
                            </div>
                        ) : (
                            <table className="students-table">
                                <thead>
                                    <tr>
                                        <th>{t('common.name')}</th>
                                        <th>{t('common.class')}</th>
                                        <th>Phone</th>
                                        <th>{t('common.status')}</th>
                                        <th>{t('common.payment_status')}</th>
                                        <th>{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map(student => {
                                            const displayName = student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim();
                                            const displayGrade = student.grade || student.class || 'N/A';
                                            const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

                                            return (
                                                <tr key={student.id}>
                                                    <td>
                                                        <div className="student-cell">
                                                            <div className="avatar-placeholder">
                                                                {initials}
                                                            </div>
                                                            <div>
                                                                <div className="student-name">{displayName}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{displayGrade}</td>
                                                    <td>{student.phone || 'N/A'}</td>
                                                    <td><span className="badge badge-active">{t('common.active')}</span></td>
                                                    <td>
                                                        <span className={`badge badge-payment ${student.paymentStatus === 'Paid' ? 'badge-paid' : student.paymentStatus === 'Unpaid' ? 'badge-unpaid' : 'badge-due'}`}>
                                                            {student.paymentStatus === 'Paid' ? t('payment_statuses.paid') :
                                                                student.paymentStatus === 'Unpaid' ? t('payment_statuses.unpaid') :
                                                                    t('payment_statuses.due_to_deadline')}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn-icon"
                                                            onClick={() => handleDeleteStudent(student.id)}
                                                            style={{ color: '#ef4444' }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="empty-state">
                                                    <div className="empty-icon">
                                                        <Search size={48} />
                                                    </div>
                                                    <h3>{t('students_page.not_found_title')}</h3>
                                                    <p>{t('students_page.not_found_desc')}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
