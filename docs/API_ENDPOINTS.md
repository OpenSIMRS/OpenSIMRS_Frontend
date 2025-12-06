# API Endpoints Documentation

Dokumentasi ini menjelaskan semua endpoint API yang digunakan oleh frontend OpenSIMRS.

## Base URL

```
Development: http://localhost:3000
Production: [TBD]
```

## Authentication

Semua endpoint (kecuali login dan refresh) memerlukan header `Authorization`:

```
Authorization: Bearer {accessToken}
```

---

## 1. Authentication

### POST /v1/auth/login
Login user dan mendapatkan access token dan refresh token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /v1/auth/refresh
Refresh access token menggunakan refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### GET /v1/auth/me
Mendapatkan informasi user yang sedang login.

**Response:**
```json
{
  "message": "Success",
  "data": {
    "ID": "user-001",
    "Email": "user@example.com",
    "Name": "John Doe",
    "Role": "ADMIN",
    "CreatedAt": "2024-01-01T00:00:00Z",
    "UpdatedAt": "2024-01-01T00:00:00Z",
    "DeletedAt": null
  }
}
```

---

## 2. Master Pasien

### GET /v1/master/pasien
Mendapatkan daftar pasien dengan pagination dan filter.

**Query Parameters:**
- `page` (int): Halaman (default: 1)
- `limit` (int): Jumlah data per halaman (default: 10)
- `search` (string): Pencarian berdasarkan nama, no_rm, atau NIK
- `jenis_kelamin` (string): Filter berdasarkan jenis kelamin (L/P/K)

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "no_rm": "RM001234",
      "nik": "3201012345678901",
      "nama_lengkap": "Ahmad Wijaya",
      "tempat_lahir": "Jakarta",
      "tanggal_lahir": "1990-05-15",
      "jenis_kelamin": "L",
      "golongan_darah": "A",
      "alamat": "Jl. Merdeka No. 123",
      "no_hp": "081234567890",
      "email": "ahmad.wijaya@email.com"
      // ... fields lainnya
    }
  ],
  "meta": {
    "total_count": 100,
    "total_page": 10,
    "page": 1,
    "count": 10
  }
}
```

### GET /v1/master/pasien/:id
Mendapatkan detail pasien berdasarkan ID.

**Response:**
```json
{
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "no_rm": "RM001234",
    "nik": "3201012345678901",
    "nama_lengkap": "Ahmad Wijaya"
    // ... semua fields
  }
}
```

### POST /v1/master/pasien
Membuat data pasien baru.

**Request Body:**
```json
{
  "nik": "3201012345678901",
  "nama_lengkap": "Ahmad Wijaya",
  "tempat_lahir": "Jakarta",
  "tanggal_lahir": "1990-05-15",
  "jenis_kelamin": "L",
  "alamat": "Jl. Merdeka No. 123",
  "no_hp": "081234567890",
  "agama_id": "agama-001",
  "status_perkawinan_id": "status-001",
  "nama_ibu": "Siti Aminah",
  "kode_wilayah": "32.01.01.2001"
  // ... fields lain yang diperlukan
}
```

**Response:**
```json
{
  "message": "Patient created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "no_rm": "RM001234",
    // ... semua fields
  }
}
```

### PUT /v1/master/pasien/:id
Update data pasien.

**Request Body:** (sama seperti POST, semua field opsional)

**Response:**
```json
{
  "message": "Patient updated successfully",
  "data": {
    // ... data pasien yang sudah diupdate
  }
}
```

### GET /v1/master/pasien/:id/riwayat
Mendapatkan riwayat kunjungan pasien.

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "kunjungan-001",
      "no_registrasi": "REG20240206001",
      "tanggal_kunjungan": "2024-02-06",
      "jenis_kunjungan": "RAJAL",
      "status_kunjungan": "SELESAI",
      "ruangan": {
        "nama": "Poli Penyakit Dalam"
      },
      "dokter": {
        "nama_lengkap": "Dr. Budi Hartono",
        "gelar_depan": "dr.",
        "gelar_belakang": "Sp.PD"
      }
    }
  ]
}
```

---

## 3. Kunjungan

### GET /v1/kunjungan
Mendapatkan daftar kunjungan.

