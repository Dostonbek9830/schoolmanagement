import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import './Teachers.css'; // Reusing/Creating styles

const AddTeacher = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        address: '',
        phoneNumber: '',
        degree: '',
        subject: '' // Added as it was in list requirements but missing in form requirements
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
        <form onSubmit={handleSubmit} className="teacher-form">
            <div className="form-header">
                <h2 className="form-title">Add New Teacher</h2>
                <button type="button" onClick={onCancel} className="btn-icon">
                    <X size={20} />
                </button>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Sarah"
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
                        placeholder="e.g. Connor"
                    />
                </div>

                <div className="form-group">
                    <label>Date of Birthday</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
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
                        placeholder="e.g. +1 555 0199"
                    />
                </div>

                <div className="form-group">
                    <label>Degree</label>
                    <select
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Degree</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Master">Master</option>
                        <option value="Associate teacher">Associate teacher</option>
                        <option value="Phd">Phd</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Subject</label>
                     <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Mathematics"
                    />
                </div>

                <div className="form-group full-width">
                    <label>Full Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Enter full address"
                        rows="3"
                    ></textarea>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-outline">
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    <Save size={18} />
                    Save Teacher
                </button>
            </div>
        </form>
    );
};

export default AddTeacher;
