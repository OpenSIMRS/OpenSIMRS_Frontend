# Modul Radiologi (RIS - Radiology Information System)

## 1. Deskripsi Umum

Modul Radiologi (RIS - Radiology Information System) adalah sistem informasi yang mengelola seluruh proses pelayanan radiologi/imaging mulai dari penerimaan order, penjadwalan, pelaksanaan pemeriksaan, penyimpanan gambar, pembuatan expertise, hingga pengiriman hasil ke rekam medis. Modul ini mencakup:

- Penerimaan order pemeriksaan radiologi
- Penjadwalan pemeriksaan
- Pelaksanaan dan dokumentasi pemeriksaan
- Penyimpanan gambar (terintegrasi PACS)
- Pembuatan dan validasi expertise
- Distribusi hasil ke EMR

---

## 2. Jenis Pemeriksaan

| Kategori                   | Jenis Pemeriksaan                              |
| -------------------------- | ---------------------------------------------- |
| **Radiologi Konvensional** | X-Ray, Fluoroscopy, Mammography                |
| **CT-Scan**                | CT Scan dengan/tanpa kontras, CT Angiography   |
| **MRI**                    | MRI dengan/tanpa kontras                       |
| **USG**                    | USG Abdomen, USG Obstetri, USG Mammae, Doppler |
| **Intervensional**         | DSA, Biopsi CT-guided, Drainage                |

---

## 3. Alur Kerja (Workflow)

### 3.1 Alur Pemeriksaan Radiologi

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Order dari      │────▶│ Terima Order &   │────▶│ Scheduling      │
│ Dokter (EMR)    │     │ Validasi         │     │ (Penjadwalan)   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Kirim ke EMR &  │◀────│ Pembuatan &      │◀────│ Pelaksanaan     │
│ PACS            │     │ Validasi Expertise│     │ Pemeriksaan     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 3.2 Detail Alur Per Tahap

**1. Penerimaan Order**

- Order masuk dari EMR (elektronik) atau formulir manual
- Validasi kelengkapan data pasien dan pemeriksaan
- Cek kontraindikasi (hamil, alergi kontras, fungsi ginjal)
- Penentuan kebutuhan persiapan pasien

**2. Penjadwalan (Scheduling)**

- Cek ketersediaan slot pemeriksaan
- Booking jadwal pasien
- Kirim informasi jadwal & persiapan ke pasien/ruangan
- Untuk CITO: prioritaskan slot tersedia

**3. Persiapan Pasien**

- Verifikasi identitas pasien
- Cek persiapan sesuai jenis pemeriksaan
- Cek informed consent (untuk kontras/invasif)
- Cek lab (kreatinin untuk kontras)

**4. Pelaksanaan Pemeriksaan**

- Positioning pasien
- Pengambilan gambar
- Quality check gambar
- Pemberian kontras (jika ada)
- Dokumentasi waktu dan pelaksana

**5. Pengiriman ke PACS**

- Transfer gambar ke PACS server
- Verifikasi gambar terkirim
- Linking dengan data pasien

**6. Pembuatan Expertise**

- Dokter radiolog membaca gambar
- Input expertise/interpretasi
- Validasi dan tanda tangan digital

**7. Distribusi Hasil**

- Hasil terkirim ke EMR secara otomatis
- Gambar dapat diakses via PACS viewer
- Cetak hasil jika diperlukan

---

## 4. Skema Data

### 4.1 Order Radiologi (order_radiologi)

