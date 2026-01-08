import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, User } from 'lucide-react';
import './Students.css';
import StudentForm from './StudentForm';
import { exportToFile, exportToCSV } from '../../utils/exportUtils';

const Students = () => {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // Mock data for initial view
    const [students, setStudents] = useState([
        { id: 1, firstName: 'Dostonbek', lastName: 'Yoqubov', class: '10-sinf', parentName: 'Dostonbek Bekmatov', paymentStatus: 'Paid' },
        { id: 2, firstName: 'Anvar', lastName: 'Oripov', class: '11-sinf', parentName: 'Tolibjon Hakimov', paymentStatus: 'Due to deadline' },
        { id: 3, firstName: 'Doston', lastName: 'Bekmatov', class: '12-sinf', parentName: 'Eldor Tursunov', paymentStatus: 'Unpaid' },
    ]);

    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Derived data for filters
    const classes = ['All', ...new Set(students.map(student => student.class))];
    const paymentStatuses = ['All', 'Paid', 'Unpaid', 'Due to deadline'];

    const handleAddStudent = (newStudent) => {
        console.log(newStudent);
        setStudents([...students, { ...newStudent, id: students.length + 1 }]);
        setShowForm(false);
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.parentName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesClass = selectedClass === 'All' || student.class === selectedClass;
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
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>{t('common.name')}</th>
                                    <th>{t('common.class')}</th>
                                    <th>{t('common.parent_name')}</th>
                                    <th>{t('common.status')}</th>
                                    <th>{t('common.payment_status')}</th>
                                    <th>{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map(student => (
                                        <tr key={student.id}>
                                            <td>
                                                <div className="student-cell">
                                                    <div className="avatar-placeholder">
                                                        {student.firstName[0]}{student.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="student-name">{student.firstName} {student.lastName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{student.class}</td>
                                            <td>{student.parentName}</td>
                                            <td><span className="badge badge-active">{t('common.active')}</span></td>
                                            <td>
                                                <span className={`badge badge-payment ${student.paymentStatus === 'Paid' ? 'badge-paid' : student.paymentStatus === 'Unpaid' ? 'badge-unpaid' : 'badge-due'}`}>
                                                    {student.paymentStatus === 'Paid' ? t('payment_statuses.paid') :
                                                        student.paymentStatus === 'Unpaid' ? t('payment_statuses.unpaid') :
                                                            t('payment_statuses.due_to_deadline')}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn-icon">{t('common.edit')}</button>
                                            </td>
                                        </tr>
                                    ))
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
