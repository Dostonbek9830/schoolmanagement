import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClassCard from './ClassCard';
import './Class.css';

const Class = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
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
            const response = await axios.get('http://localhost:5000/api/classes');
            setClasses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching classes:', error);
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
                await axios.put(`http://localhost:5000/api/classes/${editingClass.id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/classes', formData);
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
                await axios.delete(`http://localhost:5000/api/classes/${id}`);
                fetchClasses();
            } catch (error) {
                console.error('Error deleting class:', error);
            }
        }
    };

    // Grouping classes by grade
    const groupedClasses = classes.reduce((acc, curr) => {
        const grade = curr.gradeLevel;
        if (!acc[grade]) acc[grade] = [];
        acc[grade].push(curr);
        return acc;
    }, {});

    const grades = Array.from({ length: 13 }, (_, i) => i); // 0 to 12

    return (
        <div className="classes-container">
            <div className="classes-header">
                <h1>Class Management</h1>
                <button
                    className="add-class-btn"
                    onClick={() => {
                        setEditingClass(null);
                        setFormData({ className: '', gradeLevel: 0, teacherName: '', roomNumber: '' });
                        setIsModalOpen(true);
                    }}
                >
                    + Add New Class
                </button>
            </div>

            {loading ? (
                <p>Loading classes...</p>
            ) : (
                grades.map(grade => (
                    <div key={grade} className="grade-section">
                        <h2 className="grade-title">Grade {grade === 0 ? 'K (Kindergarten)' : grade}</h2>
                        <div className="class-cards-grid">
                            {groupedClasses[grade]?.map(cls => (
                                <ClassCard
                                    key={cls.id}
                                    classData={cls}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )) || (
                                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic' }}>
                                        No classes added for this grade yet.
                                    </p>
                                )}
                        </div>
                    </div>
                ))
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
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
                                    {grades.map(g => (
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
                                <button type="submit" className="add-class-btn">{editingClass ? 'Update Class' : 'Create Class'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Class;
