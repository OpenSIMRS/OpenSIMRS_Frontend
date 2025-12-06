Aplikasi SIMRS ini dibangun berdasarkan dua jalur pelayanan utama (Rawat Jalan & IGD) dan didukung oleh Master Data serta integrasi billing yang kuat.

### I. Alur Pelayanan Utama (Jalur Pasien)

| Jalur              | Alur Langkah Kunci                                                                                                                                                                                                          | Detail Krusial                                                     |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| **1. Rawat Jalan** | Pendaftaran $\rightarrow$ Poli (EMR) $\rightarrow$ _Order Penunjang/Resep_ $\rightarrow$ Lab/Radiologi/Apotek $\rightarrow$ Kasir $\rightarrow$ Pulang/Rawat Inap.                                                          | EMR harus mencatat **S-O-A-P** dan **ICD-10/ICD-9 CM**.            |
| **2. IGD**         | Triage (Merah/Kuning/Hijau) $\rightarrow$ Penanganan Kritis (Dahulu) $\rightarrow$ Pendaftaran Administrasi $\rightarrow$ _Order Tindakan/Obat_ $\rightarrow$ Apotek/Penunjang $\rightarrow$ Keputusan Akhir (Pulang/Inap). | Pasien **Merah** harus ditangani sebelum pendaftaran administrasi. |

---

### II. Modul Inti & Pendukung (Core Features)

| Kategori      | Modul                  | Fungsi & Integrasi Kunci                                                                                                    |
| :------------ | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **Pelayanan** | **Pendaftaran/Admisi** | Mengelola data Master Pasien (RM) dan kunjungan (SPRJ/IGD/RI).                                                              |
|               | **EMR (Poli/IGD/RI)**  | Pencatatan klinis (S-O-A-P), Alergi, Riwayat Penyakit. Wajib input kode **ICD-10** (Diagnosis) dan **ICD-9 CM** (Prosedur). |
|               | **Laboratorium (LIS)** | Menerima _order_, pemrosesan sampel, **Validasi Hasil**, dan mengirim hasil ke EMR.                                         |
|               | **Radiologi (RIS)**    | Menerima _order_, penyimpanan gambar (**PACS**), pembuatan _Expertise_, dan kirim hasil ke EMR.                             |
|               | **Farmasi/Apotek**     | Menerima **e-Resep**, verifikasi stok, dan otomatis mengurangi stok (**FEFO/FIFO**).                                        |
|               | **Gizi/Dietary**       | Menerima _Order Diet_ dari dokter, membuat daftar produksi makanan harian.                                                  |
| **Logistik**  | **Gudang/Logistik**    | Pengadaan (_Supplier_), Penerimaan barang, dan Distribusi stok. Pengurangan stok barang harus FEFO/FIFO.                    |
| **Keuangan**  | **Billing/Kasir**      | Mengumpulkan semua biaya layanan, menghitung total tagihan, dan memproses pembayaran pasien **Umum**.                       |
|               | **Jasa Pelayanan**     | Menghitung pembagian **Jasa Pelayanan (JP)** per staf berdasarkan persentase yang diatur.                                   |

### III. Data Master Wajib

| Kategori           | Data Master Penting                                                                             | Keterangan & Kompleksitas                                                         |
| :----------------- | :---------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Klinis Wajib**   | **ICD-10** (Diagnosis), **ICD-9 CM** (Prosedur)                                                 | Kunci EMR dan wajib untuk laporan/klaim.                                          |
| **Tarif & Barang** | **Master Tindakan/Tarif**                                                                       | Harga bervariasi berdasarkan Tindakan x Kelas Kamar x Penjamin.                   |
|                    | **Master Obat/Alkes/BHP**                                                                       | Detail barang, Satuan, Harga Beli, Harga Jual.                                    |
| **SDM & Unit**     | **Master Pegawai** (NIP, Jabatan)                                                               | **Sumber data** untuk pembuatan User SIMRS dan penentuan **Pelaksana Tindakan**.  |
|                    | **Master Ruangan** & **Master Kamar**                                                           | Ruangan untuk Unit pelayanan (Lab, Poli) dan Kamar untuk Rawat Inap (Kelas/Unit). |
| **Lain-lain**      | **Master Penjamin**, **Master Supplier**, **Master Demografi Pasien** (Agama, Pekerjaan, dll.). |

### IV. Fitur Kontrol & Tambahan

| Fitur                       | Tujuan                                                                                                              |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Dashboard & Laporan**     | Menyajikan data kinerja (BOR, ALOS, Top 10 Penyakit, Pendapatan) untuk manajemen.                                   |
| **Audit Trail**             | Mencatat log setiap perubahan data (Siapa, Kapan) untuk akuntabilitas dan keamanan data EMR/Stok.                   |
| **Pencatatan Tim Terlibat** | Di setiap modul (Lab, OK, Poli), mencatat dokter/perawat/analis yang terlibat untuk perhitungan **Jasa Pelayanan**. |
| **Edukasi Pasien**          | Fitur di EMR untuk mencatat materi edukasi yang disampaikan dan verifikasi pemahaman pasien.                        |
| **Fitur Retur/Pembatalan**  | Alur resmi untuk mengembalikan barang atau membatalkan tindakan yang sudah dibilling.                               |

---
