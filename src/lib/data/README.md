# Dummy Data

Folder ini berisi file JSON sebagai data dummy untuk development dan testing. Data ini dirancang untuk:

1. **Mudah diganti** - File JSON dapat dengan mudah di-replace dengan data dari API
2. **Type-safe** - Semua data memiliki TypeScript types yang sesuai
3. **Realistic** - Data mencerminkan struktur data yang sebenarnya akan digunakan
4. **Testing** - Dapat digunakan untuk testing komponen dan halaman

## Struktur File

### Master Data

- **`patients.json`** - Data pasien (Patient)
- **`employees.json`** - Data pegawai/staff (Employee)
- **`icd10.json`** - Kode diagnosis ICD-10
- **`ruangan.json`** - Data ruangan/unit pelayanan (Ruangan)
- **`barang.json`** - Data obat/alkes/BHP (Barang)
- **`penjamin.json`** - Data penjamin/asuransi (Penjamin)

### Transactional Data

- **`kunjungan.json`** - Data kunjungan pasien (Kunjungan)

## Penggunaan

### Import dalam Komponen Svelte

```typescript
import patientsData from '$lib/data/patients.json';
import employeesData from '$lib/data/employees.json';
import type { Patient, Employee } from '$lib/types';

// Use with type assertion
const patients: Patient[] = patientsData;
const employees: Employee[] = employeesData;
```

### Import dengan Type Checking

Untuk memastikan type safety, Anda dapat membuat helper function:

```typescript
// src/lib/utils/data-loader.ts
import patientsData from '$lib/data/patients.json';
import type { Patient } from '$lib/types';

export function loadPatients(): Patient[] {
	return patientsData as Patient[];
}
```

### Simulasi API Call

Untuk mensimulasikan delay API call:

```typescript
async function fetchPatients(): Promise<Patient[]> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 500));
	return patientsData as Patient[];
}
```

### Pagination Helper

```typescript
function paginateData<T>(data: T[], page: number, perPage: number) {
	const start = (page - 1) * perPage;
	const end = start + perPage;

	return {
		data: data.slice(start, end),
		meta: {
			total_count: data.length,
			total_page: Math.ceil(data.length / perPage),
			page: page,
			count: Math.min(perPage, data.length - start)
		}
	};
}

// Usage
const result = paginateData(patients, 1, 10);
```

### Search/Filter Helper

```typescript
function searchPatients(patients: Patient[], query: string): Patient[] {
	const lowerQuery = query.toLowerCase();
	return patients.filter(
		(patient) =>
			patient.Nama.toLowerCase().includes(lowerQuery) ||
			patient.NoRM.toLowerCase().includes(lowerQuery) ||
			patient.NIK.toLowerCase().includes(lowerQuery)
	);
}
```

## Migrasi ke API

Ketika backend API sudah siap, Anda dapat dengan mudah mengganti import JSON dengan API call:

### Before (JSON):

```typescript
import patientsData from '$lib/data/patients.json';
const patients = patientsData as Patient[];
```

### After (API):

```typescript
import api from '$lib/axios-instance';
import type { HttpResponse, Patient, PaginatedMeta } from '$lib/types';

const response = await api.get<HttpResponse<Patient[], PaginatedMeta>>('/v1/master/patients');
const patients = response.data.data;
```

### Abstraction Layer (Recommended):

Buat service layer untuk abstraksi:

```typescript
// src/lib/services/patient.service.ts
import type { Patient } from '$lib/types';
import api from '$lib/axios-instance';

// Development: Use JSON
import patientsData from '$lib/data/patients.json';
const USE_API = false;

export async function getPatients(): Promise<Patient[]> {
	if (USE_API) {
		const response = await api.get('/v1/master/patients');
		return response.data.data;
	} else {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 300));
		return patientsData as Patient[];
	}
}

export async function getPatientById(id: string): Promise<Patient | null> {
	if (USE_API) {
		const response = await api.get(`/v1/master/patients/${id}`);
		return response.data.data;
	} else {
		await new Promise((resolve) => setTimeout(resolve, 200));
		const patients = patientsData as Patient[];
		return patients.find((p) => p.ID === id) || null;
	}
}
```

Kemudian di komponen:

```typescript
import { getPatients, getPatientById } from '$lib/services/patient.service';

// Easy to switch between JSON and API
const patients = await getPatients();
const patient = await getPatientById('patient-001');
```

## Menambah Data Dummy

Untuk menambah data dummy baru:

1. **Buat TypeScript type** di `src/lib/types/`
2. **Buat file JSON** sesuai dengan type
3. **Export type** di `src/lib/types/index.ts`
4. **Gunakan type** saat import JSON

Example:

```typescript
// 1. Create type in src/lib/types/new-module.types.ts
export type NewEntity = {
	ID: string;
	Name: string;
	// ... other fields
} & GormModel;

// 2. Create src/lib/data/new-entities.json
[
	{
		ID: 'new-001',
		Name: 'Example',
		// ...
		CreatedAt: '2024-01-01T08:00:00Z',
		UpdatedAt: '2024-01-01T08:00:00Z',
		DeletedAt: null
	}
];

// 3. Export in src/lib/types/index.ts
export * from './new-module.types';

// 4. Use in component
import newEntitiesData from '$lib/data/new-entities.json';
import type { NewEntity } from '$lib/types';

const entities: NewEntity[] = newEntitiesData;
```

## Best Practices

1. **Konsisten dengan Backend** - Struktur data harus sama dengan response API backend
2. **Realistic Data** - Gunakan data yang realistis untuk testing yang lebih baik
3. **Type Safety** - Selalu gunakan TypeScript types
4. **Service Layer** - Buat abstraction layer untuk mudah switch antara JSON dan API
5. **Mock Pagination** - Implementasikan pagination di dummy data untuk simulasi yang lebih real
6. **Error Cases** - Pertimbangkan untuk membuat dummy data untuk error cases juga

## Update Data

Data dummy ini harus di-update ketika:

- Ada perubahan pada TypeScript types
- Ada perubahan pada struktur database
- Butuh test case baru
- Butuh data dengan kondisi spesifik

## Notes

- ⚠️ **Jangan gunakan data dummy untuk production**
- ✅ Data dummy sudah include field `CreatedAt`, `UpdatedAt`, `DeletedAt` sesuai dengan `GormModel`
- ✅ Semua ID menggunakan format yang konsisten (e.g., `patient-001`, `emp-001`)
- ✅ Data sudah include relasi antar entitas (e.g., `PasienID`, `DokterID`)