| Field           | Tipe Data    | Wajib | Keterangan                                         |
| --------------- | ------------ | ----- | -------------------------------------------------- |
| id              | UUID         | Ya    | Primary Key                                        |
| no_order        | VARCHAR(20)  | Ya    | Nomor order (auto-generated)                       |
| kunjungan_id    | UUID         | Ya    | FK ke kunjungan                                    |
| pasien_id       | UUID         | Ya    | FK ke master_pasien                                |
| tanggal_order   | DATETIME     | Ya    | Tanggal dan waktu order                            |
| dokter_id       | UUID         | Ya    | FK ke pegawai (Dokter pengirim)                    |
| ruangan_asal_id | UUID         | Ya    | FK ke ruangan                                      |
| pemeriksaan_id  | UUID         | Ya    | FK ke master_pemeriksaan_radiologi                 |
| modalitas_id    | UUID         | Ya    | FK ke modalitas                                    |
| prioritas       | ENUM         | Ya    | 'CITO','ELEKTIF'                                   |
| diagnosa_klinis | TEXT         | Ya    | Diagnosa/indikasi klinis                           |
| bagian_tubuh    | VARCHAR(100) | Ya    | Area yang diperiksa                                |
| proyeksi        | VARCHAR(100) | Tidak | Proyeksi (AP, Lateral, dll)                        |
| dengan_kontras  | BOOLEAN      | Ya    | Apakah dengan kontras                              |
| catatan_klinis  | TEXT         | Tidak | Informasi klinis tambahan                          |
| status_order    | ENUM         | Ya    | 'PENDING','DIJADWALKAN','PROSES','SELESAI','BATAL' |
| created_at      | TIMESTAMP    | Ya    | Waktu pembuatan                                    |
| updated_at      | TIMESTAMP    | Ya    | Waktu update terakhir                              |
| created_by      | UUID         | Ya    | FK ke user                                         |

### 4.2 Jadwal Radiologi (jadwal_radiologi)

| Field                | Tipe Data | Wajib | Keterangan                                             |
| -------------------- | --------- | ----- | ------------------------------------------------------ |
| id                   | UUID      | Ya    | Primary Key                                            |
| order_radiologi_id   | UUID      | Ya    | FK ke order_radiologi                                  |
| tanggal_jadwal       | DATE      | Ya    | Tanggal pemeriksaan                                    |
| waktu_mulai          | TIME      | Ya    | Waktu mulai                                            |
| waktu_selesai        | TIME      | Ya    | Estimasi waktu selesai                                 |
| ruang_pemeriksaan_id | UUID      | Ya    | FK ke ruang_radiologi                                  |
| modalitas_id         | UUID      | Ya    | FK ke modalitas                                        |
| status               | ENUM      | Ya    | 'BOOKING','HADIR','TIDAK_HADIR','SELESAI','RESCHEDULE' |
| catatan_persiapan    | TEXT      | Tidak | Instruksi persiapan pasien                             |
| created_at           | TIMESTAMP | Ya    | Waktu pembuatan                                        |
| updated_at           | TIMESTAMP | Ya    | Waktu update terakhir                                  |

### 4.3 Pelaksanaan Radiologi (pelaksanaan_radiologi)

| Field              | Tipe Data     | Wajib | Keterangan                   |
| ------------------ | ------------- | ----- | ---------------------------- |
| id                 | UUID          | Ya    | Primary Key                  |
| order_radiologi_id | UUID          | Ya    | FK ke order_radiologi        |
| jadwal_id          | UUID          | Tidak | FK ke jadwal_radiologi       |
| waktu_mulai        | DATETIME      | Ya    | Waktu mulai pemeriksaan      |
| waktu_selesai      | DATETIME      | Ya    | Waktu selesai pemeriksaan    |
| radiografer_id     | UUID          | Ya    | FK ke pegawai (Radiografer)  |
| dosis_radiasi      | DECIMAL(10,2) | Tidak | Dosis radiasi (mGy)          |
| kontras_jenis      | VARCHAR(100)  | Tidak | Jenis kontras yang digunakan |
| kontras_volume     | DECIMAL(10,2) | Tidak | Volume kontras (ml)          |
| kontras_lot        | VARCHAR(50)   | Tidak | Nomor lot kontras            |
| jumlah_exposure    | INT           | Tidak | Jumlah pengambilan gambar    |
| catatan_teknis     | TEXT          | Tidak | Catatan teknis               |
| status             | ENUM          | Ya    | 'PROSES','SELESAI','GAGAL'   |
| created_at         | TIMESTAMP     | Ya    | Waktu pembuatan              |
| updated_at         | TIMESTAMP     | Ya    | Waktu update terakhir        |

