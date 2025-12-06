# TypeScript Types

Folder ini berisi semua TypeScript type definitions untuk aplikasi OpenSIMRS Frontend. Types diorganisir berdasarkan modul/domain untuk kemudahan maintenance.

## File Structure

### Core Types

- **`index.ts`** - Export semua types dari sub-modules

### Domain-Specific Types

- **`master-data.types.ts`** - Types untuk master data (Patient, Employee, ICD, Ruangan, dll)
- **`pendaftaran.types.ts`** - Types untuk pendaftaran dan admisi
- **`emr.types.ts`** - Types untuk Electronic Medical Record
- **`laboratorium.types.ts`** - Types untuk laboratorium
- **`radiologi.types.ts`** - Types untuk radiologi
- **`farmasi.types.ts`** - Types untuk farmasi/apotek
- **`billing.types.ts`** - Types untuk billing dan kasir
- **`jasa-pelayanan.types.ts`** - Types untuk jasa pelayanan
- **`common.types.ts`** - Types untuk audit trail, dashboard, notifikasi

### Base Types

Base types didefinisikan di `src/lib/types.ts`:

```typescript
// Generic HTTP Response
export type HttpResponse<T, M = undefined> = {
  message: string;
  data: T;
  meta?: M;
};

// GORM Model (timestamp fields)
export type GormModel = {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
}

// Pagination Meta
export type PaginatedMeta = {
  total_count: number;
  total_page: number;
  page: number;
  count: number;
}
```

## Usage

### Import Types

```typescript
// Import specific types
import type { Patient, Employee } from '$lib/types';

// Import from specific module
import type { EMRRecord, Resep } from '$lib/types/emr.types';

// Import everything
import type * as Types from '$lib/types';
```

### Use with API Response

```typescript
import type { HttpResponse, Patient, PaginatedMeta } from '$lib/types';

// Single item response
const response: HttpResponse<Patient> = await api.get('/v1/master/patients/123');
const patient: Patient = response.data;

// List with pagination
const listResponse: HttpResponse<Patient[], PaginatedMeta> = 
  await api.get('/v1/master/patients');
const patients: Patient[] = listResponse.data;
const meta: PaginatedMeta = listResponse.meta!;
```

### Use with Component Props

```typescript
<script lang="ts">
  import type { Patient } from '$lib/types';
  
  type Props = {
    patient: Patient;
    onUpdate?: (patient: Patient) => void;
  };
  
  let { patient, onUpdate }: Props = $props();
</script>

<div>
  <h2>{patient.Nama}</h2>
  <p>No. RM: {patient.NoRM}</p>
</div>
```

### Use with Stores

```typescript
import { writable, type Writable } from 'svelte/store';
import type { Patient } from '$lib/types';

export const selectedPatient: Writable<Patient | null> = writable(null);

// Usage
selectedPatient.set(patient);
selectedPatient.subscribe(value => {
  console.log('Selected patient:', value);
});
```

### Type Guards

```typescript
import type { Kunjungan } from '$lib/types';

function isRawatJalan(kunjungan: Kunjungan): boolean {
  return kunjungan.JenisKunjungan === 'Rawat Jalan';
}

function isIGD(kunjungan: Kunjungan): boolean {
  return kunjungan.JenisKunjungan === 'IGD';
}
```

### Utility Types

```typescript
// Partial update types
type PatientUpdate = Partial<Omit<Patient, 'ID' | 'NoRM'>>;

// Required fields only
type PatientCreate = Omit<Patient, 'ID' | keyof GormModel>;

// Pick specific fields
type PatientSummary = Pick<Patient, 'ID' | 'NoRM' | 'Nama' | 'TanggalLahir'>;
```

## Type Naming Conventions

1. **PascalCase** untuk type names (e.g., `Patient`, `EMRRecord`)
2. **Specific names** untuk domain entities (e.g., `OrderLab`, `ResepFarmasi`)
3. **Descriptive** field names dalam Bahasa Indonesia untuk domain terms
4. **Consistent** dengan backend model names

## Field Naming Conventions

1. **PascalCase** untuk field names (sesuai dengan Go backend)
2. **Bahasa Indonesia** untuk domain-specific fields (e.g., `Nama`, `Alamat`)
3. **English** untuk technical fields (e.g., `ID`, `Status`, `CreatedAt`)
4. **Specific enums** untuk status fields (e.g., `'Aktif' | 'Nonaktif'`)

## Adding New Types

Ketika menambah type baru:

1. **Identifikasi domain** - Tentukan module yang sesuai
2. **Extend GormModel** - Untuk entities yang disimpan di database
3. **Export di index.ts** - Untuk kemudahan import
4. **Update dummy data** - Buat JSON file yang sesuai
5. **Document in comments** - Tambahkan JSDoc comments untuk field yang kompleks

Example:

```typescript
// src/lib/types/new-module.types.ts
import type { GormModel } from '../types';

/**
 * Represents a new entity in the system
 */
export type NewEntity = {
  ID: string;
  /** The name of the entity */
  Nama: string;
  /** Status of the entity */
  Status: 'Aktif' | 'Nonaktif';
  /** Optional description */
  Deskripsi?: string;
} & GormModel;

/**
 * Detail item for NewEntity
 */
export type NewEntityDetail = {
  ID: string;
  NewEntityID: string;
  ItemName: string;
  Quantity: number;
} & GormModel;
```

Then export in `index.ts`:

```typescript
export * from './new-module.types';
```

## Common Patterns

### Optional Fields

Use `?` for optional fields:

```typescript
export type Patient = {
  ID: string;
  Nama: string;
  Email?: string;  // Optional
  NomorKartuBPJS?: string;  // Optional
}
```

### Union Types for Status

Use union types for status fields:

```typescript
export type Kunjungan = {
  StatusKunjungan: 'Terdaftar' | 'Sedang Dilayani' | 'Selesai' | 'Batal';
}
```

### Arrays for Multiple Items

```typescript
export type Patient = {
  Alergi?: string[];  // Array of allergies
  DiagnosisSekunder?: string[];  // Array of ICD-10 IDs
}
```

### References to Other Entities

Use string ID for references:

```typescript
export type Kunjungan = {
  PasienID: string;  // Reference to Patient.ID
  DokterID?: string;  // Reference to Employee.ID
  PenjaminID: string;  // Reference to Penjamin.ID
}
```

### Extending Base Types

All database entities extend `GormModel`:

```typescript
export type Patient = {
  ID: string;
  Nama: string;
  // ... other fields
} & GormModel;  // Adds CreatedAt, UpdatedAt, DeletedAt
```

## Type Safety Best Practices

1. **Avoid `any`** - Always use specific types
2. **Use `unknown`** when type is truly unknown
3. **Type assertions** should be minimal and justified
4. **Discriminated unions** for complex states
5. **Generic types** for reusable components

### Example: Discriminated Unions

```typescript
type ApiState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: T }
  | { status: 'error', error: string };

// Usage
let patientState: ApiState<Patient> = { status: 'idle' };

// Type narrowing
if (patientState.status === 'success') {
  console.log(patientState.data.Nama);  // TypeScript knows data exists
}
```

## Integration with API

Types should match API response structure:

```typescript
// Backend Go struct
type Patient struct {
    ID              string
    NoRM            string
    Nama            string
    // ...
    gorm.Model
}

// Frontend TypeScript type
export type Patient = {
    ID: string;
    NoRM: string;
    Nama: string;
    // ...
} & GormModel;
```

## Validation

For runtime validation, consider using libraries like:
- `zod` - Schema validation
- `yup` - Object schema validation
- `io-ts` - Runtime type checking

Example with Zod:

```typescript
import { z } from 'zod';

const PatientSchema = z.object({
  ID: z.string(),
  NoRM: z.string(),
  NIK: z.string().length(16),
  Nama: z.string().min(1),
  TanggalLahir: z.string().datetime(),
  JenisKelamin: z.enum(['L', 'P']),
  // ...
});

// Use for validation
const result = PatientSchema.safeParse(data);
if (result.success) {
  const patient: Patient = result.data;
}
```

## Testing Types

TypeScript types are checked at compile time, but you can test runtime behavior:

```typescript
import { describe, it, expect } from 'vitest';
import type { Patient } from '$lib/types';
import patientsData from '$lib/data/patients.json';

describe('Patient Type', () => {
  it('should have correct structure', () => {
    const patient = patientsData[0] as Patient;
    
    expect(patient).toHaveProperty('ID');
    expect(patient).toHaveProperty('NoRM');
    expect(patient).toHaveProperty('Nama');
    expect(patient).toHaveProperty('CreatedAt');
    expect(patient).toHaveProperty('UpdatedAt');
    expect(patient).toHaveProperty('DeletedAt');
  });
});
```

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [SvelteKit TypeScript](https://kit.svelte.dev/docs/types)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/$props)
