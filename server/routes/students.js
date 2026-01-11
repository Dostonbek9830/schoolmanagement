import express from 'express';
import { getPool, sql } from '../config/database.js';

const router = express.Router();

// GET all students
router.get('/', async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .query('SELECT * FROM Students ORDER BY id DESC');

        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students', message: error.message });
    }
});

// GET single student by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Students WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Failed to fetch student', message: error.message });
    }
});

// POST create new student
router.post('/', async (req, res) => {
    try {
        const { name, grade, classId, age, phone, address, paymentStatus } = req.body;

        // Validation
        if (!name || !grade) {
            return res.status(400).json({ error: 'Name and grade are required' });
        }

        const pool = getPool();
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('grade', sql.NVarChar, grade)
            .input('classId', sql.Int, classId || null)
            .input('age', sql.Int, age || null)
            .input('phone', sql.NVarChar, phone || null)
            .input('address', sql.NVarChar, address || null)
            .input('paymentStatus', sql.NVarChar, paymentStatus || 'Unpaid')
            .query(`
        INSERT INTO Students (name, grade, classId, age, phone, address, paymentStatus, createdAt)
        OUTPUT INSERTED.*
        VALUES (@name, @grade, @classId, @age, @phone, @address, @paymentStatus, GETDATE())
      `);

        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Failed to create student', message: error.message });
    }
});

// PUT update student
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, grade, classId, age, phone, address, paymentStatus } = req.body;

        const pool = getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('grade', sql.NVarChar, grade)
            .input('classId', sql.Int, classId || null)
            .input('age', sql.Int, age || null)
            .input('phone', sql.NVarChar, phone || null)
            .input('address', sql.NVarChar, address || null)
            .input('paymentStatus', sql.NVarChar, paymentStatus)
            .query(`
        UPDATE Students 
        SET name = @name, grade = @grade, classId = @classId, age = @age, 
            phone = @phone, address = @address, paymentStatus = @paymentStatus
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: 'Failed to update student', message: error.message });
    }
});

// DELETE student
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Students WHERE id = @id; SELECT @@ROWCOUNT as rowsAffected');

        if (result.recordset[0].rowsAffected === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Failed to delete student', message: error.message });
    }
});

export default router;
