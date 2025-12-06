# Modul Retur & Pembatalan

## 1. Deskripsi Umum

Modul Retur & Pembatalan adalah sistem untuk mengelola pengembalian barang dan pembatalan transaksi yang sudah di-billing secara resmi dan terkontrol. Modul ini mencakup:

- Retur obat dari pasien
- Pembatalan tindakan yang sudah di-billing
- Pembatalan order yang belum dilaksanakan
- Koreksi billing
- Approval workflow untuk setiap retur/pembatalan

---

## 2. Jenis Retur & Pembatalan

### 2.1 Retur Barang

| Jenis | Deskripsi | Contoh |
|-------|-----------|--------|
| **Retur Obat dari Pasien** | Obat yang tidak terpakai dikembalikan | Pasien pulang, obat tidak habis |
| **Retur ke Supplier** | Barang dikembalikan ke supplier | Barang expired, rusak, salah kirim |
| **Retur Antar Depo** | Pengembalian dari depo ke gudang | Overstock di depo |

### 2.2 Pembatalan Transaksi

| Jenis | Deskripsi | Contoh |
|-------|-----------|--------|
| **Batal Order** | Order yang belum dilaksanakan dibatalkan | Order lab dibatalkan dokter |
| **Batal Tindakan** | Tindakan yang sudah dilakukan dibatalkan (billing) | Salah input tindakan |
| **Batal Resep** | Resep dibatalkan | Dokter ganti terapi |
| **Koreksi Billing** | Penyesuaian tagihan | Kesalahan tarif |

---

## 3. Alur Kerja (Workflow)

### 3.1 Alur Retur Obat dari Pasien

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Pasien/Perawat  │────▶│ Cek Kelayakan    │────▶│ Input Retur     │
│ Ajukan Retur    │     │ Retur            │     │ di Farmasi      │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Update Stok &   │◀────│ Approval         │◀────│ Verifikasi      │
│ Koreksi Billing │     │ Supervisor       │     │ Obat            │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 3.2 Alur Pembatalan Tindakan

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Unit Pelayanan  │────▶│ Ajukan           │────▶│ Review oleh     │
│ Identifikasi    │     │ Pembatalan       │     │ Billing         │
│ Kesalahan       │     │ + Alasan         │     │                 │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Update Billing  │◀────│ Approval         │◀────│ Investigasi     │
│ & Void Transaksi│     │ Supervisor       │     │ (jika perlu)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 3.3 Alur Pembatalan Order

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Dokter/Perawat  │────▶│ Cek Status Order │────▶│ Input           │
│ Minta Batal     │     │ (belum proses?)  │     │ Pembatalan      │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                        ┌─────────────────────────────────┼─────────────────────────────────┐
                        │ Belum Diproses                  │                  Sudah Diproses │
                        ▼                                 │                                 ▼
            ┌───────────────────────┐                     │              ┌───────────────────────────┐
            │ Langsung Batal        │                     │              │ Perlu Approval + Retur    │
            │ (No Charge)           │                     │              │ (Ada Charge)              │
            └───────────────────────┘                     │              └───────────────────────────┘
