# Modul Laboratorium (LIS - Laboratory Information System)

## 1. Deskripsi Umum

Modul Laboratorium (LIS - Laboratory Information System) adalah sistem informasi yang mengelola seluruh proses pelayanan laboratorium mulai dari penerimaan order, pengambilan sampel, pemrosesan, validasi hasil, hingga pengiriman hasil ke rekam medis. Modul ini mencakup:

- Penerimaan order pemeriksaan dari dokter
- Pengambilan dan registrasi sampel
- Pemrosesan pemeriksaan
- Input dan validasi hasil
- Pengiriman hasil ke EMR
- Manajemen stok reagen dan bahan habis pakai

---

## 2. Alur Kerja (Workflow)

### 2.1 Alur Pemeriksaan Laboratorium

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Order dari      │────▶│ Terima Order &   │────▶│ Sampling        │
│ Dokter (EMR)    │     │ Validasi         │     │ (Pengambilan)   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Kirim ke EMR &  │◀────│ Validasi Hasil   │◀────│ Pemrosesan &    │
│ Cetak Hasil     │     │ (Dokter/Analis)  │     │ Input Hasil     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 2.2 Detail Alur Per Tahap

**1. Penerimaan Order**

- Order masuk dari EMR (elektronik)
- Atau order manual dari formulir
- Validasi kelengkapan data pasien dan pemeriksaan
- Pengecekan duplikasi order

**2. Registrasi Sampel**

- Generate nomor sampel/barcode
- Cetak label sampel
- Catat waktu pengambilan sampel
- Catat petugas phlebotomist

**3. Pengambilan Sampel (Sampling)**

- Verifikasi identitas pasien
- Pengambilan sampel sesuai jenis pemeriksaan
- Pelabelan sampel
- Dokumentasi kondisi sampel

**4. Penerimaan Sampel di Lab**

- Verifikasi sampel dengan label
- Cek kualitas sampel (lipemik, ikterik, hemolisis)
- Jika sampel tidak layak → reject dan minta ulang
- Distribusi sampel ke unit kerja (Hematologi, Kimia Klinik, dll)

**5. Pemrosesan**

- Proses sampel sesuai SOP
- Input hasil dari analyzer (manual/interface)
- Quality control check

**6. Validasi Hasil**

- Analis melakukan validasi teknis
- Dokter Patologi Klinik melakukan validasi klinis
- Cek nilai kritis → notifikasi segera

**7. Distribusi Hasil**

- Hasil terkirim ke EMR secara otomatis
- Cetak hasil jika diperlukan
- Arsip hasil

---

## 3. Skema Data

### 3.1 Order Laboratorium (order_lab)

| Field           | Tipe Data   | Wajib | Keterangan                                                 |
| --------------- | ----------- | ----- | ---------------------------------------------------------- |
| id              | UUID        | Ya    | Primary Key                                                |
| no_order        | VARCHAR(20) | Ya    | Nomor order (auto-generated)                               |
| kunjungan_id    | UUID        | Ya    | FK ke kunjungan                                            |
| pasien_id       | UUID        | Ya    | FK ke master_pasien                                        |
| tanggal_order   | DATETIME    | Ya    | Tanggal dan waktu order                                    |
| dokter_id       | UUID        | Ya    | FK ke pegawai (Dokter pengirim)                            |
| ruangan_asal_id | UUID        | Ya    | FK ke ruangan (Poli/IGD/Ruang Ranap)                       |
| prioritas       | ENUM        | Ya    | 'CITO','BIASA'                                             |
| diagnosa_klinis | TEXT        | Ya    | Diagnosa/indikasi klinis                                   |
| catatan         | TEXT        | Tidak | Catatan tambahan                                           |
| status_order    | ENUM        | Ya    | 'PENDING','DITERIMA','SAMPLING','PROSES','SELESAI','BATAL' |
| created_at      | TIMESTAMP   | Ya    | Waktu pembuatan                                            |
| updated_at      | TIMESTAMP   | Ya    | Waktu update terakhir                                      |
| created_by      | UUID        | Ya    | FK ke user                                                 |

