# Modul Audit Trail

## 1. Deskripsi Umum

Modul Audit Trail adalah sistem pencatatan log yang merekam setiap aktivitas dan perubahan data dalam aplikasi SIMRS. Modul ini bertujuan untuk:

- Menjaga akuntabilitas pengguna
- Melacak setiap perubahan data (siapa, kapan, apa yang diubah)
- Memenuhi kebutuhan keamanan dan compliance
- Mendukung investigasi jika terjadi masalah
- Memenuhi standar akreditasi rumah sakit

---

## 2. Jenis Audit Trail

### 2.1 Kategori Aktivitas

| Kategori | Deskripsi | Contoh |
|----------|-----------|--------|
| **Akses (Access)** | Login, logout, akses halaman | User login, view rekam medis |
| **Create** | Pembuatan data baru | Pendaftaran pasien baru |
| **Read/View** | Melihat data sensitif | Melihat rekam medis pasien |
| **Update** | Perubahan data | Edit data pasien, update SOAP |
| **Delete** | Penghapusan data | Hapus order, batalkan resep |
| **Print** | Cetak dokumen | Cetak kwitansi, cetak resep |
| **Export** | Export data keluar sistem | Export laporan ke Excel |
| **Admin Action** | Aktivitas administratif | Reset password, ubah role |

### 2.2 Tingkat Sensitivitas Data

| Level | Data | Requirement |
|-------|------|-------------|
| **Critical** | Rekam medis, hasil lab, resep | Full audit (nilai sebelum & sesudah) |
| **High** | Data pasien, billing, stok | Full audit |
| **Medium** | Master data, konfigurasi | Basic audit (siapa, kapan, aksi) |
| **Low** | Data referensi umum | Minimal audit |

---

## 3. Skema Data

### 3.1 Audit Log (tbl_audit_log)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| timestamp | DATETIME(6) | Ya | Waktu kejadian (dengan microseconds) |
| user_id | UUID | Ya | FK ke tbl_user |
| username | VARCHAR(50) | Ya | Username (snapshot) |
| user_name | VARCHAR(100) | Ya | Nama lengkap user (snapshot) |
| user_role | VARCHAR(50) | Ya | Role saat aksi (snapshot) |
| session_id | VARCHAR(100) | Ya | Session ID |
| ip_address | VARCHAR(45) | Ya | IP Address |
| user_agent | TEXT | Tidak | Browser/device info |
| action | ENUM | Ya | 'LOGIN','LOGOUT','CREATE','READ','UPDATE','DELETE','PRINT','EXPORT','ADMIN' |
| module | VARCHAR(50) | Ya | Nama modul |
| entity_type | VARCHAR(50) | Ya | Tipe entitas (tbl_pasien, tbl_soap, dll) |
| entity_id | VARCHAR(50) | Ya | ID record yang diakses |
| entity_name | VARCHAR(200) | Tidak | Identifier entitas (nama pasien, no.RM) |
| description | TEXT | Ya | Deskripsi aktivitas |
| old_value | JSON | Tidak | Nilai sebelum perubahan |
| new_value | JSON | Tidak | Nilai setelah perubahan |
| changes | JSON | Tidak | Daftar field yang berubah |
| risk_level | ENUM | Ya | 'LOW','MEDIUM','HIGH','CRITICAL' |
| status | ENUM | Ya | 'SUCCESS','FAILED','DENIED' |
| error_message | TEXT | Tidak | Pesan error jika gagal |
| additional_info | JSON | Tidak | Informasi tambahan |
| created_at | TIMESTAMP | Ya | Waktu record dibuat |

