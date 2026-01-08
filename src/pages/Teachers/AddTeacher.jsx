import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, X } from 'lucide-react';
import './Teachers.css'; // Reusing/Creating styles

const AddTeacher = ({ onSubmit, onCancel }) => {
    const { t } = useTranslation();
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
                <h2 className="form-title">{t('teachers_page.form_title')}</h2>
                <button type="button" onClick={onCancel} className="btn-icon">
                    <X size={20} />
                </button>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label>{t('common.first_name')}</label>
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
                    <label>{t('common.last_name')}</label>
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
                    <label>{t('common.dob')}</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t('common.phone_number')}</label>
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
                    <label>{t('common.degree')}</label>
                    <select
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        required
                    >
                        <option value="">{t('common.select_degree')}</option>
                        <option value="Bachelor">{t('degrees.bachelor')}</option>
                        <option value="Master">{t('degrees.master')}</option>
                        <option value="Associate teacher">{t('degrees.associate_teacher')}</option>
                        <option value="Phd">{t('degrees.phd')}</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>{t('common.subject')}</label>
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
                    <label>{t('common.full_address')}</label>
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
                    {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                    <Save size={18} />
                    {t('teachers_page.save_btn')}
                </button>
            </div>
        </form>
    );
};

export default AddTeacher;
