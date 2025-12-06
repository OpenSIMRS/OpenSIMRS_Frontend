# Modul Farmasi/Apotek

## 1. Deskripsi Umum

Modul Farmasi/Apotek adalah sistem informasi yang mengelola seluruh proses pelayanan kefarmasian mulai dari penerimaan e-Resep, verifikasi, dispensing, hingga penyerahan obat kepada pasien. Modul ini mencakup:

- Penerimaan dan verifikasi e-Resep dari dokter
- Pengecekan interaksi obat dan alergi
- Dispensing obat
- Manajemen stok dengan metode FEFO/FIFO
- Pelayanan informasi obat kepada pasien
- Pencatatan retur dan pembatalan

---

## 2. Jenis Pelayanan Farmasi

| Jenis                   | Deskripsi                                               |
| ----------------------- | ------------------------------------------------------- |
| **Farmasi Rawat Jalan** | Pelayanan resep pasien rawat jalan, obat dibawa pulang  |
| **Farmasi Rawat Inap**  | Pelayanan obat harian untuk pasien rawat inap (UDD/ODD) |
| **Farmasi IGD**         | Pelayanan resep pasien IGD, prioritas tinggi            |
| **Farmasi Depo OK**     | Pelayanan obat untuk kamar operasi                      |
| **Farmasi Depo ICU**    | Pelayanan obat untuk ICU/ICCU                           |

---

## 3. Alur Kerja (Workflow)

### 3.1 Alur Pelayanan Resep Rawat Jalan

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ e-Resep dari    │────▶│ Screening &      │────▶│ Dispensing      │
│ Dokter (EMR)    │     │ Verifikasi       │     │ (Penyiapan)     │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Selesai         │◀────│ Penyerahan &     │◀────│ Pengecekan      │
│                 │     │ KIE              │     │ Akhir           │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 3.2 Alur Pelayanan Rawat Inap (Unit Dose Dispensing)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ e-Resep Harian  │────▶│ Verifikasi &     │────▶│ Penyiapan       │
│ dari DPJP       │     │ Kalkulasi Dosis  │     │ Per Waktu Pakai │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Dokumentasi     │◀────│ Distribusi ke    │◀────│ Pengecekan &    │
│ Pemberian       │     │ Ruangan          │     │ Labeling        │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 3.3 Detail Proses Verifikasi

**Administrative Screening:**

- Kelengkapan data pasien
- Kelengkapan resep (nama dokter, tanggal, tanda tangan)
- Legalitas resep (terutama narkotika/psikotropika)

**Pharmacological Screening:**

- Ketepatan indikasi
- Ketepatan dosis
- Interaksi obat-obat
- Duplikasi terapi
- Alergi obat pasien
- Kontraindikasi

**Pharmaceutical Screening:**

- Ketersediaan obat
- Stabilitas sediaan
- Inkompatibilitas (untuk IV admixture)

---

## 4. Skema Data

### 4.1 Resep (resep)

| Field           | Tipe Data   | Wajib | Keterangan                                                  |
| --------------- | ----------- | ----- | ----------------------------------------------------------- |
| id              | UUID        | Ya    | Primary Key                                                 |
| no_resep        | VARCHAR(20) | Ya    | Nomor resep (auto-generated)                                |
| kunjungan_id    | UUID        | Ya    | FK ke kunjungan                                             |
| pasien_id       | UUID        | Ya    | FK ke master_pasien                                         |
| tanggal_resep   | DATETIME    | Ya    | Tanggal dan waktu resep                                     |
| dokter_id       | UUID        | Ya    | FK ke pegawai (Dokter penulis resep)                        |
| ruangan_asal_id | UUID        | Ya    | FK ke ruangan                                               |
| jenis_resep     | ENUM        | Ya    | 'RAWAT_JALAN','RAWAT_INAP','PULANG','IGD'                   |
| prioritas       | ENUM        | Ya    | 'CITO','BIASA'                                              |
| catatan         | TEXT        | Tidak | Catatan untuk farmasi                                       |
| status_resep    | ENUM        | Ya    | 'PENDING','VERIFIKASI','PROSES','SELESAI','PARTIAL','BATAL' |
| created_at      | TIMESTAMP   | Ya    | Waktu pembuatan                                             |
| updated_at      | TIMESTAMP   | Ya    | Waktu update terakhir                                       |
| created_by      | UUID        | Ya    | FK ke user                                                  |

