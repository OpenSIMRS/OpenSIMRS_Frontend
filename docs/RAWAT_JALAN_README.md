# OpenSIMRS Frontend - Rawat Jalan Implementation

## 📋 Overview

This is the frontend implementation for OpenSIMRS (Sistem Informasi Manajemen Rumah Sakit) focusing on the **Rawat Jalan (Outpatient)** registration flow with master data management.

## ✅ Implemented Features

### 1. Authentication (Disabled for Testing)
- **Login Page** (`/login`)
  - Clean, professional design using Tailwind CSS
  - Dummy authentication (accepts any credentials)
  - Auth structure maintained but disabled for easy testing
  - Auto-redirects to dashboard after login

### 2. Dashboard (`/`)
- Main menu with navigation cards:
  - Cari Pasien (Patient Search)
  - Daftar Pasien Baru (New Patient Registration)
  - Daftar Kunjungan (Visit Registration)
  - Daftar Antrian Poli (Poli Queue)
  - Master Data

### 3. Patient Management
- **Patient Search** (`/pasien/search`)
  - Search by No. RM, NIK, Name, or Phone
  - Displays patient list in table format
  - Direct navigation to visit registration
  - View patient details

- **Patient Registration** (`/pasien/register`)
  - Complete patient registration form
  - Auto-generates Medical Record Number (No. RM)
  - Form sections:
    - Personal Identity (NIK, Name, DOB, Gender, etc.)
    - Address & Contact (with BPS area code support)
    - Family Information
  - Uses master lookup data for dropdowns
  - Form validation
  - Auto-redirect to visit registration after successful registration

### 4. Visit/Kunjungan Management
- **Visit Registration** (`/kunjungan/register`)
  - Patient selection (from search or direct link)
  - Date and time selection (defaults to current)
  - Poli (polyclinic) selection
  - Doctor selection (filtered by selected poli)
  - Insurance/payment method selection
  - Auto-generates registration number and queue number
  - Displays patient information summary

- **Poli Queue** (`/poli/antrian`)
  - List of registered visits
  - Filter by date, poli, and status
  - Queue number display
  - Status management (Terdaftar → Dilayani → Selesai)
  - Nurse can accept patients (changes status to "Dilayani")
  - Navigate to nursing assessment (link ready, page TODO)

### 5. Data Structure
- **TypeScript Types** - Complete type definitions for:
  - Master data (Patients, Poli, Doctors, Rooms, Procedures, Insurance)
  - Transactions (Visits, Assessments, SOAP)
  - Form inputs
  - API responses

- **Dummy Data** (JSON files):
  - `master-lookup.json` - Reference data (religion, education, occupation, etc.)
  - `pasien.json` - Sample patients
  - `poli.json` - Polyclinics
  - `dokter.json` - Doctors
  - `ruangan.json` - Rooms
  - `tindakan.json` - Medical procedures
  - `penjamin.json` - Insurance/payment methods

- **API Service Layer** (`lib/data/api-service.ts`):
  - Simulates backend API with async functions
  - CRUD operations for all master data
  - Patient search and management
  - Visit/kunjungan management
  - EMR services (nursing assessment & SOAP)
  - Ready for backend integration (just swap implementation)

### 6. Documentation
- **API Documentation** (`docs/API_DOCUMENTATION.md`)
  - Complete endpoint documentation
  - Request/response examples
  - Ready for backend team reference

- **Implementation Status** (`docs/IMPLEMENTATION_STATUS.md`)
  - Detailed task breakdown
  - File structure guide
  - Next steps and TODOs

## 🚧 Remaining Implementation

### EMR (Electronic Medical Record)
1. **Nursing Assessment Form** (`/emr/asesmen/[kunjungan_id]`)
   - Chief complaint
   - Medical history
   - Allergies
   - Vital signs
   - Pain assessment

2. **SOAP/Doctor Examination** (`/emr/soap/[kunjungan_id]`)
   - Subjective findings
   - Objective examination
   - Assessment/diagnosis
   - Plan/treatment
   - Complete visit functionality

### Master Data Management Pages (`/master/*`)
According to requirements, master data pages are organized as:

**Dedicated Pages** (for complex master data):
- `/master/pasien` - Patient master management
- `/master/poli` - Poli management
- `/master/dokter` - Doctor management
- `/master/ruangan` - Room management
- `/master/tindakan` - Medical procedures
- `/master/penjamin` - Insurance/payment methods
- `/master/pengguna` - User management