### 3.2 Detail Order Laboratorium (order_lab_detail)

| Field          | Tipe Data | Wajib | Keterangan                           |
| -------------- | --------- | ----- | ------------------------------------ |
| id             | UUID      | Ya    | Primary Key                          |
| order_lab_id   | UUID      | Ya    | FK ke order_lab                      |
| pemeriksaan_id | UUID      | Ya    | FK ke master_pemeriksaan_lab         |
| status         | ENUM      | Ya    | 'PENDING','PROSES','SELESAI','BATAL' |
| catatan        | TEXT      | Tidak | Catatan per pemeriksaan              |
| created_at     | TIMESTAMP | Ya    | Waktu pembuatan                      |

### 3.3 Sampel Laboratorium (sampel)

| Field           | Tipe Data     | Wajib | Keterangan                                       |
| --------------- | ------------- | ----- | ------------------------------------------------ |
| id              | UUID          | Ya    | Primary Key                                      |
| no_sampel       | VARCHAR(20)   | Ya    | Nomor sampel/barcode                             |
| order_lab_id    | UUID          | Ya    | FK ke order_lab                                  |
| jenis_sampel_id | UUID          | Ya    | FK ke jenis_sampel                               |
| wadah_id        | UUID          | Ya    | FK ke wadah_sampel                               |
| volume          | DECIMAL(10,2) | Tidak | Volume sampel (ml)                               |
| waktu_sampling  | DATETIME      | Ya    | Waktu pengambilan sampel                         |
| phlebotomist_id | UUID          | Ya    | FK ke pegawai                                    |
| kondisi_sampel  | ENUM          | Ya    | 'BAIK','LIPEMIK','IKTERIK','HEMOLISIS','CLOT'    |
| status_sampel   | ENUM          | Ya    | 'DIAMBIL','DITERIMA','PROSES','SELESAI','REJECT' |
| alasan_reject   | TEXT          | Tidak | Alasan jika di-reject                            |
| created_at      | TIMESTAMP     | Ya    | Waktu pembuatan                                  |
| updated_at      | TIMESTAMP     | Ya    | Waktu update terakhir                            |

### 3.4 Hasil Laboratorium (hasil_lab)

| Field                 | Tipe Data     | Wajib | Keterangan                                           |
| --------------------- | ------------- | ----- | ---------------------------------------------------- |
| id                    | UUID          | Ya    | Primary Key                                          |
| order_lab_detail_id   | UUID          | Ya    | FK ke order_lab_detail                               |
| sampel_id             | UUID          | Ya    | FK ke sampel                                         |
| pemeriksaan_id        | UUID          | Ya    | FK ke master_pemeriksaan_lab                         |
| hasil                 | VARCHAR(100)  | Ya    | Nilai hasil                                          |
| satuan                | VARCHAR(20)   | Ya    | Satuan hasil                                         |
| nilai_normal_min      | DECIMAL(10,2) | Tidak | Nilai normal minimum                                 |
| nilai_normal_max      | DECIMAL(10,2) | Tidak | Nilai normal maksimum                                |
| nilai_normal_text     | VARCHAR(100)  | Tidak | Nilai normal (text)                                  |
| flag                  | ENUM          | Tidak | 'LOW','NORMAL','HIGH','CRITICAL_LOW','CRITICAL_HIGH' |
| is_critical           | BOOLEAN       | Ya    | Apakah nilai kritis                                  |
| metode                | VARCHAR(100)  | Tidak | Metode pemeriksaan                                   |
| alat                  | VARCHAR(100)  | Tidak | Nama alat/analyzer                                   |
| analis_id             | UUID          | Ya    | FK ke pegawai (Analis)                               |
| waktu_periksa         | DATETIME      | Ya    | Waktu pemeriksaan                                    |
| status_validasi       | ENUM          | Ya    | 'BELUM','VALIDASI_TEKNIS','VALIDASI_KLINIS'          |
| validator_teknis_id   | UUID          | Tidak | FK ke pegawai                                        |
| waktu_validasi_teknis | DATETIME      | Tidak | Waktu validasi teknis                                |
| validator_klinis_id   | UUID          | Tidak | FK ke pegawai (Dokter PK)                            |
| waktu_validasi_klinis | DATETIME      | Tidak | Waktu validasi klinis                                |
| catatan               | TEXT          | Tidak | Catatan/interpretasi                                 |
| created_at            | TIMESTAMP     | Ya    | Waktu pembuatan                                      |
| updated_at            | TIMESTAMP     | Ya    | Waktu update terakhir                                |

