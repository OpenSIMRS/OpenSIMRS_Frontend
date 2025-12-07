# Visual Flow Guide - Rawat Jalan Implementation

## 🎨 Implemented Pages & Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          LOGIN PAGE (✅)                            │
│  - Clean card-based design                                          │
│  - Email & password inputs                                          │
│  - Dummy authentication (any credentials work)                      │
│  - Auto-redirect to dashboard                                       │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DASHBOARD (✅)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │ 🔍 Cari     │  │ 👤 Daftar   │  │ 📋 Daftar   │                │
│  │   Pasien    │  │   Pasien    │  │   Kunjungan │                │
│  │             │  │   Baru      │  │             │                │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                │
│  ┌─────────────┐  ┌─────────────┐                                  │
│  │ 🏥 Antrian  │  │ ⚙️  Master  │                                  │
│  │   Poli      │  │    Data     │                                  │
│  │             │  │             │                                  │
│  └──────┬──────┘  └──────┬──────┘                                  │
└─────────┼──────────────────┼──────────────────────────────────────┘
          │                  │
          │                  └────────────────────┐
┌─────────▼────────────────────┐                 │
│  PATIENT SEARCH (✅)         │                 │
│  - Search by:                │                 │
│    • No. RM                  │                 │
│    • NIK                     │                 │
│    • Name                    │                 │
│    • Phone                   │                 │
│  - Table results             │                 │
│  - Select → Visit Reg        │                 │
└─────────┬────────────────────┘                 │
          │                                      │
          │  ┌───────────────────────────────────▼──────┐
          │  │  PATIENT REGISTRATION (✅)               │
          │  │  - Personal data form                    │
          │  │  - Auto-generate No. RM                  │
          │  │  - Address with area code                │
          │  │  - Family information                    │
          │  │  - Submit → Visit Reg                    │
          │  └───────────────────┬──────────────────────┘
          │                      │
          └──────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   VISIT REGISTRATION (✅)                           │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ PATIENT INFO (Read-only)                                       │ │
│  │ No. RM: 2501-00001  │  NIK: 3201011990010001                  │ │
│  │ Name: Andi Wijaya   │  DOB: 01/01/1990                        │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  Form Fields:                                                        │
│  - Date & Time (default: now)                                       │
│  - Select Poli → Filters Doctors                                    │
│  - Select Doctor                                                     │
│  - Select Insurance (Umum/BPJS/Asuransi)                            │
│  - Insurance card number (if applicable)                            │
│  - Chief complaint (optional)                                       │
│                                                                      │
│  Submit → Generates:                                                │
│  - Registration No. (YYYYMMDD-XXXX)                                 │
│  - Queue Number (per poli, per day)                                 │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      POLI QUEUE (✅)                                │
│  Filters: [Date] [Poli] [Status]                            [🔄]    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ Queue │ No.RM  │ Name        │ Poli  │ Doctor │ Status │ Action││
│  ├────────────────────────────────────────────────────────────────┤ │
│  │   1   │ 2501-1 │ Andi Wijaya │ Umum  │ dr.A   │ ⭕ Daftar│ ✓  ││
│  │   2   │ 2501-2 │ Siti N.     │ Umum  │ dr.A   │ 🟡 Dilayani│ ✓││
│  │   3   │ 2501-3 │ Budi S.     │ Anak  │ dr.B   │ ⭕ Daftar│ ✓  ││
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  Actions:                                                            │
│  - View queue filtered by poli/date/status                          │
│  - Accept patient (Daftar → Dilayani)                               │
│  - Complete visit (Dilayani → Selesai)                              │
│  - Navigate to EMR (when accept is clicked)                         │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
               ┌──────────────────────┐
               │  EMR FORMS (⏳ TODO) │
               ├──────────────────────┤
               │  1. Nursing Assess.  │
               │  2. Doctor SOAP      │
               └──────────────────────┘
```

## 📊 Data Structure

```
Master Data (JSON Files):
├── master-lookup.json    ─── Reference data (Agama, Pendidikan, Pekerjaan, etc.)
├── pasien.json          ─── Sample patients (4 records)
├── poli.json            ─── Polyclinics (8 poli)
├── dokter.json          ─── Doctors (8 doctors, linked to poli)
├── ruangan.json         ─── Rooms (6 rooms)
├── tindakan.json        ─── Medical procedures (10 procedures)
└── penjamin.json        ─── Insurance (5 payment methods)

Transaction Data (In-Memory):
├── kunjunganStore[]     ─── Visit records
├── asesmenStore[]       ─── Nursing assessments
└── soapStore[]          ─── SOAP records
```

## 🎨 Design System

**Colors:**
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Gray scale: 50-900

**Components:**
- Cards with shadow-md
- Rounded corners (rounded-lg)
- Clean inputs with focus:ring-2
- Buttons with hover states
- Tables with hover:bg-gray-50
- Status badges with color-coded backgrounds

## 🔄 Status Flow

```
Visit Status:
DAFTAR (Registered) 
    ↓ (Nurse clicks "Terima")
DILAYANI (Being Served)
    ↓ (Nurse/Doctor clicks "Selesai")
SELESAI (Completed)

Alternative:
DAFTAR → BATAL (Cancelled)
```

## 📱 Responsive Design

All pages are responsive with:
- Mobile: Single column
- Tablet: 2 columns (md:)
- Desktop: 3-4 columns (lg:)
- Max width containers (max-w-7xl, max-w-4xl)

## 🔍 Search Capabilities

Patient Search supports:
- No. RM (Medical Record Number)
- NIK (National ID)
- Name (partial match)
- Phone number

Results are displayed in a sortable table with:
- Patient demographics
- Quick actions (Register Visit, View Detail)

## 📋 Form Validation

All forms include:
- Required field indicators (*)
- Input type validation (email, tel, date)
- Pattern validation (NIK: 16 digits)
- Disabled state handling
- Error messages
- Loading states

## 🚀 Future Pages (TODO)

```
Master Data Pages:
├── /master
│   ├── /pasien        ─── Patient master CRUD
│   ├── /poli          ─── Poli CRUD
│   ├── /dokter        ─── Doctor CRUD
│   ├── /ruangan       ─── Room CRUD
│   ├── /tindakan      ─── Procedure CRUD
│   ├── /penjamin      ─── Insurance CRUD
│   ├── /pengguna      ─── User CRUD
│   └── /lookup        ─── Lookup CRUD with category tabs
│       ├── Agama
│       ├── Pendidikan
│       ├── Pekerjaan
│       ├── Status Perkawinan
│       ├── Golongan Darah
│       └── Hubungan Keluarga

EMR Pages:
├── /emr
│   ├── /asesmen/[id]  ─── Nursing assessment form
│   └── /soap/[id]     ─── Doctor SOAP form
```

## 🎯 Testing Checklist

- [x] Login with any credentials
- [x] Navigate to all menu items
- [x] Search patient by different criteria
- [x] Register new patient
- [x] Verify auto-generated No. RM
- [x] Register visit for patient
- [x] Verify doctor filter by poli
- [x] View queue management
- [x] Filter queue by date/poli/status
- [x] Accept patient from queue
- [ ] Complete nursing assessment (TODO)
- [ ] Complete doctor SOAP (TODO)
- [ ] Complete visit
- [ ] Manage master data (TODO)

---

**Current Status**: Core flow ✅ | EMR & Master ⏳  
**Build Status**: ✅ Passing  
**Documentation**: ✅ Complete
