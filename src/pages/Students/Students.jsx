import React, { useState } from 'react';
import { Plus, Search, User } from 'lucide-react';
import './Students.css';
import StudentForm from './StudentForm';

const Students = () => {
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // Mock data for initial view
    const [students, setStudents] = useState([
        { id: 1, firstName: 'John', lastName: 'Doe', class: 'Grade 10', parentName: 'Jane Doe', paymentStatus: 'Paid' },
        { id: 2, firstName: 'Alice', lastName: 'Smith', class: 'Grade 11', parentName: 'Bob Smith', paymentStatus: 'Due to deadline' },
        { id: 3, firstName: 'Bob', lastName: 'Johnson', class: 'Grade 12', parentName: 'Sara Johnson', paymentStatus: 'Unpaid' },
    ]);

    const handleAddStudent = (newStudent) => {
        setStudents([...students, { ...newStudent, id: students.length + 1 }]);
        setShowForm(false);
    };

    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    {/* Search Bar Placeholder */}
                    <div className="search-bar">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                                {filteredStudents.map(student => (
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