### 3.5 Master Pemeriksaan Lab (master_pemeriksaan_lab)

| Field                   | Tipe Data     | Wajib | Keterangan                 |
| ----------------------- | ------------- | ----- | -------------------------- |
| id                      | UUID          | Ya    | Primary Key                |
| kode                    | VARCHAR(20)   | Ya    | Kode pemeriksaan           |
| nama                    | VARCHAR(100)  | Ya    | Nama pemeriksaan           |
| kategori_id             | UUID          | Ya    | FK ke kategori_lab         |
| jenis_sampel_id         | UUID          | Ya    | FK ke jenis_sampel         |
| wadah_id                | UUID          | Ya    | FK ke wadah_sampel         |
| volume_minimal          | DECIMAL(10,2) | Tidak | Volume minimal sampel (ml) |
| metode                  | VARCHAR(100)  | Tidak | Metode pemeriksaan         |
| satuan                  | VARCHAR(20)   | Ya    | Satuan hasil               |
| nilai_normal_pria_min   | DECIMAL(10,2) | Tidak | Nilai normal pria (min)    |
| nilai_normal_pria_max   | DECIMAL(10,2) | Tidak | Nilai normal pria (max)    |
| nilai_normal_wanita_min | DECIMAL(10,2) | Tidak | Nilai normal wanita (min)  |
| nilai_normal_wanita_max | DECIMAL(10,2) | Tidak | Nilai normal wanita (max)  |
| nilai_normal_anak_min   | DECIMAL(10,2) | Tidak | Nilai normal anak (min)    |
| nilai_normal_anak_max   | DECIMAL(10,2) | Tidak | Nilai normal anak (max)    |
| nilai_kritis_low        | DECIMAL(10,2) | Tidak | Nilai kritis rendah        |
| nilai_kritis_high       | DECIMAL(10,2) | Tidak | Nilai kritis tinggi        |
| waktu_tat               | INT           | Tidak | Turnaround Time (menit)    |
| tarif_id                | UUID          | Ya    | FK ke master_tarif         |
| is_active               | BOOLEAN       | Ya    | Status aktif               |
| created_at              | TIMESTAMP     | Ya    | Waktu pembuatan            |
| updated_at              | TIMESTAMP     | Ya    | Waktu update terakhir      |

### 3.6 Master Jenis Sampel (jenis_sampel)

| Field     | Tipe Data   | Wajib | Keterangan        |
| --------- | ----------- | ----- | ----------------- |
| id        | UUID        | Ya    | Primary Key       |
| kode      | VARCHAR(10) | Ya    | Kode jenis sampel |
| nama      | VARCHAR(50) | Ya    | Nama jenis sampel |
| deskripsi | TEXT        | Tidak | Deskripsi         |
| is_active | BOOLEAN     | Ya    | Status aktif      |

Contoh data: Darah EDTA, Darah Serum, Darah Citrat, Urine, Feses, Sputum, Swab, dll.

### 3.7 Master Wadah Sampel (wadah_sampel)

