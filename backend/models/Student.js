const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        studentId: {
            type: String,
            required: [true, 'Student ID is required'],
            unique: true,
            trim: true,
        },
        class: {
            type: String,
            required: [true, 'Class is required'],
            trim: true,
        },
        section: {
            type: String,
            required: [true, 'Section is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Student', studentSchema);
