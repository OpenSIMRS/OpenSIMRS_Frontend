# Modul Gudang/Logistik

## 1. Deskripsi Umum

Modul Gudang/Logistik adalah sistem informasi yang mengelola seluruh rantai pasokan (supply chain) rumah sakit, mulai dari pengadaan, penerimaan barang, penyimpanan, hingga distribusi ke unit-unit pelayanan. Modul ini mencakup:

- Manajemen master barang (Obat, Alkes, BHP)
- Pengadaan dan pembelian (Procurement)
- Penerimaan barang dari supplier
- Manajemen stok dan penyimpanan
- Distribusi ke depo/unit
- Sistem FEFO/FIFO untuk pengeluaran stok
- Stock opname dan adjustment
- Pelaporan logistik

---

## 2. Jenis Gudang

| Jenis | Deskripsi |
|-------|-----------|
| **Gudang Farmasi** | Penyimpanan obat-obatan |
| **Gudang Alkes** | Alat kesehatan habis pakai dan non-habis pakai |
| **Gudang Umum** | Barang non-medis (ATK, Rumah Tangga, dll) |
| **Gudang Gizi** | Bahan makanan dan keperluan dapur |
| **Gudang Linen** | Linen dan laundry |

---

## 3. Alur Kerja (Workflow)

### 3.1 Alur Pengadaan Barang

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Permintaan dari │────▶│ Perencanaan &    │────▶│ Purchase Order  │
│ Unit/Reorder    │     │ Seleksi Supplier │     │ (PO)            │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Update Stok     │◀────│ Penerimaan &     │◀────│ Pengiriman      │
│ Gudang          │     │ Quality Check    │     │ dari Supplier   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 3.2 Alur Distribusi Internal

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Permintaan dari │────▶│ Approval         │────▶│ Penyiapan       │
│ Depo/Unit       │     │ Gudang           │     │ Barang          │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Update Stok     │◀────│ Penerimaan di    │◀────│ Distribusi      │
│ Gudang & Depo   │     │ Depo/Unit        │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 3.3 Alur Stock Opname

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Jadwal Stock    │────▶│ Hitung Fisik     │────▶│ Input Hasil     │
│ Opname          │     │ Barang           │     │ Opname          │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Adjustment      │◀────│ Approval         │◀────│ Rekonsiliasi    │
│ Stok            │     │ Selisih          │     │ Selisih         │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 4. Skema Data