### 4.4 Expertise Radiologi (expertise)

| Field              | Tipe Data | Wajib | Keterangan                      |
| ------------------ | --------- | ----- | ------------------------------- |
| id                 | UUID      | Ya    | Primary Key                     |
| order_radiologi_id | UUID      | Ya    | FK ke order_radiologi           |
| pelaksanaan_id     | UUID      | Ya    | FK ke pelaksanaan_radiologi     |
| radiolog_id        | UUID      | Ya    | FK ke pegawai (Dokter Radiolog) |
| tanggal_baca       | DATETIME  | Ya    | Tanggal pembacaan               |
| temuan             | TEXT      | Ya    | Deskripsi temuan                |
| kesan              | TEXT      | Ya    | Kesan/kesimpulan                |
| saran              | TEXT      | Tidak | Saran pemeriksaan lanjutan      |
| status_validasi    | ENUM      | Ya    | 'DRAFT','FINAL'                 |
| waktu_validasi     | DATETIME  | Tidak | Waktu validasi                  |
| tanda_tangan       | TEXT      | Tidak | Tanda tangan digital            |
| created_at         | TIMESTAMP | Ya    | Waktu pembuatan                 |
| updated_at         | TIMESTAMP | Ya    | Waktu update terakhir           |

### 4.5 Master Pemeriksaan Radiologi (master_pemeriksaan_radiologi)

| Field           | Tipe Data    | Wajib | Keterangan              |
| --------------- | ------------ | ----- | ----------------------- |
| id              | UUID         | Ya    | Primary Key             |
| kode            | VARCHAR(20)  | Ya    | Kode pemeriksaan        |
| nama            | VARCHAR(100) | Ya    | Nama pemeriksaan        |
| modalitas_id    | UUID         | Ya    | FK ke modalitas         |
| kategori        | VARCHAR(50)  | Ya    | Kategori pemeriksaan    |
| durasi_estimasi | INT          | Ya    | Durasi estimasi (menit) |
| persiapan       | TEXT         | Tidak | Instruksi persiapan     |
| kontraindikasi  | TEXT         | Tidak | Kontraindikasi          |
| tarif_id        | UUID         | Ya    | FK ke master_tarif      |
| is_active       | BOOLEAN      | Ya    | Status aktif            |
| created_at      | TIMESTAMP    | Ya    | Waktu pembuatan         |
| updated_at      | TIMESTAMP    | Ya    | Waktu update terakhir   |

### 4.6 Master Modalitas (modalitas)

| Field      | Tipe Data   | Wajib | Keterangan                           |
| ---------- | ----------- | ----- | ------------------------------------ |
| id         | UUID        | Ya    | Primary Key                          |
| kode       | VARCHAR(10) | Ya    | Kode modalitas (CR, CT, MR, US, dll) |
| nama       | VARCHAR(50) | Ya    | Nama modalitas                       |
| deskripsi  | TEXT        | Tidak | Deskripsi                            |
| ruang_id   | UUID        | Ya    | FK ke ruang_radiologi                |
| ae_title   | VARCHAR(50) | Tidak | DICOM AE Title                       |
| is_active  | BOOLEAN     | Ya    | Status aktif                         |
| created_at | TIMESTAMP   | Ya    | Waktu pembuatan                      |

### 4.7 Ruang Radiologi (ruang_radiologi)

| Field            | Tipe Data    | Wajib | Keterangan                       |
| ---------------- | ------------ | ----- | -------------------------------- |
| id               | UUID         | Ya    | Primary Key                      |
| kode             | VARCHAR(10)  | Ya    | Kode ruang                       |
| nama             | VARCHAR(50)  | Ya    | Nama ruang                       |
| lokasi           | VARCHAR(100) | Tidak | Lokasi/lantai                    |
| modalitas_id     | UUID         | Tidak | FK ke modalitas (jika dedicated) |
| kapasitas_harian | INT          | Tidak | Kapasitas pemeriksaan per hari   |
| is_active        | BOOLEAN      | Ya    | Status aktif                     |

