# Modul Dashboard & Laporan

## 1. Deskripsi Umum

Modul Dashboard & Laporan adalah sistem informasi eksekutif yang menyajikan data kinerja rumah sakit secara visual dan interaktif. Modul ini menyediakan:

- Dashboard real-time untuk monitoring operasional
- Indikator kinerja rumah sakit (KPI)
- Laporan standar untuk manajemen dan regulator
- Analitik data untuk pengambilan keputusan
- Export data untuk kebutuhan eksternal

---

## 2. Jenis Dashboard

### 2.1 Dashboard Eksekutif

| Widget | Metrik |
|--------|--------|
| **Overview** | Total kunjungan, Pendapatan, BOR, ALOS |
| **Trend** | Grafik kunjungan harian/bulanan |
| **Perbandingan** | YoY, MoM comparison |
| **Alert** | Notifikasi penting |

### 2.2 Dashboard Pelayanan

| Widget | Metrik |
|--------|--------|
| **Rawat Jalan** | Kunjungan per poli, Antrian aktif |
| **IGD** | Kunjungan, Triage category distribution |
| **Rawat Inap** | BOR, ALOS, Turn Over |
| **Penunjang** | Volume Lab, Radiologi |

### 2.3 Dashboard Keuangan

| Widget | Metrik |
|--------|--------|
| **Pendapatan** | Harian, Bulanan, per Unit |
| **Piutang** | Outstanding, Aging |
| **Kas** | Cash flow |
| **Penjamin** | Distribusi per penjamin |

### 2.4 Dashboard Operasional

| Widget | Metrik |
|--------|--------|
| **Stok** | Alert stok minimal, expired |
| **SDM** | Kehadiran, Jasa pelayanan |
| **Farmasi** | Resep pending, TAT |
| **Lab/Radiologi** | Worklist, TAT |

---

## 3. Indikator Kinerja Rumah Sakit

### 3.1 Indikator Rawat Inap

| Indikator | Formula | Standar |
|-----------|---------|---------|
| **BOR (Bed Occupancy Rate)** | (Hari Perawatan / (TT x Periode)) x 100% | 60-85% |
| **ALOS (Average Length of Stay)** | Hari Perawatan / Jumlah Pasien Keluar | 3-12 hari |
| **TOI (Turn Over Interval)** | (TT x Periode - Hari Perawatan) / Pasien Keluar | 1-3 hari |
| **BTO (Bed Turn Over)** | Pasien Keluar / TT | 40-50 kali/tahun |
| **GDR (Gross Death Rate)** | (Pasien Meninggal / Pasien Keluar) x 1000 | < 45‰ |
| **NDR (Net Death Rate)** | (Pasien Meninggal > 48 jam / Pasien Keluar) x 1000 | < 25‰ |

### 3.2 Indikator Rawat Jalan

| Indikator | Formula |
|-----------|---------|
| **Kunjungan Baru** | Jumlah pasien baru |
| **Kunjungan Lama** | Jumlah pasien lama (kontrol) |
| **Rasio Baru:Lama** | Kunjungan Baru / Kunjungan Lama |
| **Rata-rata Kunjungan per Hari** | Total Kunjungan / Hari Kerja |
| **Kunjungan per Dokter** | Total Kunjungan / Jumlah Dokter Praktek |

### 3.3 Indikator IGD

| Indikator | Formula | Target |
|-----------|---------|--------|
| **Response Time Triage** | Waktu dari datang ke triage | < 5 menit |
| **Length of Stay IGD** | Waktu dari datang ke keluar IGD | < 6 jam |
| **Admission Rate** | Pasien yang dirawat inap | Monitoring |
| **Left Without Being Seen** | Pasien pulang sebelum diperiksa | < 2% |

### 3.4 Indikator Penunjang

