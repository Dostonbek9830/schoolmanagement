import express from 'express';
import { getPool } from '../config/database.js';

const router = express.Router();

// GET dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const pool = getPool();

        // Get total students
        const totalStudentsResult = await pool.request()
            .query('SELECT COUNT(*) as total FROM Students');

        // Get paid students count
        const paidStudentsResult = await pool.request()
            .query("SELECT COUNT(*) as total FROM Students WHERE paymentStatus = 'Paid'");

        // Get unpaid students count
        const unpaidStudentsResult = await pool.request()
            .query("SELECT COUNT(*) as total FROM Students WHERE paymentStatus = 'Unpaid'");

        // For now, we'll use placeholder values for teachers and profit
        // You can add these tables later if needed
        const stats = {
            totalStudents: totalStudentsResult.recordset[0].total,
            totalTeachers: 0, // Placeholder - add Teachers table if needed
            profit: 0, // Placeholder - calculate based on payments if needed
            paidStudents: paidStudentsResult.recordset[0].total,
            unpaidStudents: unpaidStudentsResult.recordset[0].total
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics', message: error.message });
    }
});

export default router;