| Field     | Tipe Data     | Wajib | Keterangan          |
| --------- | ------------- | ----- | ------------------- |
| id        | UUID          | Ya    | Primary Key         |
| kode      | VARCHAR(10)   | Ya    | Kode wadah          |
| nama      | VARCHAR(50)   | Ya    | Nama wadah          |
| warna     | VARCHAR(20)   | Tidak | Warna wadah (tutup) |
| volume    | DECIMAL(10,2) | Tidak | Volume wadah (ml)   |
| is_active | BOOLEAN       | Ya    | Status aktif        |

Contoh data: Tabung EDTA (ungu), Tabung Serum (merah), Tabung Citrat (biru), Pot Urine, dll.

### 3.8 Kategori Pemeriksaan Lab (kategori_lab)

| Field     | Tipe Data   | Wajib | Keterangan      |
| --------- | ----------- | ----- | --------------- |
| id        | UUID        | Ya    | Primary Key     |
| kode      | VARCHAR(10) | Ya    | Kode kategori   |
| nama      | VARCHAR(50) | Ya    | Nama kategori   |
| deskripsi | TEXT        | Tidak | Deskripsi       |
| urutan    | INT         | Ya    | Urutan tampilan |
| is_active | BOOLEAN     | Ya    | Status aktif    |

Contoh data: Hematologi, Kimia Klinik, Serologi/Imunologi, Urinalisa, Feses, Mikrobiologi, dll.

---

## 4. Form-Form yang Dibutuhkan

### 4.1 Form Penerimaan Order

**Tampilan Daftar Order Masuk:**

- Filter: Tanggal, Status, Prioritas, Ruangan Asal
- Kolom: No. Order, Tanggal, Pasien, Ruangan, Dokter, Prioritas, Status, Aksi

**Detail Order:**

- Informasi Pasien (read-only)
- Informasi Order (read-only)
- Daftar Pemeriksaan yang Diminta
- Tombol: Terima Order, Tolak Order (dengan alasan)

### 4.2 Form Registrasi & Pengambilan Sampel

**Informasi Order (read-only)**

- No. Order
- Nama Pasien / No. RM
- Tanggal Lahir / Umur
- Jenis Kelamin
- Ruangan Asal
- Diagnosa Klinis
- Daftar Pemeriksaan

**Input Sampel:**

- Jenis Sampel\* (dropdown, bisa multiple untuk order berbeda jenis)
- Nomor Sampel\* (auto-generate dengan barcode)
- Wadah\* (dropdown)
- Volume (ml)
- Waktu Pengambilan\* (datetime, default: now)
- Phlebotomist\* (dropdown / auto-fill)
- Kondisi Pasien saat Sampling (checkbox):
  - [ ] Puasa
  - [ ] Sesudah Makan
  - [ ] Sedang Terapi Antibiotik
- Catatan (textarea)
- Tombol: Cetak Label Sampel

### 4.3 Form Penerimaan Sampel di Lab

**Scan/Input Barcode Sampel**

**Verifikasi Sampel:**

- Nomor Sampel (dari scan)
- Nama Pasien (verifikasi)
- Jenis Sampel (verifikasi)
- Kondisi Sampel\* (radio):
  - Baik
  - Lipemik (berlemak)
  - Ikterik (kuning)
  - Hemolisis (pecah)
  - Clot (membeku)
- Jika kondisi tidak baik:
  - Opsi: Proses dengan catatan / Reject
  - Alasan Reject\* (jika reject)
- Waktu Diterima\* (datetime, default: now)
- Petugas Penerima\* (auto-fill)
- Distribusi ke Unit\* (dropdown: Hematologi, Kimia Klinik, dll)

### 4.4 Form Input Hasil

**Informasi Sampel (read-only)**

- No. Sampel / No. Order
- Nama Pasien
- Daftar Pemeriksaan