### 3.2 Audit Access Log (tbl_audit_access)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| timestamp | DATETIME(6) | Ya | Waktu |
| user_id | UUID | Ya | FK ke tbl_user |
| session_id | VARCHAR(100) | Ya | Session ID |
| ip_address | VARCHAR(45) | Ya | IP Address |
| action | ENUM | Ya | 'LOGIN','LOGOUT','SESSION_TIMEOUT','FORCE_LOGOUT' |
| status | ENUM | Ya | 'SUCCESS','FAILED' |
| failure_reason | VARCHAR(100) | Tidak | Alasan gagal (wrong password, locked, dll) |
| device_info | JSON | Tidak | Info perangkat |
| location_info | JSON | Tidak | Info lokasi (jika tersedia) |
| created_at | TIMESTAMP | Ya | Waktu record dibuat |

### 3.3 Audit PHI Access (tbl_audit_phi)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| timestamp | DATETIME(6) | Ya | Waktu |
| user_id | UUID | Ya | FK ke tbl_user |
| patient_id | UUID | Ya | FK ke tbl_master_pasien |
| patient_mrn | VARCHAR(20) | Ya | No. Rekam Medis |
| access_type | ENUM | Ya | 'VIEW','CREATE','UPDATE','DELETE','PRINT','EXPORT' |
| data_category | ENUM | Ya | 'DEMOGRAPHICS','CLINICAL','LAB','RADIOLOGY','PHARMACY','BILLING' |
| resource_type | VARCHAR(50) | Ya | Tipe resource (SOAP, Order Lab, dll) |
| resource_id | VARCHAR(50) | Ya | ID resource |
| access_reason | VARCHAR(100) | Tidak | Alasan akses (untuk break-the-glass) |
| is_break_glass | BOOLEAN | Ya | Apakah akses emergency |
| created_at | TIMESTAMP | Ya | Waktu record dibuat |

### 3.4 Konfigurasi Audit (tbl_audit_config)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| module | VARCHAR(50) | Ya | Nama modul |
| entity_type | VARCHAR(50) | Ya | Tipe entitas |
| action | ENUM | Ya | Jenis aksi |
| is_enabled | BOOLEAN | Ya | Aktif/tidak |
| log_old_value | BOOLEAN | Ya | Log nilai lama |
| log_new_value | BOOLEAN | Ya | Log nilai baru |
| risk_level | ENUM | Ya | Level risiko |
| retention_days | INT | Ya | Masa simpan (hari) |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update |

---

## 4. Fitur Audit Trail

### 4.1 Pencatatan Otomatis

**Setiap Transaksi Mencatat:**
- Timestamp dengan presisi microseconds
- User yang melakukan aksi
- IP Address dan session
- Aksi yang dilakukan
- Data sebelum dan sesudah perubahan
- Status keberhasilan

### 4.2 Immutability

**Aturan:**
- Audit log tidak dapat diedit
- Audit log tidak dapat dihapus (kecuali retention policy)
- Setiap perubahan pada audit log tercatat

### 4.3 PHI (Protected Health Information) Tracking

**Khusus Data Medis:**
- Tracking setiap akses ke rekam medis
- Log siapa melihat data pasien apa
- Alert untuk akses tidak biasa

### 4.4 Break-the-Glass

**Untuk Akses Darurat:**
- User dapat akses data di luar otorisasi normal
- Wajib input alasan
- Alert ke supervisor
- Review wajib dalam 24 jam

---

## 5. Interface & Form

### 5.1 Audit Trail Viewer

**Filter:**
- Periode (tanggal mulai - selesai)
- User
- Module
- Action type
- Entity type
- Risk level
- Status

**Tampilan Tabel:**
| Waktu | User | Aksi | Modul | Entitas | Deskripsi | Status |
|-------|------|------|-------|---------|-----------|--------|
| 01/01/25 10:00 | dr. A | UPDATE | EMR | SOAP-123 | Update diagnosa pasien X | Success |
| 01/01/25 09:55 | Ns. B | CREATE | Farmasi | RES-456 | Buat resep untuk pasien Y | Success |

**Detail View (klik row):**
- Informasi lengkap user dan session
- Data sebelum perubahan (highlight)
- Data setelah perubahan (highlight)
- Diff view untuk perubahan

### 5.2 Access History per Pasien

