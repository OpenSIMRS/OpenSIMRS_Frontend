# Modul Master Data

## 1. Deskripsi Umum

Modul Master Data adalah sistem pengelolaan data referensi yang digunakan oleh seluruh modul dalam aplikasi SIMRS. Master data merupakan fondasi data yang harus disiapkan sebelum sistem operasional berjalan. Modul ini mencakup:

- Data klinis wajib (ICD-10, ICD-9 CM)
- Data tarif dan tindakan
- Data obat dan barang
- Data SDM dan unit
- Data demografi dan referensi umum

---

## 2. Kategori Master Data

### 2.1 Master Data Klinis Wajib

| Master | Deskripsi | Sumber |
|--------|-----------|--------|
| **ICD-10** | Kode diagnosa penyakit | WHO |
| **ICD-9 CM** | Kode prosedur/tindakan medis | WHO |

### 2.2 Master Data Tarif & Barang

| Master | Deskripsi |
|--------|-----------|
| **Master Tindakan/Tarif** | Daftar tindakan medis dengan tarif |
| **Master Obat** | Data obat-obatan |
| **Master Alkes** | Alat kesehatan |
| **Master BHP** | Bahan habis pakai |
| **Master Barang Umum** | Barang non-medis |

### 2.3 Master Data SDM & Unit

| Master | Deskripsi |
|--------|-----------|
| **Master Pegawai** | Data seluruh pegawai RS |
| **Master Jabatan** | Struktur jabatan |
| **Master Unit/Ruangan** | Unit pelayanan |
| **Master Kamar & Bed** | Kamar rawat inap |
| **Master Poli** | Poliklinik |

### 2.4 Master Data Referensi

| Master | Deskripsi |
|--------|-----------|
| **Master Penjamin** | Jenis penjamin (BPJS, Asuransi, dll) |
| **Master Supplier** | Pemasok barang |
| **Master Produsen** | Produsen obat/alkes |
| **Master Demografi** | Agama, Pendidikan, Pekerjaan, dll |
| **Master Wilayah** | Provinsi, Kabupaten, Kecamatan, Kelurahan |

---

## 3. Skema Data Detail

