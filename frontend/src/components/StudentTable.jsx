import React, { useState } from 'react';
import { deleteStudent } from '../api/studentApi';

const StudentTable = ({ students, onEdit, onDeleted }) => {
    const [deletingId, setDeletingId] = useState(null);
    const [confirmId, setConfirmId] = useState(null);

    const handleDelete = async (id) => {
        if (confirmId !== id) {
            setConfirmId(id);
            return;
        }
        setDeletingId(id);
        try {
            await deleteStudent(id);
            onDeleted();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete student');
        } finally {
            setDeletingId(null);
            setConfirmId(null);
        }
    };

    if (students.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No Students Found</h3>
                <p>There are no student records to display.</p>
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <table className="student-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Student ID</th>
                        <th>Class</th>
                        <th>Section</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student._id} className="table-row">
                            <td className="row-num">{index + 1}</td>
                            <td className="student-name">
                                <span className="avatar">{student.name.charAt(0).toUpperCase()}</span>
                                {student.name}
                            </td>
                            <td><span className="badge">{student.studentId}</span></td>
                            <td>{student.class}</td>
                            <td>{student.section}</td>
                            <td>{student.phone}</td>
                            <td className="actions-cell">
                                <button
                                    className="btn-icon btn-edit"
                                    onClick={() => { setConfirmId(null); onEdit(student); }}
                                    title="Edit student"
                                >
                                    ✏️
                                </button>
                                <button
                                    className={`btn-icon ${confirmId === student._id ? 'btn-confirm-delete' : 'btn-delete'}`}
                                    onClick={() => handleDelete(student._id)}
                                    disabled={deletingId === student._id}
                                    title={confirmId === student._id ? 'Click again to confirm' : 'Delete student'}
                                >
                                    {deletingId === student._id ? '⏳' : confirmId === student._id ? '⚠️ Confirm' : '🗑️'}
                                </button>
                                {confirmId === student._id && (
                                    <button
                                        className="btn-icon btn-cancel-delete"
                                        onClick={() => setConfirmId(null)}
                                        title="Cancel delete"
                                    >
                                        ✕
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentTable;
