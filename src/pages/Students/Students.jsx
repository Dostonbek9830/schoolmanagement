import React, { useState } from 'react';
import { Plus, Search, User } from 'lucide-react';
import './Students.css';
import StudentForm from './StudentForm';
import { exportToFile, exportToCSV } from '../../utils/exportUtils';

const Students = () => {
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // Mock data for initial view
    const [students, setStudents] = useState([
        { id: 1, firstName: 'John', lastName: 'Doe', class: 'Grade 10', parentName: 'Jane Doe', paymentStatus: 'Paid' },
        { id: 2, firstName: 'Alice', lastName: 'Smith', class: 'Grade 11', parentName: 'Bob Smith', paymentStatus: 'Due to deadline' },
        { id: 3, firstName: 'Bob', lastName: 'Johnson', class: 'Grade 12', parentName: 'Sara Johnson', paymentStatus: 'Unpaid' },
    ]);

    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Derived data for filters
    const classes = ['All', ...new Set(students.map(student => student.class))];
    const paymentStatuses = ['All', 'Paid', 'Unpaid', 'Due to deadline'];

    const handleAddStudent = (newStudent) => {
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
                    <h1 className="page-title">Students</h1>
                    <p className="page-subtitle">Manage student records and admissions</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : (
                        <>
                            <Plus size={20} />
                            Add Student
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
                                placeholder="Search students..."
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
                                    <option key={cls} value={cls}>{cls === 'All' ? 'All Classes' : cls}</option>
                                ))}
                            </select>

                            <select
                                value={selectedPaymentStatus}
                                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                className="filter-select"
                            >
                                {paymentStatuses.map(status => (
                                    <option key={status} value={status}>{status === 'All' ? 'All Payment Status' : status}</option>
                                ))}
                            </select>

                            <div className="export-dropdown">
                                <button
                                    className="btn-outline"
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                >
                                    Export
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
                                    <th>Name</th>
                                    <th>Class</th>
                                    <th>Parent Name</th>
                                    <th>Status</th>
                                    <th>Payment Status</th>
                                    <th>Actions</th>
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
                                            <td><span className="badge badge-active">Active</span></td>
                                            <td>
                                                <span className={`badge badge-payment ${student.paymentStatus === 'Paid' ? 'badge-paid' : student.paymentStatus === 'Unpaid' ? 'badge-unpaid' : 'badge-due'}`}>
                                                    {student.paymentStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn-icon">Edit</button>
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
                                                <h3>Student not found</h3>
                                                <p>Try adjusting your search or filters to find what you're looking for.</p>
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
