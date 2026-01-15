import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Trash2, Edit2, X } from 'lucide-react';
import { classesAPI } from '../../services/api';
import '../Students/Students.css';
import './Class.css';

const Class = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [selectedClass, setSelectedClass] = useState(null);
    const [classStudents, setClassStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [studentsError, setStudentsError] = useState(null);
    const [formData, setFormData] = useState({
        className: '',
        gradeLevel: 0,
        teacherName: '',
        roomNumber: ''
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await classesAPI.getAll();
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'gradeLevel' ? parseInt(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClass) {
                await classesAPI.update(editingClass.id, formData);
            } else {
                await classesAPI.create(formData);
            }
            setIsModalOpen(false);
            setEditingClass(null);
            setFormData({ className: '', gradeLevel: 0, teacherName: '', roomNumber: '' });
            fetchClasses();
        } catch (error) {
            console.error('Error saving class:', error);
            alert('Failed to save class: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (classData) => {
        setEditingClass(classData);
        setFormData({
            className: classData.className,
            gradeLevel: classData.gradeLevel,
            teacherName: classData.teacherName || '',
            roomNumber: classData.roomNumber || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this class? Students will be unassigned.')) {
            try {
                await classesAPI.delete(id);
                fetchClasses();
            } catch (error) {
                console.error('Error deleting class:', error);
            }
        }
    };

    const handleViewStudents = async (classId) => {
        try {
            setStudentsLoading(true);
            setStudentsError(null);
            const data = await classesAPI.getById(classId);
            setSelectedClass(data);
            setClassStudents(data.students || []);
        } catch (error) {
            console.error('Error fetching class students:', error);
            setStudentsError(error.message);
        } finally {
            setStudentsLoading(false);
        }
    };

    const closeStudentsModal = () => {
        setSelectedClass(null);
        setClassStudents([]);
        setStudentsError(null);
    };

    const grades = ['All', ...new Set(classes.map(cls => cls.gradeLevel))];

    const filteredClasses = classes.filter(cls => {
        const name = cls.className || '';
        const teacher = cls.teacherName || '';
        const room = cls.roomNumber || '';
        const matchesSearch = `${name} ${teacher} ${room}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = selectedGrade === 'All' || cls.gradeLevel === Number(selectedGrade);
        return matchesSearch && matchesGrade;
    });

    return (
        <div className="class-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Class Management</h1>
                    <p className="page-subtitle">Manage class sections and student assignments</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingClass(null);
                        setFormData({ className: '', gradeLevel: 0, teacherName: '', roomNumber: '' });
                        setIsModalOpen(true);
                    }}
                >
                    <Plus size={20} />
                    Add New Class
                </button>
            </div>

            <div className="classes-list fade-in">
                <div className="filters-bar">
                    <div className="search-bar">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by class, teacher, or room..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="filter-select"
                        >
                            {grades.map(grade => (
                                <option key={grade} value={grade}>
                                    {grade === 'All' ? 'All Grades' : `Grade ${grade === 0 ? 'K' : grade}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    {loading ? (
                        <div className="empty-state">
                            <p>Loading classes...</p>
                        </div>
                    ) : error ? (
                        <div className="empty-state">
                            <p style={{ color: 'red' }}>Error: {error}</p>
                            <button className="btn btn-primary" onClick={fetchClasses}>Retry</button>
                        </div>
                    ) : (
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Grade</th>
                                    <th>Teacher</th>
                                    <th>Room</th>
                                    <th>Students</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClasses.length > 0 ? (
                                    filteredClasses.map(cls => (
                                        <tr key={cls.id}>
                                            <td>
                                                <div className="class-name-cell">
                                                    <div className="class-title">{cls.className}</div>
                                                </div>
                                            </td>
                                            <td>{cls.gradeLevel === 0 ? 'K' : cls.gradeLevel}</td>
                                            <td>{cls.teacherName || 'Not Assigned'}</td>
                                            <td>{cls.roomNumber || 'TBD'}</td>
                                            <td>
                                                <span className="badge badge-active">
                                                    {cls.studentCount || 0}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="class-actions">
                                                    <button
                                                        className="btn-icon btn-view"
                                                        title="View students"
                                                        onClick={() => handleViewStudents(cls.id)}
                                                    >
                                                        <Users size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-icon btn-edit"
                                                        title="Edit class"
                                                        onClick={() => handleEdit(cls)}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-icon btn-delete"
                                                        title="Delete class"
                                                        onClick={() => handleDelete(cls.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
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
                                                <h3>No classes found</h3>
                                                <p>Try adjusting your search or filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
                            <button className="btn-icon" onClick={() => setIsModalOpen(false)} title="Close">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Class Name</label>
                                <input
                                    type="text"
                                    name="className"
                                    value={formData.className}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="e.g. Section A"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Grade Level</label>
                                <select
                                    name="gradeLevel"
                                    value={formData.gradeLevel}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                >
                                    {Array.from({ length: 13 }, (_, i) => i).map(g => (
                                        <option key={g} value={g}>Grade {g === 0 ? 'K' : g}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Teacher Name</label>
                                <input
                                    type="text"
                                    name="teacherName"
                                    value={formData.teacherName}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="e.g. Mrs. Smith"
                                />
                            </div>
                            <div className="form-group">
                                <label>Room Number</label>
                                <input
                                    type="text"
                                    name="roomNumber"
                                    value={formData.roomNumber}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="e.g. Room 101"
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingClass ? 'Update Class' : 'Create Class'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedClass && (
                <div className="modal-overlay">
                    <div className="modal-content modal-large">
                        <div className="modal-header">
                            <div>
                                <h2>{selectedClass.className}</h2>
                                <p className="modal-subtitle">
                                    Grade {selectedClass.gradeLevel === 0 ? 'K' : selectedClass.gradeLevel} • {selectedClass.studentCount || classStudents.length} Students
                                </p>
                            </div>
                            <button className="btn-icon" onClick={closeStudentsModal} title="Close">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="table-container">
                            {studentsLoading ? (
                                <div className="empty-state">
                                    <p>Loading students...</p>
                                </div>
                            ) : studentsError ? (
                                <div className="empty-state">
                                    <p style={{ color: 'red' }}>Error: {studentsError}</p>
                                    <button className="btn btn-primary" onClick={() => handleViewStudents(selectedClass.id)}>Retry</button>
                                </div>
                            ) : classStudents.length > 0 ? (
                                <table className="students-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Payment Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classStudents.map(student => {
                                            const displayName = student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim();
                                            return (
                                                <tr key={student.id}>
                                                    <td>{displayName || 'N/A'}</td>
                                                    <td>{student.phone || 'N/A'}</td>
                                                    <td>{student.paymentStatus || 'N/A'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">
                                        <Users size={48} />
                                    </div>
                                    <h3>No students in this class</h3>
                                    <p>Assign students to this class to see them here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Class;