### 4.8 Screening Kontras (screening_kontras)

| Field                  | Tipe Data    | Wajib | Keterangan                                   |
| ---------------------- | ------------ | ----- | -------------------------------------------- |
| id                     | UUID         | Ya    | Primary Key                                  |
| order_radiologi_id     | UUID         | Ya    | FK ke order_radiologi                        |
| pasien_id              | UUID         | Ya    | FK ke master_pasien                          |
| tanggal_screening      | DATETIME     | Ya    | Tanggal screening                            |
| riwayat_alergi_kontras | BOOLEAN      | Ya    | Pernah alergi kontras                        |
| detail_alergi          | TEXT         | Tidak | Detail reaksi alergi                         |
| penyakit_ginjal        | BOOLEAN      | Ya    | Riwayat penyakit ginjal                      |
| kreatinin_terakhir     | DECIMAL(5,2) | Tidak | Nilai kreatinin terakhir                     |
| tanggal_kreatinin      | DATE         | Tidak | Tanggal pemeriksaan kreatinin                |
| egfr                   | DECIMAL(5,2) | Tidak | Nilai eGFR                                   |
| hamil                  | ENUM         | Tidak | 'YA','TIDAK','TIDAK_TAHU'                    |
| menyusui               | BOOLEAN      | Tidak | Sedang menyusui                              |
| diabetes               | BOOLEAN      | Ya    | Riwayat diabetes                             |
| menggunakan_metformin  | BOOLEAN      | Tidak | Menggunakan metformin                        |
| penyakit_tiroid        | BOOLEAN      | Ya    | Riwayat penyakit tiroid                      |
| keputusan              | ENUM         | Ya    | 'LAYAK','TIDAK_LAYAK','LAYAK_DENGAN_KONDISI' |
| catatan                | TEXT         | Tidak | Catatan                                      |
| petugas_id             | UUID         | Ya    | FK ke pegawai                                |
| created_at             | TIMESTAMP    | Ya    | Waktu pembuatan                              |

---

## 5. Form-Form yang Dibutuhkan

### 5.1 Form Penerimaan Order

**Tampilan Daftar Order Masuk:**

- Filter: Tanggal, Status, Prioritas, Modalitas
- Kolom: No. Order, Tanggal, Pasien, Ruangan, Dokter, Jenis Pemeriksaan, Prioritas, Status, Aksi

**Detail Order:**

- Informasi Pasien (read-only)
- Informasi Order (read-only)
- Jenis Pemeriksaan
- Kontraindikasi Check
- Tombol: Terima & Jadwalkan, Tolak Order (dengan alasan)

### 5.2 Form Penjadwalan

**Kalender View:**

- Tampilan per modalitas/ruang
- Slot waktu yang tersedia
- Drag & drop untuk booking

**Form Booking:**

- Order Radiologi\* (read-only dari order)
- Tanggal Pemeriksaan\*
- Waktu Mulai\*
- Ruang Pemeriksaan\* (dropdown)
- Modalitas\* (dropdown)
- Catatan Persiapan (template per jenis pemeriksaan)
  - Puasa \_\_ jam sebelum pemeriksaan
  - Minum air putih \_\_ gelas
  - Lepaskan perhiasan/logam
  - dll

### 5.3 Form Screening Kontras

**Untuk Pemeriksaan dengan Kontras:**

**Riwayat Alergi:**

- Apakah pernah alergi kontras sebelumnya?\* (radio: Ya/Tidak)
- Jika Ya, jelaskan reaksi yang terjadi (textarea)
- Apakah ada alergi obat/makanan lain?\* (radio)

**Riwayat Penyakit:**

- Apakah ada riwayat penyakit ginjal?\* (radio)
- Nilai Kreatinin terakhir\* (input)
- Tanggal pemeriksaan kreatinin\* (date)
- eGFR\* (auto-calculate atau input)
- Apakah sedang hamil?\* (radio: Ya/Tidak/Tidak Tahu)
- Apakah sedang menyusui?\* (radio)
- Apakah ada riwayat diabetes?\* (radio)
- Apakah menggunakan Metformin?\* (jika diabetes)
- Apakah ada penyakit tiroid?\* (radio)

