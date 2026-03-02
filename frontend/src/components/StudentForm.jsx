import React, { useState, useEffect } from 'react';
import { addStudent, updateStudent } from '../api/studentApi';

const INITIAL_FORM = { name: '', studentId: '', class: '', section: '', phone: '' };

const StudentForm = ({ editStudent, onSuccess, onCancelEdit }) => {
    const [form, setForm] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (editStudent) {
            setForm({
                name: editStudent.name || '',
                studentId: editStudent.studentId || '',
                class: editStudent.class || '',
                section: editStudent.section || '',
                phone: editStudent.phone || '',
            });
            setError('');
            setSuccess('');
        } else {
            setForm(INITIAL_FORM);
        }
    }, [editStudent]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (editStudent) {
                await updateStudent(editStudent._id, form);
                setSuccess('✅ Student updated successfully!');
            } else {
                await addStudent(form);
                setSuccess('✅ Student added successfully!');
                setForm(INITIAL_FORM);
            }
            onSuccess();
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
            setError(`❌ ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const isEditing = !!editStudent;

    return (
        <div className="form-card">
            <div className="form-header">
                <div className="form-icon">{isEditing ? '✏️' : '🎓'}</div>
                <h2 className="form-title">{isEditing ? 'Update Student' : 'Add New Student'}</h2>
                <p className="form-subtitle">
                    {isEditing ? 'Modify the student details below' : 'Fill in the details to register a new student'}
                </p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="student-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="e.g. Naveen Bairagi"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="studentId">Student ID</label>
                        <input
                            id="studentId"
                            type="text"
                            name="studentId"
                            placeholder="e.g. STU2024001"
                            value={form.studentId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="class">Class</label>
                        <input
                            id="class"
                            type="text"
                            name="class"
                            placeholder="e.g. 10, 11, 12 or B.Tech"
                            value={form.class}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="section">Section</label>
                        <input
                            id="section"
                            type="text"
                            name="section"
                            placeholder="e.g. A, B, C"
                            value={form.section}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group form-group-full">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            placeholder="10-digit phone number"
                            value={form.phone}
                            onChange={handleChange}
                            maxLength={10}
                            required
                        />
                    </div>
                </div>

                <div className="form-actions">
                    {isEditing && (
                        <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <span className="spinner" /> : null}
                        {loading ? 'Saving...' : isEditing ? 'Update Student' : 'Add Student'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentForm;
