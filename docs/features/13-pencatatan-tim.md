# Modul Pencatatan Tim Terlibat

## 1. Deskripsi Umum

Modul Pencatatan Tim Terlibat adalah sistem untuk mendokumentasikan setiap tenaga kesehatan yang berpartisipasi dalam pelayanan pasien. Modul ini penting untuk:

- Dokumentasi siapa saja yang terlibat dalam pelayanan
- Dasar perhitungan jasa pelayanan
- Akuntabilitas tindakan medis
- Traceability untuk quality assurance
- Kebutuhan medikolegal

---

## 2. Konteks Pencatatan Tim

### 2.1 Per Modul/Unit

| Modul             | Tim yang Dicatat                                        |
| ----------------- | ------------------------------------------------------- |
| **Poliklinik**    | Dokter pemeriksa, Perawat pendamping                    |
| **IGD**           | Dokter jaga, Perawat, Tim resusitasi                    |
| **Rawat Inap**    | DPJP, Perawat shift, Dokter konsultan                   |
| **Kamar Operasi** | Operator, Asisten, Anestesi, Perawat instrumen/sirkuler |
| **Laboratorium**  | Phlebotomist, Analis, Dokter Patologi Klinik            |
| **Radiologi**     | Radiografer, Dokter Radiologi                           |
| **Farmasi**       | Apoteker verifikator, TTK penyiap                       |

### 2.2 Peran dalam Tim

| Kategori              | Peran                                                |
| --------------------- | ---------------------------------------------------- |
| **Dokter**            | DPJP, Operator, Asisten, Konsultan, Anestesi         |
| **Perawat**           | Perawat Primer, Perawat Asosiet, Instrumen, Sirkuler |
| **Tenaga Medis Lain** | Analis, Radiografer, Fisioterapis                    |
| **Penunjang**         | Asisten, Teknisi                                     |

---

## 3. Skema Data

### 3.1 Tim Pelayanan (tim_pelayanan)

| Field          | Tipe Data | Wajib | Keterangan                                                        |
| -------------- | --------- | ----- | ----------------------------------------------------------------- |
| id             | UUID      | Ya    | Primary Key                                                       |
| referensi_tipe | ENUM      | Ya    | 'KUNJUNGAN','RAWAT_INAP','TINDAKAN','ORDER_LAB','ORDER_RADIOLOGI' |
| referensi_id   | UUID      | Ya    | ID dari referensi                                                 |
| kunjungan_id   | UUID      | Ya    | FK ke kunjungan                                                   |
| pasien_id      | UUID      | Ya    | FK ke master_pasien                                               |
| unit_id        | UUID      | Ya    | FK ke unit                                                        |
| tanggal        | DATE      | Ya    | Tanggal pelayanan                                                 |
| shift          | ENUM      | Tidak | 'PAGI','SIANG','MALAM' (untuk rawat inap)                         |
| status         | ENUM      | Ya    | 'AKTIF','SELESAI','BATAL'                                         |
| created_at     | TIMESTAMP | Ya    | Waktu pembuatan                                                   |
| updated_at     | TIMESTAMP | Ya    | Waktu update terakhir                                             |
| created_by     | UUID      | Ya    | FK ke user                                                        |

### 3.2 Anggota Tim (tim_anggota)

| Field         | Tipe Data   | Wajib | Keterangan                    |
| ------------- | ----------- | ----- | ----------------------------- |
| id            | UUID        | Ya    | Primary Key                   |
| tim_id        | UUID        | Ya    | FK ke tim_pelayanan           |
| pegawai_id    | UUID        | Ya    | FK ke pegawai                 |
| peran         | VARCHAR(50) | Ya    | Peran dalam tim               |
| is_utama      | BOOLEAN     | Ya    | Apakah penanggung jawab utama |
| waktu_mulai   | DATETIME    | Ya    | Waktu mulai bertugas          |
| waktu_selesai | DATETIME    | Tidak | Waktu selesai bertugas        |
| catatan       | TEXT        | Tidak | Catatan                       |
| status        | ENUM        | Ya    | 'AKTIF','SELESAI','DIGANTI'   |
| created_at    | TIMESTAMP   | Ya    | Waktu pembuatan               |
| updated_at    | TIMESTAMP   | Ya    | Waktu update terakhir         |

### 3.3 Riwayat Pergantian Tim (tim_history)

