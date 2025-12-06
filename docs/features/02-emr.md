# Modul EMR (Electronic Medical Record)

## 1. Deskripsi Umum

Modul EMR (Electronic Medical Record) adalah sistem pencatatan klinis digital yang mencatat seluruh riwayat medis pasien. Modul ini digunakan oleh tenaga medis (dokter, perawat) untuk mendokumentasikan:

- Asesmen dan pemeriksaan pasien
- Diagnosa dengan kode ICD-10
- Tindakan medis dengan kode ICD-9 CM
- Resep dan terapi obat
- Order penunjang (laboratorium, radiologi)
- Edukasi pasien

Modul EMR mencakup tiga konteks pelayanan:
1. **EMR Poli (Rawat Jalan)**
2. **EMR IGD (Instalasi Gawat Darurat)**
3. **EMR Rawat Inap**

---

## 2. Alur Kerja (Workflow)

### 2.1 Alur EMR Rawat Jalan

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Terima Pasien   │────▶│ Asesmen Awal     │────▶│ Pemeriksaan     │
│ dari Pendaftaran│     │ (Perawat)        │     │ Dokter          │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Selesai         │◀────│ Order Penunjang/ │◀────│ Input SOAP &    │
│ Kunjungan       │     │ Resep/Tindakan   │     │ Diagnosa        │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 2.2 Alur EMR IGD

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Pasien Triage   │────▶│ Penanganan Awal  │────▶│ Asesmen &       │
│ (Merah/Kuning)  │     │ (Prioritas)      │     │ Stabilisasi     │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Keputusan Akhir │◀────│ Order & Tindakan │◀────│ Pemeriksaan     │
│ (Pulang/Inap)   │     │ Lanjutan         │     │ Penunjang       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 2.3 Alur EMR Rawat Inap

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Pasien Masuk    │────▶│ Asesmen Awal     │────▶│ Rencana         │
│ Rawat Inap      │     │ Lengkap          │     │ Keperawatan     │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Visite Harian   │────▶│ SOAP Harian      │────▶│ Order & Therapy │
└────────┬────────┘     └──────────────────┘     └─────────────────┘
         │
         ▼ (Repeat daily until discharge)