**Input Hasil per Pemeriksaan:**
| Pemeriksaan | Hasil\* | Satuan | Nilai Normal | Flag |
|-------------|--------|--------|--------------|------|
| Hemoglobin | [input] | g/dL | 12-16 | [auto] |
| Leukosit | [input] | /µL | 4000-10000 | [auto] |
| ... | ... | ... | ... | ... |

**Footer:**

- Metode Pemeriksaan
- Nama Alat/Analyzer
- Analis Pemeriksa\* (auto-fill dari login)
- Waktu Pemeriksaan\* (datetime)
- Catatan (textarea)
- Tombol: Simpan, Simpan & Ajukan Validasi

### 4.5 Form Validasi Hasil

**Tampilan Daftar Pending Validasi:**

- Filter: Tanggal, Kategori, Analis
- Kolom: No. Sampel, Pasien, Kategori, Analis, Waktu Periksa, Status, Aksi

**Detail untuk Validasi:**

- Informasi Pasien
- Informasi Order (diagnosa klinis)
- Hasil Pemeriksaan (dengan flag warna untuk abnormal)
- Riwayat Hasil Sebelumnya (untuk pembanding)
- Delta Check (perubahan signifikan dari hasil sebelumnya)

**Aksi Validasi:**

- [ ] Setujui Semua
- Catatan/Interpretasi (textarea)
- Tombol: Validasi, Tolak (minta ulang)

**Untuk Nilai Kritis:**

- Alert khusus dengan warna merah
- Wajib input:
  - Waktu Lapor\*
  - Dilaporkan ke\* (nama & jabatan)
  - Diterima oleh\*
  - Catatan Pelaporan

### 4.6 Form Cetak Hasil

**Preview Hasil:**

- Header: Logo RS, Nama RS, Alamat
- Data Pasien: Nama, No. RM, Tanggal Lahir, Jenis Kelamin, Alamat
- Data Kunjungan: Tanggal, Ruangan, Dokter Pengirim
- Data Sampel: No. Sampel, Tanggal Sampling, Jenis Sampel
- Tabel Hasil:
  - Pemeriksaan | Hasil | Satuan | Nilai Normal | Keterangan
- Catatan/Interpretasi
- Footer: Tanggal Validasi, Nama Validator, Tanda Tangan Digital

**Opsi Cetak:**

- Print semua hasil
- Print per kategori
- Export PDF

---

## 5. Fitur Pendukung

### 5.1 Dashboard Laboratorium

**Widget:**

- Jumlah order hari ini (by status)
- Order CITO pending
- Sampel pending validasi
- Hasil nilai kritis belum dilaporkan
- TAT (Turnaround Time) monitoring
- Chart: Trend volume pemeriksaan

### 5.2 Worklist Laboratorium

**Per Unit Kerja:**

- Hematologi Worklist
- Kimia Klinik Worklist
- Serologi Worklist
- dll

**Kolom:**

- No. Sampel
- Pasien
- Pemeriksaan
- Prioritas
- Status
- TAT

**Filter:**

- Tanggal
- Status
- Prioritas

### 5.3 Nilai Kritis Alert

**Notifikasi Real-time:**

- Pop-up alert saat input nilai kritis
- SMS/WhatsApp ke dokter pengirim (opsional)
- Dashboard khusus nilai kritis

**Dokumentasi Pelaporan:**

- Checklist sudah dilaporkan
- Log siapa yang menerima laporan

### 5.4 Riwayat Hasil Pasien

**Timeline Hasil:**

- Semua hasil lab pasien (kronologis)
- Filter per jenis pemeriksaan
- Grafik trend (untuk pemeriksaan berulang)

### 5.5 Quality Control (QC)

**Input Hasil QC:**

- Jenis Kontrol (Normal/Abnormal)
- Lot Number
- Hasil QC
- Status (Pass/Fail)
- Westgard Rules Check

**Levey-Jennings Chart:**

- Visualisasi QC harian
- Alert jika out of control

