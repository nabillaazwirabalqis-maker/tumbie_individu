const db = require('./db');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const anakRoutes = require('./anak');
const ibuRoutes = require('./ibu');
const pemeriksaanRoutes = require('./pemeriksaan');
const jadwalRoutes = require('./jadwal');
const notifikasiRoutes = require('./notifikasi');
const pesertaJadwalRoutes = require('./peserta_jadwal');
const usersRoutes = require('./users');

app.use(cors());
app.use(express.json());
app.use('/anak', anakRoutes);
app.use('/ibu', ibuRoutes);
app.use('/pemeriksaan', pemeriksaanRoutes);
app.use('/jadwal', jadwalRoutes);
app.use('/notifikasi', notifikasiRoutes);
app.use('/peserta-jadwal', pesertaJadwalRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
    res.send('Backend Tumbie berhasil berjalan!');
});

app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');

        res.json({
            message: 'Koneksi PostgreSQL berhasil!',
            waktu: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Koneksi PostgreSQL gagal!',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