**Sub-pages** (for simple lookup data only):
- `/master/lookup` - Master lookup management with category tabs:
  - Agama (Religion)
  - Pendidikan (Education)
  - Pekerjaan (Occupation)
  - Status Perkawinan (Marital Status)
  - Golongan Darah (Blood Type)
  - Hubungan Keluarga (Family Relationship)

Each master page should have:
- Table view with pagination
- Search/filter functionality
- Add/Edit/Delete operations
- Form validation
- Active/inactive status toggle

## 🛠 Tech Stack

- **Framework**: SvelteKit 2.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **HTTP Client**: Axios
- **Build Tool**: Vite 7.x
- **Design**: Clean, professional UI with Fluent Design principles

## 📁 Project Structure

```
src/
├── lib/
│   ├── data/
│   │   ├── api-service.ts          # API service layer
│   │   ├── master-lookup.json      # Reference/lookup data
│   │   ├── pasien.json             # Patient dummy data
│   │   ├── poli.json               # Poli dummy data
│   │   ├── dokter.json             # Doctor dummy data
│   │   ├── ruangan.json            # Room dummy data
│   │   ├── tindakan.json           # Procedures dummy data
│   │   └── penjamin.json           # Insurance dummy data
│   ├── components/                  # Reusable components
│   ├── types.ts                     # TypeScript type definitions
│   ├── stores.ts                    # Svelte stores
│   ├── axios-instance.ts            # Axios configuration
│   └── index.ts                     # Library exports
├── routes/
│   ├── +layout.svelte               # Main layout
│   ├── +page.svelte                 # Dashboard
│   ├── login/
│   │   └── +page.svelte             # Login page ✅
│   ├── pasien/
│   │   ├── search/+page.svelte      # Patient search ✅
│   │   └── register/+page.svelte    # Patient registration ✅
│   ├── kunjungan/
│   │   └── register/+page.svelte    # Visit registration ✅
│   ├── poli/
│   │   └── antrian/+page.svelte     # Queue management ✅
│   ├── emr/                          # EMR pages (TODO)
│   │   ├── asesmen/
│   │   └── soap/
│   └── master/                       # Master data pages (TODO)
│       ├── pasien/
│       ├── poli/
│       ├── dokter/
│       ├── ruangan/
│       ├── tindakan/
│       ├── penjamin/
│       ├── pengguna/
│       └── lookup/
└── docs/
    ├── API_DOCUMENTATION.md         # API documentation
    └── IMPLEMENTATION_STATUS.md     # Implementation guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, pnpm, or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server
The app will be available at `http://localhost:5173`

### Login Credentials
Use any email and password - authentication is disabled for testing.

## 🔄 Complete Rawat Jalan Flow (Current Implementation)

1. **Login** → Any credentials accepted
2. **Dashboard** → Select menu option
3. **Patient Search** → Find existing patient OR **Patient Registration** → Register new patient
4. **Visit Registration** → Register outpatient visit
5. **Poli Queue** → Nurse views queue and accepts patient
6. *(TODO)* **Nursing Assessment** → Nurse fills assessment form
7. *(TODO)* **Doctor Examination** → Doctor fills SOAP form
8. *(TODO)* **Complete Visit** → Mark visit as complete

## 📝 Key Design Decisions

1. **Clean Tailwind Design**: Instead of Fluent UI React components (which don't work well with Svelte), we use Tailwind CSS with a clean, professional design inspired by Fluent Design principles.

2. **Dummy Data with JSON**: All master data stored in JSON files, transaction data in memory. Easy to swap with real API later.

3. **Type Safety**: Complete TypeScript coverage for all data models and API interactions.

4. **Modular API Service**: Clean separation between UI and data layer, ready for backend integration.

5. **Auth Structure Maintained**: Authentication code is commented out but structure is preserved for easy reactivation.

6. **Master Data Organization**: Following the requirement - complex master data gets dedicated pages, simple lookup data uses sub-pages.

## 🔐 Security Notes

- Current implementation uses dummy authentication
- No actual password hashing or token validation
- Ready for integration with real auth backend
- Auth structure is maintained in code (just disabled)

## 📖 Additional Documentation

- See `docs/CORE_FEATURE.md` for core feature requirements
- See `docs/features/` for detailed feature specifications
- See `docs/API_DOCUMENTATION.md` for API endpoint documentation
- See `docs/IMPLEMENTATION_STATUS.md` for implementation tracking

## 🤝 Contributing

This is a work-in-progress implementation. Remaining tasks are tracked in `docs/IMPLEMENTATION_STATUS.md`.

## 📄 License

See LICENSE file for details.

---

**Status**: Core outpatient registration flow implemented ✅  
**Next**: EMR forms and master data management pages 🚧
