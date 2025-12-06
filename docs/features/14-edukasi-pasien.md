# Modul Edukasi Pasien

## 1. Deskripsi Umum

Modul Edukasi Pasien adalah sistem untuk mendokumentasikan pemberian informasi dan edukasi kesehatan kepada pasien dan/atau keluarga. Modul ini bertujuan untuk:

- Mencatat materi edukasi yang diberikan
- Memverifikasi pemahaman pasien/keluarga
- Memastikan informed consent yang baik
- Memenuhi standar akreditasi rumah sakit
- Mendukung patient-centered care

---

## 2. Jenis Edukasi

### 2.1 Kategori Edukasi

| Kategori | Contoh Materi |
|----------|---------------|
| **Penyakit** | Pengertian, penyebab, gejala, komplikasi |
| **Pengobatan** | Cara minum obat, efek samping, interaksi |
| **Tindakan** | Prosedur, risiko, persiapan, perawatan pasca |
| **Nutrisi/Diet** | Diet khusus, pantangan, jadwal makan |
| **Aktivitas** | Mobilisasi, olahraga, istirahat |
| **Pencegahan** | Cara mencegah penularan, kekambuhan |
| **Perawatan di Rumah** | Cara merawat luka, memberi obat |
| **Kontrol & Follow-up** | Jadwal kontrol, tanda bahaya |

### 2.2 Metode Edukasi

| Metode | Keterangan |
|--------|------------|
| **Verbal** | Penjelasan lisan |
| **Demonstrasi** | Peragaan cara melakukan |
| **Media Visual** | Gambar, poster, video |
| **Leaflet/Booklet** | Material tercetak |
| **Audio Visual** | Video edukasi |
| **Praktik** | Pasien mencoba langsung |

---

## 3. Skema Data

### 3.1 Edukasi Pasien (tbl_edukasi_pasien)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kunjungan_id | UUID | Ya | FK ke tbl_kunjungan |
| pasien_id | UUID | Ya | FK ke tbl_master_pasien |
| tanggal_edukasi | DATETIME | Ya | Tanggal dan waktu edukasi |
| penerima_edukasi | ENUM | Ya | 'PASIEN','KELUARGA','PASIEN_DAN_KELUARGA' |
| nama_penerima | VARCHAR(100) | Ya | Nama penerima (jika bukan pasien) |
| hubungan_pasien | VARCHAR(50) | Tidak | Hubungan dengan pasien |
| educator_id | UUID | Ya | FK ke tbl_pegawai (pemberi edukasi) |
| profesi_educator | VARCHAR(50) | Ya | Profesi (Dokter, Perawat, Ahli Gizi, dll) |
| kategori_edukasi | ENUM | Ya | 'PENYAKIT','PENGOBATAN','TINDAKAN','NUTRISI', dll |
| topik_edukasi | TEXT | Ya | Topik yang diedukasi |
| materi_id | UUID | Tidak | FK ke tbl_materi_edukasi |
| materi_custom | TEXT | Tidak | Materi custom jika tidak ada di master |
| metode_edukasi | JSON | Ya | Metode yang digunakan (array) |
| media_digunakan | JSON | Tidak | Media yang digunakan (array) |
| durasi_menit | INT | Tidak | Durasi edukasi (menit) |
| hambatan | TEXT | Tidak | Hambatan yang ditemui |
| evaluasi_pemahaman | ENUM | Ya | 'MEMAHAMI','SEBAGIAN','TIDAK_MEMAHAMI','PERLU_ULANG' |
| metode_evaluasi | VARCHAR(100) | Ya | Cara evaluasi (teach back, pertanyaan, dll) |
| catatan_evaluasi | TEXT | Tidak | Catatan hasil evaluasi |
| rencana_tindak_lanjut | TEXT | Tidak | RTL jika belum paham |
| tanda_tangan_pasien | TEXT | Tidak | Tanda tangan digital pasien/keluarga |
| tanda_tangan_educator | TEXT | Tidak | Tanda tangan digital educator |
| status | ENUM | Ya | 'DRAFT','SELESAI','PERLU_ULANG' |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.2 Master Materi Edukasi (tbl_materi_edukasi)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(20) | Ya | Kode materi |
| judul | VARCHAR(200) | Ya | Judul materi |
| kategori | ENUM | Ya | Kategori edukasi |
| diagnosa_id | UUID | Tidak | FK ke tbl_icd10 (jika terkait diagnosa) |
| tindakan_id | UUID | Tidak | FK ke tbl_master_tindakan (jika terkait tindakan) |
| ringkasan | TEXT | Ya | Ringkasan materi |
| konten_lengkap | TEXT | Ya | Konten lengkap materi |
| poin_penting | JSON | Ya | Poin-poin penting (array) |
| bahasa | ENUM | Ya | 'ID','EN','LAINNYA' |
| file_pendukung | JSON | Tidak | File leaflet/video (array path) |
| evaluasi_standar | JSON | Tidak | Pertanyaan standar untuk evaluasi |
| target_audience | VARCHAR(100) | Tidak | Target (dewasa, anak, lansia) |
| durasi_estimasi | INT | Tidak | Estimasi durasi (menit) |
| versi | VARCHAR(10) | Ya | Versi materi |
| tanggal_berlaku | DATE | Ya | Tanggal mulai berlaku |
| tanggal_review | DATE | Tidak | Tanggal harus direview |
| created_by | UUID | Ya | FK ke tbl_user |
| approved_by | UUID | Tidak | FK ke tbl_user |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 3.3 Checklist Edukasi per Kondisi (tbl_checklist_edukasi)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| diagnosa_id | UUID | Tidak | FK ke tbl_icd10 |
| tindakan_id | UUID | Tidak | FK ke tbl_master_tindakan |
| kondisi | VARCHAR(100) | Tidak | Kondisi khusus (post op, DM, dll) |
| item_edukasi | JSON | Ya | Daftar item yang harus diedukasi |
| is_mandatory | BOOLEAN | Ya | Wajib semua item terchecklist |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 3.4 Edukasi yang Diberikan - Detail (tbl_edukasi_detail)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| edukasi_id | UUID | Ya | FK ke tbl_edukasi_pasien |
| checklist_item | VARCHAR(200) | Ya | Item yang diedukasi |
| is_diberikan | BOOLEAN | Ya | Sudah diberikan |
| is_dipahami | BOOLEAN | Tidak | Pasien memahami |
| catatan | TEXT | Tidak | Catatan per item |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

