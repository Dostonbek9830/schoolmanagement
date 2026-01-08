import React, { useState } from 'react';
import { Save } from 'lucide-react';

const StudentForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        parentName: '',
        address: '',
        phoneNumber: '',
        birthCertificate: '',
        class: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="student-form">
            <h2 className="form-title">New Student Registration</h2>

            <div className="form-grid">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. John"
                    />
                </div>

                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Doe"
                    />
                </div>

                <div className="form-group">
                    <label>Parents Name</label>
                    <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Jane Doe"
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        placeholder="e.g. +1 234 567 8900"
                    />
                </div>

                <div className="form-group">
                    <label>Birth Certificate Number</label>
                    <input
                        type="text"
                        name="birthCertificate"
                        value={formData.birthCertificate}
                        onChange={handleChange}
                        required
                        placeholder="e.g. BC-12345678"
                    />
                </div>

                <div className="form-group">
                    <label>Class/Grade</label>
                    <select
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Class</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                    </select>
                </div>

                <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Full residential address"
                        rows="3"
                    ></textarea>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    <Save size={18} />
                    Register Student
                </button>
            </div>
        </form>
    );
};

export default StudentForm;
