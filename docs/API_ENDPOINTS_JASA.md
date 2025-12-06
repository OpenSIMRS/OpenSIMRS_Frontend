# API Endpoints - Modul Jasa Pelayanan

Dokumentasi endpoint API yang digunakan atau dibutuhkan untuk frontend modul Jasa Pelayanan.

## Base URL
```
/api/v1
```

## Authentication
Semua endpoint memerlukan autentikasi menggunakan Bearer Token pada header:
```
Authorization: Bearer <access_token>
```

---

## 1. Pegawai (Employee)

### GET /pegawai
Mendapatkan daftar pegawai

**Query Parameters:**
- `search` (optional): Pencarian berdasarkan nama/NIP
- `unit_id` (optional): Filter berdasarkan unit
- `jabatan` (optional): Filter berdasarkan jabatan
- `is_active` (optional): true/false
- `page` (optional): Halaman (default: 1)
- `per_page` (optional): Jumlah per halaman (default: 10)

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "peg-001",
      "nip": "12345",
      "nama": "dr. Ahmad Budiman, Sp.B",
      "unit_id": "unit-001",
      "unit_nama": "Instalasi Bedah Sentral",
      "jabatan": "Dokter Spesialis Bedah",
      "email": "ahmad.budiman@hospital.com",
      "is_active": true
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

### GET /pegawai/:id
Mendapatkan detail pegawai

**Response:**
```json
{
  "message": "Success",
  "data": {
    "id": "peg-001",
    "nip": "12345",
    "nama": "dr. Ahmad Budiman, Sp.B",
    "unit_id": "unit-001",
    "unit_nama": "Instalasi Bedah Sentral",
    "jabatan": "Dokter Spesialis Bedah",
    "email": "ahmad.budiman@hospital.com",
    "is_active": true
  }
}
```

---

## 2. Tindakan (Medical Actions/Services)

### GET /tindakan
Mendapatkan daftar tindakan

**Query Parameters:**
- `search` (optional): Pencarian berdasarkan kode/nama
- `kategori_id` (optional): Filter berdasarkan kategori
- `is_active` (optional): true/false
- `page` (optional): Halaman
- `per_page` (optional): Jumlah per halaman

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "tind-001",
      "kode": "APD-001",
      "nama": "Operasi Appendektomi",
      "kategori_id": "kat-001",
      "kategori_nama": "Bedah",
      "tarif": 5000000,
      "komponen_jasa": 2500000,
      "is_active": true
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

### GET /tindakan/:id
Mendapatkan detail tindakan

---

## 3. Kategori Tindakan

