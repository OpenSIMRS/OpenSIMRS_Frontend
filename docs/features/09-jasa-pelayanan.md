# Modul Jasa Pelayanan

## 1. Deskripsi Umum

Modul Jasa Pelayanan adalah sistem informasi yang mengelola perhitungan dan distribusi jasa pelayanan (JP) kepada tenaga medis dan non-medis yang terlibat dalam pelayanan pasien. Modul ini mencakup:

- Pencatatan pelaksana setiap tindakan/pelayanan
- Perhitungan pembagian jasa berdasarkan formula yang ditetapkan
- Distribusi jasa per periode
- Pelaporan jasa pelayanan individu dan unit
- Rekonsiliasi dengan pendapatan

---

## 2. Komponen Jasa Pelayanan

### 2.1 Kategori Penerima Jasa

| Kategori | Contoh |
|----------|--------|
| **Dokter** | Dokter umum, Dokter spesialis, Dokter gigi |
| **Perawat** | Perawat pelaksana, Perawat pendamping |
| **Tenaga Medis Lain** | Bidan, Analis, Radiografer, Apoteker |
| **Tenaga Penunjang** | Administrasi, Cleaning Service, dll |

### 2.2 Jenis Jasa

| Jenis | Keterangan |
|-------|------------|
| **Jasa Medis** | Komponen jasa dari tindakan medis |
| **Jasa Sarana** | Komponen penggunaan sarana/alat |
| **Jasa Manajemen** | Komponen untuk manajemen RS |
| **Jasa Keperawatan** | Komponen jasa perawatan |

---

## 3. Alur Kerja (Workflow)

### 3.1 Alur Pencatatan Pelaksana

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Tindakan/       │────▶│ Input Pelaksana  │────▶│ Verifikasi      │
│ Pelayanan       │     │ (Dokter, Perawat)│     │ Data            │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
                                            ┌─────────────────────────┐
                                            │ Data Tersimpan untuk    │
                                            │ Perhitungan JP          │
                                            └─────────────────────────┘
