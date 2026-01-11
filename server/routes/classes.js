import express from 'express';
import { getPool, sql } from '../config/database.js';

const router = express.Router();

// GET all classes
router.get('/', async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .query(`
                SELECT c.*, 
                (SELECT COUNT(*) FROM Students s WHERE s.classId = c.id) as studentCount
                FROM Classes c 
                ORDER BY gradeLevel ASC, className ASC
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Failed to fetch classes', message: error.message });
    }
});

// GET single class by ID with students
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getPool();

        // Fetch class details
        const classResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Classes WHERE id = @id');

        if (classResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Fetch students in this class
        const studentsResult = await pool.request()
            .input('classId', sql.Int, id)
            .query('SELECT * FROM Students WHERE classId = @classId');

        const classData = classResult.recordset[0];
        classData.students = studentsResult.recordset;

        res.json(classData);
    } catch (error) {
        console.error('Error fetching class:', error);
        res.status(500).json({ error: 'Failed to fetch class', message: error.message });
    }
});

// POST create new class
router.post('/', async (req, res) => {
    try {
        const { className, gradeLevel, teacherName, roomNumber } = req.body;

        if (!className || gradeLevel === undefined) {
            return res.status(400).json({ error: 'Class name and grade level are required' });
        }

        const pool = getPool();
        const result = await pool.request()
            .input('className', sql.NVarChar, className)
            .input('gradeLevel', sql.Int, gradeLevel)
            .input('teacherName', sql.NVarChar, teacherName || null)
            .input('roomNumber', sql.NVarChar, roomNumber || null)
            .query(`
                INSERT INTO Classes (className, gradeLevel, teacherName, roomNumber, createdAt)
                OUTPUT INSERTED.*
                VALUES (@className, @gradeLevel, @teacherName, @roomNumber, GETDATE())
            `);

        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ error: 'Failed to create class', message: error.message });
    }
});

// PUT update class
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { className, gradeLevel, teacherName, roomNumber } = req.body;

        const pool = getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('className', sql.NVarChar, className)
            .input('gradeLevel', sql.Int, gradeLevel)
            .input('teacherName', sql.NVarChar, teacherName || null)
            .input('roomNumber', sql.NVarChar, roomNumber || null)
            .query(`
                UPDATE Classes 
                SET className = @className, gradeLevel = @gradeLevel, 
                    teacherName = @teacherName, roomNumber = @roomNumber
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({ error: 'Failed to update class', message: error.message });
    }
});

// DELETE class
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getPool();

        // First, unassign students from this class
        await pool.request()
            .input('classId', sql.Int, id)
            .query('UPDATE Students SET classId = NULL WHERE classId = @classId');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Classes WHERE id = @id; SELECT @@ROWCOUNT as rowsAffected');

        if (result.recordset[0].rowsAffected === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json({ message: 'Class deleted successfully and students unassigned' });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ error: 'Failed to delete class', message: error.message });
    }
});

export default router;