### 4.2 Detail Resep (resep_detail)

| Field                 | Tipe Data    | Wajib | Keterangan                                                |
| --------------------- | ------------ | ----- | --------------------------------------------------------- |
| id                    | UUID         | Ya    | Primary Key                                               |
| resep_id              | UUID         | Ya    | FK ke resep                                               |
| obat_id               | UUID         | Ya    | FK ke master_obat                                         |
| nama_obat             | VARCHAR(100) | Ya    | Nama obat (snapshot)                                      |
| dosis                 | VARCHAR(50)  | Ya    | Dosis per kali pakai                                      |
| satuan_dosis          | VARCHAR(20)  | Ya    | Satuan dosis                                              |
| frekuensi             | VARCHAR(50)  | Ya    | Frekuensi pemakaian                                       |
| rute                  | VARCHAR(20)  | Ya    | Rute pemberian                                            |
| durasi                | INT          | Tidak | Durasi hari                                               |
| jumlah_diminta        | INT          | Ya    | Jumlah yang diminta                                       |
| jumlah_diberikan      | INT          | Tidak | Jumlah yang diberikan                                     |
| instruksi             | TEXT         | Tidak | Instruksi khusus                                          |
| status                | ENUM         | Ya    | 'PENDING','TERSEDIA','TIDAK_TERSEDIA','DIBERIKAN','BATAL' |
| alasan_tidak_tersedia | TEXT         | Tidak | Alasan jika tidak tersedia                                |
| alternatif_obat_id    | UUID         | Tidak | FK ke master_obat (obat pengganti)                        |
| created_at            | TIMESTAMP    | Ya    | Waktu pembuatan                                           |
| updated_at            | TIMESTAMP    | Ya    | Waktu update terakhir                                     |

### 4.3 Dispensing (dispensing)

| Field            | Tipe Data   | Wajib | Keterangan                   |
| ---------------- | ----------- | ----- | ---------------------------- |
| id               | UUID        | Ya    | Primary Key                  |
| resep_id         | UUID        | Ya    | FK ke resep                  |
| resep_detail_id  | UUID        | Ya    | FK ke resep_detail           |
| stok_id          | UUID        | Ya    | FK ke stok_farmasi           |
| batch_number     | VARCHAR(50) | Ya    | Nomor batch obat             |
| expired_date     | DATE        | Ya    | Tanggal kadaluarsa           |
| jumlah           | INT         | Ya    | Jumlah yang didispensing     |
| farmasis_id      | UUID        | Ya    | FK ke pegawai (Apoteker/TTK) |
| waktu_dispensing | DATETIME    | Ya    | Waktu dispensing             |
| created_at       | TIMESTAMP   | Ya    | Waktu pembuatan              |

### 4.4 Verifikasi Resep (verifikasi_resep)

| Field             | Tipe Data | Wajib | Keterangan                      |
| ----------------- | --------- | ----- | ------------------------------- |
| id                | UUID      | Ya    | Primary Key                     |
| resep_id          | UUID      | Ya    | FK ke resep                     |
| farmasis_id       | UUID      | Ya    | FK ke pegawai                   |
| waktu_verifikasi  | DATETIME  | Ya    | Waktu verifikasi                |
| hasil_screening   | ENUM      | Ya    | 'APPROVED','REVISI','TOLAK'     |
| catatan_screening | TEXT      | Tidak | Catatan hasil screening         |
| interaksi_obat    | JSON      | Tidak | Daftar interaksi yang ditemukan |
| duplikasi_terapi  | JSON      | Tidak | Daftar duplikasi yang ditemukan |
| alergi_warning    | JSON      | Tidak | Warning alergi                  |
| created_at        | TIMESTAMP | Ya    | Waktu pembuatan                 |

