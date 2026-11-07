
const express = require('express');
const router = express.Router();
const db = require('./db');

// 1. GET semua jadwal Posyandu
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM jadwal_posyandu ORDER BY id_jadwal ASC'
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 2. GET jadwal berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT * FROM jadwal_posyandu WHERE id_jadwal = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Jadwal Posyandu tidak ditemukan'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. POST menambahkan jadwal
router.post('/', async (req, res) => {
    try {
        const {
            id_user,
            nama_kegiatan,
            tanggal,
            waktu,
            lokasi,
            keterangan
        } = req.body;

        const result = await db.query(
            `INSERT INTO jadwal_posyandu
            (id_user, nama_kegiatan, tanggal, waktu, lokasi, keterangan)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [id_user, nama_kegiatan, tanggal, waktu, lokasi, keterangan]
        );

        res.status(201).json({
            message: 'Jadwal Posyandu berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 4. PUT mengubah jadwal
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_user,
            nama_kegiatan,
            tanggal,
            waktu,
            lokasi,
            keterangan
        } = req.body;

        const result = await db.query(
            `UPDATE jadwal_posyandu
             SET id_user = $1,
                 nama_kegiatan = $2,
                 tanggal = $3,
                 waktu = $4,
                 lokasi = $5,
                 keterangan = $6
             WHERE id_jadwal = $7
             RETURNING *`,
            [id_user, nama_kegiatan, tanggal, waktu, lokasi, keterangan, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Jadwal Posyandu tidak ditemukan'
            });
        }

        res.json({
            message: 'Jadwal Posyandu berhasil diperbarui',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 5. DELETE menghapus jadwal
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM jadwal_posyandu WHERE id_jadwal = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Jadwal Posyandu tidak ditemukan'
            });
        }

        res.json({
            message: 'Jadwal Posyandu berhasil dihapus',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