---

## 4. Form-Form yang Dibutuhkan

### 4.1 Form Edukasi Pasien

**Header (read-only):**
- Nama Pasien / No. RM / Umur
- Tanggal Lahir
- Ruangan / Poli
- Diagnosa

**Bagian 1: Informasi Dasar**
- Tanggal & Waktu Edukasi* (datetime, default: sekarang)
- Penerima Edukasi* (radio):
  - Pasien
  - Keluarga
  - Pasien dan Keluarga
- Nama Penerima* (auto jika pasien, input jika keluarga)
- Hubungan dengan Pasien (dropdown, jika keluarga)
- Pemberi Edukasi* (auto dari login)
- Profesi* (auto dari data pegawai)

**Bagian 2: Materi Edukasi**
- Kategori Edukasi* (dropdown)
- Topik* (text area)
- Pilih Materi dari Database (autocomplete) atau
- Input Materi Custom (rich text)

**Jika dari Checklist (untuk kondisi tertentu):**
| Item Edukasi | Diberikan | Dipahami | Catatan |
|--------------|-----------|----------|---------|
| [ ] Pengertian penyakit | [check] | [check] | [input] |
| [ ] Cara minum obat | [check] | [check] | [input] |
| [ ] Diet yang dianjurkan | [check] | [check] | [input] |
| [ ] Tanda bahaya | [check] | [check] | [input] |

**Bagian 3: Metode & Media**
- Metode Edukasi* (multi-select checkbox):
  - [ ] Verbal/Lisan
  - [ ] Demonstrasi
  - [ ] Praktik langsung
  - [ ] Leaflet/Booklet
  - [ ] Video
  - [ ] Gambar/Poster
- Media yang Digunakan (optional, upload/select from library)
- Durasi Edukasi (menit)

**Bagian 4: Evaluasi Pemahaman**
- Metode Evaluasi* (dropdown):
  - Teach Back (pasien menjelaskan ulang)
  - Pertanyaan langsung
  - Demonstrasi ulang oleh pasien
  - Observasi
- Hasil Evaluasi* (radio):
  - Memahami dengan baik
  - Memahami sebagian
  - Tidak memahami
  - Perlu pengulangan
- Catatan Evaluasi (textarea)

**Jika Tidak Memahami:**
- Hambatan yang Ditemui (textarea)
- Rencana Tindak Lanjut* (textarea)
- Jadwal Edukasi Ulang (datetime)

**Bagian 5: Tanda Tangan**
- Tanda Tangan Penerima* (digital signature)
- Tanda Tangan Pemberi* (digital signature)

### 4.2 Form Edukasi Discharge (Pulang)

**Checklist Edukasi Pulang:**
- [ ] Obat yang diminum di rumah
- [ ] Cara minum obat dan waktu
- [ ] Efek samping yang mungkin timbul
- [ ] Diet yang harus dijalani
- [ ] Aktivitas yang boleh dan tidak boleh
- [ ] Perawatan luka (jika ada)
- [ ] Tanda-tanda harus kembali ke RS
- [ ] Jadwal kontrol ulang
- [ ] Kontak yang bisa dihubungi