| Field                | Tipe Data    | Wajib | Keterangan            |
| -------------------- | ------------ | ----- | --------------------- |
| id                   | UUID         | Ya    | Primary Key           |
| tim_id               | UUID         | Ya    | FK ke tim_pelayanan   |
| pegawai_lama_id      | UUID         | Ya    | FK ke pegawai         |
| pegawai_baru_id      | UUID         | Ya    | FK ke pegawai         |
| peran                | VARCHAR(50)  | Ya    | Peran yang digantikan |
| waktu_pergantian     | DATETIME     | Ya    | Waktu pergantian      |
| alasan               | VARCHAR(100) | Ya    | Alasan pergantian     |
| catatan_serah_terima | TEXT         | Tidak | Catatan serah terima  |
| created_by           | UUID         | Ya    | FK ke user            |
| created_at           | TIMESTAMP    | Ya    | Waktu pembuatan       |

### 3.4 Template Tim per Unit (template_tim)

| Field         | Tipe Data    | Wajib | Keterangan                            |
| ------------- | ------------ | ----- | ------------------------------------- |
| id            | UUID         | Ya    | Primary Key                           |
| unit_id       | UUID         | Ya    | FK ke unit                            |
| tindakan_id   | UUID         | Tidak | FK ke master_tindakan (jika spesifik) |
| nama_template | VARCHAR(100) | Ya    | Nama template                         |
| deskripsi     | TEXT         | Tidak | Deskripsi                             |
| is_active     | BOOLEAN      | Ya    | Status aktif                          |
| created_at    | TIMESTAMP    | Ya    | Waktu pembuatan                       |

### 3.5 Detail Template Tim (template_tim_detail)

| Field       | Tipe Data    | Wajib | Keterangan                    |
| ----------- | ------------ | ----- | ----------------------------- |
| id          | UUID         | Ya    | Primary Key                   |
| template_id | UUID         | Ya    | FK ke template_tim            |
| peran       | VARCHAR(50)  | Ya    | Nama peran                    |
| jumlah      | INT          | Ya    | Jumlah orang dengan peran ini |
| is_wajib    | BOOLEAN      | Ya    | Wajib diisi                   |
| kualifikasi | VARCHAR(100) | Tidak | Kualifikasi yang dibutuhkan   |
| urutan      | INT          | Ya    | Urutan tampilan               |
| created_at  | TIMESTAMP    | Ya    | Waktu pembuatan               |

---

## 4. Form-Form yang Dibutuhkan

### 4.1 Form Input Tim Poliklinik

**Konteks:** Saat input SOAP atau selesai pemeriksaan

**Informasi Kunjungan (read-only):**

- Nama Pasien / No. RM
- Poli / Tanggal
- Diagnosa

**Input Tim:**
| Peran | Nama | Waktu | Status |
|-------|------|-------|--------|
| Dokter Pemeriksa\* | [autocomplete] | [auto] | [aktif] |
| Perawat Pendamping | [autocomplete] | [auto] | [aktif] |

### 4.2 Form Input Tim Kamar Operasi

**Konteks:** Sebelum/saat/setelah operasi

**Informasi Operasi (read-only):**

- Nama Pasien / No. RM
- Jenis Operasi
- Jadwal

**Input Tim Operasi:**
| Peran | Nama* | Waktu Mulai | Waktu Selesai |
|-------|-------|-------------|---------------|
| Operator Utama* | [autocomplete] | [datetime] | [datetime] |
| Asisten Operator 1 | [autocomplete] | [datetime] | [datetime] |
| Asisten Operator 2 | [autocomplete] | [datetime] | [datetime] |
| Dokter Anestesi* | [autocomplete] | [datetime] | [datetime] |
| Penata Anestesi | [autocomplete] | [datetime] | [datetime] |
| Perawat Instrumen* | [autocomplete] | [datetime] | [datetime] |
| Perawat Sirkuler\* | [autocomplete] | [datetime] | [datetime] |

**Validasi:**

- Minimal: Operator, Anestesi, Perawat Instrumen, Perawat Sirkuler
- Tidak boleh duplicate person dengan peran berbeda yang overlap

### 4.3 Form Input Tim Rawat Inap (per Shift)

**Konteks:** Awal shift dan serah terima

**Informasi (read-only):**

- Ruangan
- Tanggal
- Shift (Pagi/Siang/Malam)

**Input Tim Shift:**
| Peran | Nama | Status |
|-------|------|--------|
| Perawat Kepala Shift\* | [autocomplete] | [aktif] |
| Perawat Pelaksana 1 | [autocomplete] | [aktif] |
| Perawat Pelaksana 2 | [autocomplete] | [aktif] |
| ... | ... | ... |