### GET /kategori-tindakan
Mendapatkan daftar kategori tindakan

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "kat-001",
      "kode": "BDH",
      "nama": "Bedah",
      "is_active": true
    }
  ]
}
```

---

## 4. Formula Jasa

### GET /jasa/formula
Mendapatkan daftar formula jasa

**Query Parameters:**
- `kategori_tindakan_id` (optional): Filter berdasarkan kategori
- `is_active` (optional): true/false
- `tanggal` (optional): Tanggal berlaku (YYYY-MM-DD)

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "form-001",
      "kode": "FORM-BDH-01",
      "nama": "Formula Jasa Bedah Umum",
      "kategori_tindakan_id": "kat-001",
      "komponen_jasa_medis": 50,
      "komponen_jasa_sarana": 30,
      "komponen_jasa_rs": 20,
      "is_active": true,
      "tanggal_berlaku": "2025-01-01",
      "tanggal_berakhir": null,
      "created_at": "2024-12-01T10:00:00Z",
      "updated_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

### POST /jasa/formula
Membuat formula jasa baru

**Request Body:**
```json
{
  "kode": "FORM-BDH-02",
  "nama": "Formula Jasa Bedah Khusus",
  "kategori_tindakan_id": "kat-001",
  "komponen_jasa_medis": 55,
  "komponen_jasa_sarana": 25,
  "komponen_jasa_rs": 20,
  "tanggal_berlaku": "2025-02-01",
  "distribusi": [
    {
      "peran": "OPERATOR",
      "persentase": 60
    },
    {
      "peran": "ASISTEN_1",
      "persentase": 20
    },
    {
      "peran": "ANESTESI",
      "persentase": 15
    },
    {
      "peran": "PERAWAT",
      "persentase": 5
    }
  ]
}
```

**Response:**
```json
{
  "message": "Formula created successfully",
  "data": {
    "id": "form-003",
    "kode": "FORM-BDH-02",
    ...
  }
}
```

### PUT /jasa/formula/:id
Update formula jasa

### DELETE /jasa/formula/:id
Hapus formula jasa (soft delete - set is_active = false)

### GET /jasa/formula/:id/distribusi
Mendapatkan distribusi formula per peran

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "dist-001",
      "formula_id": "form-001",
      "peran": "OPERATOR",
      "persentase": 60,
      "is_active": true,
      "created_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

---

## 5. Pelaksana Tindakan

### POST /jasa/pelaksana
Input pelaksana tindakan

**Request Body:**
```json
{
  "billing_detail_id": "bill-det-001",
  "tindakan_id": "tind-001",
  "pelaksana": [
    {
      "pegawai_id": "peg-001",
      "peran": "OPERATOR",
      "persentase": 60
    },
    {
      "pegawai_id": "peg-004",
      "peran": "ASISTEN_1",
      "persentase": 20
    },
    {
      "pegawai_id": "peg-005",
      "peran": "PERAWAT",
      "persentase": 20
    }
  ]
}
```

**Response:**
```json
{
  "message": "Pelaksana saved successfully",
  "data": [
    {
      "id": "pel-001",
      "billing_detail_id": "bill-det-001",
      "tindakan_id": "tind-001",
      "pegawai_id": "peg-001",
      "peran": "OPERATOR",
      "persentase": 60,
      "nilai_jasa": 1500000,
      "status": "PENDING",
      "created_at": "2025-01-05T10:00:00Z",
      "updated_at": "2025-01-05T10:00:00Z",
      "created_by": "user-001"
    }
  ]
}
```

### GET /jasa/pelaksana/billing/:billing_detail_id
Mendapatkan pelaksana berdasarkan billing detail

### PUT /jasa/pelaksana/:id
Update pelaksana (memerlukan approval jika billing sudah closed)

---

## 6. Periode Jasa

### GET /jasa/periode
Mendapatkan daftar periode jasa

**Query Parameters:**
- `tahun` (optional): Filter tahun
- `bulan` (optional): Filter bulan
- `status` (optional): OPEN | CALCULATING | CLOSED | PAID

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "per-001",
      "tahun": 2025,
      "bulan": 1,
      "tanggal_mulai": "2025-01-01",
      "tanggal_akhir": "2025-01-31",
      "status": "CALCULATING",
      "closed_by": null,
      "closed_at": null,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### POST /jasa/periode/close
Tutup periode jasa

**Request Body:**
```json
{
  "periode_id": "per-001"
}
```

---

## 7. Kalkulasi Jasa

### POST /jasa/kalkulasi
Hitung jasa untuk periode tertentu

**Request Body:**
```json
{
  "periode_tahun": 2025,
  "periode_bulan": 1,
  "unit_id": "unit-001",
  "pegawai_id": "peg-001"
}
```

**Response:**
```json
{
  "message": "Calculation completed",
  "data": {
    "preview": [
      {
        "nip": "12345",
        "nama": "dr. Ahmad Budiman, Sp.B",
        "unit": "Instalasi Bedah Sentral",
        "jasa_medis": 15000000,
        "jasa_keperawatan": 0,
        "jasa_lainnya": 0,
        "total": 15000000
      }
    ],
    "summary": {
      "total_pegawai": 150,
      "total_jasa": 500000000
    }
  }
}
```

### GET /jasa/kalkulasi/preview
Preview kalkulasi sebelum disimpan

**Query Parameters:**
- `periode_tahun`: Tahun
- `periode_bulan`: Bulan
- `unit_id` (optional): Filter unit
- `pegawai_id` (optional): Filter pegawai

---

## 8. Akumulasi Jasa

### GET /jasa/akumulasi
Mendapatkan daftar akumulasi jasa

**Query Parameters:**
- `periode_tahun`: Tahun
- `periode_bulan`: Bulan
- `pegawai_id` (optional): Filter pegawai
- `unit_id` (optional): Filter unit
- `status` (optional): DRAFT | APPROVED | PAID

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "akum-001",
      "pegawai_id": "peg-001",
      "periode_tahun": 2025,
      "periode_bulan": 1,
      "total_jasa_medis": 15000000,
      "total_jasa_keperawatan": 0,
      "total_jasa_lainnya": 0,
      "grand_total": 15000000,
      "potongan_pajak": 750000,
      "potongan_lainnya": 0,
      "netto": 14250000,
      "status": "DRAFT",
      "approved_by": null,
      "approved_at": null,
      "paid_at": null,
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "total_count": 150,
    "total_page": 15,
    "page": 1,
    "count": 10
  }
}
```

### GET /jasa/akumulasi/:id
Mendapatkan detail akumulasi jasa

