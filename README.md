# OpenSIMRS Frontend

Frontend application untuk OpenSIMRS (Sistem Informasi Manajemen Rumah Sakit) yang dibangun dengan SvelteKit, TypeScript, dan Tailwind CSS.

## 📚 Dokumentasi

Dokumentasi lengkap tersedia di folder [`docs/`](./docs/):

- **[PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)** - Struktur project dan arsitektur aplikasi
- **[CORE_FEATURE.md](./docs/CORE_FEATURE.md)** - Deskripsi fitur inti dan alur pelayanan
- **[API_ENDPOINTS.md](./docs/API_ENDPOINTS.md)** - Dokumentasi lengkap API endpoints
- **[AUTH_STRUCTURE.md](./docs/AUTH_STRUCTURE.md)** - Struktur autentikasi dan cara konfigurasi
- **[INITIALIZATION_SUMMARY.md](./docs/INITIALIZATION_SUMMARY.md)** - Summary implementasi inisialisasi
- **[features/](./docs/features/)** - Dokumentasi detail per modul (15 modul)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ atau Bun
- npm, pnpm, atau yarn

### Installation

1. Clone repository:

```sh
git clone https://github.com/OpenSIMRS/OpenSIMRS_Frontend.git
cd OpenSIMRS_Frontend
```

2. Install dependencies:

```sh
npm install
```

3. Setup environment variables:

```sh
cp .env.example .env
```

Edit `.env` sesuai konfigurasi backend Anda:

```env
PUBLIC_BASE_API_URL=http://localhost:3000
```

4. Start development server:

```sh
npm run dev

# atau buka browser otomatis
npm run dev -- --open
```

## 🛠️ Development

### Available Scripts

```sh
npm run dev          # Start dev server
npm run build        # Build untuk production
npm run preview      # Preview production build
npm run check        # Type checking dengan svelte-check
npm run lint         # Run ESLint dan Prettier check
npm run format       # Format code dengan Prettier
```

### Project Structure

```
src/
├── lib/
│   ├── data/          # Dummy JSON data untuk development
│   ├── types/         # TypeScript type definitions
│   ├── components/    # Reusable Svelte components
│   ├── axios-instance.ts  # Axios configuration
│   ├── stores.ts      # Svelte stores
│   └── types.ts       # Base types
├── routes/            # SvelteKit file-based routing
│   ├── login/         # Login page
│   ├── +layout.svelte # Root layout
│   └── +page.svelte   # Home page
└── app.html           # HTML template
```

### Using Dummy Data

Project ini sudah include dummy data JSON untuk development:

```typescript
import patientsData from '$lib/data/patients.json';
import employeesData from '$lib/data/employees.json';
import type { Patient, Employee } from '$lib/types';

// Type-safe usage
const patients: Patient[] = patientsData;
const employees: Employee[] = employeesData;
```

Lihat [src/lib/data/README.md](./src/lib/data/README.md) untuk detail.

### TypeScript Types

Semua types sudah tersedia dan ter-organize per domain:

```typescript
import type { 
  Patient, Employee, ICD10, Ruangan,
  Kunjungan, EMRRecord, OrderLab, 
  Billing, ResepFarmasi 
} from '$lib/types';
```

Lihat [src/lib/types/README.md](./src/lib/types/README.md) untuk detail.

### Authentication

Auth sudah di-setup dengan JWT tokens. Untuk development lokal, auth dapat di-disable:

**Option 1: Environment Variable**

```env
PUBLIC_AUTH_ENABLED=false
```

**Option 2: Comment Interceptor**

Edit `src/lib/axios-instance.ts` dan comment auth interceptor.

Lihat [docs/AUTH_STRUCTURE.md](./docs/AUTH_STRUCTURE.md) untuk panduan lengkap.

## 🏗️ Tech Stack

- **Framework**: SvelteKit 2.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **HTTP Client**: Axios
- **Build Tool**: Vite 7.x

## 📦 Features

### Implemented

- ✅ JWT-based authentication structure
- ✅ TypeScript types untuk semua entities
- ✅ Dummy JSON data untuk development
- ✅ API endpoint documentation
- ✅ Project documentation
- ✅ Axios instance dengan interceptors
- ✅ Responsive layout dengan Tailwind

### Modules (Based on Documentation)

1. **Pendaftaran & Admisi** - Patient registration and visits
2. **EMR** - Electronic Medical Record dengan SOAP
3. **Laboratorium** - Laboratory Information System
4. **Radiologi** - Radiology Information System dengan PACS
5. **Farmasi/Apotek** - E-Prescription dan stok management
6. **Billing/Kasir** - Billing dan payment processing
7. **Jasa Pelayanan** - Service fee calculation
8. **Master Data** - Master data management
9. **Dashboard & Laporan** - Metrics dan reporting

## 🧪 Testing

### Type Checking

```sh
npm run check
```

### Linting

```sh
npm run lint
```

### Build Test

```sh
npm run build
```

## 📝 API Integration

### From JSON to API

Project sudah siap untuk integrasi dengan backend. Untuk switch dari dummy data ke API:

```typescript
// Before (JSON)
import patientsData from '$lib/data/patients.json';
const patients = patientsData as Patient[];

// After (API)
import api from '$lib/axios-instance';
const response = await api.get<HttpResponse<Patient[]>>('/v1/master/patients');
const patients = response.data.data;
```

Atau gunakan service layer pattern (recommended):

```typescript
// src/lib/services/patient.service.ts
export async function getPatients(): Promise<Patient[]> {
  const USE_API = import.meta.env.PUBLIC_USE_API === 'true';
  
  if (USE_API) {
    const response = await api.get('/v1/master/patients');
    return response.data.data;
  } else {
    await delay(300); // Simulate API
    return patientsData as Patient[];
  }
}
```

## 🔐 Security

- Auth structure menggunakan JWT tokens
- Automatic token refresh
- Secure header configuration
- Input validation dengan TypeScript

Lihat [docs/AUTH_STRUCTURE.md](./docs/AUTH_STRUCTURE.md) untuk security best practices.

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Style

Project menggunakan:
- Prettier untuk formatting
- ESLint untuk linting
- TypeScript untuk type checking

Run sebelum commit:

```sh
npm run format
npm run lint
npm run check
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- SvelteKit team untuk amazing framework
- Tailwind CSS untuk utility-first CSS
- Axios untuk HTTP client

## 📞 Support

Untuk pertanyaan atau issues, silakan buka issue di GitHub repository.

---

**Built with ❤️ for better healthcare management**
