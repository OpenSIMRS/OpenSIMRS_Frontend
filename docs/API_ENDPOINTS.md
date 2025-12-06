# API Endpoint Documentation

Dokumentasi lengkap untuk semua API endpoints yang digunakan dalam aplikasi OpenSIMRS Frontend.

## Base URL

```
Development: http://localhost:3000
Production: [TBD]
```

## Authentication

Semua endpoint (kecuali `/auth/login` dan `/auth/refresh`) memerlukan Bearer token di header:

```
Authorization: Bearer {accessToken}
```

**Note**: Untuk pengembangan lokal, auth dapat di-disable sementara dengan mengubah konfigurasi di `axios-instance.ts`. Struktur auth tetap dipertahankan untuk memudahkan aktivasi kembali di masa depan.

---

## Table of Contents

1. [Authentication](#authentication-endpoints)
2. [Master Data](#master-data-endpoints)
3. [Pendaftaran & Admisi](#pendaftaran--admisi-endpoints)
4. [EMR (Electronic Medical Record)](#emr-endpoints)
5. [Laboratorium](#laboratorium-endpoints)
6. [Radiologi](#radiologi-endpoints)
7. [Farmasi/Apotek](#farmasi-endpoints)
8. [Billing & Kasir](#billing-endpoints)
9. [Jasa Pelayanan](#jasa-pelayanan-endpoints)
10. [Dashboard & Laporan](#dashboard--laporan-endpoints)

---

## Authentication Endpoints

### POST /v1/auth/login

Login dan mendapatkan access token dan refresh token.

**Request Body:**

```typescript
{
	email: string;
	password: string;
}
```

**Response:**

```typescript
{
	message: string;
	data: {
		accessToken: string;
		refreshToken: string;
	}
}
```

**Status Codes:**

- `200` - Login berhasil
- `401` - Email atau password salah
- `422` - Validasi gagal

**Example:**

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@hospital.com", "password": "password123"}'
```

---

### POST /v1/auth/refresh

Refresh access token menggunakan refresh token.

**Request Body:**

```typescript
{
	refreshToken: string;
}
```

**Response:**

```typescript
{
	message: string;
	data: {
		accessToken: string;
	}
}
```

**Status Codes:**

- `200` - Refresh berhasil
- `401` - Refresh token tidak valid atau expired

---

### GET /v1/auth/me

Mendapatkan informasi user yang sedang login.

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response:**

```typescript
{
	message: string;
	data: {
		ID: string;
		Email: string;
		Name: string;
		Role: string;
		CreatedAt: string;
		UpdatedAt: string;
		DeletedAt: string | null;
	}
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized

---

### POST /v1/auth/logout

Logout dan invalidate refresh token.

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Status Codes:**

- `200` - Logout berhasil
- `401` - Unauthorized

**Note**: Endpoint ini dapat di-disable untuk development lokal.

---

## Master Data Endpoints

### Patients (Pasien)

#### GET /v1/master/patients

Mendapatkan daftar pasien dengan pagination.

**Query Parameters:**

```typescript
{
  page?: number;        // default: 1
  perPage?: number;     // default: 10, max: 100
  search?: string;      // Search by NoRM, NIK, or Nama
  sortBy?: string;      // default: "CreatedAt"
  sortOrder?: "ASC" | "DESC";  // default: "DESC"
}
```

**Response:**

```typescript
{
  message: string;
  data: Patient[];
  meta: {
    total_count: number;
    total_page: number;
    page: number;
    count: number;
  }
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `422` - Validasi parameter gagal

---

#### GET /v1/master/patients/:id

Mendapatkan detail pasien berdasarkan ID.

**Path Parameters:**

- `id` - Patient ID

**Response:**

```typescript
{
	message: string;
	data: Patient;
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `404` - Patient tidak ditemukan

---

#### POST /v1/master/patients

Membuat pasien baru.

**Request Body:**

```typescript
{
  NIK: string;
  Nama: string;
  TanggalLahir: string;  // ISO 8601 format
  JenisKelamin: "L" | "P";
  Alamat: string;
  NoTelepon: string;
  Email?: string;
  Agama: string;
  Pekerjaan: string;
  StatusPerkawinan: string;
  GolonganDarah?: string;
  Alergi?: string[];
  NomorKartuBPJS?: string;
  NomorKartuAsuransi?: string;
}
```

**Response:**

```typescript
{
	message: string;
	data: Patient;
}
```

**Status Codes:**

- `201` - Patient created
- `401` - Unauthorized
- `422` - Validasi gagal

---

#### PUT /v1/master/patients/:id

Update data pasien.

**Path Parameters:**

- `id` - Patient ID

**Request Body:**

```typescript
{
	// Same as POST, all fields optional
}
```

**Response:**

```typescript
{
	message: string;
	data: Patient;
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `404` - Patient tidak ditemukan
- `422` - Validasi gagal

---

#### DELETE /v1/master/patients/:id

Soft delete pasien (set DeletedAt).

**Path Parameters:**

- `id` - Patient ID

**Response:**

```typescript
{
	message: string;
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `404` - Patient tidak ditemukan

---

### Employees (Pegawai)

#### GET /v1/master/employees

Mendapatkan daftar pegawai dengan pagination.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  search?: string;      // Search by NIP or Nama
  unit?: string;        // Filter by Unit
  jabatan?: string;     // Filter by Jabatan
  status?: "Aktif" | "Nonaktif";
}
```

**Response:**

```typescript
{
  message: string;
  data: Employee[];
  meta: PaginatedMeta;
}
```

---

#### GET /v1/master/employees/:id

Mendapatkan detail pegawai.

**Path Parameters:**

- `id` - Employee ID

**Response:**

```typescript
{
	message: string;
	data: Employee;
}
```

---

#### POST /v1/master/employees

Membuat pegawai baru.

**Request Body:**

```typescript
{
  NIP: string;
  Nama: string;
  JenisKelamin: "L" | "P";
  TanggalLahir: string;
  Jabatan: string;
  Unit: string;
  NoTelepon: string;
  Email: string;
  Status: "Aktif" | "Nonaktif";
  PersentaseJP?: number;
}
```

**Response:**

```typescript
{
	message: string;
	data: Employee;
}
```

---

#### PUT /v1/master/employees/:id

Update data pegawai.

**Path Parameters:**

- `id` - Employee ID

**Request Body:** Same as POST, all fields optional

**Response:**

```typescript
{
	message: string;
	data: Employee;
}
```

---

#### DELETE /v1/master/employees/:id

Soft delete pegawai.

**Path Parameters:**

- `id` - Employee ID

**Response:**

```typescript
{
	message: string;
}
```

---

### ICD-10 (Diagnosis Codes)

#### GET /v1/master/icd10

Mendapatkan daftar ICD-10 dengan pagination.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  search?: string;      // Search by Kode or Deskripsi
  kategori?: string;    // Filter by KategoriUtama
  status?: "Aktif" | "Nonaktif";
}
```

**Response:**

```typescript
{
  message: string;
  data: ICD10[];
  meta: PaginatedMeta;
}
```

---

#### GET /v1/master/icd10/:id

Mendapatkan detail ICD-10.

**Response:**

```typescript
{
	message: string;
	data: ICD10;
}
```

---

### ICD-9 CM (Procedure Codes)

#### GET /v1/master/icd9cm

Mendapatkan daftar ICD-9 CM dengan pagination.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  search?: string;
  kategori?: string;
  status?: "Aktif" | "Nonaktif";
}
```

**Response:**

```typescript
{
  message: string;
  data: ICD9CM[];
  meta: PaginatedMeta;
}
```

---

### Ruangan

#### GET /v1/master/ruangan

Mendapatkan daftar ruangan.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  search?: string;
  jenisRuangan?: "Poliklinik" | "Lab" | "Radiologi" | "Farmasi" | "IGD" | "Rawat Inap" | "Lainnya";
  status?: "Aktif" | "Nonaktif";
}
```

**Response:**

```typescript
{
  message: string;
  data: Ruangan[];
  meta: PaginatedMeta;
}
```

---

#### POST /v1/master/ruangan

Membuat ruangan baru.

**Request Body:**

```typescript
{
  KodeRuangan: string;
  NamaRuangan: string;
  JenisRuangan: "Poliklinik" | "Lab" | "Radiologi" | "Farmasi" | "IGD" | "Rawat Inap" | "Lainnya";
  Lantai?: number;
  Gedung?: string;
  Status: "Aktif" | "Nonaktif";
}
```

---

### Barang (Obat/Alkes/BHP)

#### GET /v1/master/barang

Mendapatkan daftar barang.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  search?: string;
  jenisBarang?: "Obat" | "Alkes" | "BHP";
  status?: "Aktif" | "Nonaktif";
}
```

**Response:**

```typescript
{
  message: string;
  data: Barang[];
  meta: PaginatedMeta;
}
```

---

#### GET /v1/master/barang/:id

Mendapatkan detail barang.

**Response:**

```typescript
{
	message: string;
	data: Barang;
}
```

---

#### POST /v1/master/barang

Membuat barang baru.

**Request Body:**

```typescript
{
  KodeBarang: string;
  NamaBarang: string;
  JenisBarang: "Obat" | "Alkes" | "BHP";
  Satuan: string;
  HargaBeli: number;
  HargaJual: number;
  StokMinimal: number;
  StokAktual: number;
  TanggalKadaluarsa?: string;
  NoBatch?: string;
  Status: "Aktif" | "Nonaktif";
}
```

---

#### PUT /v1/master/barang/:id

Update data barang.

**Request Body:** Same as POST, all fields optional

---

#### DELETE /v1/master/barang/:id

Soft delete barang.

---

### Penjamin (Insurance/Guarantor)

#### GET /v1/master/penjamin

Mendapatkan daftar penjamin.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  search?: string;
  jenisPenjamin?: "BPJS" | "Asuransi Swasta" | "Perusahaan" | "Umum";
  status?: "Aktif" | "Nonaktif";
}
```

**Response:**

```typescript
{
  message: string;
  data: Penjamin[];
  meta: PaginatedMeta;
}
```

---

## Pendaftaran & Admisi Endpoints

### Kunjungan (Visits)

#### GET /v1/pendaftaran/kunjungan

Mendapatkan daftar kunjungan.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  tanggalAwal?: string;  // ISO 8601 date
  tanggalAkhir?: string;
  jenisKunjungan?: "Rawat Jalan" | "IGD" | "Rawat Inap";
  statusKunjungan?: "Terdaftar" | "Sedang Dilayani" | "Selesai" | "Batal";
  pasienID?: string;
}
```

**Response:**

```typescript
{
  message: string;
  data: Kunjungan[];
  meta: PaginatedMeta;
}
```

---

#### GET /v1/pendaftaran/kunjungan/:id

Mendapatkan detail kunjungan.

**Response:**

```typescript
{
	message: string;
	data: Kunjungan;
}
```

---

#### POST /v1/pendaftaran/kunjungan

Membuat kunjungan baru (pendaftaran).

**Request Body:**

```typescript
{
  PasienID: string;
  TanggalKunjungan: string;
  JenisKunjungan: "Rawat Jalan" | "IGD" | "Rawat Inap";
  PenjaminID: string;
  KelasPelayanan: "VIP" | "Kelas 1" | "Kelas 2" | "Kelas 3" | "Umum";
  PoliTujuan?: string;    // For Rawat Jalan
  DokterID?: string;
}
```

**Response:**

```typescript
{
  message: string;
  data: Kunjungan & {
    NomorAntrian?: number;
  };
}
```

---

#### PUT /v1/pendaftaran/kunjungan/:id

Update status kunjungan.

**Request Body:**

```typescript
{
  StatusKunjungan?: "Terdaftar" | "Sedang Dilayani" | "Selesai" | "Batal";
  WaktuSelesai?: string;
}
```

---

### Antrian (Queue)

#### GET /v1/pendaftaran/antrian

Mendapatkan antrian per poli.

**Query Parameters:**

```typescript
{
  poliID: string;
  tanggal: string;  // ISO 8601 date
  status?: "Menunggu" | "Dipanggil" | "Dilayani" | "Selesai" | "Batal";
}
```

**Response:**

```typescript
{
  message: string;
  data: Antrian[];
}
```

---

#### POST /v1/pendaftaran/antrian/:id/panggil

Panggil antrian.

**Path Parameters:**

- `id` - Antrian ID

**Response:**

```typescript
{
	message: string;
	data: Antrian;
}
```

---

## EMR Endpoints

### EMR Records

#### GET /v1/emr/records

Mendapatkan daftar EMR records.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  pasienID?: string;
  kunjunganID?: string;
  tanggalAwal?: string;
  tanggalAkhir?: string;
  status?: "Draft" | "Verified" | "Finalized";
}
```

**Response:**

```typescript
{
  message: string;
  data: EMRRecord[];
  meta: PaginatedMeta;
}
```

---

#### GET /v1/emr/records/:id

Mendapatkan detail EMR record.

**Response:**

```typescript
{
	message: string;
	data: EMRRecord;
}
```

---

#### POST /v1/emr/records

Membuat EMR record baru.

**Request Body:**

```typescript
{
  KunjunganID: string;
  PasienID: string;
  DokterID: string;
  TanggalPemeriksaan: string;
  Subjective: string;
  Objective: string;
  Assessment: string;
  Plan: string;
  TekananDarah?: string;
  Nadi?: number;
  Suhu?: number;
  RespirasiRate?: number;
  BeratBadan?: number;
  TinggiBadan?: number;
  Alergi?: string[];
  RiwayatPenyakit?: string;
  RiwayatPengobatan?: string;
  DiagnosisUtama?: string;        // ICD-10 ID
  DiagnosisSekunder?: string[];   // Array of ICD-10 IDs
  ProsedurUtama?: string;         // ICD-9 CM ID
  ProsedurSekunder?: string[];    // Array of ICD-9 CM IDs
  Status: "Draft" | "Verified" | "Finalized";
}
```

**Response:**

```typescript
{
	message: string;
	data: EMRRecord;
}
```

---

#### PUT /v1/emr/records/:id

Update EMR record.

**Request Body:** Same as POST, all fields optional

---

### E-Resep (Electronic Prescription)

#### GET /v1/emr/resep

Mendapatkan daftar resep.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  kunjunganID?: string;
  dokterID?: string;
  status?: "Pending" | "Diproses" | "Selesai" | "Batal";
  tanggalAwal?: string;
  tanggalAkhir?: string;
}
```

**Response:**

```typescript
{
  message: string;
  data: Resep[];
  meta: PaginatedMeta;
}
```

---

#### POST /v1/emr/resep

Membuat resep baru.

**Request Body:**

```typescript
{
  EMRRecordID: string;
  KunjunganID: string;
  DokterID: string;
  TanggalResep: string;
  Catatan?: string;
  Items: Array<{
    ObatID: string;
    Jumlah: number;
    Satuan: string;
    Dosis: string;
    Frekuensi: string;
    Durasi: string;
    Rute: string;
    Instruksi?: string;
  }>;
}
```

**Response:**

```typescript
{
  message: string;
  data: Resep & {
    Items: ResepItem[];
  };
}
```

---

### Order Penunjang (Lab/Radiology Order)

#### POST /v1/emr/order-penunjang

Membuat order penunjang (Lab atau Radiologi).

**Request Body:**

```typescript
{
  EMRRecordID: string;
  KunjunganID: string;
  JenisOrder: "Lab" | "Radiologi";
  DokterPengirim: string;
  Catatan?: string;
  Items: Array<{
    ItemID: string;        // Lab Test ID or Radiology Exam ID
    NamaItem: string;
    Instruksi?: string;
  }>;
}
```

**Response:**

```typescript
{
  message: string;
  data: OrderPenunjang & {
    Items: OrderPenunjangItem[];
  };
}
```

---

## Laboratorium Endpoints

### Order Lab

#### GET /v1/lab/orders

Mendapatkan daftar order lab.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  status?: "Pending" | "Sampel Diambil" | "Diproses" | "Selesai" | "Batal";
  tanggalAwal?: string;
  tanggalAkhir?: string;
  pasienID?: string;
}
```

**Response:**

```typescript
{
  message: string;
  data: OrderLab[];
  meta: PaginatedMeta;
}
```

---

#### GET /v1/lab/orders/:id

Mendapatkan detail order lab.

**Response:**

```typescript
{
  message: string;
  data: OrderLab & {
    Items: OrderLabItem[];
    Sampel?: SampelLab;
    Hasil?: HasilLab[];
  };
}
```

---

#### POST /v1/lab/sampel

Input sampel lab.

**Request Body:**

```typescript
{
  OrderLabID: string;
  NomorSampel: string;
  JenisSampel: string;
  WaktuPengambilan: string;
  PetugasPengambil: string;  // Employee ID
  KondisiSampel: "Baik" | "Hemolisis" | "Lipemik" | "Ikterik" | "Rusak";
  Catatan?: string;
}
```

---

#### POST /v1/lab/hasil

Input hasil lab.

**Request Body:**

```typescript
{
  OrderLabItemID: string;
  NilaiHasil: string;
  Satuan: string;
  NilaiNormal: string;
  Keterangan?: "Normal" | "Tinggi" | "Rendah";
  MetodeTest?: string;
  TanggalPemeriksaan: string;
  AnalisID: string;  // Employee ID
  Status: "Draft" | "Validated";
}
```

---

#### POST /v1/lab/validasi

Validasi hasil lab.

**Request Body:**

```typescript
{
  OrderLabID: string;
  ValidatorID: string;  // Employee ID
  TanggalValidasi: string;
  Catatan?: string;
}
```

---

## Radiologi Endpoints

### Order Radiologi

#### GET /v1/radiologi/orders

Mendapatkan daftar order radiologi.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  status?: "Pending" | "Dijadwalkan" | "Diproses" | "Selesai" | "Batal";
  tanggalAwal?: string;
  tanggalAkhir?: string;
  pasienID?: string;
}
```

**Response:**

```typescript
{
  message: string;
  data: OrderRadiologi[];
  meta: PaginatedMeta;
}
```

---

#### GET /v1/radiologi/orders/:id

Mendapatkan detail order radiologi.

**Response:**

```typescript
{
  message: string;
  data: OrderRadiologi & {
    Items: OrderRadiologiItem[];
    Gambar?: GambarRadiologi[];
    Expertise?: ExpertiseRadiologi;
  };
}
```

---

#### POST /v1/radiologi/jadwal

Jadwalkan pemeriksaan radiologi.

**Request Body:**

```typescript
{
	OrderRadiologiItemID: string;
	JadwalPemeriksaan: string; // ISO 8601 datetime
}
```

---

#### POST /v1/radiologi/gambar

Upload gambar radiologi (PACS).

**Request Body:**

```typescript
{
  OrderRadiologiItemID: string;
  URLGambar: string;
  ThumbnailURL?: string;
  TipeGambar: string;  // e.g., "DICOM", "JPEG"
  UkuranFile: number;
  Keterangan?: string;
  TanggalUpload: string;
}
```

---

#### POST /v1/radiologi/expertise

Membuat expertise radiologi.

**Request Body:**

```typescript
{
  OrderRadiologiID: string;
  RadiologID: string;  // Employee ID
  TanggalExpertise: string;
  Deskripsi: string;
  Kesimpulan: string;
  Saran?: string;
  Status: "Draft" | "Finalized";
}
```

---

## Farmasi Endpoints

### Resep Farmasi

#### GET /v1/farmasi/resep

Mendapatkan daftar resep farmasi.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  status?: "Pending" | "Verifikasi" | "Disiapkan" | "Diserahkan" | "Batal";
  tanggalAwal?: string;
  tanggalAkhir?: string;
  pasienID?: string;
}
```

**Response:**

```typescript
{
  message: string;
  data: ResepFarmasi[];
  meta: PaginatedMeta;
}
```

---

#### GET /v1/farmasi/resep/:id

Mendapatkan detail resep farmasi.

**Response:**

```typescript
{
  message: string;
  data: ResepFarmasi & {
    Items: ItemResepFarmasi[];
  };
}
```

---

#### POST /v1/farmasi/verifikasi

Verifikasi resep.

**Request Body:**

```typescript
{
  ResepFarmasiID: string;
  ApotekerID: string;
  TanggalVerifikasi: string;
  StatusVerifikasi: "Disetujui" | "Ditolak" | "Revisi";
  Catatan?: string;
  InteraksiObat?: string;
  PeringatanAlergi?: string;
}
```

---

#### POST /v1/farmasi/penyerahan

Penyerahan obat ke pasien.

**Request Body:**

```typescript
{
  ResepFarmasiID: string;
  PetugasPenyerah: string;  // Employee ID
  TanggalPenyerahan: string;
  PenerimaNama: string;
  PenerimaHubungan: string;  // e.g., "Pasien", "Keluarga"
  TandaTanganPenerima?: string;
  Catatan?: string;
}
```

---

### Stok Obat

#### GET /v1/farmasi/stok

Mendapatkan stok obat.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  obatID?: string;
  status?: "Tersedia" | "Kadaluarsa" | "Habis";
}
```

**Response:**

```typescript
{
  message: string;
  data: StokObat[];
  meta: PaginatedMeta;
}
```

---

#### POST /v1/farmasi/mutasi-stok

Catat mutasi stok.

**Request Body:**

```typescript
{
  ObatID: string;
  BatchNumber: string;
  JenisMutasi: "Masuk" | "Keluar" | "Retur" | "Adjustment";
  Jumlah: number;
  TanggalMutasi: string;
  ReferensiID?: string;
  Keterangan?: string;
  PetugasID: string;
  StokSebelum: number;
  StokSesudah: number;
}
```

---

## Billing Endpoints

### Billing/Invoice

#### GET /v1/billing/invoices

Mendapatkan daftar billing.

**Query Parameters:**

```typescript
{
  page?: number;
  perPage?: number;
  status?: "Draft" | "Final" | "Lunas" | "Piutang" | "Batal";
  tanggalAwal?: string;
  tanggalAkhir?: string;
  pasienID?: string;
  kunjunganID?: string;
}
```

**Response:**

```typescript
{
  message: string;
  data: Billing[];
  meta: PaginatedMeta;
}
```

---

#### GET /v1/billing/invoices/:id

Mendapatkan detail billing.

**Response:**

```typescript
{
  message: string;
  data: Billing & {
    Items: ItemBilling[];
    Pembayaran?: Pembayaran[];
  };
}
```

---

#### POST /v1/billing/invoices

Membuat billing baru.

**Request Body:**

```typescript
{
	KunjunganID: string;
	PasienID: string;
	PenjaminID: string;
	TanggalBilling: string;
	Items: Array<{
		JenisItem: 'Tindakan' | 'Obat' | 'Alkes' | 'BHP' | 'Kamar' | 'Konsultasi' | 'Lainnya';
		ItemID: string;
		NamaItem: string;
		Jumlah: number;
		HargaSatuan: number;
		Diskon: number;
		TanggalLayanan: string;
		DokterPelaksana?: string;
		RuanganID?: string;
		Catatan?: string;
	}>;
}
```

---

#### POST /v1/billing/pembayaran

Proses pembayaran.

**Request Body:**

```typescript
{
  BillingID: string;
  TanggalPembayaran: string;
  MetodePembayaran: "Tunai" | "Kartu Debit" | "Kartu Kredit" | "Transfer" | "QRIS";
  JumlahBayar: number;
  NomorReferensi?: string;
  KasirID: string;
  Catatan?: string;
}
```

---

#### POST /v1/billing/retur

Retur item billing.

**Request Body:**

```typescript
{
  BillingID: string;
  ItemBillingID: string;
  TanggalRetur: string;
  JumlahRetur: number;
  AlasanRetur: string;
  DisetujuiOleh: string;  // Employee ID
  Catatan?: string;
}
```

---

## Jasa Pelayanan Endpoints

### Jasa Pelayanan

#### GET /v1/jasa-pelayanan/perhitungan

Mendapatkan perhitungan JP per periode.

**Query Parameters:**

```typescript
{
  periodeID?: string;
  pegawaiID?: string;
  tanggalAwal?: string;
  tanggalAkhir?: string;
}
```

**Response:**

```typescript
{
  message: string;
  data: RekapitulasiJP[];
}
```

---

#### POST /v1/jasa-pelayanan/periode

Buat periode JP baru.

**Request Body:**

```typescript
{
	NamaPeriode: string;
	TanggalMulai: string;
	TanggalSelesai: string;
}
```

---

#### POST /v1/jasa-pelayanan/hitung

Hitung JP untuk periode tertentu.

**Request Body:**

```typescript
{
	PeriodeJPID: string;
}
```

---

#### POST /v1/jasa-pelayanan/pembayaran

Proses pembayaran JP.

**Request Body:**

```typescript
{
  RekapitulasiJPID: string;
  TanggalPembayaran: string;
  JumlahBayar: number;
  MetodePembayaran: "Transfer" | "Tunai";
  NomorReferensi?: string;
  DiprosesOleh: string;  // Employee ID
  Catatan?: string;
}
```

---

## Dashboard & Laporan Endpoints

### Dashboard Metrics

#### GET /v1/dashboard/metrics

Mendapatkan metrics dashboard.

**Query Parameters:**

```typescript
{
  tanggal?: string;  // Default: today
}
```

**Response:**

```typescript
{
	message: string;
	data: DashboardMetrics;
}
```

---

### Laporan

#### GET /v1/laporan/kunjungan

Laporan kunjungan.

**Query Parameters:**

```typescript
{
	tanggalAwal: string;
	tanggalAkhir: string;
}
```

**Response:**

```typescript
{
	message: string;
	data: LaporanKunjungan;
}
```

---

#### GET /v1/laporan/pendapatan

Laporan pendapatan.

**Query Parameters:**

```typescript
{
	tanggalAwal: string;
	tanggalAkhir: string;
}
```

**Response:**

```typescript
{
	message: string;
	data: LaporanPendapatan;
}
```

---

#### GET /v1/laporan/top-penyakit

Top 10 penyakit.

**Query Parameters:**

```typescript
{
  periode: string;  // e.g., "2024-12"
  limit?: number;   // default: 10
}
```

**Response:**

```typescript
{
  message: string;
  data: TopPenyakit[];
}
```

---

#### GET /v1/laporan/stok

Laporan stok.

**Response:**

```typescript
{
	message: string;
	data: LaporanStok;
}
```

---

## Error Responses

Semua endpoint menggunakan format error yang konsisten:

```typescript
{
  message: string;
  errors?: Record<string, string[]>;  // Untuk validasi errors
}
```

**Common HTTP Status Codes:**

- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity (Validation Error)
- `500` - Internal Server Error

---

## Notes

1. **Development Mode**: Untuk development lokal, auth dapat di-disable dengan mengomentari interceptor di `axios-instance.ts`. Namun struktur auth tetap dipertahankan.

2. **Pagination**: Semua endpoint list menggunakan pagination dengan format meta yang sama.

3. **Soft Delete**: Semua operasi delete adalah soft delete (mengeset `DeletedAt`).

4. **Timezone**: Gunakan header `TZ` untuk timezone. Default: UTC.

5. **Date Format**: Semua tanggal menggunakan ISO 8601 format.

6. **Search**: Endpoint dengan parameter `search` melakukan pencarian di multiple fields yang relevan.
