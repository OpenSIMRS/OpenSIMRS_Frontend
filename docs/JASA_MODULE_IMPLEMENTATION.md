# Implementasi Modul Jasa Pelayanan - Frontend

Dokumentasi implementasi frontend modul Jasa Pelayanan (Service Fee) berdasarkan spesifikasi dalam `docs/features/09-jasa-pelayanan.md`.

## 📋 Ringkasan

Modul Jasa Pelayanan adalah sistem untuk mengelola perhitungan dan distribusi jasa pelayanan kepada tenaga medis dan non-medis. Implementasi ini mencakup 7 halaman utama dengan fitur lengkap sesuai requirement.

## 🎯 Tech Stack

- **Framework**: SvelteKit 2.x dengan TypeScript
- **UI Library**: shadcn-svelte (custom implementation)
- **Styling**: Tailwind CSS 4.x
- **Data Format**: JSON (dummy data)
- **State Management**: Svelte stores

## 📁 Struktur File

```
src/
├── lib/
│   ├── components/
│   │   └── ui/
│   │       ├── button.svelte       # Komponen button
│   │       └── card.svelte         # Komponen card
│   ├── data/
│   │   └── jasa-dummy.json         # Dummy data lengkap
│   ├── types/
│   │   └── jasa.ts                 # TypeScript types (16 types)
│   └── utils.ts                    # Utility functions (cn)
└── routes/
    └── jasa/
        ├── +page.svelte            # Dashboard
        ├── approval/
        │   └── +page.svelte        # Approval jasa
        ├── formula/
        │   └── +page.svelte        # Setting formula
        ├── kalkulasi/
        │   └── +page.svelte        # Kalkulasi periode
        ├── laporan/
        │   └── +page.svelte        # Laporan per unit
        ├── pelaksana/
        │   └── +page.svelte        # Input pelaksana
        └── slip/
            └── +page.svelte        # Slip individual

docs/
└── API_ENDPOINTS_JASA.md          # Dokumentasi API endpoints
```

## 🎨 Halaman yang Diimplementasikan

### 1. Dashboard Jasa Pelayanan
**Route**: `/jasa`

**Fitur**:
- Summary cards (Total jasa bulan ini, Perbandingan, Total penerima)
- Tabel top 10 penerima jasa
- Progress bar distribusi per unit
- Tabel trend 12 bulan terakhir

**Data yang ditampilkan**:
- `DashboardJasa` type dengan data trend, distribusi, dan top performers

### 2. Setting Formula Jasa
**Route**: `/jasa/formula`

**Fitur**:
- Tabel daftar formula dengan filter dan status
- Modal form create/edit formula
- Validasi total persentase komponen = 100%
- View distribusi per peran

**Validasi**:
- Kode formula wajib diisi
- Komponen jasa medis + sarana + RS = 100%
- Tanggal berlaku wajib diisi

### 3. Kalkulasi Jasa Periode
**Route**: `/jasa/kalkulasi`

**Fitur**:
- Filter periode (tahun, bulan, unit, pegawai)
- Preview hasil kalkulasi
- Summary total pegawai dan total jasa
- Export Excel
- Simpan draft / Submit approval

**Data yang diproses**:
- `AkumulasiJasa` dengan breakdown per jenis jasa

### 4. Slip Jasa Individual
**Route**: `/jasa/slip`

**Fitur**:
- Pilih pegawai dan periode
- Preview slip dengan format cetak
- Rincian per tindakan dengan detail pasien
- Perhitungan bruto, potongan, netto
- Print dan download PDF

**Format slip**:
- Header periode dan data pegawai
- Rincian tindakan dengan tanggal dan nilai
- Summary dengan potongan pajak
- Footer tanggal cetak

### 5. Input Pelaksana Tindakan
**Route**: `/jasa/pelaksana`

**Fitur**:
- Pilih tindakan dari daftar
- Form input multi-pelaksana
- Auto-calculate nilai jasa berdasarkan persentase
- Validasi total persentase = 100%
- Validasi operator wajib ada

**Validasi**:
- Minimal 1 pelaksana
- Operator wajib diisi
- Total persentase = 100%
- Semua pegawai harus dipilih

### 6. Approval Jasa
**Route**: `/jasa/approval`

**Fitur**:
- Daftar pending approval dengan summary
- Detail akumulasi dengan rincian tindakan
- Approve/Reject individual atau batch
- Filter berdasarkan status

**Status yang ditangani**:
- DRAFT (pending approval)
- APPROVED
- PAID

### 7. Laporan Jasa per Unit
**Route**: `/jasa/laporan`

**Fitur**:
- Filter tahun, bulan, dan unit
- Summary total jasa, rata-rata, top performer
- Tabel rincian per pegawai
- Visualisasi distribusi dengan progress bar
- Export Excel dan PDF

## 📊 TypeScript Types

File `src/lib/types/jasa.ts` berisi 16 tipe data lengkap:

### Enum Types
- `PeranTindakan`: OPERATOR, ASISTEN_1, ASISTEN_2, ANESTESI, PERAWAT, LAINNYA
- `StatusPelaksana`: PENDING, CALCULATED, PAID
- `StatusAkumulasi`: DRAFT, APPROVED, PAID
- `StatusPeriode`: OPEN, CALCULATING, CLOSED, PAID