| Indikator | Standar |
|-----------|---------|
| **TAT Lab (rutin)** | < 120 menit |
| **TAT Lab (CITO)** | < 60 menit |
| **TAT Radiologi** | < 60 menit (expertise) |
| **Medication Error Rate** | 0% |

---

## 4. Skema Data

### 4.1 Konfigurasi Dashboard (dashboard_config)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(20) | Ya | Kode dashboard |
| nama | VARCHAR(100) | Ya | Nama dashboard |
| jenis | ENUM | Ya | 'EKSEKUTIF','PELAYANAN','KEUANGAN','OPERASIONAL','CUSTOM' |
| deskripsi | TEXT | Tidak | Deskripsi |
| layout | JSON | Ya | Konfigurasi layout widget |
| refresh_interval | INT | Ya | Interval refresh (detik) |
| role_access | JSON | Ya | Role yang dapat mengakses |
| is_active | BOOLEAN | Ya | Status aktif |
| created_by | UUID | Ya | FK ke user |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.2 Widget Dashboard (dashboard_widget)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| dashboard_id | UUID | Ya | FK ke dashboard_config |
| kode | VARCHAR(20) | Ya | Kode widget |
| nama | VARCHAR(100) | Ya | Nama widget |
| jenis | ENUM | Ya | 'NUMBER','CHART','TABLE','MAP','GAUGE' |
| data_source | VARCHAR(100) | Ya | Sumber data (query/API) |
| konfigurasi | JSON | Ya | Konfigurasi tampilan |
| posisi_x | INT | Ya | Posisi horizontal |
| posisi_y | INT | Ya | Posisi vertikal |
| lebar | INT | Ya | Lebar widget (grid unit) |
| tinggi | INT | Ya | Tinggi widget (grid unit) |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.3 Template Laporan (laporan_template)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(20) | Ya | Kode laporan |
| nama | VARCHAR(150) | Ya | Nama laporan |
| kategori | ENUM | Ya | 'PELAYANAN','KEUANGAN','SDM','LOGISTIK','REGULASI','CUSTOM' |
| deskripsi | TEXT | Tidak | Deskripsi laporan |
| query | TEXT | Ya | Query untuk generate data |
| parameter | JSON | Tidak | Parameter yang dibutuhkan |
| format_output | JSON | Ya | Format output (kolom, format, dll) |
| jadwal | JSON | Tidak | Jadwal generate otomatis |
| role_access | JSON | Ya | Role yang dapat mengakses |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 4.4 Riwayat Generate Laporan (laporan_history)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| template_id | UUID | Ya | FK ke laporan_template |
| parameter_value | JSON | Ya | Nilai parameter yang digunakan |
| tanggal_generate | DATETIME | Ya | Waktu generate |
| user_id | UUID | Ya | FK ke user |
| file_path | VARCHAR(255) | Tidak | Path file hasil |
| status | ENUM | Ya | 'PENDING','PROSES','SELESAI','GAGAL' |
| error_message | TEXT | Tidak | Pesan error jika gagal |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.5 Data Agregat Harian (agregat_harian)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| tanggal | DATE | Ya | Tanggal |
| metrik | VARCHAR(50) | Ya | Nama metrik |
| unit_id | UUID | Tidak | FK ke unit |
| nilai | DECIMAL(15,2) | Ya | Nilai metrik |
| keterangan | JSON | Tidak | Detail tambahan |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

---

## 5. Daftar Laporan Standar

### 5.1 Laporan Pelayanan

| Kode | Nama Laporan | Periode | Untuk |
|------|--------------|---------|-------|
| LP-001 | Laporan Kunjungan Rawat Jalan | Harian/Bulanan | Internal |
| LP-002 | Laporan Kunjungan per Poli | Bulanan | Internal |
| LP-003 | Laporan Kunjungan per Dokter | Bulanan | Internal |
| LP-004 | Laporan IGD | Harian/Bulanan | Internal |
| LP-005 | Laporan Rawat Inap | Bulanan | Internal |
| LP-006 | Laporan BOR/ALOS/TOI/BTO | Bulanan | Manajemen |
| LP-007 | Top 10 Penyakit Rawat Jalan | Bulanan/Tahunan | Regulasi |
| LP-008 | Top 10 Penyakit Rawat Inap | Bulanan/Tahunan | Regulasi |
| LP-009 | Laporan Mortalitas | Bulanan | Regulasi |
| LP-010 | Laporan Rujukan | Bulanan | Regulasi |