**Pasien yang Ditangani:**

- Link ke daftar pasien di ruangan

### 4.4 Form Input Tim Laboratorium

**Konteks:** Saat pemeriksaan lab

**Input Tim:**
| Peran | Nama | Waktu |
|-------|------|-------|
| Phlebotomist | [autocomplete] | [datetime] |
| Analis Pemeriksa\* | [autocomplete] | [datetime] |
| Validator Teknis | [autocomplete] | [datetime] |
| Validator Klinis (Dokter PK) | [autocomplete] | [datetime] |

### 4.5 Form Serah Terima / Pergantian

**Konteks:** Pergantian personel dalam tim

**Informasi (read-only):**

- Tim yang aktif
- Anggota saat ini

**Input Pergantian:**

- Peran yang Diganti\*
- Personel Lama\* (auto dari aktif)
- Personel Baru\* (autocomplete)
- Waktu Pergantian\* (default: sekarang)
- Alasan Pergantian\* (dropdown):
  - Pergantian shift
  - Istirahat
  - Keperluan mendesak
  - Lainnya
- Catatan Serah Terima (textarea)

---

## 5. Fitur Pendukung

### 5.1 Dashboard Tim Aktif

**Per Unit:**

- Daftar tim yang sedang aktif
- Status setiap anggota
- Alert jika ada peran kosong

### 5.2 Riwayat Tim per Pasien

**Tampilan:**

- Timeline semua tim yang menangani pasien
- Filter by periode, unit
- Detail siapa melakukan apa

### 5.3 Validasi Kompetensi

**Fitur:**

- Cek STR/SIP sebelum assign
- Warning jika expired
- Block jika tidak sesuai kualifikasi

### 5.4 Template Tim

**Fitur:**

- Template per jenis tindakan
- Quick fill dari template
- Customizable per unit

### 5.5 Integrasi Jadwal

**Fitur:**

- Saran personel dari jadwal shift
- Warning jika assign di luar jadwal
- Tracking overtime

---

## 6. Integrasi dengan Modul Lain

| Modul              | Integrasi                         |
| ------------------ | --------------------------------- |
| **EMR**            | Input tim saat dokumentasi klinis |
| **Kamar Operasi**  | Input tim operasi                 |
| **Jasa Pelayanan** | Data tim untuk kalkulasi JP       |
| **Laboratorium**   | Input analis dan validator        |
| **Radiologi**      | Input radiografer dan radiolog    |
| **SDM**            | Validasi jadwal, kompetensi       |

---

## 7. Aturan Bisnis (Business Rules)

1. Setiap pelayanan **wajib** memiliki minimal 1 penanggung jawab utama
2. **DPJP** hanya boleh 1 per episode rawat inap
3. Tim operasi **wajib** lengkap sebelum operasi dimulai
4. Pergantian personel **wajib** dengan serah terima tercatat
5. **Tidak boleh** assign personel dengan STR/SIP expired
6. Personel yang **cuti/tidak hadir** tidak bisa di-assign
7. **Overlap** waktu tugas di tempat berbeda tidak diizinkan
8. Data tim **tidak bisa diedit** setelah 24 jam tanpa approval
9. **Konsultan** dari luar unit harus tercatat dengan jelas
10. Tim **IGD resusitasi** memerlukan pencatatan real-time

---

## 8. Kebutuhan Teknis

### 8.1 Real-time Tracking

**Untuk Kondisi Kritis:**

- Update real-time siapa yang aktif
- Quick assign/reassign
- Mobile-friendly interface

### 8.2 Permission/Role

| Role                 | Akses                       |
| -------------------- | --------------------------- |
| Kepala Unit          | Assign tim unit sendiri     |
| Kepala Ruang         | Assign tim ruangan          |
| Perawat Shift Leader | Assign anggota shift        |
| Admin                | Semua + template + override |

### 8.3 Laporan

**Laporan Standar:**

- Tim per pelayanan
- Beban kerja per personel
- Overtime report
- Kepatuhan pengisian tim

---

## 9. Notifikasi

| Event                      | Penerima             | Channel |
| -------------------------- | -------------------- | ------- |
| Tim belum lengkap          | Kepala Unit          | Alert   |
| Pergantian shift mendekati | Tim shift berikutnya | Push    |
| STR/SIP akan expired       | Personel + SDM       | Email   |
| Overlap assignment         | Admin                | Alert   |