### 4.1 Master Barang (tbl_master_barang)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(20) | Ya | Kode barang |
| nama | VARCHAR(150) | Ya | Nama barang |
| kategori_id | UUID | Ya | FK ke tbl_kategori_barang |
| jenis | ENUM | Ya | 'OBAT','ALKES','BHP','UMUM','GIZI','LINEN' |
| satuan_kecil | VARCHAR(20) | Ya | Satuan terkecil |
| satuan_sedang | VARCHAR(20) | Tidak | Satuan sedang |
| satuan_besar | VARCHAR(20) | Tidak | Satuan besar |
| konversi_sedang | INT | Tidak | Konversi ke satuan kecil |
| konversi_besar | INT | Tidak | Konversi ke satuan kecil |
| harga_beli | DECIMAL(15,2) | Ya | Harga beli terakhir |
| harga_jual | DECIMAL(15,2) | Ya | Harga jual |
| margin_persen | DECIMAL(5,2) | Tidak | Persentase margin |
| stok_minimal | INT | Ya | Stok minimal (reorder point) |
| stok_maksimal | INT | Tidak | Stok maksimal |
| lead_time | INT | Tidak | Lead time pengadaan (hari) |
| is_consignment | BOOLEAN | Ya | Barang konsinyasi |
| produsen_id | UUID | Tidak | FK ke tbl_produsen |
| supplier_default_id | UUID | Tidak | FK ke tbl_supplier |
| golongan | ENUM | Tidak | Untuk obat: 'BEBAS','KERAS','NARKOTIKA', dll |
| is_high_alert | BOOLEAN | Tidak | Untuk obat high alert |
| lokasi_penyimpanan | VARCHAR(50) | Tidak | Lokasi di gudang |
| suhu_penyimpanan | VARCHAR(50) | Tidak | Suhu penyimpanan |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 4.2 Supplier (tbl_supplier)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(20) | Ya | Kode supplier |
| nama | VARCHAR(100) | Ya | Nama supplier |
| jenis | ENUM | Ya | 'DISTRIBUTOR','PRODUSEN','APOTEK','LAINNYA' |
| alamat | TEXT | Ya | Alamat lengkap |
| kota | VARCHAR(50) | Ya | Kota |
| telepon | VARCHAR(20) | Ya | Nomor telepon |
| fax | VARCHAR(20) | Tidak | Nomor fax |
| email | VARCHAR(100) | Tidak | Email |
| website | VARCHAR(100) | Tidak | Website |
| npwp | VARCHAR(30) | Tidak | NPWP |
| nama_kontak | VARCHAR(100) | Tidak | Nama contact person |
| telepon_kontak | VARCHAR(20) | Tidak | Telepon contact person |
| no_izin | VARCHAR(50) | Tidak | Nomor izin PBF/Apotek |
| tanggal_izin_expired | DATE | Tidak | Tanggal expired izin |
| termin_pembayaran | INT | Tidak | Termin pembayaran (hari) |
| bank | VARCHAR(50) | Tidak | Nama bank |
| no_rekening | VARCHAR(30) | Tidak | Nomor rekening |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 4.3 Purchase Order (tbl_purchase_order)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| no_po | VARCHAR(20) | Ya | Nomor PO |
| tanggal_po | DATE | Ya | Tanggal PO |
| supplier_id | UUID | Ya | FK ke tbl_supplier |
| gudang_id | UUID | Ya | FK ke tbl_gudang |
| jenis_po | ENUM | Ya | 'REGULER','CITO','KONSINYASI' |
| keterangan | TEXT | Tidak | Keterangan |
| total | DECIMAL(15,2) | Ya | Total nilai PO |
| ppn | DECIMAL(15,2) | Tidak | Nilai PPN |
| diskon | DECIMAL(15,2) | Tidak | Nilai diskon |
| grand_total | DECIMAL(15,2) | Ya | Grand total |
| tanggal_kirim | DATE | Tidak | Estimasi tanggal kirim |
| status | ENUM | Ya | 'DRAFT','PENDING','APPROVED','PARTIAL','COMPLETE','CANCEL' |
| approved_by | UUID | Tidak | FK ke tbl_user |
| approved_at | DATETIME | Tidak | Waktu approval |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |
| created_by | UUID | Ya | FK ke tbl_user |