### 5.2 Laporan Keuangan

| Kode | Nama Laporan | Periode | Untuk |
|------|--------------|---------|-------|
| LK-001 | Laporan Pendapatan Harian | Harian | Kasir/Keuangan |
| LK-002 | Laporan Pendapatan per Unit | Bulanan | Manajemen |
| LK-003 | Laporan Pendapatan per Penjamin | Bulanan | Keuangan |
| LK-004 | Laporan Piutang | Bulanan | Keuangan |
| LK-005 | Laporan Aging Piutang | Bulanan | Keuangan |
| LK-006 | Laporan Jasa Pelayanan | Bulanan | SDM/Keuangan |
| LK-007 | Rekap Billing per Kelas | Bulanan | Keuangan |

### 5.3 Laporan Penunjang

| Kode | Nama Laporan | Periode | Untuk |
|------|--------------|---------|-------|
| LPJ-001 | Laporan Pemeriksaan Laboratorium | Bulanan | Lab |
| LPJ-002 | Laporan Pemeriksaan Radiologi | Bulanan | Radiologi |
| LPJ-003 | Laporan Resep Farmasi | Bulanan | Farmasi |
| LPJ-004 | Laporan Penggunaan Obat | Bulanan | Farmasi |
| LPJ-005 | Laporan Stok Obat | Bulanan | Logistik |

### 5.4 Laporan Regulasi (Wajib)

| Kode | Nama Laporan | Frekuensi | Tujuan |
|------|--------------|-----------|--------|
| LR-001 | RL 1 - Data Dasar RS | Tahunan | Kemenkes |
| LR-002 | RL 2 - Ketenagaan | Tahunan | Kemenkes |
| LR-003 | RL 3 - Pelayanan | Bulanan | Kemenkes |
| LR-004 | RL 4 - Morbiditas/Mortalitas | Tahunan | Kemenkes |
| LR-005 | RL 5 - Pengunjung | Tahunan | Kemenkes |
| LR-006 | Laporan IKS (Indikator Kinerja Standar) | Triwulan | BPJS |

---

## 6. Form & Interface

### 6.1 Dashboard Viewer

**Layout:**
- Header: Nama dashboard, periode, refresh button
- Grid layout untuk widget
- Each widget: Title, data visualization, drill-down option

**Interaksi:**
- Click widget untuk detail
- Filter by date range
- Export to PDF/Excel

### 6.2 Dashboard Builder (Admin)

**Fitur:**
- Drag & drop widget
- Configure widget properties
- Preview mode
- Save & publish

**Widget Properties:**
- Jenis visualisasi (line chart, bar chart, pie, table, dll)
- Data source
- Filter default
- Styling

### 6.3 Report Generator

**Step 1: Pilih Template**
- Browse kategori
- Search by nama
- Preview template

**Step 2: Input Parameter**
- Periode (tanggal mulai - selesai)
- Unit (jika diperlukan)
- Filter lainnya sesuai template

**Step 3: Preview & Generate**
- Preview data
- Generate report
- Download (PDF/Excel/CSV)

### 6.4 Scheduled Report

**Konfigurasi:**
- Pilih template laporan
- Set parameter default
- Jadwal (harian/mingguan/bulanan)
- Waktu generate
- Penerima (email)
- Format output

### 6.5 Ad-hoc Query (Advanced User)

**Fitur:**
- SQL query builder visual
- Test query
- Save as template
- Export hasil

