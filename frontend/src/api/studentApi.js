import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students`;

// Get all students
export const getStudents = () => axios.get(API_BASE);

// Search students by query
export const searchStudents = (q) => axios.get(`${API_BASE}/search`, { params: { q } });

// Add a new student
export const addStudent = (data) => axios.post(API_BASE, data);

// Update a student by MongoDB _id
export const updateStudent = (id, data) => axios.put(`${API_BASE}/${id}`, data);

// Delete a student by MongoDB _id
export const deleteStudent = (id) => axios.delete(`${API_BASE}/${id}`);
