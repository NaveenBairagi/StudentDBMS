const Student = require('../models/Student');
const { getRedisClient } = require('../config/redis');

const CACHE_KEY = 'students:all';
const CACHE_TTL = 120; // 2 minutes

// Helper: safely get/set Redis
const safeRedisGet = async (key) => {
    try {
        const client = getRedisClient();
        if (client.status !== 'ready') return null;
        return await client.get(key);
    } catch {
        return null;
    }
};

const safeRedisSet = async (key, value, ttl) => {
    try {
        const client = getRedisClient();
        if (client.status !== 'ready') return;
        await client.set(key, value, 'EX', ttl);
    } catch {
        // ignore
    }
};

const safeRedisDel = async (key) => {
    try {
        const client = getRedisClient();
        if (client.status !== 'ready') return;
        await client.del(key);
    } catch {
        // ignore
    }
};

// @desc  Get all students
// @route GET /api/students
const getAllStudents = async (req, res) => {
    try {
        // 1. Check Redis cache
        const cached = await safeRedisGet(CACHE_KEY);
        if (cached) {
            console.log('📦 Cache HIT — returning students from Redis');
            return res.status(200).json({
                success: true,
                source: 'cache',
                data: JSON.parse(cached),
            });
        }

        // 2. Cache miss — fetch from MongoDB
        console.log('🔍 Cache MISS — fetching from MongoDB');
        const students = await Student.find().sort({ createdAt: -1 });

        // 3. Store in Redis
        await safeRedisSet(CACHE_KEY, JSON.stringify(students), CACHE_TTL);

        res.status(200).json({ success: true, source: 'db', data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc  Search students by name, studentId, class, or section
// @route GET /api/students/search?q=<query>
const searchStudents = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.status(400).json({ success: false, message: 'Search query is required' });
        }

        const regex = new RegExp(q, 'i');
        const students = await Student.find({
            $or: [
                { name: regex },
                { studentId: regex },
                { class: regex },
                { section: regex },
            ],
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc  Add a new student
// @route POST /api/students
const addStudent = async (req, res) => {
    try {
        const { name, studentId, class: cls, section, phone } = req.body;

        // Check for duplicate studentId
        const existing = await Student.findOne({ studentId });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: `Student ID "${studentId}" already exists. Please use a unique ID.`,
            });
        }

        const student = await Student.create({ name, studentId, class: cls, section, phone });

        // Invalidate cache
        await safeRedisDel(CACHE_KEY);
        console.log('🗑️  Cache invalidated after adding student');

        res.status(201).json({ success: true, data: student, message: 'Student added successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Student ID already exists. Please use a unique ID.',
            });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc  Update a student
// @route PUT /api/students/:id
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, studentId, class: cls, section, phone } = req.body;

        // Check if new studentId conflicts with another student
        if (studentId) {
            const conflict = await Student.findOne({ studentId, _id: { $ne: id } });
            if (conflict) {
                return res.status(409).json({
                    success: false,
                    message: `Student ID "${studentId}" is already used by another student.`,
                });
            }
        }

        const student = await Student.findByIdAndUpdate(
            id,
            { name, studentId, class: cls, section, phone },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Invalidate cache
        await safeRedisDel(CACHE_KEY);
        console.log('🗑️  Cache invalidated after updating student');

        res.status(200).json({ success: true, data: student, message: 'Student updated successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc  Delete a student
// @route DELETE /api/students/:id
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Invalidate cache
        await safeRedisDel(CACHE_KEY);
        console.log('🗑️  Cache invalidated after deleting student');

        res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllStudents,
    searchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
};
