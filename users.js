
const express = require('express');
const db = require('./db');

const router = express.Router();

// GET semua users
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id_user, nama_user, username, role FROM users ORDER BY id_user ASC'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET users berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id_user, nama_user, username, role FROM users WHERE id_user = $1',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST tambah users
router.post('/', async (req, res) => {
    try {
        const { nama_user, username, password, role } = req.body;

        const result = await db.query(
            `INSERT INTO users (nama_user, username, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id_user, nama_user, username, role`,
            [nama_user, username, password, role]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update users
router.put('/:id', async (req, res) => {
    try {
        const { nama_user, username, password, role } = req.body;

        const result = await db.query(
            `UPDATE users
             SET nama_user = $1, username = $2, password = $3, role = $4
             WHERE id_user = $5
             RETURNING id_user, nama_user, username, role`,
            [nama_user, username, password, role, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE users
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query(
            `DELETE FROM users
             WHERE id_user = $1
             RETURNING id_user, nama_user, username, role`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.json({
            message: 'User berhasil dihapus',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