```

### 3.2 Alur Perhitungan Jasa

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Billing Closed  │────▶│ Hitung Komponen  │────▶│ Distribusi ke   │
│                 │     │ Jasa             │     │ Pelaksana       │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Generate Slip   │◀────│ Approval         │◀────│ Rekonsiliasi    │
│ Jasa            │     │ Manajemen        │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 3.3 Alur Distribusi Bulanan

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Closing Periode │────▶│ Generate Laporan │────▶│ Approval        │
│ (Bulanan)       │     │ JP               │     │                 │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Distribusi ke   │◀────│ Proses           │◀────│ Integrasi       │
│ Rekening        │     │ Pembayaran       │     │ Payroll         │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 4. Skema Data

### 4.1 Pelaksana Tindakan (pelaksana_tindakan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| billing_detail_id | UUID | Ya | FK ke billing_detail |
| tindakan_id | UUID | Ya | FK ke master_tindakan |
| pegawai_id | UUID | Ya | FK ke pegawai |
| peran | ENUM | Ya | 'OPERATOR','ASISTEN_1','ASISTEN_2','ANESTESI','PERAWAT','LAINNYA' |
| persentase | DECIMAL(5,2) | Ya | Persentase jasa |
| nilai_jasa | DECIMAL(15,2) | Ya | Nilai jasa yang diterima |
| status | ENUM | Ya | 'PENDING','CALCULATED','PAID' |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |
| created_by | UUID | Ya | FK ke user |

### 4.2 Formula Jasa (formula_jasa)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(20) | Ya | Kode formula |
| nama | VARCHAR(100) | Ya | Nama formula |
| kategori_tindakan_id | UUID | Ya | FK ke kategori_tindakan |
| komponen_jasa_medis | DECIMAL(5,2) | Ya | Persentase jasa medis dari tarif |
| komponen_jasa_sarana | DECIMAL(5,2) | Ya | Persentase jasa sarana |
| komponen_jasa_rs | DECIMAL(5,2) | Ya | Persentase untuk RS |
| is_active | BOOLEAN | Ya | Status aktif |
| tanggal_berlaku | DATE | Ya | Tanggal mulai berlaku |
| tanggal_berakhir | DATE | Tidak | Tanggal berakhir |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 4.3 Distribusi Formula per Peran (distribusi_formula)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| formula_id | UUID | Ya | FK ke formula_jasa |
| peran | ENUM | Ya | 'OPERATOR','ASISTEN_1','ASISTEN_2','ANESTESI','PERAWAT' |
| persentase | DECIMAL(5,2) | Ya | Persentase dari komponen jasa medis |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.4 Akumulasi Jasa (akumulasi_jasa)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| pegawai_id | UUID | Ya | FK ke pegawai |
| periode_tahun | INT | Ya | Tahun periode |
| periode_bulan | INT | Ya | Bulan periode |
| total_jasa_medis | DECIMAL(15,2) | Ya | Total jasa medis |
| total_jasa_keperawatan | DECIMAL(15,2) | Ya | Total jasa keperawatan |
| total_jasa_lainnya | DECIMAL(15,2) | Ya | Total jasa lainnya |
| grand_total | DECIMAL(15,2) | Ya | Grand total |
| potongan_pajak | DECIMAL(15,2) | Ya | Potongan pajak |
| potongan_lainnya | DECIMAL(15,2) | Tidak | Potongan lainnya |
| netto | DECIMAL(15,2) | Ya | Jumlah bersih |
| status | ENUM | Ya | 'DRAFT','APPROVED','PAID' |
| approved_by | UUID | Tidak | FK ke user |
| approved_at | DATETIME | Tidak | Waktu approval |
| paid_at | DATETIME | Tidak | Waktu pembayaran |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 4.5 Detail Akumulasi (akumulasi_jasa_detail)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| akumulasi_id | UUID | Ya | FK ke akumulasi_jasa |
| pelaksana_id | UUID | Ya | FK ke pelaksana_tindakan |
| tanggal | DATE | Ya | Tanggal tindakan |
| billing_id | UUID | Ya | FK ke billing |
| pasien_nama | VARCHAR(100) | Ya | Nama pasien |
| tindakan_nama | VARCHAR(150) | Ya | Nama tindakan |
| peran | VARCHAR(50) | Ya | Peran dalam tindakan |
| nilai_jasa | DECIMAL(15,2) | Ya | Nilai jasa |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.6 Template Peran Tindakan (template_peran)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| tindakan_id | UUID | Ya | FK ke master_tindakan |
| peran | ENUM | Ya | 'OPERATOR','ASISTEN_1','ASISTEN_2','ANESTESI','PERAWAT' |
| is_required | BOOLEAN | Ya | Wajib diisi |
| default_pegawai_id | UUID | Tidak | FK ke pegawai (default) |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.7 Periode Jasa (periode_jasa)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| tahun | INT | Ya | Tahun |
| bulan | INT | Ya | Bulan |
| tanggal_mulai | DATE | Ya | Tanggal awal periode |
| tanggal_akhir | DATE | Ya | Tanggal akhir periode |
| status | ENUM | Ya | 'OPEN','CALCULATING','CLOSED','PAID' |
| closed_by | UUID | Tidak | FK ke user |
| closed_at | DATETIME | Tidak | Waktu closing |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

---

## 5. Form-Form yang Dibutuhkan

### 5.1 Form Input Pelaksana Tindakan

**Konteks:** Muncul saat input tindakan di EMR atau saat billing

**Informasi Tindakan (read-only):**
- Nama Tindakan
- Kategori
- Tarif
- Komponen Jasa: Rp X

**Input Pelaksana:**
| Peran | Nama Pegawai* | Persentase | Nilai Jasa |
|-------|---------------|------------|------------|
| Operator Utama | [search dropdown] | [auto/input] | [auto-calc] |
| Asisten 1 | [search dropdown] | [auto/input] | [auto-calc] |
| Asisten 2 | [search dropdown] | [auto/input] | [auto-calc] |
| Anestesi | [search dropdown] | [auto/input] | [auto-calc] |
| Perawat Instrumen | [search dropdown] | [auto/input] | [auto-calc] |
| Perawat Sirkuler | [search dropdown] | [auto/input] | [auto-calc] |

**Validasi:**
- Total persentase = 100%
- Operator wajib diisi
- Minimal 1 peran terisi

### 5.2 Form Setting Formula Jasa

**Header:**
- Kode Formula*
- Nama Formula*
- Kategori Tindakan* (dropdown)
- Tanggal Berlaku*
- Tanggal Berakhir

**Komponen Tarif:**
| Komponen | Persentase dari Tarif |
|----------|----------------------|
| Jasa Medis | [input]% |
| Jasa Sarana | [input]% |
| Jasa RS | [input]% |
| **Total** | **100%** |

**Distribusi Jasa Medis per Peran:**
| Peran | Persentase dari Jasa Medis |
|-------|---------------------------|
| Operator | [input]% |
| Asisten 1 | [input]% |
| Asisten 2 | [input]% |
| Anestesi | [input]% |
| Perawat | [input]% |
| **Total** | **100%** |

### 5.3 Form Kalkulasi Jasa Periode

**Filter:**
- Periode (Bulan/Tahun)*
- Unit (opsional)
- Pegawai (opsional)

**Proses:**
1. Klik "Hitung Jasa"
2. Sistem mengambil semua billing closed dalam periode
3. Kalkulasi berdasarkan formula
4. Generate akumulasi per pegawai

**Preview Hasil:**
| No | NIP | Nama | Unit | Jasa Medis | Jasa Keperawatan | Total |
|----|-----|------|------|------------|------------------|-------|
| 1 | 001 | dr. A | Bedah | 15,000,000 | - | 15,000,000 |
| 2 | 002 | dr. B | Penyakit Dalam | 12,500,000 | - | 12,500,000 |
| 3 | 003 | Ns. C | Ruang Rawat | - | 3,500,000 | 3,500,000 |

**Aksi:**
- Simpan Draft
- Submit untuk Approval
- Export Excel

### 5.4 Form Approval Jasa

**Daftar Pending Approval:**
| Periode | Total Pegawai | Total Jasa | Status | Aksi |
|---------|---------------|------------|--------|------|
| Jan 2025 | 150 | 500,000,000 | Pending | [Review] [Approve] [Reject] |

**Detail Review:**
- Summary per unit
- Detail per pegawai
- Perbandingan dengan periode sebelumnya
- Anomaly detection (jika ada kenaikan/penurunan signifikan)

### 5.5 Form Slip Jasa Individu

**Preview Slip:**
```
====================================
        SLIP JASA PELAYANAN
           Periode: Januari 2025
