# Modul Pendaftaran & Admisi

## 1. Deskripsi Umum

Modul Pendaftaran dan Admisi adalah gerbang utama untuk semua pasien yang akan mendapatkan layanan di rumah sakit. Modul ini bertanggung jawab untuk:

- Mengelola data Master Pasien (Rekam Medis)
- Membuat dan mengelola kunjungan pasien (Rawat Jalan, IGD, Rawat Inap)
- Menerbitkan nomor antrian
- Mengelola bed management untuk rawat inap

---

## 2. Alur Kerja (Workflow)

### 2.1 Alur Pendaftaran Pasien Baru

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Pasien Datang  │────▶│  Cek Data Pasien │────▶│  Pasien Baru?   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                        ┌─────────────────────────────────┼─────────────────────────────────┐
                        │ Ya                              │                            Tidak │
                        ▼                                 │                                  ▼
            ┌───────────────────────┐                     │              ┌───────────────────────────┐
            │ Input Data Pasien Baru│                     │              │ Verifikasi Data Eksisting │
            │ (Buat No. RM)         │                     │              └─────────────┬─────────────┘
            └───────────┬───────────┘                     │                            │
                        │                                 │                            │
                        └─────────────────────────────────┼────────────────────────────┘
                                                          │
                                                          ▼
                                            ┌─────────────────────────┐
                                            │ Pilih Jenis Kunjungan   │
                                            │ (Rawat Jalan/IGD/RI)    │
                                            └─────────────┬───────────┘
                                                          │
                                                          ▼
                                            ┌─────────────────────────┐
                                            │ Input Data Kunjungan    │
                                            └─────────────┬───────────┘
                                                          │
                                                          ▼
                                            ┌─────────────────────────┐
                                            │ Cetak Kartu Berobat &   │
                                            │ Nomor Antrian           │
                                            └─────────────────────────┘
