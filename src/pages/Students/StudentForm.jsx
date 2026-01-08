import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';

const StudentForm = ({ onSubmit }) => {
    const { t } = useTranslation();
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
            <h2 className="form-title">{t('students_page.form_title')}</h2>

            <div className="form-grid">
                <div className="form-group">
                    <label>{t('common.first_name')}</label>
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
                    <label>{t('common.last_name')}</label>
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
                    <label>{t('common.parent_name')}</label>
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
                    <label>{t('common.phone_number')}</label>
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
                    <label>{t('common.birth_certificate')}</label>
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
                    <label>{t('common.class_grade')}</label>
                    <select
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        required
                    >
                        <option value="">{t('common.select_class')}</option>
                        <option value="Grade 1">{t('grades.grade_1')}</option>
                        <option value="Grade 2">{t('grades.grade_2')}</option>
                        <option value="Grade 3">{t('grades.grade_3')}</option>
                        <option value="Grade 9">{t('grades.grade_9')}</option>
                        <option value="Grade 10">{t('grades.grade_10')}</option>
                        <option value="Grade 11">{t('grades.grade_11')}</option>
                        <option value="Grade 12">{t('grades.grade_12')}</option>
                    </select>
                </div>

                <div className="form-group full-width">
                    <label>{t('common.address')}</label>
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
                    {t('students_page.register_btn')}
                </button>
            </div>
        </form>
    );
};

export default StudentForm;
