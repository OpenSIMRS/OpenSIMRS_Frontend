# API Documentation (Dummy)

## Base URL
```
http://localhost:3000/api
```

> **Note**: This is currently using dummy data with local JSON files. All endpoints below are documented for future backend integration.

---

## Authentication

### POST /v1/auth/login
Login to the system

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### POST /v1/auth/refresh
Refresh access token

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "message": "Token refreshed",
  "data": {
    "accessToken": "string"
  }
}
```

### GET /v1/auth/me
Get current user info

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "message": "User info retrieved",
  "data": {
    "ID": "string",
    "Email": "string",
    "Name": "string",
    "Role": "string",
    "CreatedAt": "string",
    "UpdatedAt": "string",
    "DeletedAt": null
  }
}
```

---

## Master Data - Lookup

### GET /api/master/lookup
Get all lookup data or filter by category

**Query Parameters:**
- `category` (optional): AGAMA, PENDIDIKAN, PEKERJAAN, STATUS_PERKAWINAN, GOLONGAN_DARAH, HUBUNGAN_KELUARGA

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "string",
      "value": "string",
      "category": "string"
    }
  ]
}
```

### POST /api/master/lookup
Create new lookup item

**Request Body:**
```json
{
  "value": "string",
  "category": "string"
}
```

### PUT /api/master/lookup/:id
Update lookup item

### DELETE /api/master/lookup/:id
Delete lookup item

---

## Master Data - Poli

### GET /api/master/poli
Get all poli (polyclinics)

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "string",
      "kode": "string",
      "nama": "string",
      "is_active": true,
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### GET /api/master/poli/:id
Get poli by ID

### POST /api/master/poli
Create new poli

**Request Body:**
```json
{
  "kode": "string",
  "nama": "string",
  "is_active": true
}
```

### PUT /api/master/poli/:id
Update poli

### DELETE /api/master/poli/:id
Delete poli

---

## Master Data - Dokter

### GET /api/master/dokter
Get all doctors

**Query Parameters:**
- `poli_id` (optional): Filter by poli

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "string",
      "nip": "string",
      "nama_lengkap": "string",
      "gelar_depan": "string",
      "gelar_belakang": "string",
      "spesialisasi": "string",
      "no_sip": "string",
      "poli_id": "string",
      "is_active": true,
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### POST /api/master/dokter
Create new doctor

### PUT /api/master/dokter/:id
Update doctor

### DELETE /api/master/dokter/:id
Delete doctor

---

## Master Data - Ruangan

### GET /api/master/ruangan
Get all rooms

**Query Parameters:**
- `jenis` (optional): POLI, IGD, RAWAT_INAP, PENUNJANG

### POST /api/master/ruangan
Create new room

### PUT /api/master/ruangan/:id
Update room

### DELETE /api/master/ruangan/:id
Delete room

---

## Master Data - Tindakan

### GET /api/master/tindakan
Get all medical procedures

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "string",
      "kode": "string",
      "nama": "string",
      "kategori": "string",
      "tarif": 0,
      "is_active": true,
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### POST /api/master/tindakan
Create new medical procedure

### PUT /api/master/tindakan/:id
Update medical procedure

### DELETE /api/master/tindakan/:id
Delete medical procedure

---

## Master Data - Penjamin

### GET /api/master/penjamin
Get all insurance/payment methods

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "string",
      "kode": "string",
      "nama": "string",
      "jenis": "UMUM|BPJS|ASURANSI",
      "is_active": true,
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

---

## Patient Management

### GET /api/pasien/search
Search patients

**Query Parameters:**
- `q`: Search query (nik, no_rm, nama, no_hp)

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "string",
      "no_rm": "string",
      "nik": "string",
      "nama_lengkap": "string",
      "tanggal_lahir": "string",
      "jenis_kelamin": "L|P",
      "alamat": "string",
      "no_hp": "string",
      ...
    }
  ]
}
```

### GET /api/pasien/:id
Get patient by ID

### GET /api/pasien/nik/:nik
Get patient by NIK

### GET /api/pasien/rm/:no_rm
Get patient by Medical Record Number

### POST /api/pasien
Create new patient

**Request Body:**
```json
{
  "nik": "string",
  "nama_lengkap": "string",
  "tempat_lahir": "string",
  "tanggal_lahir": "string",
  "jenis_kelamin": "L|P",
  "alamat": "string",
  "kode_wilayah": "string",
  "no_hp": "string",
  "agama_id": "string",
  "status_perkawinan_id": "string",
  "nama_ibu": "string",
  ...
}
```