### Main Types
- `PelaksanaTindakan`: Data pelaksana tindakan
- `FormulaJasa`: Formula perhitungan jasa
- `DistribusiFormula`: Distribusi per peran
- `AkumulasiJasa`: Akumulasi jasa pegawai
- `AkumulasiJasaDetail`: Detail rincian jasa
- `TemplatePeran`: Template peran tindakan
- `PeriodeJasa`: Periode jasa

### Supporting Types
- `Pegawai`: Data pegawai
- `Tindakan`: Data tindakan medis
- `KategoriTindakan`: Kategori tindakan

### Form Types
- `InputPelaksana`: Input form pelaksana
- `InputFormulaJasa`: Input form formula
- `FilterKalkulasiJasa`: Filter kalkulasi
- `PreviewKalkulasi`: Preview hasil kalkulasi
- `SlipJasa`: Data slip jasa
- `LaporanJasaUnit`: Laporan per unit
- `DashboardJasa`: Data dashboard

## 🔌 API Endpoints

Dokumentasi lengkap ada di `docs/API_ENDPOINTS_JASA.md` mencakup:

### 11 Grup Endpoint
1. Pegawai (GET /pegawai, GET /pegawai/:id)
2. Tindakan (GET /tindakan, GET /tindakan/:id)
3. Kategori Tindakan (GET /kategori-tindakan)
4. Formula Jasa (GET/POST/PUT/DELETE /jasa/formula)
5. Pelaksana Tindakan (POST/GET/PUT /jasa/pelaksana)
6. Periode Jasa (GET/POST /jasa/periode)
7. Kalkulasi Jasa (POST/GET /jasa/kalkulasi)
8. Akumulasi Jasa (GET /jasa/akumulasi, POST /jasa/akumulasi/approve)
9. Slip Jasa (GET /jasa/slip/:pegawai_id)
10. Laporan Jasa (GET /jasa/laporan/unit)
11. Dashboard Jasa (GET /jasa/dashboard)

## 📦 Dummy Data

File `src/lib/data/jasa-dummy.json` berisi:
- 5 pegawai dengan berbagai jabatan
- 3 kategori tindakan
- 3 tindakan medis
- 2 formula jasa dengan distribusi
- 3 pelaksana tindakan
- 2 periode jasa
- 3 akumulasi jasa dengan detail
- Data dashboard lengkap

## 🎨 UI Components

### Card Component
```svelte
<Card class="p-6">
  <!-- Content -->
</Card>
```

### Button Component
```svelte
<Button on:click={handler}>Text</Button>
<Button variant="outline">Text</Button>
<Button variant="destructive">Text</Button>
<Button size="sm">Text</Button>
```

## 🚀 Cara Menjalankan

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

### Routes
- Dashboard: http://localhost:5173/jasa
- Formula: http://localhost:5173/jasa/formula
- Kalkulasi: http://localhost:5173/jasa/kalkulasi
- Slip: http://localhost:5173/jasa/slip
- Pelaksana: http://localhost:5173/jasa/pelaksana
- Approval: http://localhost:5173/jasa/approval
- Laporan: http://localhost:5173/jasa/laporan

## ✅ Fitur Lengkap

- ✅ TypeScript untuk semua komponen
- ✅ Dummy data JSON untuk development
- ✅ Validasi form sesuai business rules
- ✅ Format currency Indonesian Rupiah
- ✅ Format date Indonesian locale
- ✅ Responsive design
- ✅ Print-friendly (slip jasa)
- ✅ Modal dialogs
- ✅ Tables dengan pagination ready
- ✅ Progress bars dan charts
- ✅ Export buttons (Excel, PDF)
- ✅ Authentication code intact

## 🔒 Authentication

Kode autentikasi tetap utuh dan tidak diubah:
- `src/lib/axios-instance.ts` - Token management
- `src/routes/login/+page.svelte` - Login page
- Bearer token support dalam axios interceptor

## 📝 Business Rules Implemented

Sesuai dokumentasi:
1. ✅ Operator wajib diisi
2. ✅ Total persentase pelaksana = 100%
3. ✅ Komponen tarif (medis + sarana + RS) = 100%
4. ✅ Potongan pajak 5%
5. ✅ Status flow: DRAFT → APPROVED → PAID
6. ✅ Periode flow: OPEN → CALCULATING → CLOSED → PAID

## 🎯 Next Steps

Untuk integrasi dengan backend:
1. Replace dummy data dengan API calls
2. Implement real export functionality
3. Add authentication guards
4. Add loading states
5. Add error handling
6. Implement pagination
7. Add search/filter functionality
8. Add notification system

## 📚 Referensi

- Design docs: `docs/features/09-jasa-pelayanan.md`
- API docs: `docs/API_ENDPOINTS_JASA.md`
- Project structure: `docs/PROJECT_STRUCTURE.md`
- SvelteKit: https://kit.svelte.dev
- Tailwind CSS: https://tailwindcss.com
