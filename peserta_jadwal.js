
const express = require('express');
const router = express.Router();
const db = require('./db');

// 1. GET semua peserta jadwal
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM peserta_jadwal ORDER BY id_peserta ASC'
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 2. GET peserta berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT * FROM peserta_jadwal WHERE id_peserta = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data peserta jadwal tidak ditemukan'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. POST mendaftarkan anak ke jadwal
router.post('/', async (req, res) => {
    try {
        const {
            id_jadwal,
            id_anak,
            status_kehadiran
        } = req.body;

        const result = await db.query(
            `INSERT INTO peserta_jadwal
            (id_jadwal, id_anak, status_kehadiran)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [
                id_jadwal,
                id_anak,
                status_kehadiran || 'belum_hadir'
            ]
        );

        res.status(201).json({
            message: 'Peserta berhasil didaftarkan',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 4. PUT mengubah data peserta jadwal
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_jadwal,
            id_anak,
            status_kehadiran
        } = req.body;

        const result = await db.query(
            `UPDATE peserta_jadwal
             SET id_jadwal = $1,
                 id_anak = $2,
                 status_kehadiran = $3
             WHERE id_peserta = $4
             RETURNING *`,
            [id_jadwal, id_anak, status_kehadiran, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data peserta jadwal tidak ditemukan'
            });
        }

        res.json({
            message: 'Data peserta jadwal berhasil diperbarui',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 5. DELETE menghapus peserta dari jadwal
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM peserta_jadwal WHERE id_peserta = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data peserta jadwal tidak ditemukan'
            });
        }

        res.json({
            message: 'Peserta berhasil dihapus dari jadwal',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
