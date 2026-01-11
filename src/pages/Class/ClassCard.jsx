import React from 'react';

const ClassCard = ({ classData, onEdit, onDelete, onGradeClick }) => {
    return (
        <div className="class-card">
            <div className="class-card-header">
                <div className="class-card-title">{classData.className}</div>
                <span className="grade-badge">Grade {classData.gradeLevel}</span>
            </div>

            <div className="class-info">
                <div className="info-item">
                    <span>👨‍🏫</span>
                    <span>Teacher: {classData.teacherName || 'Not Assigned'}</span>
                </div>
                <div className="info-item">
                    <span>🏠</span>
                    <span>Room: {classData.roomNumber || 'TBD'}</span>
                </div>
                <div className="info-item">
                    <span>👥</span>
                    <span>Students: {classData.studentCount || 0}</span>
                </div>
            </div>

            {classData.students && classData.students.length > 0 && (
                <div className="student-list-preview">
                    <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', color: '#94a3b8' }}>
                        RECENT STUDENTS
                    </div>
                    {classData.students.slice(0, 3).map(student => (
                        <div key={student.id} className="student-list-item">
                            {student.name}
                        </div>
                    ))}
                    {classData.students.length > 3 && (
                        <div className="student-list-item" style={{ color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }} onClick={() => onGradeClick(classData)}>
                            + {classData.students.length - 3} more...
                        </div>
                    )}
                </div>
            )}

            <div className="card-actions">
                <button
                    className="btn-icon btn-edit"
                    title="Edit Class"
                    onClick={() => onEdit(classData)}
                >
                    ✏️
                </button>
                <button
                    className="btn-icon btn-delete"
                    title="Delete Class"
                    onClick={() => onDelete(classData.id)}
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default ClassCard;