**Response:**
```json
{
  "message": "Patient created successfully",
  "data": {
    "id": "string",
    "no_rm": "2501-00001",
    ...
  }
}
```

### PUT /api/pasien/:id
Update patient

### DELETE /api/pasien/:id
Delete patient

---

## Kunjungan (Visit) Management

### GET /api/kunjungan
Get all visits

**Query Parameters:**
- `status`: DAFTAR, DILAYANI, SELESAI, BATAL
- `tanggal`: ISO date string (YYYY-MM-DD)

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "string",
      "no_registrasi": "string",
      "pasien_id": "string",
      "tanggal_kunjungan": "string",
      "waktu_kunjungan": "string",
      "jenis_kunjungan": "RAJAL|IGD|RANAP",
      "poli_id": "string",
      "ruangan_id": "string",
      "dokter_id": "string",
      "penjamin_id": "string",
      "status_kunjungan": "string",
      "no_antrian": 0,
      ...
    }
  ]
}
```

### GET /api/kunjungan/:id
Get visit by ID

### GET /api/kunjungan/pasien/:pasien_id
Get all visits for a patient

### POST /api/kunjungan
Create new visit

**Request Body:**
```json
{
  "pasien_id": "string",
  "tanggal_kunjungan": "string",
  "waktu_kunjungan": "string",
  "jenis_kunjungan": "RAJAL",
  "poli_id": "string",
  "ruangan_id": "string",
  "dokter_id": "string",
  "penjamin_id": "string",
  "no_penjamin": "string",
  "keterangan": "string"
}
```

**Response:**
```json
{
  "message": "Visit created successfully",
  "data": {
    "id": "string",
    "no_registrasi": "20250107-0001",
    "no_antrian": 1,
    "status_kunjungan": "DAFTAR",
    ...
  }
}
```

### PUT /api/kunjungan/:id
Update visit

### DELETE /api/kunjungan/:id
Cancel visit

---

## EMR - Nursing Assessment

### GET /api/emr/asesmen/kunjungan/:kunjungan_id
Get nursing assessment for a visit

**Response:**
```json
{
  "message": "Success",
  "data": {
    "id": "string",
    "kunjungan_id": "string",
    "pasien_id": "string",
    "waktu_asesmen": "string",
    "keluhan_utama": "string",
    "riwayat_penyakit_sekarang": "string",
    "td_sistole": 0,
    "td_diastole": 0,
    "nadi": 0,
    "respirasi": 0,
    "suhu": 0,
    "perawat_id": "string",
    ...
  }
}
```

### POST /api/emr/asesmen
Create nursing assessment

**Request Body:**
```json
{
  "kunjungan_id": "string",
  "pasien_id": "string",
  "waktu_asesmen": "string",
  "keluhan_utama": "string",
  "riwayat_penyakit_sekarang": "string",
  "td_sistole": 120,
  "td_diastole": 80,
  "nadi": 75,
  "respirasi": 20,
  "suhu": 36.5,
  "perawat_id": "string",
  ...
}
```

### PUT /api/emr/asesmen/:id
Update nursing assessment

---

## EMR - SOAP

### GET /api/emr/soap/kunjungan/:kunjungan_id
Get all SOAP records for a visit

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "string",
      "kunjungan_id": "string",
      "pasien_id": "string",
      "tanggal_pemeriksaan": "string",
      "waktu_pemeriksaan": "string",
      "subjective": "string",
      "objective": "string",
      "assessment": "string",
      "plan": "string",
      "td_sistole": 0,
      "td_diastole": 0,
      "nadi": 0,
      "respirasi": 0,
      "suhu": 0,
      "dokter_id": "string",
      "is_dpjp": true,
      ...
    }
  ]
}
```

### POST /api/emr/soap
Create SOAP record

**Request Body:**
```json
{
  "kunjungan_id": "string",
  "pasien_id": "string",
  "tanggal_pemeriksaan": "string",
  "waktu_pemeriksaan": "string",
  "subjective": "string",
  "objective": "string",
  "assessment": "string",
  "plan": "string",
  "td_sistole": 120,
  "td_diastole": 80,
  "nadi": 75,
  "respirasi": 20,
  "suhu": 36.5,
  "dokter_id": "string",
  "is_dpjp": true
}
```

### PUT /api/emr/soap/:id
Update SOAP record

---

## Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "message": "string",
  "data": {} | [],
  "meta": {
    "total_count": 0,
    "total_page": 0,
    "page": 0,
    "count": 0
  }
}
```

**Error Response:**
```json
{
  "error": "string",
  "message": "string",
  "details": {}
}
```

---

## Status Codes

- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error
