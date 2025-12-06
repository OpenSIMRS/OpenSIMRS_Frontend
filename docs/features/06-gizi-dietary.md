# Modul Gizi/Dietary

## 1. Deskripsi Umum

Modul Gizi/Dietary adalah sistem informasi yang mengelola pelayanan gizi di rumah sakit, meliputi pengelolaan order diet pasien rawat inap, perencanaan menu, produksi makanan, hingga distribusi ke ruangan. Modul ini mencakup:

- Penerimaan order diet dari dokter
- Asesmen status gizi pasien
- Perencanaan diet sesuai kondisi medis
- Manajemen produksi makanan harian
- Distribusi makanan ke ruangan
- Monitoring asupan gizi pasien
- Konseling gizi

---

## 2. Alur Kerja (Workflow)

### 2.1 Alur Order Diet Pasien Rawat Inap

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Order Diet dari │────▶│ Terima & Review  │────▶│ Planning Menu   │
│ Dokter (EMR)    │     │ Order            │     │ Pasien          │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Monitoring      │◀────│ Distribusi ke    │◀────│ Produksi        │
│ Asupan          │     │ Ruangan          │     │ Makanan         │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 2.2 Alur Konseling Gizi

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Permintaan      │────▶│ Asesmen Status   │────▶│ Konseling &     │
│ Konseling       │     │ Gizi             │     │ Edukasi         │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
                                            ┌─────────────────────────┐
                                            │ Dokumentasi &           │
                                            │ Follow-up               │
                                            └─────────────────────────┘