---

## 7. Visualisasi Data

### 7.1 Jenis Chart yang Tersedia

| Jenis | Penggunaan |
|-------|------------|
| **Line Chart** | Trend waktu (kunjungan, pendapatan) |
| **Bar Chart** | Perbandingan kategori |
| **Pie/Donut Chart** | Distribusi persentase |
| **Gauge** | Target vs Actual |
| **Table** | Data detail |
| **Card/Number** | Single metric |
| **Heat Map** | Density (jam sibuk, dll) |
| **Geo Map** | Distribusi geografis pasien |

### 7.2 Contoh Dashboard

**Dashboard Eksekutif:**
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   Kunjungan     │   Pendapatan    │      BOR        │      ALOS       │
│     1,234       │   Rp 1.2 M      │     75%         │    4.5 hari     │
│    ▲ 5%         │    ▲ 8%         │    ▲ 2%         │    ▼ 0.3        │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
┌───────────────────────────────────┬───────────────────────────────────┐
│      Trend Kunjungan (Line)       │     Pendapatan per Unit (Bar)     │
│                                   │                                   │
│         📈                        │         📊                        │
│                                   │                                   │
└───────────────────────────────────┴───────────────────────────────────┘
┌───────────────────────────────────┬───────────────────────────────────┐
│    Distribusi Penjamin (Pie)      │      Top 10 Diagnosis (Table)     │
│                                   │                                   │
│         🥧                        │         📋                        │
│                                   │                                   │
└───────────────────────────────────┴───────────────────────────────────┘
```

---

## 8. Integrasi dengan Modul Lain

| Modul Sumber | Data yang Diterima |
|--------------|-------------------|
| Semua Modul | Data transaksi untuk agregasi |
| Billing | Pendapatan |
| Pendaftaran | Kunjungan |
| Rawat Inap | Data rawat inap (BOR, ALOS) |
| Farmasi | Data resep |
| Lab/Radiologi | Data pemeriksaan |

---

## 9. Aturan Bisnis (Business Rules)

1. **Dashboard** harus refresh minimal setiap 5 menit untuk data real-time
2. **Data agregat** dihitung dan disimpan untuk performa
3. Laporan yang sudah di-generate **tidak boleh diubah** (immutable)
4. **Akses laporan** sesuai role dan unit masing-masing
5. **Laporan regulasi** harus sesuai format standar Kemenkes
6. Data pada dashboard harus **konsisten** dengan laporan
7. **Drill-down** hanya menampilkan data sesuai akses user
8. **Export** data sensitif memerlukan approval
9. **Scheduled report** dikirim maksimal 1 jam setelah periode berakhir
10. **Backup** data laporan dilakukan secara berkala

---

## 10. Kebutuhan Teknis

### 10.1 Data Warehouse

**Struktur:**
- Fact tables untuk transaksi
- Dimension tables untuk master
- Aggregate tables untuk performa

**ETL Process:**
- Extract dari OLTP
- Transform dan cleansing
- Load ke data warehouse
- Scheduling (nightly/hourly)

### 10.2 Permission/Role

| Role | Akses |
|------|-------|
| User Biasa | Dashboard unit sendiri |
| Kepala Unit | Dashboard + laporan unit |
| Manajemen | Dashboard eksekutif + laporan manajemen |
| Admin | Semua + konfigurasi |
| Regulator Access | Laporan regulasi saja |

### 10.3 Export Format

- PDF (untuk cetak resmi)
- Excel (untuk analisis lanjutan)
- CSV (untuk data processing)
- HTML (untuk email)

### 10.4 Notifikasi

| Event | Penerima | Channel |
|-------|----------|---------|
| KPI di bawah target | Manajemen | Alert |
| Laporan terjadwal selesai | Subscriber | Email |
| Generate gagal | Admin | Alert |
| Data anomaly | Admin | Alert |