### 4.5 Penyerahan Obat (penyerahan_obat)

| Field           | Tipe Data    | Wajib | Keterangan                    |
| --------------- | ------------ | ----- | ----------------------------- |
| id              | UUID         | Ya    | Primary Key                   |
| resep_id        | UUID         | Ya    | FK ke resep                   |
| waktu_serah     | DATETIME     | Ya    | Waktu penyerahan              |
| penerima        | VARCHAR(100) | Ya    | Nama penerima obat            |
| hubungan_pasien | VARCHAR(50)  | Tidak | Hubungan dengan pasien        |
| no_identitas    | VARCHAR(20)  | Tidak | No. KTP penerima              |
| farmasis_id     | UUID         | Ya    | FK ke pegawai                 |
| kie_diberikan   | BOOLEAN      | Ya    | KIE sudah diberikan           |
| catatan_kie     | TEXT         | Tidak | Catatan informasi obat        |
| tanda_tangan    | TEXT         | Tidak | Tanda tangan digital penerima |
| created_at      | TIMESTAMP    | Ya    | Waktu pembuatan               |

### 4.6 Master Obat (master_obat)

| Field          | Tipe Data     | Wajib | Keterangan                                                  |
| -------------- | ------------- | ----- | ----------------------------------------------------------- |
| id             | UUID          | Ya    | Primary Key                                                 |
| kode           | VARCHAR(20)   | Ya    | Kode obat                                                   |
| nama           | VARCHAR(100)  | Ya    | Nama dagang                                                 |
| nama_generik   | VARCHAR(100)  | Ya    | Nama generik                                                |
| bentuk_sediaan | VARCHAR(50)   | Ya    | Tablet, Sirup, Injeksi, dll                                 |
| kekuatan       | VARCHAR(50)   | Ya    | Kekuatan sediaan                                            |
| satuan         | VARCHAR(20)   | Ya    | Satuan terkecil                                             |
| kategori_id    | UUID          | Ya    | FK ke kategori_obat                                         |
| golongan       | ENUM          | Ya    | 'BEBAS','BEBAS_TERBATAS','KERAS','NARKOTIKA','PSIKOTROPIKA' |
| produsen_id    | UUID          | Tidak | FK ke produsen                                              |
| harga_beli     | DECIMAL(15,2) | Ya    | Harga beli                                                  |
| harga_jual     | DECIMAL(15,2) | Ya    | Harga jual                                                  |
| margin_persen  | DECIMAL(5,2)  | Tidak | Persentase margin                                           |
| stok_minimal   | INT           | Ya    | Stok minimal untuk reorder                                  |
| is_formularium | BOOLEAN       | Ya    | Termasuk formularium RS                                     |
| is_generik     | BOOLEAN       | Ya    | Obat generik                                                |
| is_high_alert  | BOOLEAN       | Ya    | Obat high alert                                             |
| is_lasa        | BOOLEAN       | Ya    | Look Alike Sound Alike                                      |
| keterangan     | TEXT          | Tidak | Keterangan                                                  |
| is_active      | BOOLEAN       | Ya    | Status aktif                                                |
| created_at     | TIMESTAMP     | Ya    | Waktu pembuatan                                             |
| updated_at     | TIMESTAMP     | Ya    | Waktu update terakhir                                       |

### 4.7 Stok Farmasi (stok_farmasi)

| Field          | Tipe Data     | Wajib | Keterangan            |
| -------------- | ------------- | ----- | --------------------- |
| id             | UUID          | Ya    | Primary Key           |
| obat_id        | UUID          | Ya    | FK ke master_obat     |
| depo_id        | UUID          | Ya    | FK ke depo_farmasi    |
| batch_number   | VARCHAR(50)   | Ya    | Nomor batch           |
| expired_date   | DATE          | Ya    | Tanggal kadaluarsa    |
| jumlah         | INT           | Ya    | Jumlah stok           |
| harga_beli     | DECIMAL(15,2) | Ya    | Harga beli per unit   |
| tanggal_terima | DATE          | Ya    | Tanggal terima        |
| created_at     | TIMESTAMP     | Ya    | Waktu pembuatan       |
| updated_at     | TIMESTAMP     | Ya    | Waktu update terakhir |

