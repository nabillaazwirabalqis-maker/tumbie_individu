
const express = require('express');
const router = express.Router();
const db = require('./db');

// 1. GET semua data pemeriksaan
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM pemeriksaan ORDER BY id_pemeriksaan ASC'
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 2. GET pemeriksaan berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT * FROM pemeriksaan WHERE id_pemeriksaan = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data pemeriksaan tidak ditemukan'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. POST menambahkan pemeriksaan
router.post('/', async (req, res) => {
    try {
        const {
            id_anak,
            tanggal_pemeriksaan,
            berat_badan,
            tinggi_badan,
            lingkar_kepala,
            jenis_imunisasi
        } = req.body;

        const result = await db.query(
            `INSERT INTO pemeriksaan
            (id_anak, tanggal_pemeriksaan, berat_badan,
             tinggi_badan, lingkar_kepala, jenis_imunisasi)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                id_anak,
                tanggal_pemeriksaan,
                berat_badan,
                tinggi_badan,
                lingkar_kepala,
                jenis_imunisasi
            ]
        );

        res.status(201).json({
            message: 'Data pemeriksaan berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 4. PUT mengubah data pemeriksaan
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_anak,
            tanggal_pemeriksaan,
            berat_badan,
            tinggi_badan,
            lingkar_kepala,
            jenis_imunisasi
        } = req.body;

        const result = await db.query(
            `UPDATE pemeriksaan
             SET id_anak = $1,
                 tanggal_pemeriksaan = $2,
                 berat_badan = $3,
                 tinggi_badan = $4,
                 lingkar_kepala = $5,
                 jenis_imunisasi = $6
             WHERE id_pemeriksaan = $7
             RETURNING *`,
            [
                id_anak,
                tanggal_pemeriksaan,
                berat_badan,
                tinggi_badan,
                lingkar_kepala,
                jenis_imunisasi,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data pemeriksaan tidak ditemukan'
            });
        }

        res.json({
            message: 'Data pemeriksaan berhasil diperbarui',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 5. DELETE menghapus pemeriksaan
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM pemeriksaan WHERE id_pemeriksaan = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data pemeriksaan tidak ditemukan'
            });
        }

        res.json({
            message: 'Data pemeriksaan berhasil dihapus',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
