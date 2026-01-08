import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import './Teachers.css';
import AddTeacher from './AddTeacher';

const Teachers = () => {
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('active'); // 'active' or 'terminated'

    // Mock data
    const [teachers, setTeachers] = useState([
        {
            id: 1,
            firstName: 'Sarah',
            lastName: 'Connor',
            subject: 'Mathematics',
            degree: 'Master',
            phoneNumber: '+1 234 567 8900',
            status: 'Active'
        },
        {
            id: 2,
            firstName: 'James',
            lastName: 'Cameron',
            subject: 'Science',
            degree: 'Phd',
            phoneNumber: '+1 987 654 3210',
            status: 'On Leave'
        },
        // Mock Terminated Teacher
        {
            id: 3,
            firstName: 'Arnold',
            lastName: 'Schwarzenegger',
            subject: 'Physical Education',
            degree: 'Bachelor',
            phoneNumber: '+1 555 123 4567',
            status: 'Terminated',
            terminationReason: 'Contract Expired'
        }
    ]);

    const handleAddTeacher = (newTeacher) => {
        setTeachers([...teachers, {
            ...newTeacher,
            id: teachers.length + 1,
            status: 'Active' // Default status
        }]);
        setShowForm(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            setTeachers(teachers.filter(t => t.id !== id));
        }
    };

    const getFilteredTeachers = () => {
        return teachers.filter(teacher => {
            const matchesSearch =
                `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());

            if (viewMode === 'terminated') {
                return matchesSearch && teacher.status === 'Terminated';
            }
            return matchesSearch && teacher.status !== 'Terminated';
        });
    };

    const filteredTeachers = getFilteredTeachers();

    return (
        <div className="teachers-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Teachers</h1>
                    <p className="page-subtitle">Manage school teachers</p>
                </div>
                {!showForm && viewMode === 'active' && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={20} />
                        Add Teacher
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="form-container fade-in">
                    <AddTeacher
                        onSubmit={handleAddTeacher}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            ) : (
                <div className="teachers-list fade-in">
                    <div className="search-bar-container">
                        <div className="search-bar">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by name or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="view-toggles">
                            <button
                                className={`toggle-btn ${viewMode === 'active' ? 'active' : ''}`}
                                onClick={() => setViewMode('active')}
                            >
                                Active Teachers
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'terminated' ? 'active' : ''}`}
                                onClick={() => setViewMode('terminated')}
                            >
                                Terminated
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="teachers-table">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Subject</th>
                                    <th>Degree</th>
                                    <th>Phone Number</th>
                                    <th>Status</th>
                                    {viewMode === 'terminated' && <th>Termination Reason</th>}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeachers.length > 0 ? (
                                    filteredTeachers.map(teacher => (
                                        <tr key={teacher.id}>
                                            <td>
                                                <div className="teacher-name">
                                                    {teacher.firstName} {teacher.lastName}
                                                </div>
                                            </td>
                                            <td>{teacher.subject}</td>
                                            <td>{teacher.degree}</td>
                                            <td>{teacher.phoneNumber}</td>
                                            <td>
                                                <span className={`badge ${teacher.status === 'Active' ? 'badge-active' :
                                                        teacher.status === 'Terminated' ? 'badge-terminated' : 'badge-inactive'
                                                    }`}>
                                                    {teacher.status}
                                                </span>
                                            </td>
                                            {viewMode === 'terminated' && (
                                                <td>{teacher.terminationReason}</td>
                                            )}
                                            <td>
                                                <div className="action-buttons">
                                                    {viewMode === 'active' && (
                                                        <button className="btn-icon" title="Edit">
                                                            <Edit size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn-icon delete-btn"
                                                        title="Delete"
                                                        onClick={() => handleDelete(teacher.id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={viewMode === 'terminated' ? "7" : "6"} className="text-center">
                                            No {viewMode} teachers found matching your search.
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

export default Teachers;