**Tampilan:**
- Semua akses ke rekam medis pasien tertentu
- Filter by periode, user, jenis akses
- Alert jika ada akses tidak biasa

### 5.3 User Activity Report

**Menampilkan:**
- Aktivitas user tertentu dalam periode
- Summary per jenis aksi
- Pattern analysis

### 5.4 Security Alert Dashboard

**Widget:**
- Login failures (count, trend)
- Unusual access patterns
- Break-the-glass events
- High-risk activities

---

## 6. Report & Analytics

### 6.1 Laporan Standar

| Nama Laporan | Frekuensi | Penerima |
|--------------|-----------|----------|
| Login Activity Report | Harian | Security |
| Failed Login Report | Harian | Security |
| PHI Access Report | Bulanan | Compliance |
| Admin Activity Report | Bulanan | Manajemen |
| Break-the-Glass Report | Bulanan | Compliance |
| Data Change Summary | Bulanan | IT/Audit |

### 6.2 Alert Rules

| Rule | Condition | Action |
|------|-----------|--------|
| Multiple Login Failure | > 5 failed login dalam 15 menit | Lock account + notify security |
| Unusual Access Time | Login di luar jam kerja | Notify supervisor |
| Mass Data Access | > 100 record dalam 1 jam | Notify security |
| Cross-department Access | Akses data pasien bukan unit sendiri | Log + periodic review |
| Sensitive Data Export | Export data pasien | Notify compliance |

---

## 7. Integrasi dengan Modul Lain

| Modul | Data yang Di-audit |
|-------|-------------------|
| **Pendaftaran** | CRUD data pasien |
| **EMR** | Semua aktivitas rekam medis |
| **Billing** | Transaksi keuangan |
| **Farmasi** | Resep, dispensing |
| **Gudang** | Mutasi stok |
| **User Management** | Perubahan akses dan role |

---

## 8. Aturan Bisnis (Business Rules)

1. **Setiap** aktivitas di sistem harus tercatat dalam audit log
2. Audit log bersifat **append-only**, tidak bisa diedit/dihapus
3. Akses ke **rekam medis** wajib di-log dengan detail lengkap
4. **Failed login** > 5x akan mengunci akun
5. **Break-the-glass** access memerlukan justifikasi dan review
6. Audit log disimpan minimal **10 tahun** untuk data medis
7. Audit log disimpan minimal **5 tahun** untuk data non-medis
8. **Export** data pasien memerlukan approval
9. Akses di luar jam kerja ter-flag untuk review
10. Perubahan **role/permission** tercatat dengan detail

---

## 9. Kebutuhan Teknis

### 9.1 Storage & Retention

| Data Type | Retention | Storage |
|-----------|-----------|---------|
| Access logs | 5 tahun | Cold storage setelah 1 tahun |
| PHI access | 10 tahun | Encrypted storage |
| Transaction logs | 10 tahun | Archived |
| System logs | 1 tahun | Rotating |

### 9.2 Performance

**Requirement:**
- Write: Async untuk tidak mengganggu transaksi utama
- Read: Indexed untuk query cepat
- Archive: Automated untuk data lama

### 9.3 Security

**Measures:**
- Audit log terenkripsi
- Akses ke audit log terbatas
- Integrity check (hash/checksum)
- Backup terpisah

### 9.4 Permission/Role

| Role | Akses |
|------|-------|
| User Biasa | Tidak ada akses |
| Kepala Unit | View aktivitas unit |
| Security Officer | View semua + alert |
| Compliance Officer | View semua + report |
| Admin | Konfigurasi + view |
| Auditor | Read-only semua |

---

## 10. Notifikasi

| Event | Penerima | Channel | Urgency |
|-------|----------|---------|---------|
| Multiple login failure | Security | Push + Email | High |
| Account locked | User + Security | Email | High |
| Break-the-glass access | Supervisor | Push | High |
| Unusual access pattern | Security | Alert | Medium |
| Mass data export | Compliance | Email | Medium |
| Admin action on sensitive data | Compliance | Alert | High |