```

### 2.2 Alur Pendaftaran Rawat Jalan

1. Pasien datang ke loket pendaftaran
2. Petugas mencari data pasien berdasarkan NIK/No. RM/Nama
3. Jika pasien baru, buat data master pasien
4. Pilih poli tujuan dan dokter
5. Pilih jenis penjamin (Umum/BPJS/Asuransi)
6. Sistem menerbitkan nomor antrian
7. Cetak bukti pendaftaran

### 2.3 Alur Pendaftaran IGD

1. Pasien datang/dibawa ke IGD
2. **Triage** dilakukan terlebih dahulu (penentuan prioritas: Merah/Kuning/Hijau)
3. Pasien dengan kategori **Merah** langsung ditangani tanpa menunggu pendaftaran administrasi
4. Petugas administrasi melakukan pendaftaran setelah kondisi stabil
5. Input data pasien dan kunjungan IGD
6. Hubungkan dengan data triage yang sudah ada

### 2.4 Alur Admisi Rawat Inap

1. Dokter poli/IGD memberikan order rawat inap
2. Petugas admisi menerima order
3. Cek ketersediaan kamar sesuai kelas yang diminta
4. Jika tersedia, booking kamar
5. Input data rawat inap (tanggal masuk, diagnosa awal, DPJP)
6. Cetak form persetujuan rawat inap
7. Antar pasien ke ruangan

---

## 3. Skema Data

### 3.1 Master Pasien (master_pasien)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| no_rm | VARCHAR(10) | Ya | Nomor Rekam Medis (Auto-generated) |
| nik | VARCHAR(16) | Ya | Nomor Induk Kependudukan |
| nama_lengkap | VARCHAR(100) | Ya | Nama lengkap pasien |
| tempat_lahir | VARCHAR(50) | Ya | Tempat lahir |
| tanggal_lahir | DATE | Ya | Tanggal lahir |
| jenis_kelamin | ENUM('L','P') | Ya | Laki-laki/Perempuan |
| golongan_darah | ENUM('A','B','AB','O','-') | Tidak | Golongan darah |
| alamat | TEXT | Ya | Alamat lengkap |
| rt | VARCHAR(3) | Tidak | RT |
| rw | VARCHAR(3) | Tidak | RW |
| kode_wilayah | VARCHAR(13) | Ya | Kode wilayah BPS format: PPKKCCDDDDDD (PP=Provinsi 2 digit, KK=Kabupaten 2 digit, CC=Kecamatan 2 digit, DDDDDD=Desa/Kelurahan 6 digit) |
| kode_pos | VARCHAR(5) | Tidak | Kode pos |
| no_telepon | VARCHAR(15) | Tidak | Nomor telepon |
| no_hp | VARCHAR(15) | Ya | Nomor HP |
| email | VARCHAR(100) | Tidak | Email |
| agama_id | UUID | Ya | FK ke master_lookup (category=AGAMA) |
| pendidikan_id | UUID | Tidak | FK ke master_lookup (category=PENDIDIKAN) |
| pekerjaan_id | UUID | Tidak | FK ke master_lookup (category=PEKERJAAN) |
| status_perkawinan_id | UUID | Ya | FK ke master_lookup (category=STATUS_PERKAWINAN) |
| nama_ayah | VARCHAR(100) | Tidak | Nama ayah kandung |
| nama_ibu | VARCHAR(100) | Ya | Nama ibu kandung |
| nama_pasangan | VARCHAR(100) | Tidak | Nama suami/istri |
| foto | VARCHAR(255) | Tidak | Path foto pasien |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |
| created_by | UUID | Ya | FK ke user |
| updated_by | UUID | Ya | FK ke user |

### 3.2 Kunjungan (kunjungan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| no_registrasi | VARCHAR(20) | Ya | Nomor registrasi kunjungan |
| pasien_id | UUID | Ya | FK ke master_pasien |
| tanggal_kunjungan | DATE | Ya | Tanggal kunjungan |
| waktu_kunjungan | TIME | Ya | Waktu kunjungan |
| jenis_kunjungan | ENUM | Ya | 'RAJAL','IGD','RANAP' |
| ruangan_id | UUID | Ya | FK ke ruangan (Poli/IGD/Ruang Ranap) |
| dokter_id | UUID | Ya | FK ke pegawai (DPJP) |
| penjamin_id | UUID | Ya | FK ke penjamin |
| no_penjamin | VARCHAR(50) | Tidak | Nomor kartu penjamin (BPJS/Asuransi) |
| status_kunjungan | ENUM | Ya | 'DAFTAR','DILAYANI','SELESAI','BATAL' |
| no_antrian | INT | Ya | Nomor antrian |
| keterangan | TEXT | Tidak | Catatan tambahan |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |
| created_by | UUID | Ya | FK ke user |
| updated_by | UUID | Ya | FK ke user |

### 3.3 Rawat Inap (rawat_inap)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kunjungan_id | UUID | Ya | FK ke kunjungan |
| pasien_id | UUID | Ya | FK ke master_pasien |
| tanggal_masuk | DATETIME | Ya | Tanggal dan waktu masuk |
| tanggal_keluar | DATETIME | Tidak | Tanggal dan waktu keluar |
| kamar_id | UUID | Ya | FK ke kamar |
| bed_id | UUID | Ya | FK ke bed |
| kelas_id | UUID | Ya | FK ke kelas_kamar |
| dpjp_id | UUID | Ya | FK ke pegawai (Dokter Penanggung Jawab) |
| diagnosa_masuk | TEXT | Ya | Diagnosa awal saat masuk |
| cara_masuk | ENUM | Ya | 'POLIKLINIK','IGD','RUJUKAN','LAHIR_DI_RS' |
| status_rawat | ENUM | Ya | 'AKTIF','PINDAH_KAMAR','PULANG','MENINGGAL','RUJUK' |
| cara_keluar | ENUM | Tidak | 'SEMBUH','PAPS','MENINGGAL','RUJUK' |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |
| created_by | UUID | Ya | FK ke user |
| updated_by | UUID | Ya | FK ke user |

### 3.4 Penanggung Jawab Pasien (penanggung_jawab)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| pasien_id | UUID | Ya | FK ke master_pasien |
| nama | VARCHAR(100) | Ya | Nama penanggung jawab |
| hubungan | VARCHAR(50) | Ya | Hubungan dengan pasien |
| nik | VARCHAR(16) | Ya | NIK penanggung jawab |
| alamat | TEXT | Ya | Alamat |
| no_telepon | VARCHAR(15) | Ya | Nomor telepon |
| is_primary | BOOLEAN | Ya | Penanggung jawab utama |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.5 Triage IGD (triage)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kunjungan_id | UUID | Ya | FK ke kunjungan |
| waktu_triage | DATETIME | Ya | Waktu dilakukan triage |
| kategori | ENUM | Ya | 'MERAH','KUNING','HIJAU','HITAM' |
| keluhan_utama | TEXT | Ya | Keluhan utama pasien |
| tanda_vital_td | VARCHAR(10) | Ya | Tekanan Darah (mmHg) |
| tanda_vital_nadi | INT | Ya | Nadi (x/menit) |
| tanda_vital_rr | INT | Ya | Respiratory Rate (x/menit) |
| tanda_vital_suhu | DECIMAL(4,1) | Ya | Suhu tubuh (°C) |
| tanda_vital_spo2 | INT | Tidak | Saturasi oksigen (%) |
| gcs_eye | INT | Tidak | GCS Eye (1-4) |
| gcs_verbal | INT | Tidak | GCS Verbal (1-5) |
| gcs_motor | INT | Tidak | GCS Motor (1-6) |
| petugas_triage_id | UUID | Ya | FK ke pegawai |
| catatan | TEXT | Tidak | Catatan tambahan |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

---

## 4. Form-Form yang Dibutuhkan

### 4.1 Form Pendaftaran Pasien Baru

**Bagian 1: Data Identitas**
- NIK* (dengan validasi format 16 digit)
- Nama Lengkap*
- Tempat Lahir*
- Tanggal Lahir* (date picker)
- Jenis Kelamin* (radio button: L/P)
- Golongan Darah (dropdown)
- Agama* (dropdown)
- Status Perkawinan* (dropdown)

**Bagian 2: Alamat**
- Alamat Lengkap* (textarea)
- RT/RW
- Provinsi* (input text / autocomplete dari API eksternal)
- Kabupaten/Kota* (input text / autocomplete)
- Kecamatan* (input text / autocomplete)
- Kelurahan/Desa* (input text / autocomplete)
- Kode Pos

> **Catatan:** Data wilayah tidak disimpan sebagai FK, melainkan kode wilayah BPS disimpan sebagai string.

**Bagian 3: Kontak**
- Nomor HP* (dengan validasi format)
- Nomor Telepon
- Email

**Bagian 4: Informasi Tambahan**
- Pendidikan (dropdown)
- Pekerjaan (dropdown)
- Nama Ibu Kandung*
- Nama Ayah
- Nama Pasangan

**Bagian 5: Penanggung Jawab**
- Nama Penanggung Jawab*
- Hubungan dengan Pasien*
- NIK Penanggung Jawab*
- Alamat Penanggung Jawab*
- No. Telepon Penanggung Jawab*

**Bagian 6: Foto (Opsional)**
- Upload foto pasien (capture webcam / upload file)

### 4.2 Form Pendaftaran Kunjungan Rawat Jalan

- Cari Pasien (by NIK/No.RM/Nama)*
- Tanggal Kunjungan* (default: hari ini)
- Poli Tujuan* (dropdown)
- Dokter* (dropdown, filter by poli)
- Jenis Penjamin* (dropdown: Umum/BPJS/Asuransi Lainnya)
- Nomor Kartu Penjamin (jika bukan Umum)
- Keterangan/Keluhan Awal

### 4.3 Form Pendaftaran IGD

- Cari Pasien (by NIK/No.RM/Nama) atau input cepat untuk pasien tidak sadar
- Tanggal & Waktu Kedatangan*
- Cara Datang* (dropdown: Sendiri, Ambulans RS, Ambulans Lain, Polisi)
- Jenis Penjamin* (dropdown)
- Nomor Kartu Penjamin
- Pengantar/Penanggung Jawab (jika pasien tidak sadar)

### 4.4 Form Triage IGD

- Waktu Triage*
- Kategori Triage* (radio button: Merah/Kuning/Hijau/Hitam)
- Keluhan Utama* (textarea)
- Tanda Vital:
  - Tekanan Darah (Sistole/Diastole)*
  - Nadi (x/menit)*
  - Respiratory Rate (x/menit)*
  - Suhu (°C)*
  - SpO2 (%)
- GCS (Eye/Verbal/Motor) - untuk kategori merah
- Petugas Triage* (auto-fill dari login)
- Catatan Tambahan

### 4.5 Form Admisi Rawat Inap

- Data Pasien (tampilan read-only dari kunjungan)
- Tanggal & Waktu Masuk*
- Asal Pasien* (dropdown: Poliklinik/IGD/Rujukan/Lahir di RS)
- Dokter Pengirim (jika dari Poli/IGD)*
- DPJP Rawat Inap*
- Diagnosa Masuk*
- Kelas Kamar yang Diminta* (dropdown)
- Ruangan* (dropdown, filter by kelas)
- Kamar* (dropdown, filter by ruangan, tampilkan ketersediaan)
- Bed* (dropdown, filter by kamar, tampilkan status)
- Jenis Penjamin*
- Nomor Kartu Penjamin

### 4.6 Form Pindah Kamar

- Kamar Asal (read-only)
- Tanggal Pindah*
- Alasan Pindah* (dropdown: Permintaan Pasien, Indikasi Medis, dll)
- Ruangan Tujuan* (dropdown)
- Kamar Tujuan* (dropdown)
- Bed Tujuan* (dropdown)
- Persetujuan Pasien/Keluarga*

### 4.7 Form Kepulangan Pasien

- Data Pasien (read-only)
- Tanggal & Waktu Keluar*
- Cara Keluar* (dropdown: Sembuh, Atas Permintaan Sendiri, Meninggal, Rujuk)
- Diagnosa Akhir* (dengan pilihan ICD-10)
- Kondisi Saat Pulang*
- Instruksi Kontrol Ulang
- Obat Pulang (link ke e-Resep)
- Resume Medis (cetak)

---

## 5. Fitur Pendukung

### 5.1 Pencarian Pasien

**Kriteria Pencarian:**
- Nomor Rekam Medis
- NIK
- Nama Pasien (partial match)
- Tanggal Lahir
- Nomor HP

**Hasil Pencarian Menampilkan:**
- Foto pasien (jika ada)
- Nomor RM
- Nama
- Tanggal Lahir / Umur
- Jenis Kelamin
- Alamat
- Status kunjungan terakhir

### 5.2 Display Antrian

**Tampilan Antrian per Poli:**
- Nomor antrian yang sedang dilayani
- Daftar antrian berikutnya
- Estimasi waktu tunggu
- Notifikasi audio saat nomor dipanggil

### 5.3 Bed Management

**Dashboard Bed:**
- Visualisasi layout ruangan
- Status setiap bed (Tersedia/Terisi/Maintenance/Booking)
- Informasi pasien yang menempati
- Filter berdasarkan kelas/ruangan

### 5.4 Laporan Pendaftaran

**Jenis Laporan:**
- Jumlah kunjungan harian/bulanan
- Kunjungan per poli
- Kunjungan per dokter
- Kunjungan per jenis penjamin
- BOR (Bed Occupancy Rate) untuk rawat inap
- ALOS (Average Length of Stay)

---

## 6. Integrasi dengan Modul Lain

| Modul Tujuan | Data yang Dikirim | Trigger |
|--------------|-------------------|---------|
| EMR | Data pasien + kunjungan | Setelah pendaftaran selesai |
| Billing | Data kunjungan + penjamin | Setelah pendaftaran selesai |
| Farmasi | Data pasien + kunjungan (untuk e-Resep) | Saat order obat |
| Laboratorium | Data pasien + kunjungan | Saat order lab |
| Radiologi | Data pasien + kunjungan | Saat order radiologi |

---

## 7. Aturan Bisnis (Business Rules)

1. **Nomor RM** di-generate otomatis dengan format: `YYMM-XXXXX` (contoh: 2501-00001)
2. **Nomor Registrasi** di-generate per hari dengan format: `YYYYMMDD-XXXX`
3. Satu pasien hanya boleh memiliki **satu kunjungan aktif** per jenis layanan
4. Pasien IGD dengan kategori **Merah** dapat dilayani tanpa pendaftaran terlebih dahulu
5. **NIK** bersifat unik, tidak boleh ada duplikasi
6. Pasien **Rawat Inap** harus memiliki kunjungan **Rawat Jalan** atau **IGD** terlebih dahulu
7. **Booking kamar** maksimal 2 jam sebelum pasien datang
8. **Pindah kamar** harus dengan persetujuan pasien/keluarga kecuali indikasi medis

---

## 8. Kebutuhan Teknis

### 8.1 Validasi

| Field | Validasi |
|-------|----------|
| NIK | 16 digit angka, unique |
| No. HP | Format Indonesia (+62 atau 08) |
| Email | Format email valid |
| Tanggal Lahir | Tidak boleh di masa depan |
| Kode Pos | 5 digit angka |

### 8.2 Fitur Autocomplete

- Pencarian pasien dengan autocomplete (min 3 karakter)
- Alamat dengan autocomplete dari API wilayah Indonesia (atau input text dengan kode BPS)
- Pencarian dokter dengan filter poli

### 8.3 Permission/Role

| Role | Akses |
|------|-------|
| Admin Pendaftaran | Full access pendaftaran + edit master pasien |
| Petugas Pendaftaran | Pendaftaran kunjungan, tidak bisa edit master pasien |
| Petugas IGD | Pendaftaran IGD + Triage |
| Petugas Admisi | Admisi rawat inap + pindah kamar |
| Supervisor | View semua + approval pembatalan |

### 8.4 Cetak/Print

- Kartu berobat pasien
- Gelang pasien (barcode/QR)
- Bukti pendaftaran
- Nomor antrian
- Form persetujuan rawat inap
- Label identitas pasien
