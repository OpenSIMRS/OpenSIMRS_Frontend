# Modul Billing/Kasir

## 1. Deskripsi Umum

Modul Billing/Kasir adalah sistem informasi yang mengelola seluruh proses penagihan dan pembayaran rumah sakit. Modul ini mengumpulkan semua biaya layanan dari berbagai unit pelayanan, menghitung total tagihan, dan memproses pembayaran. Modul ini mencakup:

- Pengumpulan tagihan dari semua unit pelayanan
- Kalkulasi biaya berdasarkan tarif dan penjamin
- Pembuatan invoice dan kwitansi
- Proses pembayaran multi-metode
- Pengelolaan deposit dan uang muka
- Closing billing dan rekonsiliasi
- Pelaporan pendapatan

---

## 2. Sumber Tagihan

| Unit Asal         | Jenis Tagihan                    |
| ----------------- | -------------------------------- |
| **Pendaftaran**   | Biaya administrasi               |
| **Poliklinik**    | Konsultasi dokter, tindakan poli |
| **IGD**           | Konsultasi, tindakan darurat     |
| **Rawat Inap**    | Kamar, konsultasi, tindakan      |
| **Laboratorium**  | Pemeriksaan lab                  |
| **Radiologi**     | Pemeriksaan radiologi            |
| **Farmasi**       | Obat dan alkes                   |
| **Gizi**          | Biaya makan                      |
| **Kamar Operasi** | Tindakan operasi, anestesi       |
| **ICU/ICCU**      | Perawatan intensif               |
| **Fisioterapi**   | Rehabilitasi medik               |

---

## 3. Alur Kerja (Workflow)

### 3.1 Alur Billing Rawat Jalan

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Pasien Selesai  │────▶│ Verifikasi       │────▶│ Cetak Invoice   │
│ Pelayanan       │     │ Tagihan          │     │                 │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
                                            ┌─────────────────────────┐
                                            │ Pembayaran & Cetak      │
                                            │ Kwitansi                │
                                            └─────────────────────────┘
