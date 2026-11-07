
const express = require('express');
const router = express.Router();
const db = require('./db');

// 1. GET semua data ibu
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM ibu ORDER BY id_ibu ASC'
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 2. GET data ibu berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT * FROM ibu WHERE id_ibu = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data ibu tidak ditemukan'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. POST menambahkan data ibu
router.post('/', async (req, res) => {
    try {
        const {
            id_user,
            nama_ibu,
            nik,
            tanggal_lahir,
            alamat,
            no_hp
        } = req.body;

        const result = await db.query(
            `INSERT INTO ibu
            (id_user, nama_ibu, nik, tanggal_lahir, alamat, no_hp)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [id_user, nama_ibu, nik, tanggal_lahir, alamat, no_hp]
        );

        res.status(201).json({
            message: 'Data ibu berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 4. PUT mengubah data ibu
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_user,
            nama_ibu,
            nik,
            tanggal_lahir,
            alamat,
            no_hp
        } = req.body;

        const result = await db.query(
            `UPDATE ibu
             SET id_user = $1,
                 nama_ibu = $2,
                 nik = $3,
                 tanggal_lahir = $4,
                 alamat = $5,
                 no_hp = $6
             WHERE id_ibu = $7
             RETURNING *`,
            [id_user, nama_ibu, nik, tanggal_lahir, alamat, no_hp, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data ibu tidak ditemukan'
            });
        }

        res.json({
            message: 'Data ibu berhasil diperbarui',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 5. DELETE menghapus data ibu
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM ibu WHERE id_ibu = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data ibu tidak ditemukan'
            });
        }

        res.json({
            message: 'Data ibu berhasil dihapus',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