**Resume Edukasi:**
- Ringkasan semua edukasi yang sudah diberikan selama perawatan
- Status pemahaman masing-masing

### 4.3 Form Informed Consent Tindakan

**Header:**
- Nama Pasien / No. RM
- Nama Tindakan

**Informasi yang Disampaikan:**
- [ ] Diagnosa dan kondisi pasien
- [ ] Tujuan dan manfaat tindakan
- [ ] Prosedur tindakan
- [ ] Risiko dan komplikasi yang mungkin
- [ ] Alternatif tindakan lain
- [ ] Prognosis dengan dan tanpa tindakan
- [ ] Perkiraan biaya

**Evaluasi Pemahaman:**
- Kesempatan bertanya: Ya/Tidak
- Pertanyaan yang diajukan: (textarea)
- Jawaban yang diberikan: (textarea)

**Keputusan:**
- [ ] Menyetujui tindakan
- [ ] Menolak tindakan

**Tanda Tangan:**
- Pasien/Keluarga
- Saksi 1
- Saksi 2
- Dokter yang memberikan informasi

---

## 5. Fitur Pendukung

### 5.1 Library Materi Edukasi

**Fitur:**
- Database materi terstandar
- Kategorisasi per topik/diagnosa
- Multi-bahasa
- Version control
- Approval workflow

### 5.2 Media Library

**Jenis Media:**
- Leaflet (PDF)
- Video edukasi
- Gambar/infografis
- Audio

**Fitur:**
- Upload dan kategorisasi
- Preview
- Download/print
- Usage tracking

### 5.3 Reminder Edukasi

**Trigger:**
- Diagnosa tertentu → reminder edukasi terkait
- Tindakan tertentu → reminder edukasi pre/post
- Pasien akan pulang → reminder edukasi discharge

### 5.4 Dashboard Kepatuhan Edukasi

**Metrik:**
- Persentase pasien yang diedukasi
- Per diagnosa/tindakan
- Per unit
- Hasil evaluasi pemahaman

### 5.5 Mobile-Friendly View

**Untuk Pasien/Keluarga:**
- Akses materi edukasi via QR code
- Video dapat diputar ulang
- Checklist mandiri

---

## 6. Integrasi dengan Modul Lain

| Modul | Integrasi |
|-------|-----------|
| **EMR** | Trigger edukasi dari diagnosa |
| **Farmasi** | Edukasi obat saat penyerahan |
| **Gizi** | Edukasi diet |
| **Pendaftaran** | Edukasi hak & kewajiban pasien |
| **Rawat Inap** | Edukasi discharge planning |

---

## 7. Aturan Bisnis (Business Rules)

1. Setiap pasien rawat inap **wajib** mendapat edukasi discharge
2. Tindakan invasif **wajib** dengan informed consent dan edukasi
3. Pasien dengan diagnosa kronis (DM, HT) **wajib** edukasi standar
4. Edukasi **wajib** dievaluasi pemahamannya
5. Jika tidak memahami, **wajib** dijadwalkan edukasi ulang
6. Dokumentasi edukasi **wajib** ditandatangani
7. Materi edukasi harus **diapprove** sebelum digunakan
8. Materi edukasi harus **direview** minimal setiap 2 tahun
9. Edukasi dalam bahasa yang dipahami pasien
10. Hambatan edukasi (buta huruf, tuna rungu) harus diakomodasi

---

## 8. Kebutuhan Teknis

### 8.1 Digital Signature

**Requirement:**
- Capture tanda tangan via touch/stylus
- Simpan sebagai image
- Tamper-proof

### 8.2 Permission/Role

| Role | Akses |
|------|-------|
| Dokter | Create, view, materi semua |
| Perawat | Create, view, materi keperawatan |
| Ahli Gizi | Create, view, materi gizi |
| Farmasi | Create, view, materi obat |
| Admin Edukasi | Kelola materi library |

### 8.3 Laporan

**Laporan Standar:**
- Kepatuhan edukasi per unit
- Hasil evaluasi pemahaman
- Materi yang sering digunakan
- Pasien yang perlu edukasi ulang

---

## 9. Notifikasi

| Event | Penerima | Channel |
|-------|----------|---------|
| Pasien baru perlu edukasi (berdasarkan diagnosa) | Perawat | Alert |
| Pasien akan pulang, edukasi belum lengkap | Perawat | Alert |
| Edukasi ulang terjadwal | Educator | Reminder |
| Materi edukasi perlu review | Admin Edukasi | Email |
