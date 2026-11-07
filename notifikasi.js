
const express = require('express');
const router = express.Router();
const db = require('./db');

// 1. GET semua notifikasi
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM notifikasi ORDER BY id_notifikasi ASC'
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 2. GET notifikasi berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT * FROM notifikasi WHERE id_notifikasi = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Notifikasi tidak ditemukan'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. POST menambahkan notifikasi
router.post('/', async (req, res) => {
    try {
        const { id_user, judul, pesan, status_dibaca } = req.body;

        const result = await db.query(
            `INSERT INTO notifikasi
            (id_user, judul, pesan, status_dibaca)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [id_user, judul, pesan, status_dibaca ?? false]
        );

        res.status(201).json({
            message: 'Notifikasi berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 4. PUT mengubah notifikasi
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { id_user, judul, pesan, status_dibaca } = req.body;

        const result = await db.query(
            `UPDATE notifikasi
             SET id_user = $1,
                 judul = $2,
                 pesan = $3,
                 status_dibaca = $4
             WHERE id_notifikasi = $5
             RETURNING *`,
            [id_user, judul, pesan, status_dibaca, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Notifikasi tidak ditemukan'
            });
        }

        res.json({
            message: 'Notifikasi berhasil diperbarui',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 5. DELETE menghapus notifikasi
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM notifikasi WHERE id_notifikasi = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Notifikasi tidak ditemukan'
            });
        }

        res.json({
            message: 'Notifikasi berhasil dihapus',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