**Keputusan:**

- Status Kelayakan\* (radio: Layak/Tidak Layak/Layak dengan Kondisi)
- Catatan
- Petugas Screening

### 5.4 Form Informed Consent

**Untuk Pemeriksaan Kontras/Invasif:**

- Nama Tindakan\*
- Tujuan Tindakan\*
- Prosedur Tindakan\*
- Risiko & Komplikasi\*
- Alternatif Tindakan
- Pernyataan Pasien/Keluarga
- Tanda Tangan Pasien/Keluarga
- Tanda Tangan Saksi
- Tanda Tangan Dokter/Petugas

### 5.5 Form Pelaksanaan Pemeriksaan

**Informasi Order (read-only):**

- No. Order
- Nama Pasien / No. RM
- Jenis Pemeriksaan
- Dokter Pengirim

**Input Pelaksanaan:**

- Waktu Mulai\* (datetime)
- Waktu Selesai\* (datetime)
- Radiografer Pelaksana\* (dropdown/auto-fill)
- Modalitas/Alat\* (dropdown)
- Jumlah Exposure (input)
- Dosis Radiasi (mGy) - jika ada

**Jika dengan Kontras:**

- Jenis Kontras\* (dropdown)
- Volume (ml)\*
- Lot Number\*
- Expired Date

**Catatan Teknis (textarea)**

**Quality Check:**

- Kualitas Gambar\* (radio: Baik/Cukup/Perlu Pengulangan)
- Alasan jika perlu pengulangan

### 5.6 Form Expertise (Interpretasi Radiolog)

**Header:**

- Nama Pasien / No. RM
- Tanggal Lahir / Umur / Jenis Kelamin
- Dokter Pengirim
- Diagnosa Klinis
- Jenis Pemeriksaan

**Gambar (dari PACS viewer):**

- Embedded DICOM viewer
- Tools: Zoom, Pan, Window/Level, Measurement
- Compare dengan pemeriksaan sebelumnya

**Input Expertise:**

- **Temuan/Deskripsi\*** (rich text editor)
  - Template per jenis pemeriksaan
  - Fitur auto-text/snippet
- **Kesan/Kesimpulan\*** (textarea)
- **Saran** (textarea)
  - Pemeriksaan lanjutan yang direkomendasikan

**Validasi:**

- Simpan sebagai Draft
- Finalisasi & Validasi
- Tanda Tangan Digital

### 5.7 Form Cetak Hasil

**Layout Hasil:**

- Header: Logo RS, Nama RS, Alamat
- Data Pasien
- Data Pemeriksaan
- Gambar representatif (opsional)
- Expertise:
  - Temuan
  - Kesan
  - Saran
- Footer: Tanggal, Nama Radiolog, Tanda Tangan

---

## 6. Fitur Pendukung

### 6.1 Dashboard Radiologi

**Widget:**

- Statistik order hari ini (by status)
- Order CITO pending
- Jadwal hari ini
- Pending expertise
- TAT monitoring

### 6.2 Scheduling Board

**Tampilan:**

- Kalender per hari/minggu
- Per ruang/modalitas
- Color coding by status
- Slot availability

**Fitur:**

- Drag & drop reschedule
- Conflict detection
- Capacity alert

### 6.3 Worklist Radiografer

**Per Modalitas:**

- Daftar pasien yang dijadwalkan
- Status persiapan
- Prioritas (CITO first)
- Checklist persiapan

### 6.4 Reading Worklist (Radiolog)

**Daftar Pending Expertise:**

- Filter: Tanggal, Modalitas, Prioritas
- Sort by: Waktu pemeriksaan, Prioritas
- Status: Belum dibaca, Draft, Final
- Quick link ke PACS viewer

### 6.5 PACS Integration

**Fitur Viewer:**