```

### 3.2 Alur Billing Rawat Inap

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Deposit Awal    │────▶│ Tagihan Harian   │────▶│ Billing Interim │
│                 │     │ (Running Bill)   │     │ (Opsional)      │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Pembayaran &    │◀────│ Final Billing    │◀────│ Pasien Pulang   │
│ Kwitansi        │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 3.3 Alur Klaim Penjamin (BPJS/Asuransi)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Pelayanan       │────▶│ Verifikasi       │────▶│ Grouping &      │
│ Selesai         │     │ Kelengkapan      │     │ Costing (INA-CBG)│
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Monitoring      │◀────│ Submit Klaim     │◀────│ Generate        │
│ Status Klaim    │     │                  │     │ File Klaim      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 4. Skema Data

### 4.1 Billing (billing)

| Field           | Tipe Data     | Wajib | Keterangan                         |
| --------------- | ------------- | ----- | ---------------------------------- |
| id              | UUID          | Ya    | Primary Key                        |
| no_billing      | VARCHAR(20)   | Ya    | Nomor billing                      |
| kunjungan_id    | UUID          | Ya    | FK ke kunjungan                    |
| rawat_inap_id   | UUID          | Tidak | FK ke rawat_inap                   |
| pasien_id       | UUID          | Ya    | FK ke master_pasien                |
| penjamin_id     | UUID          | Ya    | FK ke penjamin                     |
| jenis_billing   | ENUM          | Ya    | 'RAWAT_JALAN','RAWAT_INAP','IGD'   |
| tanggal_billing | DATE          | Ya    | Tanggal billing dibuat             |
| total_tagihan   | DECIMAL(15,2) | Ya    | Total tagihan kotor                |
| total_diskon    | DECIMAL(15,2) | Tidak | Total diskon                       |
| total_penjamin  | DECIMAL(15,2) | Tidak | Ditanggung penjamin                |
| total_pasien    | DECIMAL(15,2) | Ya    | Beban pasien                       |
| total_deposit   | DECIMAL(15,2) | Tidak | Total deposit yang digunakan       |
| total_bayar     | DECIMAL(15,2) | Ya    | Total yang sudah dibayar           |
| sisa_tagihan    | DECIMAL(15,2) | Ya    | Sisa tagihan                       |
| status          | ENUM          | Ya    | 'OPEN','CLOSED','PENDING','CANCEL' |
| closed_at       | DATETIME      | Tidak | Waktu closing                      |
| closed_by       | UUID          | Tidak | FK ke user                         |
| created_at      | TIMESTAMP     | Ya    | Waktu pembuatan                    |
| updated_at      | TIMESTAMP     | Ya    | Waktu update terakhir              |
| created_by      | UUID          | Ya    | FK ke user                         |

### 4.2 Detail Billing (billing_detail)

| Field          | Tipe Data     | Wajib | Keterangan                                                                           |
| -------------- | ------------- | ----- | ------------------------------------------------------------------------------------ |
| id             | UUID          | Ya    | Primary Key                                                                          |
| billing_id     | UUID          | Ya    | FK ke billing                                                                        |
| tanggal        | DATE          | Ya    | Tanggal transaksi                                                                    |
| unit_id        | UUID          | Ya    | FK ke unit                                                                           |
| kategori       | ENUM          | Ya    | 'REGISTRASI','KONSULTASI','TINDAKAN','LAB','RADIOLOGI','OBAT','KAMAR','MAKAN','LAIN' |
| referensi_tipe | VARCHAR(50)   | Ya    | Tipe referensi (resep, order_lab, dll)                                               |
| referensi_id   | UUID          | Ya    | ID referensi                                                                         |
| item_id        | UUID          | Ya    | FK ke master item (tindakan/obat/dll)                                                |
| nama_item      | VARCHAR(150)  | Ya    | Nama item                                                                            |
| tarif_id       | UUID          | Ya    | FK ke tarif                                                                          |
| harga_satuan   | DECIMAL(15,2) | Ya    | Harga per unit                                                                       |
| jumlah         | INT           | Ya    | Jumlah/quantity                                                                      |
| subtotal       | DECIMAL(15,2) | Ya    | Subtotal                                                                             |
| diskon_persen  | DECIMAL(5,2)  | Tidak | Persentase diskon                                                                    |
| diskon_nominal | DECIMAL(15,2) | Tidak | Nominal diskon                                                                       |
| total          | DECIMAL(15,2) | Ya    | Total setelah diskon                                                                 |
| kelas_id       | UUID          | Tidak | FK ke kelas (untuk rawat inap)                                                       |
| dokter_id      | UUID          | Tidak | FK ke pegawai (dokter pelaksana)                                                     |
| pelaksana      | JSON          | Tidak | Daftar pelaksana untuk JP                                                            |
| status         | ENUM          | Ya    | 'PENDING','BILLED','CANCEL','RETUR'                                                  |
| created_at     | TIMESTAMP     | Ya    | Waktu pembuatan                                                                      |
| updated_at     | TIMESTAMP     | Ya    | Waktu update terakhir                                                                |

### 4.3 Pembayaran (pembayaran)

| Field           | Tipe Data     | Wajib | Keterangan                                                       |
| --------------- | ------------- | ----- | ---------------------------------------------------------------- |
| id              | UUID          | Ya    | Primary Key                                                      |
| no_kwitansi     | VARCHAR(20)   | Ya    | Nomor kwitansi                                                   |
| billing_id      | UUID          | Ya    | FK ke billing                                                    |
| tanggal_bayar   | DATETIME      | Ya    | Tanggal dan waktu bayar                                          |
| jumlah_bayar    | DECIMAL(15,2) | Ya    | Jumlah pembayaran                                                |
| metode_bayar    | ENUM          | Ya    | 'TUNAI','KARTU_DEBIT','KARTU_KREDIT','TRANSFER','QRIS','DEPOSIT' |
| referensi_bayar | VARCHAR(50)   | Tidak | No. kartu/referensi bank                                         |
| nama_bank       | VARCHAR(50)   | Tidak | Nama bank (jika non-tunai)                                       |
| keterangan      | TEXT          | Tidak | Keterangan                                                       |
| kasir_id        | UUID          | Ya    | FK ke user                                                       |
| shift_id        | UUID          | Ya    | FK ke shift                                                      |
| status          | ENUM          | Ya    | 'SUCCESS','PENDING','VOID'                                       |
| void_by         | UUID          | Tidak | FK ke user                                                       |
| void_at         | DATETIME      | Tidak | Waktu void                                                       |
| void_reason     | TEXT          | Tidak | Alasan void                                                      |
| created_at      | TIMESTAMP     | Ya    | Waktu pembuatan                                                  |

### 4.4 Deposit (deposit)

| Field           | Tipe Data     | Wajib | Keterangan                                      |
| --------------- | ------------- | ----- | ----------------------------------------------- |
| id              | UUID          | Ya    | Primary Key                                     |
| no_deposit      | VARCHAR(20)   | Ya    | Nomor deposit                                   |
| pasien_id       | UUID          | Ya    | FK ke master_pasien                             |
| kunjungan_id    | UUID          | Tidak | FK ke kunjungan                                 |
| rawat_inap_id   | UUID          | Tidak | FK ke rawat_inap                                |
| tanggal         | DATETIME      | Ya    | Tanggal deposit                                 |
| jumlah          | DECIMAL(15,2) | Ya    | Jumlah deposit                                  |
| metode_bayar    | ENUM          | Ya    | 'TUNAI','KARTU_DEBIT','KARTU_KREDIT','TRANSFER' |
| referensi_bayar | VARCHAR(50)   | Tidak | Referensi pembayaran                            |
| keterangan      | TEXT          | Tidak | Keterangan                                      |
| kasir_id        | UUID          | Ya    | FK ke user                                      |
| status          | ENUM          | Ya    | 'AKTIF','TERPAKAI','REFUND'                     |
| created_at      | TIMESTAMP     | Ya    | Waktu pembuatan                                 |

### 4.5 Penggunaan Deposit (deposit_usage)

| Field         | Tipe Data     | Wajib | Keterangan            |
| ------------- | ------------- | ----- | --------------------- |
| id            | UUID          | Ya    | Primary Key           |
| deposit_id    | UUID          | Ya    | FK ke deposit         |
| billing_id    | UUID          | Ya    | FK ke billing         |
| pembayaran_id | UUID          | Ya    | FK ke pembayaran      |
| jumlah        | DECIMAL(15,2) | Ya    | Jumlah yang digunakan |
| created_at    | TIMESTAMP     | Ya    | Waktu pembuatan       |

### 4.6 Master Tarif (tarif)

| Field            | Tipe Data     | Wajib | Keterangan                                                                           |
| ---------------- | ------------- | ----- | ------------------------------------------------------------------------------------ |
| id               | UUID          | Ya    | Primary Key                                                                          |
| kode             | VARCHAR(20)   | Ya    | Kode tarif                                                                           |
| nama             | VARCHAR(150)  | Ya    | Nama item tarif                                                                      |
| kategori         | ENUM          | Ya    | 'REGISTRASI','KONSULTASI','TINDAKAN','LAB','RADIOLOGI','OBAT','KAMAR','MAKAN','LAIN' |
| item_id          | UUID          | Tidak | FK ke master item terkait                                                            |
| kelas_id         | UUID          | Tidak | FK ke kelas                                                                          |
| penjamin_id      | UUID          | Tidak | FK ke penjamin                                                                       |
| tarif            | DECIMAL(15,2) | Ya    | Nilai tarif                                                                          |
| komponen_jasa    | DECIMAL(15,2) | Tidak | Komponen jasa medis                                                                  |
| komponen_sarana  | DECIMAL(15,2) | Tidak | Komponen sarana                                                                      |
| komponen_bhp     | DECIMAL(15,2) | Tidak | Komponen bahan habis pakai                                                           |
| tanggal_berlaku  | DATE          | Ya    | Tanggal mulai berlaku                                                                |
| tanggal_berakhir | DATE          | Tidak | Tanggal berakhir                                                                     |
| is_active        | BOOLEAN       | Ya    | Status aktif                                                                         |
| created_at       | TIMESTAMP     | Ya    | Waktu pembuatan                                                                      |
| updated_at       | TIMESTAMP     | Ya    | Waktu update terakhir                                                                |

### 4.7 Penjamin (penjamin)

| Field                 | Tipe Data     | Wajib | Keterangan                                        |
| --------------------- | ------------- | ----- | ------------------------------------------------- |
| id                    | UUID          | Ya    | Primary Key                                       |
| kode                  | VARCHAR(20)   | Ya    | Kode penjamin                                     |
| nama                  | VARCHAR(100)  | Ya    | Nama penjamin                                     |
| jenis                 | ENUM          | Ya    | 'UMUM','BPJS','ASURANSI','PERUSAHAAN','KEDINASAN' |
| alamat                | TEXT          | Tidak | Alamat                                            |
| telepon               | VARCHAR(20)   | Tidak | Telepon                                           |
| email                 | VARCHAR(100)  | Tidak | Email                                             |
| nama_kontak           | VARCHAR(100)  | Tidak | Contact person                                    |
| termin_bayar          | INT           | Tidak | Termin pembayaran (hari)                          |
| persentase_tanggungan | DECIMAL(5,2)  | Tidak | Persentase ditanggung                             |
| plafon                | DECIMAL(15,2) | Tidak | Batas maksimal                                    |
| no_kontrak            | VARCHAR(50)   | Tidak | Nomor kontrak                                     |
| tanggal_kontrak       | DATE          | Tidak | Tanggal kontrak                                   |
| tanggal_expired       | DATE          | Tidak | Tanggal expired kontrak                           |
| is_active             | BOOLEAN       | Ya    | Status aktif                                      |
| created_at            | TIMESTAMP     | Ya    | Waktu pembuatan                                   |
| updated_at            | TIMESTAMP     | Ya    | Waktu update terakhir                             |

### 4.8 Shift Kasir (shift)

| Field           | Tipe Data     | Wajib | Keterangan                 |
| --------------- | ------------- | ----- | -------------------------- |
| id              | UUID          | Ya    | Primary Key                |
| kasir_id        | UUID          | Ya    | FK ke user                 |
| loket_id        | UUID          | Ya    | FK ke loket                |
| tanggal         | DATE          | Ya    | Tanggal shift              |
| waktu_mulai     | DATETIME      | Ya    | Waktu mulai shift          |
| waktu_selesai   | DATETIME      | Tidak | Waktu selesai shift        |
| modal_awal      | DECIMAL(15,2) | Ya    | Modal awal kas             |
| total_tunai     | DECIMAL(15,2) | Tidak | Total penerimaan tunai     |
| total_non_tunai | DECIMAL(15,2) | Tidak | Total penerimaan non-tunai |
| serah_terima    | DECIMAL(15,2) | Tidak | Uang yang diserahkan       |
| selisih         | DECIMAL(15,2) | Tidak | Selisih kas                |
| status          | ENUM          | Ya    | 'OPEN','CLOSED'            |
| catatan         | TEXT          | Tidak | Catatan                    |
| created_at      | TIMESTAMP     | Ya    | Waktu pembuatan            |

---

## 5. Form-Form yang Dibutuhkan

### 5.1 Form Billing Rawat Jalan

**Header:**

- Nama Pasien / No. RM
- Tanggal Kunjungan
- Poli / Dokter
- Penjamin

**Detail Tagihan (Auto dari unit):**
| No | Tanggal | Unit | Keterangan | Qty | Harga | Diskon | Total |
|----|---------|------|------------|-----|-------|--------|-------|
| 1 | 01/01/2025 | Poli Umum | Konsultasi dr. A | 1 | 150,000 | - | 150,000 |
| 2 | 01/01/2025 | Laboratorium | Darah Lengkap | 1 | 100,000 | - | 100,000 |
| 3 | 01/01/2025 | Farmasi | Amoxicillin 500mg | 15 | 3,000 | - | 45,000 |

**Summary:**
| Label | Nilai |
|-------|-------|
| Subtotal | Rp 295,000 |
| Diskon | Rp 0 |
| **Total Tagihan** | **Rp 295,000** |
| Ditanggung Penjamin | Rp 0 |
| **Beban Pasien** | **Rp 295,000** |

**Aksi:**

- Tambah Item Manual
- Hapus Item
- Berikan Diskon
- Proses Pembayaran
- Cetak Invoice

### 5.2 Form Billing Rawat Inap

**Header:**

- Nama Pasien / No. RM
- Ruangan / Kelas
- Tanggal Masuk / Tanggal Keluar
- Diagnosa
- DPJP
- Penjamin

**Tab: Detail per Hari**

- Pilih tanggal untuk melihat rincian

**Detail Tagihan:**
| Kategori | Jumlah Item | Total |
|----------|-------------|-------|
| Kamar | 5 hari | Rp 2,500,000 |
| Konsultasi | 5 kali | Rp 500,000 |
| Tindakan | 3 item | Rp 1,200,000 |
| Laboratorium | 2 pemeriksaan | Rp 350,000 |
| Radiologi | 1 pemeriksaan | Rp 500,000 |
| Obat-obatan | 25 item | Rp 1,800,000 |
| Makanan | 5 hari | Rp 250,000 |
| **Total** | | **Rp 7,100,000** |

**Deposit:**
| Tanggal | No. Deposit | Jumlah |
|---------|-------------|--------|
| 01/01/2025 | DEP-001 | Rp 3,000,000 |
| 03/01/2025 | DEP-002 | Rp 2,000,000 |
| **Total Deposit** | | **Rp 5,000,000** |

**Summary:**
| Label | Nilai |
|-------|-------|
| Total Tagihan | Rp 7,100,000 |
| Diskon | Rp 100,000 |
| **Netto** | **Rp 7,000,000** |
| Ditanggung Penjamin | Rp 0 |
| Total Deposit | (Rp 5,000,000) |
| **Sisa Bayar** | **Rp 2,000,000** |

### 5.3 Form Pembayaran

**Informasi Billing (read-only):**

- No. Billing
- Nama Pasien
- Total Tagihan
- Deposit Terpakai
- Sisa yang Harus Dibayar

**Input Pembayaran:**

- Metode Pembayaran\* (radio/tabs):
  - [ ] Tunai
  - [ ] Kartu Debit
  - [ ] Kartu Kredit
  - [ ] Transfer Bank
  - [ ] QRIS
  - [ ] Deposit

**Jika Tunai:**

- Jumlah Bayar\* (input)
- Kembalian (auto-calculate)

**Jika Kartu/Transfer:**

- Bank\* (dropdown)
- No. Referensi\* (input)
- Approval Code (untuk kartu)

**Split Payment:**

- [ ] Gunakan Split Payment
- Metode 1: [dropdown] Jumlah: [input]
- Metode 2: [dropdown] Jumlah: [input]

**Aksi:**

- Proses Pembayaran
- Cetak Kwitansi

### 5.4 Form Deposit

**Informasi Pasien:**

- Cari Pasien (search)
- Nama / No. RM
- Kunjungan/Rawat Inap (jika ada)

**Input Deposit:**

- Tanggal\* (default: hari ini)
- Jumlah Deposit\*
- Metode Pembayaran\*
- No. Referensi (jika non-tunai)
- Keterangan

**Aksi:**

- Simpan & Cetak Bukti Deposit

### 5.5 Form Closing Shift

**Informasi Shift:**

- Tanggal
- Loket
- Nama Kasir
- Waktu Mulai
- Modal Awal

**Rekap Transaksi:**
| Metode | Jumlah Transaksi | Total |
|--------|------------------|-------|
| Tunai | 25 | Rp 15,000,000 |
| Kartu Debit | 10 | Rp 8,500,000 |
| Kartu Kredit | 5 | Rp 5,200,000 |
| Transfer | 3 | Rp 12,000,000 |
| QRIS | 8 | Rp 2,300,000 |
| **Total** | **51** | **Rp 43,000,000** |

**Serah Terima Kas:**

- Total Tunai yang Harus Diserahkan: Rp 15,000,000
- Modal Awal: Rp 500,000
- Seharusnya: Rp 15,500,000
- Aktual Diserahkan\*: [input]
- Selisih: [auto-calculate]
- Keterangan Selisih (jika ada)

**Aksi:**

- Tutup Shift
- Cetak Laporan Shift

### 5.6 Form Void/Pembatalan Pembayaran

**Cari Kwitansi:**

- No. Kwitansi\* (input)
- Atau cari by Pasien/Tanggal

**Informasi Pembayaran (read-only):**

- No. Kwitansi
- Tanggal Bayar
- Nama Pasien
- Jumlah
- Metode Bayar
- Kasir

**Alasan Void:**

- Alasan\* (dropdown + textarea)

**Approval:**

- Supervisor Approval Required

### 5.7 Form Diskon

**Jenis Diskon:**

- Diskon per Item
- Diskon Total Billing

**Input Diskon:**

- Jenis\* (Persentase/Nominal)
- Nilai\*
- Alasan\* (dropdown)
- Keterangan
- Approval (jika melebihi threshold)

---

## 6. Fitur Pendukung

### 6.1 Dashboard Kasir

**Widget:**

- Pendapatan Hari Ini
- Jumlah Transaksi
- Billing Pending
- Pasien Rawat Inap Aktif

**Quick Access:**

- Billing baru
- Cari billing
- Terima deposit

### 6.2 Running Bill Monitoring

**Untuk Rawat Inap:**

- Daftar pasien rawat inap aktif
- Total tagihan berjalan
- Status deposit
- Alert jika tagihan > deposit

### 6.3 Estimasi Biaya

**Fitur:**

- Estimasi biaya rawat inap
- Berdasarkan diagnosa dan kelas
- Untuk informasi ke pasien/keluarga

### 6.4 Multi-Currency (Opsional)

**Jika dibutuhkan:**

- Input pembayaran valas
- Kurs harian
- Konversi otomatis

### 6.5 Cetak Dokumen

**Jenis Dokumen:**

- Invoice/Tagihan
- Kwitansi Pembayaran
- Bukti Deposit
- Rincian Biaya (untuk asuransi)
- Laporan Shift

---

## 7. Integrasi dengan Modul Lain

| Modul Sumber | Data yang Diterima    | Penggunaan            |
| ------------ | --------------------- | --------------------- |
| Semua Unit   | Transaksi pelayanan   | Generate billing      |
| Pendaftaran  | Data pasien, penjamin | Identifikasi          |
| Rawat Inap   | Status pasien         | Trigger final billing |
| Gudang       | Harga barang          | Kalkulasi tarif       |

| Modul Tujuan   | Data yang Dikirim | Trigger                |
| -------------- | ----------------- | ---------------------- |
| Keuangan       | Pendapatan harian | Setelah closing        |
| Jasa Pelayanan | Detail pelaksana  | Setelah billing closed |
| Rekam Medis    | Status pembayaran | Real-time              |

---

## 8. Aturan Bisnis (Business Rules)

1. Pasien rawat jalan **wajib** menyelesaikan pembayaran sebelum pulang
2. **Deposit** rawat inap minimal sesuai estimasi 3 hari pertama
3. **Warning** jika tagihan berjalan > 80% deposit
4. Pasien tidak boleh pulang jika ada **tunggakan** (kecuali BPJS)
5. **Void** pembayaran memerlukan approval supervisor
6. **Diskon** > 10% memerlukan approval manager
7. **Closing shift** wajib dilakukan setiap pergantian shift
8. **Selisih kas** > Rp 50,000 harus dilaporkan
9. **Invoice** rawat inap dicetak saat pasien pulang
10. Pembayaran **non-tunai** harus ada bukti transaksi

---

## 9. Kebutuhan Teknis

### 9.1 Hardware Integration

| Perangkat       | Fungsi           |
| --------------- | ---------------- |
| EDC             | Pembayaran kartu |
| Cash Drawer     | Laci kas         |
| Receipt Printer | Cetak kwitansi   |
| Barcode Scanner | Scan billing     |

### 9.2 Payment Gateway (Opsional)

- Virtual Account
- QRIS
- E-Wallet

### 9.3 Permission/Role

| Role             | Akses                           |
| ---------------- | ------------------------------- |
| Kasir            | Billing, pembayaran, deposit    |
| Supervisor Kasir | Void, diskon, approval, closing |
| Admin Billing    | Semua + master tarif + laporan  |
| Finance          | View + laporan + rekonsiliasi   |

### 9.4 Laporan

**Laporan Harian:**

- Pendapatan per kasir
- Pendapatan per metode bayar
- Pendapatan per unit
- Void/pembatalan

**Laporan Bulanan:**

- Pendapatan total
- Pendapatan per penjamin
- Piutang pasien
- Aging piutang

**Laporan Khusus:**

- Top spender
- Analisis pendapatan
- Trend pembayaran

---

## 10. Notifikasi

| Event                    | Penerima         | Channel      |
| ------------------------ | ---------------- | ------------ |
| Tagihan melebihi deposit | Kasir + Keluarga | Alert + SMS  |
| Pasien mau pulang        | Kasir            | Push         |
| Void request             | Supervisor       | Push         |
| Selisih kas              | Manager          | Email        |
| Piutang jatuh tempo      | Finance          | Daily report |