### 4.8 Depo Farmasi (depo_farmasi)

| Field     | Tipe Data    | Wajib | Keterangan                                          |
| --------- | ------------ | ----- | --------------------------------------------------- |
| id        | UUID         | Ya    | Primary Key                                         |
| kode      | VARCHAR(10)  | Ya    | Kode depo                                           |
| nama      | VARCHAR(50)  | Ya    | Nama depo                                           |
| jenis     | ENUM         | Ya    | 'UTAMA','RAWAT_JALAN','RAWAT_INAP','IGD','OK','ICU' |
| lokasi    | VARCHAR(100) | Tidak | Lokasi                                              |
| is_active | BOOLEAN      | Ya    | Status aktif                                        |

### 4.9 Interaksi Obat (interaksi_obat)

| Field             | Tipe Data | Wajib | Keterangan                                 |
| ----------------- | --------- | ----- | ------------------------------------------ |
| id                | UUID      | Ya    | Primary Key                                |
| obat_a_id         | UUID      | Ya    | FK ke master_obat                          |
| obat_b_id         | UUID      | Ya    | FK ke master_obat                          |
| tingkat_keparahan | ENUM      | Ya    | 'RINGAN','SEDANG','BERAT','KONTRAINDIKASI' |
| deskripsi         | TEXT      | Ya    | Deskripsi interaksi                        |
| mekanisme         | TEXT      | Tidak | Mekanisme interaksi                        |
| rekomendasi       | TEXT      | Tidak | Rekomendasi penanganan                     |
| referensi         | TEXT      | Tidak | Sumber referensi                           |
| is_active         | BOOLEAN   | Ya    | Status aktif                               |

---

## 5. Form-Form yang Dibutuhkan

### 5.1 Dashboard Antrian Resep

**Tampilan Daftar Resep:**

- Filter: Tanggal, Status, Jenis, Prioritas
- Tabs: Pending, Verifikasi, Proses, Selesai, Batal
- Kolom: No. Resep, Waktu, Pasien, Ruangan, Dokter, Prioritas, Status, Aksi
- Highlight: CITO (merah), High Alert (kuning)

### 5.2 Form Verifikasi Resep

**Header (read-only):**

- No. Resep
- Nama Pasien / No. RM / Umur
- Jenis Kelamin
- Berat Badan (jika ada)
- Ruangan / Dokter
- Diagnosa

**Warning Panel:**

- Alergi Pasien (dari master alergi - merah)
- Kondisi Khusus (hamil, menyusui, gangguan ginjal/hati)

**Daftar Obat:**
| Obat | Dosis | Frekuensi | Rute | Jumlah | Stok | Status | Warning | Aksi |
|------|-------|-----------|------|--------|------|--------|---------|------|
| Amoxicillin 500mg | 1 cap | 3x1 | Oral | 15 | ✓ 100 | [dropdown] | [icon] | [edit] |

**Warning Icons:**

- 🔴 Alergi
- 🟠 Interaksi Berat
- 🟡 Interaksi Sedang
- ⚠️ Dosis tidak lazim
- 🔄 Duplikasi

**Interaksi Panel:**

- Daftar interaksi obat yang ditemukan
- Level keparahan
- Rekomendasi

**Aksi:**

- Approve
- Minta Revisi (dengan catatan ke dokter)
- Tolak (dengan alasan)

### 5.3 Form Dispensing

**Informasi Resep (read-only):**

- No. Resep
- Nama Pasien
- Daftar obat yang diapprove

**Input Dispensing per Obat:**

