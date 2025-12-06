# Dokumentasi Fitur SIMRS

Folder ini berisi dokumentasi detail untuk setiap modul/fitur dalam aplikasi SIMRS (Sistem Informasi Manajemen Rumah Sakit) berdasarkan [CORE_FEATURE.md](../CORE_FEATURE.md).

## Daftar Modul

### Pelayanan (Service Modules)

| No | Dokumen | Deskripsi |
|----|---------|-----------|
| 01 | [Pendaftaran & Admisi](./01-pendaftaran-admisi.md) | Mengelola data Master Pasien (RM) dan kunjungan (Rawat Jalan/IGD/Rawat Inap) |
| 02 | [EMR (Electronic Medical Record)](./02-emr.md) | Pencatatan klinis (S-O-A-P), Alergi, Riwayat Penyakit dengan kode ICD-10 dan ICD-9 CM |
| 03 | [Laboratorium (LIS)](./03-laboratorium.md) | Menerima order, pemrosesan sampel, validasi hasil, dan kirim hasil ke EMR |
| 04 | [Radiologi (RIS)](./04-radiologi.md) | Menerima order, penyimpanan gambar (PACS), pembuatan expertise, dan kirim hasil ke EMR |
| 05 | [Farmasi/Apotek](./05-farmasi-apotek.md) | Menerima e-Resep, verifikasi stok, dan pengurangan stok otomatis (FEFO/FIFO) |
| 06 | [Gizi/Dietary](./06-gizi-dietary.md) | Menerima order diet dari dokter, membuat daftar produksi makanan harian |

### Logistik (Logistics Modules)

| No | Dokumen | Deskripsi |
|----|---------|-----------|
| 07 | [Gudang/Logistik](./07-gudang-logistik.md) | Pengadaan (Supplier), penerimaan barang, dan distribusi stok dengan sistem FEFO/FIFO |

### Keuangan (Finance Modules)

| No | Dokumen | Deskripsi |
|----|---------|-----------|
| 08 | [Billing/Kasir](./08-billing-kasir.md) | Mengumpulkan biaya layanan, menghitung total tagihan, dan memproses pembayaran |
| 09 | [Jasa Pelayanan](./09-jasa-pelayanan.md) | Menghitung pembagian Jasa Pelayanan (JP) per staf berdasarkan persentase yang diatur |

### Master Data

| No | Dokumen | Deskripsi |
|----|---------|-----------|
| 10 | [Master Data](./10-master-data.md) | Pengelolaan ICD-10, ICD-9 CM, Tarif, Obat, Pegawai, Ruangan, Kamar, dll |

### Kontrol & Fitur Tambahan

| No | Dokumen | Deskripsi |
|----|---------|-----------|
| 11 | [Dashboard & Laporan](./11-dashboard-laporan.md) | Menyajikan data kinerja (BOR, ALOS, Top 10 Penyakit, Pendapatan) untuk manajemen |
| 12 | [Audit Trail](./12-audit-trail.md) | Mencatat log setiap perubahan data (Siapa, Kapan) untuk akuntabilitas dan keamanan |
| 13 | [Pencatatan Tim Terlibat](./13-pencatatan-tim.md) | Mencatat dokter/perawat/analis yang terlibat untuk perhitungan Jasa Pelayanan |
| 14 | [Edukasi Pasien](./14-edukasi-pasien.md) | Fitur di EMR untuk mencatat materi edukasi dan verifikasi pemahaman pasien |
| 15 | [Retur & Pembatalan](./15-retur-pembatalan.md) | Alur resmi untuk mengembalikan barang atau membatalkan tindakan yang sudah dibilling |

## Struktur Dokumentasi

Setiap dokumen modul berisi:

1. **Deskripsi Umum** - Penjelasan singkat tentang modul
2. **Alur Kerja (Workflow)** - Diagram alur proses dalam modul
3. **Skema Data** - Struktur tabel database yang dibutuhkan
4. **Form-Form yang Dibutuhkan** - Daftar form dengan field-field yang diperlukan
5. **Fitur Pendukung** - Fitur tambahan seperti dashboard, alert, dll
6. **Integrasi dengan Modul Lain** - Hubungan antar modul
7. **Aturan Bisnis (Business Rules)** - Aturan yang harus dipenuhi
8. **Kebutuhan Teknis** - Permission, validasi, dan kebutuhan teknis lainnya
9. **Notifikasi** - Event yang memicu notifikasi

## Referensi

- [CORE_FEATURE.md](../CORE_FEATURE.md) - Daftar fitur inti dan alur pelayanan utama
- [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) - Struktur proyek dan arsitektur aplikasi
