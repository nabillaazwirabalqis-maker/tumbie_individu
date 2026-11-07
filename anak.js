const express = require('express');
const router = express.Router();
const db = require('./db');

// 1. GET semua data anak
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM anak ORDER BY id_anak ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. GET data anak berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT * FROM anak WHERE id_anak = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data anak tidak ditemukan'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. POST menambahkan data anak
router.post('/', async (req, res) => {
    try {
        const {
            id_ibu,
            nama_anak,
            tanggal_lahir,
            jenis_kelamin
        } = req.body;

        const result = await db.query(
            `INSERT INTO anak
            (id_ibu, nama_anak, tanggal_lahir, jenis_kelamin)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [id_ibu, nama_anak, tanggal_lahir, jenis_kelamin]
        );

        res.status(201).json({
            message: 'Data anak berhasil ditambahkan',
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 4. PUT mengubah data anak berdasarkan ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_ibu,
            nama_anak,
            tanggal_lahir,
            jenis_kelamin
        } = req.body;

        const result = await db.query(
            `UPDATE anak
             SET id_ibu = $1,
                 nama_anak = $2,
                 tanggal_lahir = $3,
                 jenis_kelamin = $4
             WHERE id_anak = $5
             RETURNING *`,
            [id_ibu, nama_anak, tanggal_lahir, jenis_kelamin, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data anak tidak ditemukan'
            });
        }

        res.json({
            message: 'Data anak berhasil diperbarui',
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 5. DELETE menghapus data anak berdasarkan ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM anak WHERE id_anak = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data anak tidak ditemukan'
            });
        }

        res.json({
            message: 'Data anak berhasil dihapus',
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;