### 5.6 Manajemen Stok Reagen

**Link ke Modul Gudang:**

- Permintaan reagen
- Stock opname
- Expired date monitoring

---

## 6. Integrasi dengan Modul Lain

| Modul Sumber | Data yang Diterima     | Penggunaan          |
| ------------ | ---------------------- | ------------------- |
| EMR          | Order pemeriksaan      | Trigger worklist    |
| Pendaftaran  | Data pasien, kunjungan | Identifikasi pasien |

| Modul Tujuan | Data yang Dikirim          | Trigger             |
| ------------ | -------------------------- | ------------------- |
| EMR          | Hasil pemeriksaan          | Setelah validasi    |
| Billing      | Detail pemeriksaan & tarif | Setelah sampling    |
| Gudang       | Pengurangan stok reagen    | Setelah pemeriksaan |

---

## 7. Aturan Bisnis (Business Rules)

1. **Order CITO** harus diproses prioritas, target TAT 1 jam
2. Setiap hasil **wajib** melalui validasi teknis sebelum validasi klinis
3. **Nilai kritis** harus dilaporkan ke dokter dalam 15 menit
4. Sampel dengan kondisi **reject** tidak boleh diproses
5. **Delta check** warning jika perubahan hasil > 50% dari sebelumnya
6. Hasil yang sudah divalidasi **tidak boleh diedit** tanpa approval
7. **QC** harus dilakukan setiap hari sebelum pemeriksaan pasien
8. **Sampel** yang tidak diproses dalam 4 jam harus dikonfirmasi ulang
9. Setiap pemeriksaan harus memiliki **metode** dan **alat** yang tercatat
10. **Barcode sampel** bersifat unik dan tidak boleh duplikat

---

## 8. Kebutuhan Teknis

### 8.1 Integrasi Analyzer

| Aspek      | Spesifikasi                                         |
| ---------- | --------------------------------------------------- |
| Protokol   | HL7 v2.x, ASTM, LIS2-A2                             |
| Komunikasi | Serial RS232, TCP/IP, File-based                    |
| Mode       | Uni-directional, Bi-directional                     |
| Data       | Order (Host to Analyzer), Result (Analyzer to Host) |

### 8.2 Barcode

| Aspek   | Spesifikasi                   |
| ------- | ----------------------------- |
| Format  | Code 128, Code 39             |
| Konten  | No. Sampel, No. RM            |
| Printer | Label printer thermal         |
| Scanner | Barcode scanner USB/Bluetooth |

### 8.3 Permission/Role

| Role           | Akses                                      |
| -------------- | ------------------------------------------ |
| Analis         | Terima order, input hasil, validasi teknis |
| Phlebotomist   | Sampling, registrasi sampel                |
| Dokter PK      | Validasi klinis, interpretasi              |
| Supervisor Lab | Semua + kelola master + QC                 |
| Admin Lab      | Laporan, statistik                         |

### 8.4 Laporan

**Laporan Harian:**

- Volume pemeriksaan per kategori
- Daftar pemeriksaan CITO
- Daftar nilai kritis
- TAT Report

**Laporan Bulanan:**

- Statistik pemeriksaan
- Top 10 pemeriksaan
- Produktivitas analis
- QC Summary

**Laporan Khusus:**

- Pemeriksaan per penjamin
- Pemeriksaan per dokter pengirim

---

## 9. Notifikasi

| Event            | Penerima        | Channel           |
| ---------------- | --------------- | ----------------- |
| Order CITO masuk | Petugas Lab     | Push Notification |
| Sampel diterima  | Dokter Pengirim | Dalam sistem      |
| Hasil tersedia   | Dokter Pengirim | Push Notification |
| Nilai kritis     | Dokter Pengirim | Push + SMS/WA     |
| QC Fail          | Supervisor Lab  | Push Notification |
| Sampel expired   | Analis          | Alert             |