====================================
NIP        : 12345
Nama       : dr. Ahmad Budiman, Sp.B
Unit       : Instalasi Bedah Sentral

------------------------------------
RINCIAN JASA
------------------------------------
Operasi Appendektomi      : Rp 2,500,000
  - Pasien: Budi (RM: 001)
  - Tanggal: 05/01/2025
  
Operasi Hernia           : Rp 3,000,000
  - Pasien: Ani (RM: 002)
  - Tanggal: 10/01/2025

... (dst)

------------------------------------
TOTAL BRUTO              : Rp 15,000,000
Potongan Pajak (5%)      : Rp    750,000
------------------------------------
TOTAL NETTO              : Rp 14,250,000
====================================
```

### 5.6 Form Laporan Jasa per Unit

**Filter:**
- Periode*
- Unit*

**Tampilan:**
| Nama | Jabatan | Jumlah Tindakan | Total Jasa |
|------|---------|-----------------|------------|
| dr. A | Dokter Bedah | 25 | 15,000,000 |
| dr. B | Dokter Bedah | 20 | 12,000,000 |
| Ns. C | Perawat | 50 | 5,000,000 |

**Summary:**
- Total Jasa Unit: Rp XX
- Rata-rata per Pegawai: Rp XX
- Top Performer: dr. A

---

## 6. Fitur Pendukung

### 6.1 Dashboard Jasa Pelayanan

**Widget:**
- Total Jasa Bulan Ini
- Perbandingan dengan Bulan Lalu
- Top 10 Penerima Jasa
- Distribusi per Unit

**Chart:**
- Trend Jasa 12 Bulan Terakhir
- Pie Chart per Kategori Tindakan
- Bar Chart per Unit

### 6.2 Simulasi Perhitungan

**Fitur:**
- Input tindakan dan pelaksana
- Kalkulasi simulasi jasa
- Berguna untuk estimasi sebelum tindakan

### 6.3 Audit Trail Jasa

**Tracking:**
- Perubahan pelaksana
- Perubahan persentase
- Approval history
- Payment history

### 6.4 Integrasi Payroll

**Fitur:**
- Export data untuk sistem penggajian
- Format sesuai kebutuhan
- Scheduling otomatis

### 6.5 Analitik Jasa

**Report:**
- Produktivitas per dokter
- Trend pelayanan
- Benchmark antar unit
- Cost per service

---

## 7. Integrasi dengan Modul Lain

| Modul Sumber | Data yang Diterima | Penggunaan |
|--------------|--------------------|--------------------|
| Billing | Detail tindakan, tarif | Basis perhitungan |
| EMR | Pelaksana tindakan | Data pelaksana |
| Master Pegawai | Data pegawai | Identifikasi penerima |
| Master Tindakan | Formula jasa | Perhitungan |

| Modul Tujuan | Data yang Dikirim | Trigger |
|--------------|-------------------|---------|
| Keuangan | Total jasa per periode | Setelah approval |
| Payroll | Data jasa per pegawai | Setelah closing |
| SDM | Kinerja pegawai | Periodik |

---

## 8. Aturan Bisnis (Business Rules)

1. Setiap tindakan **wajib** memiliki minimal 1 pelaksana (operator)
2. **Total persentase** pelaksana harus = 100%
3. Jasa dihitung setelah **billing closed** dan **terbayar** (untuk pasien umum)
4. **Periode jasa** mengikuti periode billing (bukan tanggal tindakan)
5. Perubahan pelaksana setelah billing closed memerlukan **approval**
6. **Potongan pajak** sesuai ketentuan pajak penghasilan
7. Jasa **BPJS** dihitung berdasarkan tarif INA-CBG setelah klaim approved
8. **Closing periode** tidak bisa dibuka kembali tanpa approval direktur
9. Pegawai yang **resign/mutasi** tetap mendapat jasa periode berjalan
10. **Slip jasa** dapat diakses setelah approval manajemen

---

## 9. Kebutuhan Teknis

### 9.1 Formula Engine

**Requirement:**
- Flexible formula definition
- Multiple formula per kategori
- Version control formula
- Effective date tracking

### 9.2 Permission/Role

| Role | Akses |
|------|-------|
| Staff Unit | View jasa sendiri |
| Kepala Unit | View jasa unit, input pelaksana |
| Admin JP | Kalkulasi, setting formula |
| Supervisor | Approval level 1 |
| Manager | Approval level 2, closing periode |
| Direktur | View all, override approval |

### 9.3 Laporan

**Laporan Periodik:**
- Jasa per pegawai
- Jasa per unit
- Jasa per kategori tindakan
- Summary bulanan

**Laporan Analitik:**
- Trend jasa
- Produktivitas
- Benchmark
- Forecasting

---

## 10. Notifikasi

| Event | Penerima | Channel |
|-------|----------|---------|
| Jasa periode siap dihitung | Admin JP | Push |
| Pending approval | Supervisor/Manager | Push |
| Jasa diapprove | Pegawai | Push |
| Jasa dibayarkan | Pegawai | Push + Email |
| Anomaly terdeteksi | Admin JP | Alert |