### GET /jasa/akumulasi/:id/detail
Mendapatkan detail rincian jasa

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "akum-det-001",
      "akumulasi_id": "akum-001",
      "pelaksana_id": "pel-001",
      "tanggal": "2025-01-05",
      "billing_id": "bill-001",
      "pasien_nama": "Budi Santoso",
      "tindakan_nama": "Operasi Appendektomi",
      "peran": "Operator Utama",
      "nilai_jasa": 2500000,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### POST /jasa/akumulasi/approve
Approve akumulasi jasa

**Request Body:**
```json
{
  "akumulasi_ids": ["akum-001", "akum-002"]
}
```

### POST /jasa/akumulasi/reject
Reject akumulasi jasa

**Request Body:**
```json
{
  "akumulasi_id": "akum-001",
  "reason": "Data tidak sesuai"
}
```

---

## 9. Slip Jasa

### GET /jasa/slip/:pegawai_id
Mendapatkan slip jasa individual

**Query Parameters:**
- `tahun`: Tahun
- `bulan`: Bulan

**Response:**
```json
{
  "message": "Success",
  "data": {
    "pegawai": {
      "nip": "12345",
      "nama": "dr. Ahmad Budiman, Sp.B",
      "unit": "Instalasi Bedah Sentral"
    },
    "periode": {
      "tahun": 2025,
      "bulan": 1,
      "bulan_nama": "Januari"
    },
    "rincian": [
      {
        "tanggal": "2025-01-05",
        "tindakan": "Operasi Appendektomi",
        "pasien": "Budi Santoso",
        "rm": "RM-001",
        "nilai": 2500000
      }
    ],
    "total_bruto": 15000000,
    "potongan_pajak": 750000,
    "potongan_lainnya": 0,
    "total_netto": 14250000
  }
}
```

### GET /jasa/slip/:pegawai_id/download
Download slip jasa dalam format PDF

---

## 10. Laporan Jasa

### GET /jasa/laporan/unit
Laporan jasa per unit

**Query Parameters:**
- `tahun`: Tahun
- `bulan`: Bulan
- `unit_id`: ID Unit

**Response:**
```json
{
  "message": "Success",
  "data": {
    "unit_id": "unit-001",
    "unit_nama": "Instalasi Bedah Sentral",
    "periode": {
      "tahun": 2025,
      "bulan": 1
    },
    "data": [
      {
        "nama": "dr. Ahmad Budiman, Sp.B",
        "jabatan": "Dokter Spesialis Bedah",
        "jumlah_tindakan": 25,
        "total_jasa": 15000000
      }
    ],
    "summary": {
      "total_jasa": 20000000,
      "rata_rata": 6666666,
      "top_performer": "dr. Ahmad Budiman, Sp.B"
    }
  }
}
```

### GET /jasa/laporan/ringkasan
Laporan ringkasan jasa

**Query Parameters:**
- `tahun`: Tahun
- `bulan`: Bulan
- `format` (optional): excel | pdf

---

## 11. Dashboard Jasa

### GET /jasa/dashboard
Mendapatkan data dashboard jasa

**Query Parameters:**
- `tahun` (optional): Tahun (default: tahun sekarang)
- `bulan` (optional): Bulan (default: bulan sekarang)

**Response:**
```json
{
  "message": "Success",
  "data": {
    "total_bulan_ini": 31000000,
    "perbandingan_bulan_lalu": {
      "nilai": 28000000,
      "persentase": 10.71
    },
    "top_penerima": [
      {
        "nama": "dr. Ahmad Budiman, Sp.B",
        "unit": "Instalasi Bedah Sentral",
        "total": 15000000
      }
    ],
    "distribusi_unit": [
      {
        "unit": "Instalasi Bedah Sentral",
        "total": 20000000
      }
    ],
    "trend_12_bulan": [
      {
        "bulan": "Jan 2025",
        "tahun": 2025,
        "total": 31000000
      }
    ]
  }
}
```

---

## Error Responses

Semua endpoint dapat mengembalikan error dengan format:

```json
{
  "message": "Error message",
  "errors": {
    "field_name": ["Error detail"]
  }
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Unprocessable Entity
- `500`: Internal Server Error

---

## Notes

1. Semua tanggal menggunakan format ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
2. Semua nilai uang dalam satuan Rupiah (tanpa desimal)
3. Pagination menggunakan parameter `page` dan `per_page`
4. Soft delete digunakan untuk semua data (is_active = false)
5. Audit trail dicatat di semua operasi (created_by, updated_by, created_at, updated_at)