### 3.1 Master ICD-10 (tbl_icd10)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(10) | Ya | Kode ICD-10 |
| nama_id | VARCHAR(255) | Ya | Nama diagnosa (Indonesia) |
| nama_en | VARCHAR(255) | Ya | Nama diagnosa (English) |
| kategori | VARCHAR(10) | Tidak | Kategori (Chapter) |
| parent_kode | VARCHAR(10) | Tidak | Kode parent (hierarki) |
| deskripsi | TEXT | Tidak | Deskripsi detail |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.2 Master ICD-9 CM (tbl_icd9cm)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(10) | Ya | Kode ICD-9 CM |
| nama_id | VARCHAR(255) | Ya | Nama prosedur (Indonesia) |
| nama_en | VARCHAR(255) | Ya | Nama prosedur (English) |
| kategori | VARCHAR(10) | Tidak | Kategori |
| parent_kode | VARCHAR(10) | Tidak | Kode parent |
| deskripsi | TEXT | Tidak | Deskripsi detail |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.3 Master Tindakan (tbl_master_tindakan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(20) | Ya | Kode tindakan internal |
| nama | VARCHAR(200) | Ya | Nama tindakan |
| kategori_id | UUID | Ya | FK ke tbl_kategori_tindakan |
| icd9cm_id | UUID | Tidak | FK ke tbl_icd9cm |
| unit_id | UUID | Ya | FK ke tbl_unit (unit pelaksana) |
| is_operasi | BOOLEAN | Ya | Apakah tindakan operasi |
| is_memerlukan_consent | BOOLEAN | Ya | Memerlukan informed consent |
| tarif_default | DECIMAL(15,2) | Ya | Tarif default |
| komponen_jasa_medis | DECIMAL(15,2) | Ya | Komponen jasa medis |
| komponen_sarana | DECIMAL(15,2) | Ya | Komponen sarana |
| komponen_bhp | DECIMAL(15,2) | Ya | Komponen BHP |
| durasi_estimasi | INT | Tidak | Durasi estimasi (menit) |
| keterangan | TEXT | Tidak | Keterangan |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.4 Master Tarif per Kelas/Penjamin (tbl_tarif_detail)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| tindakan_id | UUID | Ya | FK ke tbl_master_tindakan |
| kelas_id | UUID | Tidak | FK ke tbl_kelas_kamar |
| penjamin_id | UUID | Tidak | FK ke tbl_penjamin |
| tarif | DECIMAL(15,2) | Ya | Nilai tarif |
| komponen_jasa_medis | DECIMAL(15,2) | Tidak | Jasa medis khusus |
| komponen_sarana | DECIMAL(15,2) | Tidak | Sarana khusus |
| komponen_bhp | DECIMAL(15,2) | Tidak | BHP khusus |
| tanggal_berlaku | DATE | Ya | Tanggal mulai berlaku |
| tanggal_berakhir | DATE | Tidak | Tanggal berakhir |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 3.5 Master Pegawai (tbl_pegawai)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| nip | VARCHAR(20) | Ya | Nomor Induk Pegawai |
| nik | VARCHAR(16) | Ya | NIK |
| nama_lengkap | VARCHAR(100) | Ya | Nama lengkap |
| gelar_depan | VARCHAR(20) | Tidak | Gelar depan |
| gelar_belakang | VARCHAR(50) | Tidak | Gelar belakang |
| tempat_lahir | VARCHAR(50) | Ya | Tempat lahir |
| tanggal_lahir | DATE | Ya | Tanggal lahir |
| jenis_kelamin | ENUM('L','P') | Ya | Jenis kelamin |
| alamat | TEXT | Ya | Alamat |
| no_telepon | VARCHAR(15) | Tidak | Nomor telepon |
| no_hp | VARCHAR(15) | Ya | Nomor HP |
| email | VARCHAR(100) | Tidak | Email |
| jabatan_id | UUID | Ya | FK ke tbl_jabatan |
| unit_id | UUID | Ya | FK ke tbl_unit |
| jenis_pegawai | ENUM | Ya | 'PNS','KONTRAK','HONORER','DOKTER_TAMU' |
| status_pegawai | ENUM | Ya | 'AKTIF','CUTI','RESIGN','PENSIUN' |
| tanggal_masuk | DATE | Ya | Tanggal mulai bekerja |
| tanggal_keluar | DATE | Tidak | Tanggal keluar |
| no_str | VARCHAR(50) | Tidak | Nomor STR (untuk nakes) |
| tanggal_str_expired | DATE | Tidak | Tanggal expired STR |
| no_sip | VARCHAR(50) | Tidak | Nomor SIP |
| tanggal_sip_expired | DATE | Tidak | Tanggal expired SIP |
| spesialisasi | VARCHAR(100) | Tidak | Spesialisasi (untuk dokter) |
| foto | VARCHAR(255) | Tidak | Path foto |
| user_id | UUID | Tidak | FK ke tbl_user (akun SIMRS) |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.6 Master Unit/Ruangan (tbl_unit)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(10) | Ya | Kode unit |
| nama | VARCHAR(100) | Ya | Nama unit |
| jenis | ENUM | Ya | 'POLI','IGD','RAWAT_INAP','PENUNJANG','ADMINISTRASI' |
| parent_id | UUID | Tidak | FK ke tbl_unit (parent, untuk hierarki) |
| lokasi | VARCHAR(100) | Tidak | Lokasi/gedung/lantai |
| telepon | VARCHAR(20) | Tidak | Nomor telepon unit |
| kepala_unit_id | UUID | Tidak | FK ke tbl_pegawai |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.7 Master Kelas Kamar (tbl_kelas_kamar)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(10) | Ya | Kode kelas |
| nama | VARCHAR(50) | Ya | Nama kelas |
| deskripsi | TEXT | Tidak | Deskripsi |
| tarif_kamar | DECIMAL(15,2) | Ya | Tarif per hari |
| urutan | INT | Ya | Urutan (VIP=1, I=2, II=3, III=4) |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 3.8 Master Kamar (tbl_kamar)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(10) | Ya | Kode kamar |
| nama | VARCHAR(50) | Ya | Nama kamar |
| unit_id | UUID | Ya | FK ke tbl_unit (ruangan rawat inap) |
| kelas_id | UUID | Ya | FK ke tbl_kelas_kamar |
| kapasitas_bed | INT | Ya | Jumlah bed dalam kamar |
| fasilitas | TEXT | Tidak | Daftar fasilitas |
| lokasi | VARCHAR(100) | Tidak | Lokasi detail |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.9 Master Bed (tbl_bed)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(10) | Ya | Kode bed |
| nama | VARCHAR(20) | Ya | Nama bed (Bed A, Bed B, dll) |
| kamar_id | UUID | Ya | FK ke tbl_kamar |
| status | ENUM | Ya | 'TERSEDIA','TERISI','MAINTENANCE','BOOKING' |
| pasien_id | UUID | Tidak | FK ke tbl_master_pasien (jika terisi) |
| rawat_inap_id | UUID | Tidak | FK ke tbl_rawat_inap (jika terisi) |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.10 Master Jabatan (tbl_jabatan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(10) | Ya | Kode jabatan |
| nama | VARCHAR(100) | Ya | Nama jabatan |
| kategori | ENUM | Ya | 'STRUKTURAL','FUNGSIONAL','UMUM' |
| parent_id | UUID | Tidak | FK ke tbl_jabatan (hierarki) |
| level | INT | Ya | Level jabatan |
| is_medis | BOOLEAN | Ya | Jabatan medis |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 3.11 Master Agama (tbl_agama)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(5) | Ya | Kode agama |
| nama | VARCHAR(50) | Ya | Nama agama |
| is_active | BOOLEAN | Ya | Status aktif |

### 3.12 Master Pendidikan (tbl_pendidikan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(10) | Ya | Kode pendidikan |
| nama | VARCHAR(50) | Ya | Nama tingkat pendidikan |
| urutan | INT | Ya | Urutan level |
| is_active | BOOLEAN | Ya | Status aktif |

### 3.13 Master Pekerjaan (tbl_pekerjaan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(10) | Ya | Kode pekerjaan |
| nama | VARCHAR(100) | Ya | Nama pekerjaan |
| kategori | VARCHAR(50) | Tidak | Kategori pekerjaan |
| is_active | BOOLEAN | Ya | Status aktif |

### 3.14 Master Wilayah - Provinsi (tbl_provinsi)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(2) | Ya | Kode provinsi (BPS) |
| nama | VARCHAR(100) | Ya | Nama provinsi |
| is_active | BOOLEAN | Ya | Status aktif |

### 3.15 Master Wilayah - Kabupaten (tbl_kabupaten)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(4) | Ya | Kode kabupaten (BPS) |
| nama | VARCHAR(100) | Ya | Nama kabupaten/kota |
| provinsi_id | UUID | Ya | FK ke tbl_provinsi |
| is_active | BOOLEAN | Ya | Status aktif |

### 3.16 Master Wilayah - Kecamatan (tbl_kecamatan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(7) | Ya | Kode kecamatan (BPS) |
| nama | VARCHAR(100) | Ya | Nama kecamatan |
| kabupaten_id | UUID | Ya | FK ke tbl_kabupaten |
| is_active | BOOLEAN | Ya | Status aktif |

### 3.17 Master Wilayah - Kelurahan (tbl_kelurahan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(10) | Ya | Kode kelurahan (BPS) |
| nama | VARCHAR(100) | Ya | Nama kelurahan/desa |
| kecamatan_id | UUID | Ya | FK ke tbl_kecamatan |
| kode_pos | VARCHAR(5) | Tidak | Kode pos |
| is_active | BOOLEAN | Ya | Status aktif |

---

## 4. Form-Form yang Dibutuhkan

### 4.1 Form CRUD Master Umum

**Template Form untuk semua master:**

**Tampilan List:**
- Search/Filter
- Tabel dengan pagination
- Kolom: Kode, Nama, Status, Aksi
- Aksi: View, Edit, Delete, Aktif/Non-aktif

**Form Add/Edit:**
- Field sesuai struktur tabel
- Validasi required
- Tombol: Simpan, Batal

### 4.2 Form Master ICD-10/ICD-9 CM

**Fitur Khusus:**
- Import dari file (Excel/CSV)
- Tree view hierarki
- Search advanced (by kode/nama)
- Bulk aktif/non-aktif

### 4.3 Form Master Tindakan

**Bagian 1: Informasi Dasar**
- Kode Tindakan*
- Nama Tindakan*
- Kategori* (dropdown)
- Unit Pelaksana* (dropdown)
- Mapping ICD-9 CM (autocomplete)
- Durasi Estimasi (menit)

**Bagian 2: Tarif**
- Tarif Default*
- Komponen Jasa Medis
- Komponen Sarana
- Komponen BHP

**Bagian 3: Setting**
- [ ] Tindakan Operasi
- [ ] Memerlukan Informed Consent

**Bagian 4: Tarif per Kelas (Sub-form)**
| Kelas | Penjamin | Tarif | Berlaku Mulai | Aksi |
|-------|----------|-------|---------------|------|
| VIP | Umum | [input] | [date] | [edit][hapus] |

### 4.4 Form Master Pegawai

**Bagian 1: Data Pribadi**
- NIP*
- NIK*
- Nama Lengkap*
- Gelar Depan
- Gelar Belakang
- Tempat/Tanggal Lahir*
- Jenis Kelamin*
- Alamat*
- No. HP*
- Email
- Foto (upload)

**Bagian 2: Data Kepegawaian**
- Jabatan* (dropdown)
- Unit Kerja* (dropdown)
- Jenis Pegawai* (dropdown)
- Status Pegawai* (dropdown)
- Tanggal Masuk*
- Tanggal Keluar

**Bagian 3: Data Profesi (untuk Nakes)**
- Spesialisasi
- No. STR*
- Tanggal Expired STR*
- No. SIP
- Tanggal Expired SIP

**Bagian 4: Akun SIMRS**
- Buat Akun User (link ke User Management)

### 4.5 Form Master Kamar & Bed

**Master Kamar:**
- Kode Kamar*
- Nama Kamar*
- Ruangan* (dropdown unit rawat inap)
- Kelas* (dropdown)
- Kapasitas Bed*
- Fasilitas (checkbox list)

**Master Bed (Sub-form per Kamar):**
| Kode Bed | Nama | Status | Aksi |
|----------|------|--------|------|
| [auto] | [input] | [dropdown] | [edit][hapus] |

### 4.6 Form Master Tarif Batch

**Untuk Update Tarif Massal:**

**Filter:**
- Kategori Tindakan
- Unit
- Kelas

**Bulk Update:**
| Kode | Nama Tindakan | Tarif Lama | Tarif Baru | Persentase |
|------|---------------|------------|------------|------------|
| T001 | Tindakan A | 100,000 | [input] | [auto] |
| T002 | Tindakan B | 150,000 | [input] | [auto] |

**Opsi:**
- [ ] Naik semua X%
- Tanggal Berlaku*

---

## 5. Fitur Pendukung

### 5.1 Import/Export Data

**Format yang Didukung:**
- Excel (.xlsx)
- CSV (.csv)
- JSON (.json)

**Fitur:**
- Template download
- Validasi sebelum import
- Error report
- Rollback jika gagal

### 5.2 Validasi Data

**Validasi Otomatis:**
- Duplikasi kode
- Format data
- Referential integrity
- Konsistensi data

### 5.3 Audit Trail Master

**Tracking:**
- Setiap perubahan master data
- Siapa yang mengubah
- Kapan diubah
- Data sebelum dan sesudah

### 5.4 Sinkronisasi Data Eksternal

**ICD-10/ICD-9 CM:**
- Update dari sumber resmi WHO
- Mapping dengan versi sebelumnya

**Wilayah:**
- Sinkronisasi dengan data BPS

### 5.5 Data Seeding

**Fitur:**
- Initial data setup
- Demo data untuk testing
- Restore default

---

## 6. Aturan Bisnis (Business Rules)

1. **Kode** pada setiap master harus unik
2. Master yang sudah dipakai di transaksi **tidak boleh dihapus**, hanya non-aktifkan
3. **Perubahan tarif** harus dengan tanggal berlaku, tidak retroaktif
4. **ICD-10/ICD-9 CM** harus sesuai versi WHO yang berlaku
5. **Pegawai** dengan peran medis wajib memiliki STR aktif
6. **Expired STR/SIP** akan memberikan warning
7. **Bed** yang terisi tidak bisa diubah ke maintenance
8. **Unit** tidak bisa dihapus jika masih ada pegawai terkait
9. **Hierarki wilayah** harus konsisten (Provinsi → Kabupaten → Kecamatan → Kelurahan)
10. **Backup master data** dilakukan sebelum import massal

---

## 7. Kebutuhan Teknis

### 7.1 Permission/Role

| Role | Akses |
|------|-------|
| Admin Master | Full CRUD semua master |
| Admin Unit | View all, Edit unit terkait |
| Supervisor | View all |
| User Biasa | View yang diperlukan |

### 7.2 Caching

**Untuk Performa:**
- Cache master yang sering diakses
- Invalidate cache saat ada perubahan
- TTL yang sesuai

### 7.3 Search & Indexing

**Indexing:**
- Kode (primary search)
- Nama (full-text search)
- Kategori

**Autocomplete:**
- ICD-10/ICD-9 CM search
- Obat search
- Pegawai search

---

## 8. Checklist Implementasi Master Data

### 8.1 Data Wajib Sebelum Go-Live

- [ ] ICD-10 (minimal chapter yang relevan)
- [ ] ICD-9 CM (minimal yang sering dipakai)
- [ ] Master Pegawai (semua pegawai aktif)
- [ ] Master Unit/Ruangan
- [ ] Master Kamar & Bed (untuk rawat inap)
- [ ] Master Tindakan & Tarif
- [ ] Master Obat
- [ ] Master Penjamin
- [ ] Master Wilayah (Provinsi s/d Kelurahan)
- [ ] Master Referensi (Agama, Pendidikan, Pekerjaan)

### 8.2 Data Opsional

- [ ] Master Supplier
- [ ] Master Produsen
- [ ] Tarif per Kelas per Penjamin
- [ ] Formula Jasa Pelayanan