┌─────────────────┐
│ Resume Medis &  │
│ Discharge Plan  │
└─────────────────┘
```

---

## 3. Skema Data

### 3.1 Asesmen Awal Keperawatan (asesmen_keperawatan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kunjungan_id | UUID | Ya | FK ke kunjungan |
| pasien_id | UUID | Ya | FK ke master_pasien |
| waktu_asesmen | DATETIME | Ya | Waktu asesmen dilakukan |
| keluhan_utama | TEXT | Ya | Keluhan utama pasien |
| riwayat_penyakit_sekarang | TEXT | Ya | Riwayat penyakit saat ini |
| riwayat_penyakit_dahulu | TEXT | Tidak | Riwayat penyakit terdahulu |
| riwayat_penyakit_keluarga | TEXT | Tidak | Riwayat penyakit keluarga |
| alergi_obat | TEXT | Tidak | Daftar alergi obat |
| alergi_makanan | TEXT | Tidak | Daftar alergi makanan |
| alergi_lainnya | TEXT | Tidak | Alergi lainnya |
| td_sistole | INT | Ya | Tekanan Darah Sistole (mmHg) |
| td_diastole | INT | Ya | Tekanan Darah Diastole (mmHg) |
| nadi | INT | Ya | Nadi (x/menit) |
| respirasi | INT | Ya | Respiratory Rate (x/menit) |
| suhu | DECIMAL(4,1) | Ya | Suhu tubuh (°C) |
| tinggi_badan | DECIMAL(5,2) | Tidak | Tinggi badan (cm) |
| berat_badan | DECIMAL(5,2) | Tidak | Berat badan (kg) |
| spo2 | INT | Tidak | Saturasi oksigen (%) |
| nyeri_skor | INT | Tidak | Skala nyeri (0-10) |
| perawat_id | UUID | Ya | FK ke pegawai |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.2 Rekam Medis SOAP (soap)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kunjungan_id | UUID | Ya | FK ke kunjungan |
| pasien_id | UUID | Ya | FK ke master_pasien |
| tanggal_pemeriksaan | DATE | Ya | Tanggal pemeriksaan |
| waktu_pemeriksaan | TIME | Ya | Waktu pemeriksaan |
| subjective | TEXT | Ya | Keluhan pasien (Subjective) |
| objective | TEXT | Ya | Hasil pemeriksaan fisik (Objective) |
| assessment | TEXT | Ya | Penilaian/diagnosa (Assessment) |
| plan | TEXT | Ya | Rencana terapi (Plan) |
| td_sistole | INT | Ya | Tekanan Darah Sistole |
| td_diastole | INT | Ya | Tekanan Darah Diastole |
| nadi | INT | Ya | Nadi |
| respirasi | INT | Ya | Respiratory Rate |
| suhu | DECIMAL(4,1) | Ya | Suhu tubuh |
| dokter_id | UUID | Ya | FK ke pegawai (Dokter pemeriksa) |
| is_dpjp | BOOLEAN | Ya | Apakah dokter ini DPJP |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.3 Diagnosa (diagnosa)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| soap_id | UUID | Ya | FK ke soap |
| kunjungan_id | UUID | Ya | FK ke kunjungan |
| icd10_id | UUID | Ya | FK ke icd10 |
| jenis_diagnosa | ENUM | Ya | 'UTAMA','SEKUNDER','KOMPLIKASI' |
| keterangan | TEXT | Tidak | Keterangan tambahan |
| urutan | INT | Ya | Urutan diagnosa |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 3.4 Prosedur/Tindakan Medis (prosedur)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| soap_id | UUID | Ya | FK ke soap |
| kunjungan_id | UUID | Ya | FK ke kunjungan |
| icd9cm_id | UUID | Ya | FK ke icd9cm |
| tindakan_id | UUID | Ya | FK ke master_tindakan |
| tanggal_prosedur | DATETIME | Ya | Waktu prosedur dilakukan |
| dokter_pelaksana_id | UUID | Ya | FK ke pegawai |
| perawat_asisten_id | UUID | Tidak | FK ke pegawai |
| hasil | TEXT | Tidak | Hasil prosedur |
| catatan | TEXT | Tidak | Catatan prosedur |
| status | ENUM | Ya | 'RENCANA','DILAKUKAN','BATAL' |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.5 Alergi Pasien (alergi)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| pasien_id | UUID | Ya | FK ke master_pasien |
| jenis_alergi | ENUM | Ya | 'OBAT','MAKANAN','LAINNYA' |
| nama_alergen | VARCHAR(100) | Ya | Nama zat/obat penyebab |
| reaksi | TEXT | Ya | Reaksi yang timbul |
| tingkat_keparahan | ENUM | Ya | 'RINGAN','SEDANG','BERAT' |
| tanggal_ditemukan | DATE | Tidak | Tanggal pertama diketahui |
| status | ENUM | Ya | 'AKTIF','TIDAK_AKTIF' |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| created_by | UUID | Ya | FK ke user |

### 3.6 Riwayat Penyakit (riwayat_penyakit)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| pasien_id | UUID | Ya | FK ke master_pasien |
| jenis_riwayat | ENUM | Ya | 'PRIBADI','KELUARGA' |
| nama_penyakit | VARCHAR(100) | Ya | Nama penyakit |
| icd10_id | UUID | Tidak | FK ke icd10 |
| tahun_diagnosa | INT | Tidak | Tahun pertama didiagnosa |
| status_penyakit | ENUM | Ya | 'SEMBUH','TERKONTROL','AKTIF' |
| keterangan | TEXT | Tidak | Keterangan tambahan |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 3.7 Catatan Keperawatan (catatan_keperawatan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kunjungan_id | UUID | Ya | FK ke kunjungan |
| waktu_catatan | DATETIME | Ya | Waktu pencatatan |
| jenis_catatan | ENUM | Ya | 'OBSERVASI','TINDAKAN','EDUKASI','LAINNYA' |
| isi_catatan | TEXT | Ya | Isi catatan |
| perawat_id | UUID | Ya | FK ke pegawai |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 3.8 Resume Medis (resume_medis)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kunjungan_id | UUID | Ya | FK ke kunjungan |
| rawat_inap_id | UUID | Tidak | FK ke rawat_inap |
| tanggal_masuk | DATETIME | Ya | Tanggal masuk |
| tanggal_keluar | DATETIME | Ya | Tanggal keluar |
| diagnosa_masuk | TEXT | Ya | Diagnosa saat masuk |
| diagnosa_akhir | TEXT | Ya | Diagnosa akhir |
| ringkasan_perjalanan_penyakit | TEXT | Ya | Ringkasan penyakit |
| hasil_pemeriksaan_penunjang | TEXT | Tidak | Hasil lab/radiologi penting |
| tindakan_yang_dilakukan | TEXT | Tidak | Tindakan medis yang dilakukan |
| terapi_obat | TEXT | Tidak | Terapi obat yang diberikan |
| kondisi_saat_pulang | TEXT | Ya | Kondisi pasien saat pulang |
| instruksi_pasca_pulang | TEXT | Tidak | Instruksi untuk di rumah |
| jadwal_kontrol | DATE | Tidak | Jadwal kontrol berikutnya |
| dokter_id | UUID | Ya | FK ke pegawai (DPJP) |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

---

## 4. Form-Form yang Dibutuhkan

### 4.1 Form Asesmen Awal Keperawatan

**Bagian 1: Informasi Kunjungan (Read-only)**
- Nama Pasien
- No. Rekam Medis
- Tanggal Lahir / Umur
- Ruangan/Poli
- Dokter Tujuan

**Bagian 2: Keluhan**
- Keluhan Utama* (textarea)
- Riwayat Penyakit Sekarang* (textarea)
- Onset (kapan mulai)
- Durasi

**Bagian 3: Riwayat**
- Riwayat Penyakit Dahulu (textarea + list penyakit kronis dengan checkbox)
  - [ ] Diabetes Mellitus
  - [ ] Hipertensi
  - [ ] Jantung
  - [ ] Asma
  - [ ] TBC
  - [ ] Hepatitis
  - [ ] HIV/AIDS
  - [ ] Lainnya: ________
- Riwayat Penyakit Keluarga (textarea)
- Riwayat Operasi (textarea)

**Bagian 4: Alergi**
- Status Alergi* (radio: Ada/Tidak Ada/Tidak Diketahui)
- Jika ada:
  - Alergi Obat (input dengan autocomplete obat)
  - Alergi Makanan (input)
  - Alergi Lainnya (input)
  - Reaksi yang timbul (textarea)

**Bagian 5: Tanda Vital**
- Tekanan Darah* (input: Sistole/Diastole)
- Nadi* (input: x/menit)
- Respirasi* (input: x/menit)
- Suhu* (input: °C)
- SpO2 (input: %)
- Tinggi Badan (input: cm)
- Berat Badan (input: kg)
- IMT (auto-calculate)

**Bagian 6: Skala Nyeri**
- Skor Nyeri (slider 0-10)
- Lokasi Nyeri (body map / text)
- Karakteristik Nyeri (dropdown)

**Bagian 7: Screening**
- Risiko Jatuh (form Morse Fall Scale)
- Status Nutrisi (form MNA/Malnutrition Screening)
- Risiko Dekubitus (Skala Braden, untuk rawat inap)

### 4.2 Form SOAP (Pemeriksaan Dokter)

**Header (Read-only)**
- Nama Pasien / No. RM / Umur
- Tanggal Kunjungan
- Poli / Ruangan
- Nama Dokter

**Subjective (S)**
- Keluhan Utama* (textarea, bisa copy dari asesmen perawat)
- Keluhan Tambahan (textarea)
- Riwayat singkat (textarea)

**Objective (O)**
- Tanda Vital (tampilkan dari asesmen perawat, bisa edit)
  - Tekanan Darah
  - Nadi
  - Respirasi
  - Suhu
  - SpO2
- Kesadaran* (dropdown: Composmentis, Apatis, Somnolen, Sopor, Koma)
- GCS (Eye/Verbal/Motor) - jika tidak composmentis
- Pemeriksaan Fisik* (textarea atau structured form per sistem organ)
  - Kepala
  - Mata
  - THT
  - Leher
  - Thorax
  - Abdomen
  - Ekstremitas
  - Kulit
  - Neurologi

**Assessment (A)**
- Diagnosa Utama* (autocomplete ICD-10)
  - Kode ICD-10
  - Nama Diagnosa
  - Keterangan
- Diagnosa Sekunder (dapat multiple, autocomplete ICD-10)
- Diagnosa Diferensial (textarea)

**Plan (P)**
- Rencana Terapi* (textarea)
- Order Tindakan (link ke form order tindakan)
- Order Laboratorium (link ke form order lab)
- Order Radiologi (link ke form order radiologi)
- E-Resep (link ke form resep)
- Order Diet (untuk rawat inap)
- Rencana Tindak Lanjut (dropdown: Kontrol Ulang, Rawat Inap, Rujuk, Selesai)
- Jadwal Kontrol (date picker)

### 4.3 Form Order Laboratorium

- Tanggal Order*
- Dokter Peminta* (auto-fill dari login)
- Prioritas* (radio: CITO/Biasa)
- Diagnosa Klinis* (text)
- Jenis Pemeriksaan* (checkbox tree):
  - [ ] Hematologi
    - [ ] Darah Lengkap
    - [ ] Hemoglobin
    - [ ] Hematokrit
    - [ ] Leukosit
    - [ ] Trombosit
    - [ ] LED
    - [ ] Golongan Darah
  - [ ] Kimia Klinik
    - [ ] Gula Darah Sewaktu
    - [ ] Gula Darah Puasa
    - [ ] HbA1c
    - [ ] Kolesterol Total
    - [ ] Trigliserida
    - [ ] HDL
    - [ ] LDL
    - [ ] SGOT
    - [ ] SGPT
    - [ ] Ureum
    - [ ] Kreatinin
    - [ ] Asam Urat
  - [ ] Serologi/Imunologi
    - [ ] HBsAg
    - [ ] Anti HCV
    - [ ] Anti HIV
    - [ ] Widal
    - [ ] Dengue NS1
    - [ ] IgG/IgM Dengue
  - [ ] Urinalisa
    - [ ] Urine Lengkap
    - [ ] Sedimen Urine
  - [ ] Feses
    - [ ] Feses Lengkap
- Catatan Klinis (textarea)

### 4.4 Form Order Radiologi

- Tanggal Order*
- Dokter Peminta* (auto-fill)
- Prioritas* (radio: CITO/Biasa)
- Diagnosa Klinis*
- Jenis Pemeriksaan* (radio + detail):
  - X-Ray
    - Bagian tubuh (dropdown)
    - Proyeksi (checkbox: AP, Lateral, Oblique)
  - CT-Scan
    - Bagian tubuh (dropdown)
    - Dengan/Tanpa Kontras
  - MRI
    - Bagian tubuh (dropdown)
    - Dengan/Tanpa Kontras
  - USG
    - Jenis (dropdown: Abdomen, Mammae, Obstetri, dll)
- Catatan Klinis (textarea)
- Informasi Khusus:
  - Hamil? (radio: Ya/Tidak/Tidak Tahu)
  - Alergi Kontras? (radio)
  - Kreatinin terakhir (jika pakai kontras)

### 4.5 Form E-Resep

**Header**
- Tanggal Resep*
- Dokter Penulis Resep* (auto-fill)
- Jenis Resep (dropdown: Rawat Jalan, Rawat Inap, Pulang)

**Detail Obat (repeatable)**
- Cari Obat* (autocomplete dari master obat)
- Nama Obat (auto-fill)
- Bentuk Sediaan (auto-fill)
- Kekuatan (auto-fill)
- Dosis* (input)
- Satuan Dosis* (dropdown)
- Frekuensi* (dropdown: 1x1, 2x1, 3x1, 4x1, Bila Perlu, dll)
- Rute* (dropdown: Oral, IV, IM, SC, Topikal, dll)
- Durasi* (input hari)
- Jumlah (auto-calculate atau manual)
- Instruksi Khusus (text: sesudah makan, sebelum tidur, dll)

**Footer**
- Catatan untuk Farmasi (textarea)
- Alergi Obat Pasien (warning display)

### 4.6 Form Order Tindakan

- Tanggal Order*
- Dokter Peminta*
- Jenis Tindakan* (autocomplete dari master tindakan)
  - Kode Tindakan
  - Nama Tindakan
  - Kode ICD-9 CM
- Prioritas* (radio: CITO/Elektif)
- Dokter Pelaksana* (dropdown)
- Jadwal Pelaksanaan* (datetime picker)
- Diagnosa Pre-Operatif (untuk tindakan bedah)
- Catatan Khusus (textarea)

### 4.7 Form Catatan Keperawatan Harian (CPPT)

- Tanggal & Waktu*
- Jenis Catatan* (dropdown: Observasi, Tindakan, Edukasi, Lainnya)
- Catatan SBAR:
  - Situation (textarea)
  - Background (textarea)
  - Assessment (textarea)
  - Recommendation (textarea)
- Atau catatan bebas (textarea)
- Tanda tangan digital perawat

### 4.8 Form Resume Medis

- **Data Pasien** (auto-fill)
- **Tanggal Perawatan** (auto-fill dari kunjungan)
- Diagnosa Masuk*
- Diagnosa Akhir* (dengan ICD-10)
- Diagnosa Sekunder (dengan ICD-10)
- Tindakan yang Dilakukan (dengan ICD-9 CM)
- Ringkasan Perjalanan Penyakit*
- Hasil Pemeriksaan Penunjang Penting
- Terapi yang Diberikan
- Kondisi Waktu Pulang* (dropdown + textarea)
- Prognosis (dropdown)
- Instruksi Pasca Pulang
- Obat yang Dibawa Pulang
- Diet yang Dianjurkan
- Jadwal Kontrol
- Tanda tangan DPJP

---

## 5. Fitur Pendukung

### 5.1 Riwayat Medis Pasien

**Timeline View:**
- Kronologi semua kunjungan pasien
- Filter berdasarkan periode/jenis kunjungan
- Akses cepat ke SOAP, diagnosa, resep, hasil lab

**Summary View:**
- Daftar alergi aktif (highlight)
- Daftar penyakit kronis
- Obat-obatan rutin
- Riwayat operasi

### 5.2 ICD-10 & ICD-9 CM Search

**Pencarian:**
- Cari berdasarkan kode
- Cari berdasarkan nama penyakit/prosedur
- Filter berdasarkan kategori/chapter
- Autocomplete dengan frequently used

**Display:**
- Kode
- Nama (Indonesia & English)
- Deskripsi
- Hierarki (parent-child)

### 5.3 Drug Interaction Checker

- Cek interaksi antar obat dalam resep
- Warning jika ada kontraindikasi
- Cek alergi obat pasien sebelum meresepkan

### 5.4 Clinical Decision Support

- Alert untuk dosis abnormal
- Reminder untuk pemeriksaan rutin (DM, Hipertensi)
- Warning untuk hasil lab kritis

### 5.5 Template SOAP

- Template SOAP per diagnosa umum
- Customizable oleh dokter
- Copy dari kunjungan sebelumnya

---

## 6. Integrasi dengan Modul Lain

| Modul Sumber | Data yang Diterima | Penggunaan di EMR |
|--------------|--------------------|--------------------|
| Pendaftaran | Data pasien, kunjungan | Header rekam medis |
| Laboratorium | Hasil pemeriksaan | Ditampilkan di Objective |
| Radiologi | Hasil & expertise | Ditampilkan di Objective |
| Farmasi | Status e-Resep | Tracking order obat |

| Modul Tujuan | Data yang Dikirim | Trigger |
|--------------|-------------------|---------|
| Laboratorium | Order Lab | Saat dokter order |
| Radiologi | Order Radiologi | Saat dokter order |
| Farmasi | E-Resep | Saat dokter order resep |
| Billing | Diagnosa, Tindakan | Otomatis |
| Gizi | Order Diet | Saat dokter order |

---

## 7. Aturan Bisnis (Business Rules)

1. **SOAP wajib** memiliki minimal 1 diagnosa dengan kode ICD-10
2. Setiap tindakan medis **wajib** dikoding dengan ICD-9 CM
3. **E-Resep** harus divalidasi farmasi sebelum diberikan ke pasien
4. **Alergi** yang tercatat harus muncul sebagai warning saat order obat
5. **DPJP** hanya boleh ada 1 per episode rawat inap
6. Resume medis **wajib** dibuat saat pasien pulang/selesai perawatan
7. **Catatan keperawatan** minimal 1x per shift untuk rawat inap
8. **Order CITO** harus diproses dalam 1 jam oleh unit terkait
9. Edit SOAP setelah 24 jam memerlukan **approval supervisor**
10. **Semua perubahan** dicatat dalam audit trail

---

## 8. Kebutuhan Teknis

### 8.1 Validasi Form

| Field | Validasi |
|-------|----------|
| Tanda Vital | Range normal dengan warning jika abnormal |
| ICD-10 | Harus valid dan ada di database |
| ICD-9 CM | Harus valid dan ada di database |
| Dosis Obat | Cek terhadap range yang ditetapkan |
| Tanggal | Tidak boleh di masa depan |

### 8.2 Performance

- Load time rekam medis < 2 detik
- Autocomplete ICD < 300ms response
- History pasien dengan lazy loading

### 8.3 Security & Privacy

| Aspek | Implementasi |
|-------|--------------|
| Access Control | Role-based, per unit/ruangan |
| Audit Trail | Setiap view, create, update, delete |
| Data Masking | NIK, alamat untuk role non-klinis |
| Session | Auto logout setelah 15 menit idle |

### 8.4 Permission/Role EMR

| Role | View | Create | Edit | Delete | Order |
|------|------|--------|------|--------|-------|
| Dokter DPJP | Semua | Ya | Ya (24 jam) | Tidak | Ya |
| Dokter Lain | Per kunjungan | Ya | Ya (24 jam) | Tidak | Ya |
| Perawat | Per ruangan | Asesmen & Catatan | Ya (24 jam) | Tidak | Tidak |
| Admin RM | Semua | Tidak | Tidak | Tidak | Tidak |

### 8.5 Cetak/Print

- Resume Medis (format standar Kemenkes)
- Surat Keterangan Sakit
- Surat Rujukan
- Surat Keterangan Sehat
- Lembar Informed Consent
- Label Spesimen
- Order Lab/Radiologi
- E-Resep