### 4.4 Detail Purchase Order (tbl_po_detail)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| po_id | UUID | Ya | FK ke tbl_purchase_order |
| barang_id | UUID | Ya | FK ke tbl_master_barang |
| satuan | VARCHAR(20) | Ya | Satuan pemesanan |
| jumlah_pesan | INT | Ya | Jumlah yang dipesan |
| jumlah_terima | INT | Tidak | Jumlah yang sudah diterima |
| harga_satuan | DECIMAL(15,2) | Ya | Harga per satuan |
| diskon_persen | DECIMAL(5,2) | Tidak | Diskon persen |
| diskon_nominal | DECIMAL(15,2) | Tidak | Diskon nominal |
| subtotal | DECIMAL(15,2) | Ya | Subtotal |
| status | ENUM | Ya | 'PENDING','PARTIAL','COMPLETE','CANCEL' |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.5 Penerimaan Barang (tbl_penerimaan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| no_terima | VARCHAR(20) | Ya | Nomor penerimaan |
| tanggal_terima | DATE | Ya | Tanggal terima |
| po_id | UUID | Tidak | FK ke tbl_purchase_order |
| supplier_id | UUID | Ya | FK ke tbl_supplier |
| gudang_id | UUID | Ya | FK ke tbl_gudang |
| no_faktur | VARCHAR(50) | Ya | Nomor faktur supplier |
| tanggal_faktur | DATE | Ya | Tanggal faktur |
| no_surat_jalan | VARCHAR(50) | Tidak | Nomor surat jalan |
| total | DECIMAL(15,2) | Ya | Total nilai |
| ppn | DECIMAL(15,2) | Tidak | Nilai PPN |
| grand_total | DECIMAL(15,2) | Ya | Grand total |
| jatuh_tempo | DATE | Tidak | Tanggal jatuh tempo |
| status | ENUM | Ya | 'DRAFT','VERIFIED','POSTED','CANCEL' |
| verified_by | UUID | Tidak | FK ke tbl_user |
| verified_at | DATETIME | Tidak | Waktu verifikasi |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| created_by | UUID | Ya | FK ke tbl_user |

### 4.6 Detail Penerimaan (tbl_penerimaan_detail)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| penerimaan_id | UUID | Ya | FK ke tbl_penerimaan |
| po_detail_id | UUID | Tidak | FK ke tbl_po_detail |
| barang_id | UUID | Ya | FK ke tbl_master_barang |
| batch_number | VARCHAR(50) | Ya | Nomor batch |
| expired_date | DATE | Ya | Tanggal kadaluarsa |
| satuan | VARCHAR(20) | Ya | Satuan |
| jumlah | INT | Ya | Jumlah diterima |
| harga_satuan | DECIMAL(15,2) | Ya | Harga satuan |
| subtotal | DECIMAL(15,2) | Ya | Subtotal |
| kondisi | ENUM | Ya | 'BAIK','RUSAK','EXPIRED' |
| catatan | TEXT | Tidak | Catatan |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.7 Stok Gudang (tbl_stok)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| barang_id | UUID | Ya | FK ke tbl_master_barang |
| gudang_id | UUID | Ya | FK ke tbl_gudang |
| batch_number | VARCHAR(50) | Ya | Nomor batch |
| expired_date | DATE | Ya | Tanggal kadaluarsa |
| jumlah | INT | Ya | Jumlah stok |
| harga_beli | DECIMAL(15,2) | Ya | Harga beli per unit |
| lokasi | VARCHAR(50) | Tidak | Lokasi penyimpanan |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 4.8 Mutasi Stok (tbl_mutasi_stok)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| tanggal | DATETIME | Ya | Tanggal mutasi |
| barang_id | UUID | Ya | FK ke tbl_master_barang |
| gudang_id | UUID | Ya | FK ke tbl_gudang |
| batch_number | VARCHAR(50) | Ya | Nomor batch |
| jenis_mutasi | ENUM | Ya | 'MASUK','KELUAR','ADJUSTMENT','RETUR','RUSAK' |
| jumlah | INT | Ya | Jumlah mutasi |
| saldo_akhir | INT | Ya | Saldo setelah mutasi |
| referensi_tipe | VARCHAR(50) | Tidak | Tipe dokumen referensi |
| referensi_id | UUID | Tidak | ID dokumen referensi |
| keterangan | TEXT | Tidak | Keterangan |
| created_by | UUID | Ya | FK ke tbl_user |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.9 Permintaan Internal (tbl_permintaan_internal)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| no_permintaan | VARCHAR(20) | Ya | Nomor permintaan |
| tanggal | DATE | Ya | Tanggal permintaan |
| unit_peminta_id | UUID | Ya | FK ke tbl_unit |
| gudang_tujuan_id | UUID | Ya | FK ke tbl_gudang (depo tujuan) |
| gudang_pengirim_id | UUID | Ya | FK ke tbl_gudang |
| jenis | ENUM | Ya | 'RUTIN','CITO' |
| keterangan | TEXT | Tidak | Keterangan |
| status | ENUM | Ya | 'DRAFT','PENDING','APPROVED','REJECTED','PROSES','SELESAI' |
| approved_by | UUID | Tidak | FK ke tbl_user |
| approved_at | DATETIME | Tidak | Waktu approval |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| created_by | UUID | Ya | FK ke tbl_user |

### 4.10 Distribusi Internal (tbl_distribusi)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| no_distribusi | VARCHAR(20) | Ya | Nomor distribusi |
| tanggal | DATE | Ya | Tanggal distribusi |
| permintaan_id | UUID | Tidak | FK ke tbl_permintaan_internal |
| gudang_pengirim_id | UUID | Ya | FK ke tbl_gudang |
| gudang_penerima_id | UUID | Ya | FK ke tbl_gudang |
| keterangan | TEXT | Tidak | Keterangan |
| status | ENUM | Ya | 'DRAFT','DIKIRIM','DITERIMA','PARTIAL' |
| dikirim_by | UUID | Tidak | FK ke tbl_user |
| dikirim_at | DATETIME | Tidak | Waktu kirim |
| diterima_by | UUID | Tidak | FK ke tbl_user |
| diterima_at | DATETIME | Tidak | Waktu terima |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| created_by | UUID | Ya | FK ke tbl_user |

### 4.11 Stock Opname (tbl_stock_opname)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| no_opname | VARCHAR(20) | Ya | Nomor stock opname |
| tanggal | DATE | Ya | Tanggal opname |
| gudang_id | UUID | Ya | FK ke tbl_gudang |
| jenis | ENUM | Ya | 'PENUH','PARSIAL','SAMPLING' |
| status | ENUM | Ya | 'DRAFT','PROSES','SELESAI','APPROVED' |
| catatan | TEXT | Tidak | Catatan |
| approved_by | UUID | Tidak | FK ke tbl_user |
| approved_at | DATETIME | Tidak | Waktu approval |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| created_by | UUID | Ya | FK ke tbl_user |

### 4.12 Detail Stock Opname (tbl_stock_opname_detail)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| opname_id | UUID | Ya | FK ke tbl_stock_opname |
| barang_id | UUID | Ya | FK ke tbl_master_barang |
| batch_number | VARCHAR(50) | Ya | Nomor batch |
| stok_sistem | INT | Ya | Stok menurut sistem |
| stok_fisik | INT | Ya | Stok hasil hitung fisik |
| selisih | INT | Ya | Selisih (fisik - sistem) |
| keterangan | TEXT | Tidak | Keterangan selisih |
| status_adjustment | ENUM | Tidak | 'PENDING','APPROVED','REJECTED' |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

---

## 5. Form-Form yang Dibutuhkan

### 5.1 Form Purchase Order

**Header PO:**
- Nomor PO* (auto-generate)
- Tanggal PO*
- Supplier* (dropdown dengan search)
- Gudang Tujuan* (dropdown)
- Jenis PO* (dropdown: Reguler/CITO/Konsinyasi)
- Estimasi Pengiriman
- Keterangan

**Detail Barang:**
| No | Kode | Nama Barang | Satuan | Stok | Jumlah | Harga | Diskon | Subtotal |
|----|------|-------------|--------|------|--------|-------|--------|----------|
| 1 | [search] | [auto] | [dropdown] | [auto] | [input] | [input] | [input] | [auto] |

**Footer:**
- Subtotal
- Diskon (%)
- PPN (%)
- Grand Total

**Aksi:**
- Simpan Draft
- Submit untuk Approval
- Cetak

### 5.2 Form Penerimaan Barang

**Header:**
- Nomor Terima* (auto-generate)
- Tanggal Terima*
- Referensi PO (dropdown, jika ada)
- Supplier* (auto-fill dari PO atau manual)
- Gudang Tujuan*
- Nomor Faktur*
- Tanggal Faktur*
- Nomor Surat Jalan

**Detail Barang:**
| No | Kode | Nama Barang | Batch* | Expired* | Satuan | Qty Terima* | Harga | Subtotal | Kondisi |
|----|------|-------------|--------|----------|--------|-------------|-------|----------|---------|
| 1 | [from PO] | [auto] | [input] | [date] | [auto] | [input] | [auto] | [auto] | [dropdown] |

**Quality Check:**
- [ ] Kondisi kemasan baik
- [ ] Batch number sesuai
- [ ] Expired date minimal 1 tahun
- [ ] Jumlah sesuai surat jalan
- [ ] Dokumen lengkap (faktur, SJ, CoA)

**Footer:**
- Subtotal
- PPN
- Grand Total
- Jatuh Tempo Pembayaran

### 5.3 Form Permintaan Internal

**Header:**
- Nomor Permintaan* (auto-generate)
- Tanggal*
- Unit Peminta* (dropdown)
- Gudang Pengirim* (dropdown)
- Jenis* (Rutin/CITO)
- Keterangan

**Detail Barang:**
| No | Kode | Nama Barang | Stok Depo | Stok Gudang | Jumlah Minta | Satuan |
|----|------|-------------|-----------|-------------|--------------|--------|
| 1 | [search] | [auto] | [auto] | [auto] | [input] | [auto] |

### 5.4 Form Distribusi

**Header:**
- Nomor Distribusi* (auto-generate)
- Tanggal*
- Referensi Permintaan (dropdown, jika ada)
- Gudang Pengirim*
- Gudang/Depo Penerima*
- Keterangan

**Detail Barang (Sistem FEFO):**
| No | Kode | Nama Barang | Batch | Expired | Stok | Qty Kirim | Satuan |
|----|------|-------------|-------|---------|------|-----------|--------|
| 1 | [select] | [auto] | [FEFO] | [auto] | [auto] | [input] | [auto] |

### 5.5 Form Stock Opname

**Header:**
- Nomor Opname* (auto-generate)
- Tanggal*
- Gudang*
- Jenis Opname* (Penuh/Parsial/Sampling)
- Filter Kategori (untuk parsial)
- Catatan

**Detail Hitung:**
| No | Kode | Nama Barang | Batch | Expired | Lokasi | Stok Sistem | Stok Fisik* | Selisih | Ket |
|----|------|-------------|-------|---------|--------|-------------|-------------|---------|-----|
| 1 | XXX | Obat A | ABC1 | 2025-06 | A-1-2 | 100 | [input] | [auto] | [input] |

**Fitur:**
- Scan barcode untuk input cepat
- Filter by lokasi
- Export/Import template

### 5.6 Form Retur ke Supplier

**Header:**
- Nomor Retur* (auto-generate)
- Tanggal*
- Supplier*
- Gudang*
- Referensi Penerimaan
- Alasan Retur* (dropdown)
- Keterangan

**Detail Barang:**
| No | Kode | Nama Barang | Batch | Expired | Qty Retur | Satuan | Harga | Subtotal |
|----|------|-------------|-------|---------|-----------|--------|-------|----------|
| 1 | [select] | [auto] | [select] | [auto] | [input] | [auto] | [auto] | [auto] |

### 5.7 Form Kartu Stok

**Filter:**
- Gudang
- Barang (search)
- Periode

**Tampilan:**
- Informasi Barang
- Stok Awal Periode
- Tabel Mutasi:
  | Tanggal | Dokumen | Jenis | Masuk | Keluar | Saldo | Batch | Expired |
  |---------|---------|-------|-------|--------|-------|-------|---------|
- Stok Akhir per Batch

---

## 6. Fitur Pendukung

### 6.1 Dashboard Logistik

**Widget:**
- Total Nilai Stok
- Barang di Bawah Stok Minimal
- Barang Mendekati Expired (< 3 bulan)
- Barang Expired
- PO Pending Approval
- Penerimaan Hari Ini

**Chart:**
- Trend Pengadaan
- Top 10 Fast Moving
- Top 10 Slow Moving
- Nilai Stok per Kategori

### 6.2 Alert System

**Jenis Alert:**
- Stok di bawah reorder point
- Barang expired < 3 bulan
- Barang expired
- PO belum diterima > lead time
- Faktur jatuh tempo

### 6.3 FEFO/FIFO Automation

**Logika:**
- Pengeluaran stok otomatis ambil batch dengan expired terdekat (FEFO)
- Jika expired sama, ambil yang masuk lebih dulu (FIFO)
- Warning jika memilih batch selain FEFO

### 6.4 Supplier Management

**Fitur:**
- Rating supplier (delivery time, quality, price)
- Riwayat transaksi
- Kontrak dan harga khusus
- Reminder expired izin PBF

### 6.5 Laporan Analitik

**Inventory:**
- ABC Analysis (value-based)
- XYZ Analysis (movement-based)
- Dead Stock Report
- Aging Report

**Procurement:**
- Lead Time Analysis
- Supplier Performance
- Purchase History

---

## 7. Integrasi dengan Modul Lain

| Modul Sumber | Data yang Diterima | Penggunaan |
|--------------|--------------------|--------------------|
| Farmasi | Pengurangan stok, permintaan | Update stok, trigger reorder |
| Laboratorium | Penggunaan reagen | Update stok |
| Radiologi | Penggunaan kontras | Update stok |
| Gizi | Permintaan bahan makanan | Distribusi |
| Keuangan | Pembayaran supplier | Update status hutang |

| Modul Tujuan | Data yang Dikirim | Trigger |
|--------------|-------------------|---------|
| Farmasi | Distribusi obat | Setelah diterima |
| Keuangan | Hutang supplier | Setelah penerimaan |
| Billing | Harga barang | Real-time |

---

## 8. Aturan Bisnis (Business Rules)

1. **FEFO** (First Expired First Out) wajib untuk semua pengeluaran
2. Barang dengan **expired < 3 bulan** tidak boleh didistribusi ke rawat jalan
3. Barang **expired** tidak boleh didistribusi, harus dimusnahkan
4. **PO CITO** harus diapprove dalam 1 jam
5. Penerimaan barang dengan **expired < 6 bulan** memerlukan approval khusus
6. **Stock opname** minimal dilakukan 1x per bulan untuk fast moving
7. **Selisih stock opname** > 5% memerlukan investigasi
8. Permintaan internal yang diapprove harus dipenuhi dalam **24 jam**
9. Supplier dengan **izin expired** tidak boleh melakukan transaksi
10. **Retur** harus dilakukan maksimal 7 hari setelah penerimaan

---

## 9. Kebutuhan Teknis

### 9.1 Barcode Integration

| Item | Penggunaan |
|------|------------|
| Barcode Barang | Identifikasi cepat, stock opname |
| Barcode Lokasi | Tracking penyimpanan |
| Barcode Batch | FEFO tracking |

### 9.2 Permission/Role

| Role | Akses |
|------|-------|
| Staff Gudang | Penerimaan, distribusi, stock opname |
| Admin Gudang | Semua + master barang |
| Purchasing | PO, penerimaan |
| Supervisor | Approval, adjustment |
| Manager Logistik | Semua + laporan + analitik |

### 9.3 Laporan

**Laporan Harian:**
- Penerimaan barang
- Distribusi
- Stok menipis
- Expired alert

**Laporan Bulanan:**
- Mutasi stok
- Stock opname
- Nilai persediaan
- Pengadaan per supplier

**Laporan Khusus:**
- ABC-XYZ Analysis
- Dead stock
- Aging report
- Supplier performance

---

## 10. Notifikasi

| Event | Penerima | Channel |
|-------|----------|---------|
| PO butuh approval | Supervisor | Push |
| Stok di bawah minimal | Purchasing | Push + Email |
| Barang expired < 1 bulan | Admin Gudang | Alert |
| Permintaan internal masuk | Staff Gudang | Push |
| Faktur jatuh tempo | Finance | Email |
| Selisih stock opname | Manager | Push |
