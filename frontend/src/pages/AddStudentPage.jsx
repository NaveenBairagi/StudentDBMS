import React, { useState } from 'react';
import StudentForm from '../components/StudentForm';

const AddStudentPage = ({ onStudentAdded }) => {
    const handleSuccess = () => {
        if (onStudentAdded) onStudentAdded();
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Add Student</h1>
                <p className="page-subtitle">Register a new student into the system</p>
            </div>
            <StudentForm onSuccess={handleSuccess} />
        </div>
    );
};

export default AddStudentPage;