- Obat: [Nama Obat]
- Jumlah yang diminta: [X]
- Pilih Batch\* (dropdown, urut by FEFO):
  | Batch | Expired | Stok | Pilih |
  |-------|---------|------|-------|
  | ABC123 | 2025-06 | 50 | [radio] |
  | DEF456 | 2025-12 | 100 | [radio] |
- Jumlah diambil\* (input)
- Scan Barcode (untuk verifikasi)

**Checklist Dispensing:**

- [ ] Obat sudah dihitung ulang
- [ ] Obat dalam kondisi baik
- [ ] Etiket sudah ditempel
- [ ] Kemasan sudah sesuai

### 5.4 Form Etiket Obat

**Isi Etiket:**

- Nama Pasien
- No. RM
- Nama Obat
- Aturan Pakai (dalam bahasa Indonesia yang jelas):
  - "3 kali sehari 1 tablet, sesudah makan"
  - "2 kali sehari 1 sendok teh, sebelum makan"
- Peringatan khusus:
  - "Habiskan obat ini"
  - "Dapat menyebabkan kantuk"
  - "Simpan di tempat sejuk"
- Tanggal dispensing
- Nama Apotek RS

### 5.5 Form Penyerahan Obat

**Informasi Resep (read-only):**

- No. Resep
- Nama Pasien
- Daftar obat yang disiapkan

**Input Penyerahan:**

- Nama Penerima\*
- Hubungan dengan Pasien (dropdown)
- No. Identitas
- Waktu Penyerahan\* (auto: now)

**Checklist KIE (Komunikasi, Informasi, Edukasi):**

- [ ] Nama obat dan indikasi
- [ ] Aturan pakai (dosis, frekuensi, waktu)
- [ ] Cara penyimpanan
- [ ] Efek samping yang mungkin timbul
- [ ] Hal yang harus dihindari
- [ ] Tanda-tanda harus kembali ke RS

**Catatan KIE** (textarea)

**Tanda Tangan Digital Penerima**

### 5.6 Form Retur Obat

**Jenis Retur:**

- Retur dari Pasien (obat tidak terpakai)
- Retur ke Gudang (expired/rusak)

**Detail Retur:**

- Tanggal Retur\*
- Obat\* (dropdown/search)
- Batch Number\*
- Expired Date (auto-fill)
- Jumlah\*
- Alasan Retur\* (dropdown + textarea)
- Kondisi Obat\* (dropdown)

**Untuk Retur dari Pasien:**

- No. Resep Asal
- Nama Pasien

**Approval:**

- Status: Pending Approval
- Approved by: [Apoteker Supervisor]

### 5.7 Form Permintaan Obat ke Gudang

**Header:**

- Tanggal Permintaan\*
- Depo Peminta\*
- Jenis Permintaan (Rutin/CITO)

**Detail Permintaan:**
| Obat | Stok Saat Ini | Stok Minimal | Jumlah Minta |
|------|---------------|--------------|--------------|
| [search] | [auto] | [auto] | [input] |

**Catatan** (textarea)

---

## 6. Fitur Pendukung

### 6.1 Drug Interaction Checker

**Fitur:**

- Cek interaksi antar obat dalam satu resep
- Cek interaksi dengan obat yang sedang dikonsumsi pasien
- Klasifikasi level interaksi
- Rekomendasi alternatif

### 6.2 Alergi Alert

**Trigger:**

- Saat verifikasi resep
- Jika obat/golongan obat ada di daftar alergi pasien
- Warning tidak bisa di-bypass tanpa justifikasi

### 6.3 Dosis Calculator

**Untuk Pediatri:**

- Input: Berat badan, Usia
- Kalkulasi dosis berdasarkan mg/kg BB
- Warning jika melebihi dosis maksimal

**Untuk Geriatri/Gangguan Fungsi Organ:**

- Penyesuaian dosis untuk gangguan ginjal (based on CrCl)
- Penyesuaian dosis untuk gangguan hati

### 6.4 Stok Monitoring