```

---

## 3. Jenis Diet

### 3.1 Diet Berdasarkan Penyakit

| Kode | Nama Diet | Indikasi |
|------|-----------|----------|
| DM | Diet Diabetes Mellitus | Pasien diabetes |
| DJ | Diet Jantung | Pasien penyakit jantung |
| DG | Diet Ginjal | Pasien gagal ginjal |
| DH | Diet Hati | Pasien gangguan hati |
| DL | Diet Lambung | Pasien gastritis/GERD |
| DT | Diet Rendah Garam | Hipertensi |
| DP | Diet Rendah Purin | Asam urat |
| DA | Diet Alergi | Alergi makanan |
| DC | Diet Kanker | Pasien kanker |
| DF | Diet Demam Typhoid | Demam typhoid |

### 3.2 Diet Berdasarkan Bentuk Makanan

| Kode | Bentuk | Keterangan |
|------|--------|------------|
| MB | Makanan Biasa | Nasi biasa |
| ML | Makanan Lunak | Bubur |
| MS | Makanan Saring | Makanan halus disaring |
| MC | Makanan Cair | Cair penuh |
| PN | Parenteral Nutrition | Nutrisi IV |
| EN | Enteral Nutrition | Melalui NGT/PEG |

### 3.3 Diet Khusus

| Jenis | Keterangan |
|-------|------------|
| Diet Post-Op | Diet bertahap pasca operasi |
| Diet Pre-Op | Persiapan operasi (puasa) |
| Diet Anak | Sesuai usia dan kondisi |
| Diet Ibu Hamil/Menyusui | Kebutuhan khusus kehamilan |

---

## 4. Skema Data

### 4.1 Order Diet (order_diet)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| no_order | VARCHAR(20) | Ya | Nomor order |
| rawat_inap_id | UUID | Ya | FK ke rawat_inap |
| pasien_id | UUID | Ya | FK ke master_pasien |
| tanggal_order | DATETIME | Ya | Tanggal order |
| dokter_id | UUID | Ya | FK ke pegawai |
| ruangan_id | UUID | Ya | FK ke ruangan |
| kamar_id | UUID | Ya | FK ke kamar |
| bed_id | UUID | Ya | FK ke bed |
| jenis_diet_id | UUID | Ya | FK ke master_diet |
| bentuk_makanan | ENUM | Ya | 'BIASA','LUNAK','SARING','CAIR' |
| kalori | INT | Tidak | Target kalori harian |
| protein | INT | Tidak | Target protein (gram) |
| alergi_makanan | TEXT | Tidak | Daftar alergi |
| pantangan | TEXT | Tidak | Pantangan makanan |
| catatan | TEXT | Tidak | Catatan khusus |
| tanggal_mulai | DATE | Ya | Tanggal mulai diet |
| tanggal_selesai | DATE | Tidak | Tanggal selesai diet |
| status | ENUM | Ya | 'AKTIF','SELESAI','BATAL' |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 4.2 Master Diet (master_diet)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(10) | Ya | Kode diet |
| nama | VARCHAR(100) | Ya | Nama diet |
| kategori | VARCHAR(50) | Ya | Kategori diet |
| deskripsi | TEXT | Ya | Deskripsi diet |
| indikasi | TEXT | Ya | Indikasi medis |
| kontraindikasi | TEXT | Tidak | Kontraindikasi |
| panduan_umum | TEXT | Ya | Panduan umum diet |
| kalori_default | INT | Tidak | Kalori default |
| protein_default | INT | Tidak | Protein default |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.3 Asesmen Gizi (asesmen_gizi)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kunjungan_id | UUID | Ya | FK ke kunjungan |
| rawat_inap_id | UUID | Tidak | FK ke rawat_inap |
| pasien_id | UUID | Ya | FK ke master_pasien |
| tanggal_asesmen | DATETIME | Ya | Tanggal asesmen |
| tinggi_badan | DECIMAL(5,2) | Ya | Tinggi badan (cm) |
| berat_badan | DECIMAL(5,2) | Ya | Berat badan (kg) |
| berat_badan_ideal | DECIMAL(5,2) | Tidak | BB ideal (kg) |
| imt | DECIMAL(5,2) | Ya | Indeks Massa Tubuh |
| status_imt | ENUM | Ya | 'UNDERWEIGHT','NORMAL','OVERWEIGHT','OBESE' |
| lila | DECIMAL(5,2) | Tidak | Lingkar lengan atas (cm) |
| lingkar_perut | DECIMAL(5,2) | Tidak | Lingkar perut (cm) |
| skor_mna | INT | Tidak | Skor Mini Nutritional Assessment |
| status_gizi | ENUM | Ya | 'BAIK','KURANG','BURUK','LEBIH' |
| riwayat_makan | TEXT | Tidak | Riwayat pola makan |
| alergi_makanan | TEXT | Tidak | Alergi makanan |
| pantangan | TEXT | Tidak | Pantangan (agama/kultur) |
| diagnosa_gizi | TEXT | Ya | Diagnosa gizi (PES format) |
| intervensi | TEXT | Ya | Rencana intervensi gizi |
| monitoring | TEXT | Tidak | Rencana monitoring |
| ahli_gizi_id | UUID | Ya | FK ke pegawai |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |
| updated_at | TIMESTAMP | Ya | Waktu update terakhir |

### 4.4 Menu Harian (menu_harian)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| tanggal | DATE | Ya | Tanggal menu |
| siklus_id | UUID | Ya | FK ke siklus_menu |
| waktu_makan | ENUM | Ya | 'PAGI','SIANG','SORE','SNACK_PAGI','SNACK_SORE' |
| jenis_diet_id | UUID | Ya | FK ke master_diet |
| bentuk_makanan | ENUM | Ya | 'BIASA','LUNAK','SARING','CAIR' |
| menu_id | UUID | Ya | FK ke master_menu |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.5 Master Menu (master_menu)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kode | VARCHAR(20) | Ya | Kode menu |
| nama | VARCHAR(100) | Ya | Nama menu |
| kategori | ENUM | Ya | 'MAKANAN_POKOK','LAUK_HEWANI','LAUK_NABATI','SAYUR','BUAH','MINUMAN','SNACK' |
| komposisi | TEXT | Ya | Komposisi/resep |
| porsi | VARCHAR(50) | Ya | Ukuran porsi |
| kalori | INT | Ya | Kalori per porsi |
| protein | DECIMAL(5,2) | Ya | Protein (gram) |
| lemak | DECIMAL(5,2) | Ya | Lemak (gram) |
| karbohidrat | DECIMAL(5,2) | Ya | Karbohidrat (gram) |
| serat | DECIMAL(5,2) | Tidak | Serat (gram) |
| natrium | DECIMAL(5,2) | Tidak | Natrium (mg) |
| alergen | TEXT | Tidak | Kandungan alergen |
| foto | VARCHAR(255) | Tidak | Foto menu |
| is_active | BOOLEAN | Ya | Status aktif |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.6 Produksi Makanan (produksi_makanan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| tanggal | DATE | Ya | Tanggal produksi |
| waktu_makan | ENUM | Ya | 'PAGI','SIANG','SORE','SNACK_PAGI','SNACK_SORE' |
| total_porsi | INT | Ya | Total porsi yang diproduksi |
| detail | JSON | Ya | Detail per jenis diet |
| waktu_mulai_produksi | TIME | Ya | Waktu mulai |
| waktu_selesai_produksi | TIME | Tidak | Waktu selesai |
| petugas_id | UUID | Ya | FK ke pegawai |
| catatan | TEXT | Tidak | Catatan produksi |
| status | ENUM | Ya | 'PLANNING','PRODUKSI','SELESAI' |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.7 Distribusi Makanan (distribusi_makanan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| produksi_id | UUID | Ya | FK ke produksi_makanan |
| order_diet_id | UUID | Ya | FK ke order_diet |
| pasien_id | UUID | Ya | FK ke master_pasien |
| ruangan_id | UUID | Ya | FK ke ruangan |
| waktu_distribusi | DATETIME | Ya | Waktu distribusi |
| petugas_distribusi_id | UUID | Ya | FK ke pegawai |
| status_terima | ENUM | Ya | 'TERIMA','TOLAK','TIDAK_ADA' |
| alasan_tolak | TEXT | Tidak | Alasan jika ditolak |
| catatan | TEXT | Tidak | Catatan |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.8 Monitoring Asupan (monitoring_asupan)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| order_diet_id | UUID | Ya | FK ke order_diet |
| pasien_id | UUID | Ya | FK ke master_pasien |
| tanggal | DATE | Ya | Tanggal monitoring |
| waktu_makan | ENUM | Ya | 'PAGI','SIANG','SORE','SNACK_PAGI','SNACK_SORE' |
| makanan_pokok | ENUM | Ya | 'HABIS','3/4','1/2','1/4','TIDAK_MAKAN' |
| lauk_hewani | ENUM | Ya | 'HABIS','3/4','1/2','1/4','TIDAK_MAKAN' |
| lauk_nabati | ENUM | Ya | 'HABIS','3/4','1/2','1/4','TIDAK_MAKAN' |
| sayur | ENUM | Ya | 'HABIS','3/4','1/2','1/4','TIDAK_MAKAN' |
| buah | ENUM | Ya | 'HABIS','3/4','1/2','1/4','TIDAK_MAKAN' |
| minuman | ENUM | Ya | 'HABIS','3/4','1/2','1/4','TIDAK_MAKAN' |
| makanan_luar | BOOLEAN | Tidak | Ada makanan dari luar |
| catatan | TEXT | Tidak | Catatan/keluhan |
| petugas_id | UUID | Ya | FK ke pegawai |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

### 4.9 Konseling Gizi (konseling_gizi)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| id | UUID | Ya | Primary Key |
| kunjungan_id | UUID | Ya | FK ke kunjungan |
| pasien_id | UUID | Ya | FK ke master_pasien |
| tanggal | DATETIME | Ya | Tanggal konseling |
| jenis | ENUM | Ya | 'AWAL','LANJUTAN' |
| ahli_gizi_id | UUID | Ya | FK ke pegawai |
| diagnosa_gizi | TEXT | Ya | Diagnosa gizi (PES) |
| topik_edukasi | TEXT | Ya | Topik yang diedukasi |
| materi_edukasi | TEXT | Tidak | Materi yang diberikan |
| media_edukasi | VARCHAR(255) | Tidak | Media yang digunakan |
| respon_pasien | TEXT | Tidak | Respon/feedback pasien |
| rencana_tindak_lanjut | TEXT | Tidak | RTL |
| jadwal_kontrol | DATE | Tidak | Jadwal konseling berikut |
| created_at | TIMESTAMP | Ya | Waktu pembuatan |

---

## 5. Form-Form yang Dibutuhkan

### 5.1 Form Order Diet (untuk Dokter di EMR)

**Informasi Pasien (read-only):**
- Nama / No. RM / Umur
- Ruangan / Kamar / Bed
- Diagnosa Medis

**Input Order:**
- Jenis Diet* (dropdown dengan multi-select)
- Bentuk Makanan* (radio):
  - Makanan Biasa
  - Makanan Lunak
  - Makanan Saring
  - Makanan Cair
- Target Kalori (kkal/hari)
- Target Protein (gram/hari)
- Alergi Makanan (tag input)
- Pantangan Agama/Budaya
- Catatan Khusus (textarea)
- Tanggal Mulai* (date, default: hari ini)

### 5.2 Form Asesmen Gizi

**Data Pasien (read-only):**
- Nama / No. RM
- Tanggal Lahir / Umur
- Jenis Kelamin
- Ruangan / Kamar

**Pengukuran Antropometri:**
- Tinggi Badan* (cm)
- Berat Badan* (kg)
- IMT* (auto-calculate)
- Status IMT* (auto-determine)
- LILA (cm)
- Lingkar Perut (cm)
- Berat Badan Ideal (auto-calculate)

**Riwayat Gizi:**
- Pola Makan Sebelumnya (textarea)
- Frekuensi Makan
- Nafsu Makan* (dropdown)
- Perubahan BB 3 bulan terakhir
- Gangguan Makan:
  - [ ] Mual
  - [ ] Muntah
  - [ ] Diare
  - [ ] Konstipasi
  - [ ] Kesulitan Menelan
  - [ ] Lainnya

**Alergi & Pantangan:**
- Alergi Makanan (tag input)
- Pantangan Agama/Budaya (checkbox/input)

**Skrining Malnutrisi (MNA/MUST):**
- Form skrining sesuai standar
- Skor* (auto-calculate)
- Risiko Malnutrisi* (auto-determine)

**Diagnosa Gizi (Format PES):**
- Problem* (dropdown + text)
- Etiologi* (textarea)
- Sign/Symptom* (textarea)

**Intervensi:**
- Tujuan Intervensi*
- Rencana Diet*
- Monitoring & Evaluasi

### 5.3 Dashboard Order Diet (untuk Instalasi Gizi)

**Filter:**
- Tanggal
- Ruangan
- Jenis Diet
- Bentuk Makanan

**Tampilan Grid:**
| Kamar | Bed | Pasien | Diet | Bentuk | Keterangan | Status |
|-------|-----|--------|------|--------|------------|--------|

**Aksi:**
- Lihat Detail
- Update Status
- Cetak

### 5.4 Form Perencanaan Menu Harian

**Header:**
- Tanggal Menu*
- Siklus Menu* (dropdown: Siklus 1/2/3/dst)

**Per Waktu Makan:**
| Waktu | Diet | Bentuk | Menu Pokok | Lauk Hewani | Lauk Nabati | Sayur | Buah | Minuman |
|-------|------|--------|------------|-------------|-------------|-------|------|---------|
| Pagi | [all] | [all] | [select] | [select] | [select] | [select] | [select] | [select] |
| Snack Pagi | ... | ... | ... | ... | ... | ... | ... | ... |
| Siang | ... | ... | ... | ... | ... | ... | ... | ... |
| Snack Sore | ... | ... | ... | ... | ... | ... | ... | ... |
| Sore | ... | ... | ... | ... | ... | ... | ... | ... |

### 5.5 Form Produksi Makanan

**Header:**
- Tanggal Produksi*
- Waktu Makan* (dropdown)

**Rekap Kebutuhan (auto-generate dari order aktif):**
| Jenis Diet | Bentuk | Jumlah Porsi |
|------------|--------|--------------|
| Diet DM | Biasa | 15 |
| Diet DM | Lunak | 5 |
| Diet Jantung | Biasa | 10 |
| ... | ... | ... |
| **Total** | | **XX** |

**Checklist Produksi:**
- [ ] Bahan baku sudah disiapkan
- [ ] Cek expired bahan
- [ ] Cek kebersihan dapur
- [ ] Produksi dimulai

**Catatan Produksi** (textarea)

### 5.6 Form Distribusi Makanan

**Filter:**
- Ruangan
- Waktu Makan

**Checklist Distribusi per Pasien:**
| Kamar | Bed | Pasien | Diet | Status | Waktu | Catatan |
|-------|-----|--------|------|--------|-------|---------|
| 101 | A | Budi | DM-Lunak | [dropdown] | [auto] | [input] |

**Status Options:**
- Diterima
- Ditolak (wajib isi alasan)
- Pasien Tidak Ada
- Puasa

### 5.7 Form Monitoring Asupan

**Data Pasien (read-only):**
- Nama / Kamar / Bed
- Jenis Diet

**Input per Waktu Makan:**
| Komponen | Habis | 3/4 | 1/2 | 1/4 | Tidak Makan |
|----------|-------|-----|-----|-----|-------------|
| Makanan Pokok | (o) | (o) | (o) | (o) | (o) |
| Lauk Hewani | (o) | (o) | (o) | (o) | (o) |
| Lauk Nabati | (o) | (o) | (o) | (o) | (o) |
| Sayur | (o) | (o) | (o) | (o) | (o) |
| Buah | (o) | (o) | (o) | (o) | (o) |

**Tambahan:**
- Ada Makanan dari Luar? (checkbox)
- Catatan/Keluhan (textarea)

### 5.8 Form Konseling Gizi

**Data Pasien:**
- Informasi pasien (read-only)
- Riwayat konseling sebelumnya (jika ada)

**Asesmen:**
- Data antropometri terkini
- Diagnosa medis
- Diagnosa gizi (PES format)

**Edukasi:**
- Topik Edukasi* (multi-select checkbox)
- Materi yang Diberikan* (textarea)
- Media Edukasi (checkbox):
  - [ ] Leaflet
  - [ ] Booklet
  - [ ] Food Model
  - [ ] Gambar/Poster
  - [ ] Video

**Evaluasi:**
- Respon/Pemahaman Pasien* (textarea)
- Kendala yang Dihadapi (textarea)
- Rencana Tindak Lanjut (textarea)
- Jadwal Kontrol Berikutnya (date)

---

## 6. Fitur Pendukung

### 6.1 Dashboard Instalasi Gizi

**Widget:**
- Total Pasien dengan Order Diet Aktif
- Rekap per Jenis Diet
- Rekap per Ruangan
- Order Diet Baru Hari Ini
- Alert Diet Khusus (alergi, pantangan)

### 6.2 Kalkulator Kebutuhan Gizi

**Input:**
- Berat Badan
- Tinggi Badan
- Usia
- Jenis Kelamin
- Aktivitas Fisik
- Faktor Stres (kondisi medis)

**Output:**
- BMR (Basal Metabolic Rate)
- TEE (Total Energy Expenditure)
- Kebutuhan Protein
- Kebutuhan Cairan

### 6.3 Siklus Menu Generator

**Fitur:**
- Setup siklus menu (7 hari/10 hari)
- Copy siklus
- Variasi menu per diet
- Kalkulasi nutrisi otomatis

### 6.4 Laporan Asupan Pasien

**Per Pasien:**
- Grafik asupan harian
- Perbandingan dengan target
- Trend berat badan

### 6.5 Manajemen Alergen

**Fitur:**
- Database alergen per menu
- Warning saat distribusi ke pasien dengan alergi
- Substitusi menu otomatis

---

## 7. Integrasi dengan Modul Lain

| Modul Sumber | Data yang Diterima | Penggunaan |
|--------------|--------------------|--------------------|
| EMR | Order diet, diagnosa | Trigger pelayanan |
| Pendaftaran | Data pasien | Identifikasi |
| Rawat Inap | Status pasien, kamar | Distribusi |

| Modul Tujuan | Data yang Dikirim | Trigger |
|--------------|-------------------|---------|
| Billing | Biaya makan | Per hari |
| EMR | Catatan asupan, konseling | Setelah monitoring |
| Gudang | Permintaan bahan makanan | Harian |

---

## 8. Aturan Bisnis (Business Rules)

1. Setiap pasien rawat inap **wajib** memiliki order diet
2. Order diet **default** adalah Diet Biasa jika tidak ada order khusus
3. **Perubahan diet** harus dengan order baru dari dokter
4. **Alergi makanan** harus dicek sebelum distribusi
5. Pasien **puasa** (pre-op) harus ditandai dalam sistem
6. **Monitoring asupan** dilakukan setiap waktu makan
7. Pasien dengan asupan < 50% selama 3 hari berturut-turut harus **dilaporkan ke dokter**
8. **Menu harian** harus dipersiapkan H-1
9. Produksi makanan harus dimulai sesuai jadwal standar
10. **Konseling gizi** wajib untuk pasien DM, GGK, Malnutrisi

---

## 9. Kebutuhan Teknis

### 9.1 Permission/Role

| Role | Akses |
|------|-------|
| Ahli Gizi | Asesmen, konseling, perencanaan menu |
| Dietisien | Monitoring asupan, konseling |
| Pramusaji | Distribusi, input monitoring |
| Juru Masak | Produksi |
| Supervisor Gizi | Semua + laporan + master |

### 9.2 Laporan

**Laporan Harian:**
- Rekap order diet
- Daftar produksi
- Laporan distribusi
- Pasien dengan asupan rendah

**Laporan Bulanan:**
- Statistik pelayanan gizi
- Penggunaan bahan makanan
- Sisa makanan (food waste)
- Kepuasan pasien

**Laporan Khusus:**
- Pasien dengan intervensi gizi
- Hasil monitoring status gizi
- Konseling gizi

---

## 10. Notifikasi

| Event | Penerima | Channel |
|-------|----------|---------|
| Order diet baru | Ahli Gizi | Push |
| Perubahan diet | Instalasi Gizi | Push |
| Pasien dengan alergi | Pramusaji | Alert |
| Asupan rendah 3 hari | Ahli Gizi + Dokter | Push |
| Pasien pulang | Instalasi Gizi | Update |