**Query Parameters:**
- `page`, `limit`: Pagination
- `tanggal_mulai`, `tanggal_akhir`: Filter berdasarkan tanggal
- `jenis_kunjungan`: Filter (RAJAL/IGD/RANAP)
- `status_kunjungan`: Filter (DAFTAR/DILAYANI/SELESAI/BATAL)
- `ruangan_id`: Filter berdasarkan ruangan
- `dokter_id`: Filter berdasarkan dokter

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "kunjungan-001",
      "no_registrasi": "REG20240206001",
      "pasien": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "no_rm": "RM001234",
        "nama_lengkap": "Ahmad Wijaya"
      },
      "tanggal_kunjungan": "2024-02-06",
      "waktu_kunjungan": "08:30:00",
      "jenis_kunjungan": "RAJAL",
      "ruangan": {
        "nama": "Poli Penyakit Dalam"
      },
      "dokter": {
        "nama_lengkap": "Dr. Budi Hartono"
      },
      "status_kunjungan": "DILAYANI",
      "no_antrian": 1
    }
  ],
  "meta": {
    "total_count": 50,
    "total_page": 5,
    "page": 1,
    "count": 10
  }
}
```

### POST /v1/kunjungan
Membuat kunjungan baru (pendaftaran pasien).

**Request Body:**
```json
{
  "pasien_id": "550e8400-e29b-41d4-a716-446655440001",
  "tanggal_kunjungan": "2024-02-06",
  "waktu_kunjungan": "08:30:00",
  "jenis_kunjungan": "RAJAL",
  "ruangan_id": "ruangan-poli-001",
  "dokter_id": "pegawai-dokter-001",
  "penjamin_id": "penjamin-001",
  "no_penjamin": "0001234567890",
  "keterangan": null
}
```

**Response:**
```json
{
  "message": "Visit created successfully",
  "data": {
    "id": "kunjungan-001",
    "no_registrasi": "REG20240206001",
    "no_antrian": 1
    // ... semua fields
  }
}
```

### GET /v1/kunjungan/:id
Mendapatkan detail kunjungan.

### PUT /v1/kunjungan/:id/status
Update status kunjungan.

**Request Body:**
```json
{
  "status_kunjungan": "DILAYANI"
}
```

---

## 4. EMR (Electronic Medical Record)

### GET /v1/emr/kunjungan/:id/asesmen
Mendapatkan asesmen keperawatan untuk kunjungan.

### POST /v1/emr/asesmen
Membuat asesmen keperawatan.

**Request Body:**
```json
{
  "kunjungan_id": "kunjungan-001",
  "pasien_id": "550e8400-e29b-41d4-a716-446655440001",
  "waktu_asesmen": "2024-02-06T08:45:00Z",
  "keluhan_utama": "Demam tinggi sejak 3 hari yang lalu",
  "riwayat_penyakit_sekarang": "Pasien mengeluh demam tinggi...",
  "alergi_obat": "Penisilin",
  "td_sistole": 120,
  "td_diastole": 80,
  "nadi": 88,
  "respirasi": 20,
  "suhu": 38.5,
  "berat_badan": 70,
  "tinggi_badan": 170,
  "perawat_id": "pegawai-perawat-001"
}
```

### GET /v1/emr/kunjungan/:id/soap
Mendapatkan SOAP untuk kunjungan.

### POST /v1/emr/soap
Membuat catatan SOAP.

**Request Body:**
```json
{
  "kunjungan_id": "kunjungan-001",
  "waktu_pemeriksaan": "2024-02-06T09:00:00Z",
  "subjective": "Pasien mengeluh demam tinggi, pusing, dan mual",
  "objective": "TD: 120/80 mmHg, Nadi: 88x/menit, Suhu: 38.5°C",
  "assessment": "Febris ec susp. Infeksi Saluran Pernapasan Atas",
  "plan": "1. Istirahat\n2. Minum banyak air\n3. Antibiotik\n4. Antipiretik",
  "dokter_id": "pegawai-dokter-001"
}
```

### POST /v1/emr/diagnosis
Menambahkan diagnosis (ICD-10).

**Request Body:**
```json
{
  "kunjungan_id": "kunjungan-001",
  "icd10_id": "icd10-003",
  "jenis_diagnosa": "UTAMA",
  "urutan": 1,
  "keterangan": null
}
```

### POST /v1/emr/tindakan
Mencatat tindakan medis.

**Request Body:**
```json
{
  "kunjungan_id": "kunjungan-001",
  "tindakan_id": "tindakan-001",
  "icd9cm_id": "icd9cm-001",
  "waktu_tindakan": "2024-02-06T09:30:00Z",
  "jumlah": 1,
  "tarif": 150000,
  "pelaksana_id": "pegawai-dokter-001",
  "keterangan": null
}
```

---

## 5. Laboratorium

### GET /v1/lab/order
Mendapatkan daftar order lab.

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter (PENDING/DIPROSES/SELESAI/BATAL)
- `tanggal_mulai`, `tanggal_akhir`: Filter tanggal
- `pasien_id`: Filter berdasarkan pasien

### POST /v1/lab/order
Membuat order lab baru.

**Request Body:**
```json
{
  "kunjungan_id": "kunjungan-001",
  "pasien_id": "550e8400-e29b-41d4-a716-446655440001",
  "dokter_pengirim_id": "pegawai-dokter-001",
  "tanggal_order": "2024-02-06T10:00:00Z",
  "catatan": "Periksa fungsi hati",
  "detail_order": [
    {
      "pemeriksaan_lab_id": "lab-001",
      "keterangan": null
    },
    {
      "pemeriksaan_lab_id": "lab-002",
      "keterangan": null
    }
  ]
}
```

### PUT /v1/lab/order/:id/hasil
Input hasil pemeriksaan lab.

**Request Body:**
```json
{
  "detail_order_id": "detail-lab-001",
  "hasil": "25.5",
  "nilai_normal": "10-40",
  "satuan": "U/L",
  "keterangan": "Normal",
  "status": "SELESAI",
  "petugas_id": "pegawai-analis-001"
}
```

---

## 6. Radiologi

### GET /v1/radiologi/order
Mendapatkan daftar order radiologi.

### POST /v1/radiologi/order
Membuat order radiologi baru.

**Request Body:**
```json
{
  "kunjungan_id": "kunjungan-001",
  "pasien_id": "550e8400-e29b-41d4-a716-446655440001",
  "dokter_pengirim_id": "pegawai-dokter-001",
  "tanggal_order": "2024-02-06T10:00:00Z",
  "catatan": "Rontgen thorax AP/Lateral",
  "detail_order": [
    {
      "pemeriksaan_radiologi_id": "rad-001",
      "tanggal_jadwal": "2024-02-06T14:00:00Z"
    }
  ]
}
```

### PUT /v1/radiologi/order/:id/hasil
Input hasil dan expertise radiologi.

**Request Body:**
```json
{
  "detail_order_id": "detail-rad-001",
  "hasil": "Gambaran infiltrat pada lobus...",
  "expertise": "Kesan: Pneumonia",
  "radiolog_id": "pegawai-radiolog-001",
  "radiografer_id": "pegawai-radiografer-001",
  "status": "SELESAI"
}
```

---

## 7. Farmasi/Apotek

### GET /v1/farmasi/resep
Mendapatkan daftar resep.

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter (PENDING/DIPROSES/DISERAHKAN/BATAL)
- `tanggal_mulai`, `tanggal_akhir`: Filter tanggal

### POST /v1/farmasi/resep
Membuat resep (e-Resep).

**Request Body:**
```json
{
  "kunjungan_id": "kunjungan-001",
  "pasien_id": "550e8400-e29b-41d4-a716-446655440001",
  "dokter_id": "pegawai-dokter-001",
  "tanggal_resep": "2024-02-06T10:00:00Z",
  "detail_resep": [
    {
      "obat_id": "obat-001",
      "jumlah": 10,
      "satuan": "tablet",
      "aturan_pakai": "3x1 sehari sesudah makan",
      "keterangan": null
    },
    {
      "obat_id": "obat-002",
      "jumlah": 1,
      "satuan": "botol",
      "aturan_pakai": "3x1 sendok makan",
      "keterangan": "Kocok dahulu sebelum diminum"
    }
  ]
}
```

### PUT /v1/farmasi/resep/:id/serahkan
Proses penyerahan obat.

**Request Body:**
```json
{
  "apoteker_id": "pegawai-apoteker-001",
  "waktu_diserahkan": "2024-02-06T11:00:00Z"
}
```

---

## 8. Billing/Kasir

### GET /v1/billing
Mendapatkan daftar billing.

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter (BELUM_BAYAR/DIBAYAR_SEBAGIAN/LUNAS/BATAL)
- `tanggal_mulai`, `tanggal_akhir`: Filter tanggal

### GET /v1/billing/kunjungan/:id
Mendapatkan billing untuk kunjungan tertentu.

**Response:**
```json
{
  "message": "Success",
  "data": {
    "id": "billing-001",
    "no_billing": "BIL20240206001",
    "kunjungan_id": "kunjungan-001",
    "pasien": {
      "no_rm": "RM001234",
      "nama_lengkap": "Ahmad Wijaya"
    },
    "tanggal_billing": "2024-02-06",
    "total_tagihan": 500000,
    "total_diskon": 0,
    "total_pajak": 0,
    "total_bayar": 500000,
    "total_dibayar": 0,
    "sisa_tagihan": 500000,
    "status": "BELUM_BAYAR",
    "detail_billing": [
      {
        "jenis_item": "TINDAKAN",
        "nama_item": "Konsultasi Dokter Spesialis",
        "jumlah": 1,
        "harga_satuan": 150000,
        "total_bayar": 150000
      },
      {
        "jenis_item": "OBAT",
        "nama_item": "Amoxicillin 500mg",
        "jumlah": 10,
        "harga_satuan": 5000,
        "total_bayar": 50000
      }
    ]
  }
}
```

### POST /v1/billing/:id/bayar
Proses pembayaran.

**Request Body:**
```json
{
  "jumlah_bayar": 500000,
  "metode_pembayaran": "TUNAI",
  "nomor_referensi": null,
  "kasir_id": "pegawai-kasir-001"
}
```

---

## 9. Master Data

### GET /v1/master/icd10
Mendapatkan daftar ICD-10.

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Pencarian berdasarkan kode atau nama
- `kategori`: Filter berdasarkan kategori

### GET /v1/master/icd9cm
Mendapatkan daftar ICD-9 CM.

### GET /v1/master/tindakan
Mendapatkan daftar tindakan medis.

### GET /v1/master/obat
Mendapatkan daftar obat.

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Pencarian berdasarkan nama generik atau dagang
- `kategori_id`: Filter berdasarkan kategori

### GET /v1/master/pegawai
Mendapatkan daftar pegawai.

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Pencarian berdasarkan nama atau NIP
- `jabatan_id`: Filter berdasarkan jabatan
- `unit_id`: Filter berdasarkan unit
- `status_pegawai`: Filter berdasarkan status

### GET /v1/master/ruangan
Mendapatkan daftar ruangan.

**Query Parameters:**
- `jenis_ruangan`: Filter (POLI/IGD/RANAP/LAB/RADIOLOGI/FARMASI/dll)

### GET /v1/master/kamar
Mendapatkan daftar kamar rawat inap.

**Query Parameters:**
- `ruangan_id`: Filter berdasarkan ruangan
- `kelas_id`: Filter berdasarkan kelas
- `status`: Filter berdasarkan ketersediaan

### GET /v1/master/lookup
Mendapatkan data lookup.

**Query Parameters:**
- `category`: Filter berdasarkan kategori (AGAMA/PENDIDIKAN/PEKERJAAN/STATUS_PERKAWINAN)

---

## 10. Dashboard & Laporan

### GET /v1/dashboard/stats
Mendapatkan statistik dashboard.

**Response:**
```json
{
  "message": "Success",
  "data": {
    "total_kunjungan_hari_ini": 150,
    "total_pasien_aktif": 45,
    "total_bed_terisi": 120,
    "total_bed_kosong": 30,
    "bor": 80.0,
    "alos": 4.5,
    "pendapatan_hari_ini": 15000000,
    "pendapatan_bulan_ini": 350000000
  }
}
```

### GET /v1/dashboard/top-penyakit
Mendapatkan top 10 penyakit.

**Query Parameters:**
- `bulan`: Format YYYY-MM (default: bulan sekarang)

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "icd10_kode": "J18.9",
      "icd10_nama": "Pneumonia, tidak spesifik",
      "jumlah": 45
    }
  ]
}
```

### GET /v1/dashboard/pendapatan-bulanan
Mendapatkan grafik pendapatan bulanan.

**Query Parameters:**
- `tahun`: Tahun (default: tahun sekarang)

---

## Error Responses

Semua endpoint menggunakan format error yang konsisten:

**400 Bad Request:**
```json
{
  "error": "Validation error",
  "details": {
    "nik": "NIK harus 16 digit"
  }
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Access token is invalid or expired"
}
```

**404 Not Found:**
```json
{
  "error": "Not found",
  "message": "Patient with ID xxx not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Notes

1. Semua tanggal menggunakan format ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
2. Pagination default: page=1, limit=10
3. Semua response sukses menggunakan format `{ message, data, meta? }`
4. Header `TZ` otomatis ditambahkan untuk timezone
5. Soft delete: Data yang dihapus memiliki field `DeletedAt` yang terisi

---

## Changelog

- 2024-02-06: Initial documentation