- DICOM image viewing
- Window/Level adjustment
- Zoom, Pan, Rotate
- Measurement tools
- Compare studies
- Report linking

**PACS Workflow:**

- Auto-send images after examination
- Worklist integration (DICOM Modality Worklist)
- Storage commitment

### 6.6 Template Expertise

**Template per Jenis Pemeriksaan:**

- Normal template
- Abnormal findings template
- Structured reporting
- Custom snippets per radiolog

---

## 7. Integrasi dengan Modul Lain

| Modul Sumber | Data yang Diterima     | Penggunaan          |
| ------------ | ---------------------- | ------------------- |
| EMR          | Order pemeriksaan      | Trigger worklist    |
| Pendaftaran  | Data pasien, kunjungan | Identifikasi pasien |
| Laboratorium | Hasil kreatinin        | Screening kontras   |

| Modul Tujuan | Data yang Dikirim             | Trigger             |
| ------------ | ----------------------------- | ------------------- |
| EMR          | Hasil expertise + link gambar | Setelah validasi    |
| Billing      | Detail pemeriksaan & tarif    | Setelah pelaksanaan |
| PACS         | DICOM images                  | Setelah akuisisi    |

---

## 8. Aturan Bisnis (Business Rules)

1. **Order CITO** harus diprioritaskan dan expertise selesai < 2 jam
2. **Pemeriksaan kontras** wajib screening dan informed consent
3. **Kreatinin** untuk CT/MRI dengan kontras tidak boleh > 7 hari
4. **eGFR < 30** merupakan kontraindikasi relatif kontras iodine
5. Pasien **hamil** tidak boleh X-Ray/CT kecuali indikasi vital
6. **Expertise** harus divalidasi oleh dokter spesialis radiologi
7. **Gambar DICOM** harus tersimpan minimal 5 tahun
8. **Reschedule** maksimal 2x untuk satu order
9. Setiap pemeriksaan harus mencatat **radiografer pelaksana**
10. **Dosis radiasi** wajib dicatat untuk pemeriksaan X-Ray/CT

---

## 9. Kebutuhan Teknis

### 9.1 DICOM & PACS

| Aspek     | Spesifikasi                   |
| --------- | ----------------------------- |
| Protokol  | DICOM 3.0                     |
| Services  | C-STORE, C-FIND, C-MOVE, MWL  |
| Viewer    | Web-based DICOM viewer        |
| Storage   | PACS server dengan redundancy |
| Retention | Minimal 5 tahun               |

### 9.2 Hardware Integration

| Perangkat     | Koneksi    |
| ------------- | ---------- |
| CT Scanner    | DICOM, HL7 |
| MRI           | DICOM      |
| X-Ray Digital | DICOM      |
| USG           | DICOM      |
| CR/DR         | DICOM      |

### 9.3 Permission/Role

| Role            | Akses                                    |
| --------------- | ---------------------------------------- |
| Radiografer     | Terima order, pelaksanaan, quality check |
| Admin Radiologi | Scheduling, administrasi                 |
| Radiolog        | Reading, expertise, validasi             |
| Supervisor      | Semua + kelola master + laporan          |

### 9.4 Laporan

**Laporan Harian:**

- Volume pemeriksaan per modalitas
- Order CITO
- TAT Report
- Pending expertise

**Laporan Bulanan:**

- Statistik pemeriksaan
- Top 10 jenis pemeriksaan
- Produktivitas radiolog
- Dosis radiasi summary

**Laporan Khusus:**

- Pemeriksaan per penjamin
- Pemeriksaan per dokter pengirim
- Reject rate

---

## 10. Notifikasi

| Event                     | Penerima          | Channel           |
| ------------------------- | ----------------- | ----------------- |
| Order CITO masuk          | Petugas Radiologi | Push Notification |
| Jadwal pemeriksaan        | Pasien/Ruangan    | SMS/WA            |
| Hasil expertise tersedia  | Dokter Pengirim   | Push Notification |
| Temuan kritis             | Dokter Pengirim   | Push + Telepon    |
| Pending expertise > 4 jam | Radiolog          | Alert             |