**Dashboard Stok:**

- Stok di bawah minimal (reorder point)
- Obat mendekati expired (< 3 bulan)
- Obat expired
- Fast moving items
- Slow moving items

### 6.5 High Alert Medication Safety

**Double Check System:**

- Obat high alert memerlukan verifikasi ganda
- Konfirmasi oleh 2 orang farmasis
- Dokumentasi checker

**Visual Warning:**

- Label khusus high alert
- Penyimpanan terpisah
- Alert saat dispensing

### 6.6 LASA (Look Alike Sound Alike)

**Prevention:**

- Warning saat ada obat LASA dalam resep
- Tall Man Lettering display
- Separasi penyimpanan

---

## 7. Integrasi dengan Modul Lain

| Modul Sumber | Data yang Diterima | Penggunaan        |
| ------------ | ------------------ | ----------------- |
| EMR          | e-Resep            | Trigger pelayanan |
| Pendaftaran  | Data pasien        | Identifikasi      |
| Gudang       | Mutasi stok        | Update stok       |

| Modul Tujuan | Data yang Dikirim          | Trigger            |
| ------------ | -------------------------- | ------------------ |
| Billing      | Detail obat & harga        | Setelah dispensing |
| EMR          | Status resep, riwayat obat | Real-time          |
| Gudang       | Pengurangan stok           | Setelah dispensing |
| Gudang       | Permintaan barang          | Manual/Auto        |

---

## 8. Aturan Bisnis (Business Rules)

1. **Resep CITO** harus dilayani dalam 15 menit
2. Semua resep **wajib** melalui proses verifikasi oleh Apoteker
3. **Obat Narkotika/Psikotropika** harus dengan resep khusus dan double check
4. Sistem **FEFO** (First Expired First Out) wajib untuk dispensing
5. **Obat expired** tidak boleh didispensing
6. Stok obat yang **expired < 3 bulan** tidak boleh untuk rawat jalan
7. **Alergi** yang tercatat tidak bisa di-bypass tanpa konfirmasi dokter
8. **High Alert** medication memerlukan double check
9. Resep yang tidak diambil dalam **3 hari** otomatis batal
10. **Copy resep** hanya untuk obat bebas/bebas terbatas

---

## 9. Kebutuhan Teknis

### 9.1 Barcode/QR Integration

| Item    | Barcode                            |
| ------- | ---------------------------------- |
| Obat    | Scan untuk verifikasi & dispensing |
| Resep   | QR Code untuk tracking             |
| Patient | Untuk identifikasi                 |

### 9.2 Label Printer

**Etiket Obat:**

- Thermal printer
- Format standar apotek
- Multilingual (Indonesia, Sunda, Jawa jika perlu)

### 9.3 Permission/Role

| Role                            | Akses                                 |
| ------------------------------- | ------------------------------------- |
| TTK (Tenaga Teknis Kefarmasian) | Dispensing, penyiapan                 |
| Apoteker                        | Verifikasi, dispensing, KIE, validasi |
| Apoteker Supervisor             | Semua + retur approval + master       |
| Admin Farmasi                   | Laporan, stok management              |

### 9.4 Laporan

**Laporan Harian:**

- Jumlah resep per jenis
- Resep CITO
- Retur obat
- Stok menipis

**Laporan Bulanan:**

- Volume pelayanan
- Top 10 obat
- Penggunaan narkotika/psikotropika
- Statistik interaksi obat

**Laporan Khusus:**

- Laporan per penjamin
- Laporan generik vs paten
- Expired loss report

---

## 10. Notifikasi

| Event                     | Penerima      | Channel               |
| ------------------------- | ------------- | --------------------- |
| Resep CITO masuk          | Farmasis      | Push + Audio          |
| Resep siap diambil        | Pasien        | SMS / Display antrian |
| Interaksi berat ditemukan | Apoteker      | Alert                 |
| Stok menipis              | Admin Farmasi | Push                  |
| Obat mendekati expired    | Supervisor    | Daily report          |
