-- 1. TABEL USERS
CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    nama_user VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('kader', 'orang_tua'))
);

-- 2. TABEL IBU
CREATE TABLE ibu (
    id_ibu SERIAL PRIMARY KEY,
    id_user INT UNIQUE NOT NULL,
    nama_ibu VARCHAR(100) NOT NULL,
    nik VARCHAR(16) UNIQUE NOT NULL,
    tanggal_lahir DATE,
    alamat TEXT,
    no_hp VARCHAR(15),

    CONSTRAINT fk_ibu_user
        FOREIGN KEY (id_user)
        REFERENCES users(id_user)
);

-- 3. TABEL ANAK
CREATE TABLE anak (
    id_anak SERIAL PRIMARY KEY,
    id_ibu INT NOT NULL,
    nama_anak VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin VARCHAR(10) NOT NULL
        CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),

    CONSTRAINT fk_anak_ibu
        FOREIGN KEY (id_ibu)
        REFERENCES ibu(id_ibu)
);

-- 4. TABEL PEMERIKSAAN
CREATE TABLE pemeriksaan (
    id_pemeriksaan SERIAL PRIMARY KEY,
    id_anak INT NOT NULL,
    tanggal_pemeriksaan DATE NOT NULL,
    berat_badan NUMERIC(5,2)
        CHECK (berat_badan > 0),
    tinggi_badan NUMERIC(5,2)
        CHECK (tinggi_badan > 0),
    lingkar_kepala NUMERIC(5,2)
        CHECK (lingkar_kepala > 0),
    jenis_imunisasi VARCHAR(100),

    CONSTRAINT fk_pemeriksaan_anak
        FOREIGN KEY (id_anak)
        REFERENCES anak(id_anak)
);

-- 5. TABEL JADWAL POSYANDU
CREATE TABLE jadwal_posyandu (
    id_jadwal SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    nama_kegiatan VARCHAR(100) NOT NULL,
    tanggal DATE NOT NULL,
    waktu TIME,
    lokasi VARCHAR(150),
    keterangan TEXT,

    CONSTRAINT fk_jadwal_user
        FOREIGN KEY (id_user)
        REFERENCES users(id_user)
);

-- 6. TABEL NOTIFIKASI
CREATE TABLE notifikasi (
    id_notifikasi SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    judul VARCHAR(100) NOT NULL,
    pesan TEXT,
    tanggal_notifikasi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_dibaca BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_notifikasi_user
        FOREIGN KEY (id_user)
        REFERENCES users(id_user)
);

-- 7. TABEL PESERTA JADWAL
CREATE TABLE peserta_jadwal (
    id_peserta SERIAL PRIMARY KEY,
    id_jadwal INT NOT NULL,
    id_anak INT NOT NULL,
    status_kehadiran VARCHAR(20) DEFAULT 'belum_hadir'
        CHECK (status_kehadiran IN
        ('belum_hadir', 'hadir', 'tidak_hadir')),
    tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_peserta_jadwal
        FOREIGN KEY (id_jadwal)
        REFERENCES jadwal_posyandu(id_jadwal),

    CONSTRAINT fk_peserta_anak
        FOREIGN KEY (id_anak)
        REFERENCES anak(id_anak),

    CONSTRAINT unique_peserta
        UNIQUE (id_jadwal, id_anak)
);