```

---

## 4. Skema Data

### 4.1 Retur Barang (retur_barang)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| no_retur | VARCHAR(20) | Ya | Nomor retur |
| tanggal_retur | DATETIME | Ya | Tanggal dan waktu retur |
| jenis_retur | ENUM | Ya | 'DARI_PASIEN','KE_SUPPLIER','ANTAR_DEPO' |
| sumber | VARCHAR(100) | Ya | Asal retur (pasien/depo) |
| tujuan | VARCHAR(100) | Ya | Tujuan retur (gudang/supplier) |
| pasien_id | UUID | Tidak | FK ke master_pasien |
| kunjungan_id | UUID | Tidak | FK ke kunjungan |
| resep_id | UUID | Tidak | FK ke resep |
| supplier_id | UUID | Tidak | FK ke supplier |
| depo_asal_id | UUID | Tidak | FK ke depo_farmasi |
| depo_tujuan_id | UUID | Tidak | FK ke gudang |
| alasan | ENUM | Ya | 'TIDAK_TERPAKAI','ALERGI','EXPIRED','RUSAK','SALAH_KIRIM','OVERSTOCK' |
| alasan_detail | TEXT | Tidak | Detail alasan |
| total_nilai | DECIMAL(15,2) | Ya | Total nilai retur |
| status | ENUM | Ya | 'DRAFT','PENDING','APPROVED','REJECTED','COMPLETED' |
| requested_by | UUID | Ya | FK ke user |
| approved_by | UUID | Tidak | FK ke user |
| approved_at | DATETIME | Tidak | Waktu approval |
| rejection_reason | TEXT | Tidak | Alasan jika ditolak |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 4.2 Detail Retur Barang (retur_barang_detail)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| retur_id | UUID | Ya | FK ke retur_barang |
| barang_id | UUID | Ya | FK ke master_obat/barang |
| nama_barang | VARCHAR(100) | Ya | Nama barang (snapshot) |
| batch_number | VARCHAR(50) | Ya | Nomor batch |
| expired_date | DATE | Ya | Tanggal expired |
| jumlah | INT | Ya | Jumlah yang diretur |
| satuan | VARCHAR(20) | Ya | Satuan |
| harga_satuan | DECIMAL(15,2) | Ya | Harga per satuan |
| subtotal | DECIMAL(15,2) | Ya | Subtotal |
| kondisi | ENUM | Ya | 'BAIK','RUSAK','EXPIRED' |
| catatan | TEXT | Tidak | Catatan per item |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.3 Pembatalan Transaksi (pembatalan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| no_pembatalan | VARCHAR(20) | Ya | Nomor pembatalan |
| tanggal | DATETIME | Ya | Tanggal pembatalan |
| jenis | ENUM | Ya | 'ORDER','TINDAKAN','RESEP','BILLING_ITEM' |
| referensi_tipe | VARCHAR(50) | Ya | Tipe referensi |
| referensi_id | UUID | Ya | ID referensi |
| billing_detail_id | UUID | Tidak | FK ke billing_detail |
| pasien_id | UUID | Ya | FK ke master_pasien |
| kunjungan_id | UUID | Ya | FK ke kunjungan |
| unit_id | UUID | Ya | FK ke unit |
| nilai_batal | DECIMAL(15,2) | Tidak | Nilai yang dibatalkan |
| kategori_alasan | ENUM | Ya | 'SALAH_INPUT','GANTI_TERAPI','PASIEN_MENOLAK','KONDISI_BERUBAH','LAINNYA' |
| alasan_detail | TEXT | Ya | Detail alasan pembatalan |
| sudah_dilaksanakan | BOOLEAN | Ya | Apakah sudah dilaksanakan |
| perlu_koreksi_billing | BOOLEAN | Ya | Perlu koreksi billing |
| status | ENUM | Ya | 'DRAFT','PENDING','APPROVED','REJECTED','COMPLETED' |
| requested_by | UUID | Ya | FK ke user |
| approved_by | UUID | Tidak | FK ke user |
| approved_at | DATETIME | Tidak | Waktu approval |
| rejection_reason | TEXT | Tidak | Alasan jika ditolak |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 4.4 Koreksi Billing (koreksi_billing)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| no_koreksi | VARCHAR(20) | Ya | Nomor koreksi |
| tanggal | DATETIME | Ya | Tanggal koreksi |
| billing_id | UUID | Ya | FK ke billing |
| billing_detail_id | UUID | Ya | FK ke billing_detail |
| jenis_koreksi | ENUM | Ya | 'HAPUS','TAMBAH','UBAH_JUMLAH','UBAH_TARIF' |
| nilai_awal | DECIMAL(15,2) | Ya | Nilai sebelum koreksi |
| nilai_baru | DECIMAL(15,2) | Ya | Nilai setelah koreksi |
| selisih | DECIMAL(15,2) | Ya | Selisih nilai |
| alasan | TEXT | Ya | Alasan koreksi |
| status | ENUM | Ya | 'DRAFT','PENDING','APPROVED','REJECTED','COMPLETED' |
| requested_by | UUID | Ya | FK ke user |
| approved_by | UUID | Tidak | FK ke user |
| approved_at | DATETIME | Tidak | Waktu approval |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

---

## 5. Form-Form yang Dibutuhkan

### 5.1 Form Retur Obat dari Pasien

**Informasi Pasien (read-only):**
- Nama Pasien / No. RM
- Ruangan / Kunjungan
- Tanggal Resep Asal

**Informasi Resep (read-only):**
- No. Resep
- Daftar obat yang diberikan

**Input Retur:**
| Obat | Batch | Qty Diberikan | Qty Retur* | Kondisi* | Catatan |
|------|-------|---------------|------------|----------|---------|
| Amoxicillin 500mg | ABC123 | 15 | [input] | [dropdown] | [input] |
| Paracetamol 500mg | DEF456 | 10 | [input] | [dropdown] | [input] |

**Kondisi Options:**
- Baik (layak pakai ulang)
- Rusak (kemasan terbuka/rusak)
- Expired (kadaluarsa)

**Alasan Retur* (dropdown):**
- Obat tidak terpakai
- Pasien alergi (baru diketahui)
- Terapi diganti dokter
- Pasien meninggal
- Lainnya

**Detail Alasan* (textarea)**

**Summary:**
- Total nilai retur: Rp XXX
- Status: Pending Approval

### 5.2 Form Pembatalan Order

**Informasi Order (read-only):**
- No. Order
- Jenis (Lab/Radiologi/Tindakan)
- Detail order
- Status order

**Input Pembatalan:**
- Kategori Alasan* (dropdown):
  - Salah input
  - Terapi diganti
  - Pasien menolak
  - Kondisi pasien berubah
  - Lainnya
- Detail Alasan* (textarea)

**Jika Sudah Diproses:**
- Warning: Order sudah diproses, akan ada charge yang perlu di-retur
- [ ] Saya memahami akan ada koreksi billing

### 5.3 Form Pembatalan Tindakan

**Informasi Tindakan (read-only):**
- Nama Tindakan
- Tanggal Pelaksanaan
- Dokter Pelaksana
- Nilai Tarif
- Status Billing

**Input Pembatalan:**
- Alasan Pembatalan* (dropdown + textarea)
- Apakah tindakan benar-benar sudah dilakukan?* (radio)
  - Ya, sudah dilakukan (salah billing, perlu investigasi)
  - Tidak, salah input (bisa langsung batal)
- Jika sudah dilakukan:
  - Alasan pembatalan billing* (textarea)
  - [ ] Saya bertanggung jawab atas pembatalan ini

### 5.4 Form Koreksi Billing

**Informasi Billing (read-only):**
- No. Billing
- Nama Pasien
- Total Billing

**Item yang Dikoreksi:**
- Pilih Item (dropdown dari billing detail)

**Jenis Koreksi* (radio):**
- Hapus item
- Ubah jumlah
- Ubah tarif
- Tambah item baru

**Detail Koreksi:**
- Nilai Awal: Rp XXX (read-only)
- Nilai Baru: [input] (untuk ubah) atau 0 (untuk hapus)
- Selisih: Rp XXX (auto-calculate)

**Alasan Koreksi* (textarea)**

### 5.5 Form Approval Retur/Pembatalan

**Daftar Pending Approval:**
| No | Tanggal | Jenis | Pasien | Unit | Nilai | Pemohon | Aksi |
|----|---------|-------|--------|------|-------|---------|------|
| 1 | 01/01/25 | Retur Obat | Budi | Farmasi | Rp 150,000 | Apt. A | [Review] |
| 2 | 01/01/25 | Batal Tindakan | Ani | Poli Bedah | Rp 500,000 | dr. B | [Review] |

**Detail Review:**
- Informasi lengkap retur/pembatalan
- Alasan pemohon
- Dampak ke billing
- History pembatalan sebelumnya (jika ada pattern)

**Aksi:**
- Approve (+ catatan)
- Reject (+ alasan wajib)
- Minta Klarifikasi

---

## 6. Fitur Pendukung

### 6.1 Dashboard Retur & Pembatalan

**Widget:**
- Pending approval count
- Trend retur/pembatalan (anomaly detection)
- Top reason for cancellation
- Nilai retur bulan ini

### 6.2 Audit History

**Tracking:**
- Semua retur/pembatalan tercatat
- Status approval chain
- Siapa melakukan apa kapan

### 6.3 Pattern Detection

**Alert jika:**
- Retur/pembatalan dari user/unit tertentu terlalu tinggi
- Retur obat yang sama berulang
- Pembatalan order yang tinggi

### 6.4 Reporting

**Laporan:**
- Retur per periode
- Pembatalan per unit
- Alasan pembatalan terbanyak
- Nilai kehilangan akibat retur

---

## 7. Integrasi dengan Modul Lain

| Modul | Integrasi |
|-------|-----------|
| **Farmasi** | Retur obat → update stok, koreksi dispensing |
| **Gudang** | Retur barang → update stok |
| **Billing** | Koreksi tagihan |
| **Lab/Radiologi** | Pembatalan order |
| **EMR** | Pembatalan tindakan |
| **Jasa Pelayanan** | Koreksi jasa jika tindakan dibatalkan |

---

## 8. Aturan Bisnis (Business Rules)

1. Semua retur/pembatalan **wajib** dengan alasan yang jelas
2. Retur obat hanya bisa dilakukan **dalam 24 jam** setelah dispensing
3. Obat dengan **kemasan sudah terbuka** tidak bisa diretur (kecuali kondisi khusus)
4. **Obat high alert** memerlukan approval level lebih tinggi
5. Pembatalan yang sudah di-billing memerlukan **approval supervisor**
6. Nilai pembatalan **> Rp 1.000.000** memerlukan approval manager
7. **Void pembayaran** hanya bisa dilakukan di hari yang sama
8. Retur tidak bisa dilakukan jika **billing sudah closed** (perlu proses khusus)
9. Setiap retur/pembatalan **harus ter-audit**
10. Pattern abuse akan trigger **investigasi**

---

## 9. Kebutuhan Teknis

### 9.1 Approval Workflow

**Level Approval:**
| Nilai/Jenis | Level 1 | Level 2 |
|-------------|---------|---------|
| < Rp 100,000 | Supervisor Unit | - |
| Rp 100,000 - 1,000,000 | Supervisor Unit | Kepala Unit |
| > Rp 1,000,000 | Kepala Unit | Manager |
| Narkotika/Psikotropika | Apoteker | Kepala Farmasi |

### 9.2 Permission/Role

| Role | Akses |
|------|-------|
| Staff Unit | Request retur/pembatalan |
| Supervisor | Approve level 1 |
| Kepala Unit | Approve level 2 |
| Manager | Approve level 3 |
| Admin | Override, konfigurasi |

### 9.3 Laporan

**Laporan Standar:**
- Retur per periode
- Pembatalan per unit
- Analisis alasan
- Perbandingan trend

---

## 10. Notifikasi

| Event | Penerima | Channel |
|-------|----------|---------|
| Request baru perlu approval | Approver | Push |
| Request diapprove | Requester | Push |
| Request ditolak | Requester | Push + reason |
| Anomaly terdeteksi | Manager | Alert |
| Nilai retur tinggi | Finance | Daily report |
