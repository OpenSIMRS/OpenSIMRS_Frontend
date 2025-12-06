# Dokumentasi Struktur Project OpenSIMRS Frontend

## Overview

OpenSIMRS Frontend adalah aplikasi web berbasis SvelteKit dengan TypeScript yang menggunakan Tailwind CSS untuk styling dan Axios untuk HTTP client.

## Tech Stack

- **Framework**: SvelteKit 2.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **HTTP Client**: Axios
- **Build Tool**: Vite 7.x
- **Package Manager**: npm/pnpm/yarn

## Struktur Direktori

```
frontend/
├── docs/                          # Dokumentasi project
│   └── PROJECT_STRUCTURE.md       # Dokumentasi struktur project (file ini)
├── src/                           # Source code aplikasi
│   ├── lib/                       # Library dan utilities
│   │   ├── assets/                # Asset seperti gambar, font, dll
│   │   ├── components/            # Komponen Svelte yang dapat digunakan kembali
│   │   │   └── Stateful.svelte    # Komponen stateful
│   │   ├── axios-instance.ts      # Konfigurasi Axios dengan interceptor
│   │   ├── index.ts               # Entry point untuk library exports
│   │   ├── stores.ts              # Svelte stores global
│   │   └── types.ts               # Type definitions TypeScript
│   ├── routes/                    # File-based routing SvelteKit
│   │   ├── login/                 # Route untuk halaman login
│   │   │   └── +page.svelte       # Halaman login
│   │   ├── +layout.svelte         # Layout utama aplikasi
│   │   ├── +layout.ts             # Logic untuk layout
│   │   ├── +page.svelte           # Halaman home/landing page
│   │   └── layout.css             # Global CSS untuk layout
│   ├── app.d.ts                   # Global type declarations
│   └── app.html                   # HTML template utama
├── static/                        # File static (tidak diproses oleh Vite)
│   └── robots.txt                 # File robots.txt untuk SEO
├── .env.example                   # Template environment variables
├── eslint.config.js               # Konfigurasi ESLint
├── package.json                   # Dependencies dan scripts
├── README.md                      # Dokumentasi utama project
├── svelte.config.js               # Konfigurasi SvelteKit
├── tsconfig.json                  # Konfigurasi TypeScript
└── vite.config.ts                 # Konfigurasi Vite
```

## Detail Direktori dan File

### `/src/lib/`

Direktori ini berisi kode yang dapat digunakan kembali di seluruh aplikasi.

#### `axios-instance.ts`
- Konfigurasi instance Axios dengan base URL dari environment variable
- Mengatur request/response interceptors untuk:
  - Menambahkan access token ke setiap request
  - Menangani token refresh otomatis saat token expired
  - Error handling global
- Menyediakan `accessToken` store untuk manajemen autentikasi

#### `types.ts`
- Berisi type definitions untuk:
  - `HttpResponse<T, M>`: Generic type untuk response API
  - `GormModel`: Base model dengan timestamps (CreatedAt, UpdatedAt, DeletedAt)
  - `PaginatedMeta`: Type untuk metadata pagination
  - Type-type lain untuk data dari API

#### `stores.ts`
- Svelte stores global untuk state management
- Dapat berisi stores untuk user data, app state, dll

#### `components/`
- Komponen Svelte yang reusable
- `Stateful.svelte`: Komponen dengan state management

### `/src/routes/`

Direktori untuk file-based routing SvelteKit. Setiap folder/file merepresentasikan route di aplikasi.

#### `+layout.svelte`
- Layout wrapper untuk semua halaman
- Berisi struktur UI yang konsisten (header, sidebar, footer, dll)

#### `+layout.ts`
- Logic untuk layout (data loading, authentication check, dll)

#### `+page.svelte`
- Halaman utama/landing page (route: `/`)

#### `layout.css`
- Global styles untuk layout
- Custom CSS yang tidak dicakup oleh Tailwind

#### `login/+page.svelte`
- Halaman login (route: `/login`)
- Form autentikasi user

### `/static/`

Berisi file static yang akan disalin langsung ke output build tanpa diproses oleh Vite.

- File dapat diakses dari root URL (contoh: `/robots.txt`)
- Cocok untuk favicon, robots.txt, manifest.json, dll

### Configuration Files

#### `.env.example`
- Template file untuk environment variables
- Berisi contoh konfigurasi yang diperlukan aplikasi
- Developers harus membuat file `.env` sendiri berdasarkan template ini
- **JANGAN** commit file `.env` ke version control (harus ada di `.gitignore`)

Environment variables yang tersedia:
```env
PUBLIC_BASE_API_URL=http://localhost:3000
```

> **Catatan**: Untuk setup development, copy file ini menjadi `.env`:
> ```bash
> cp .env.example .env
> ```
> Kemudian sesuaikan nilai-nilai sesuai environment lokal Anda.

#### `package.json`
Mendefinisikan:
- Project metadata (name, version)
- Dependencies (axios)
- DevDependencies (SvelteKit, TypeScript, Tailwind, ESLint, Prettier, dll)
- Scripts untuk development dan build

## Konvensi Penamaan File SvelteKit

SvelteKit menggunakan konvensi penamaan khusus untuk file routing:

- `+page.svelte`: Mendefinisikan halaman/route
- `+page.ts` atau `+page.server.ts`: Logic untuk load data halaman
- `+layout.svelte`: Layout yang membungkus halaman child
- `+layout.ts` atau `+layout.server.ts`: Logic untuk layout
- `+error.svelte`: Custom error page
- `+server.ts`: API endpoints

Awalan `+` menandakan file khusus SvelteKit yang memiliki fungsi routing.

## Environment Variables

Project menggunakan environment variables untuk konfigurasi yang dapat berubah antar environment.

### Setup Environment Variables

1. Copy file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit file `.env` sesuai kebutuhan environment Anda

### Available Variables

- `PUBLIC_BASE_API_URL`: Base URL untuk API backend
  - Development: `http://localhost:3000`
  - Production: URL API server production

### Accessing Environment Variables

Variables dengan prefix `PUBLIC_` dapat diakses di client-side melalui:
```typescript
import { env } from '$env/dynamic/public';

const apiUrl = env.PUBLIC_BASE_API_URL;
```

> **Penting**: 
> - Variabel dengan prefix `PUBLIC_` dapat diakses di browser (client-side)
> - Jangan simpan secret keys atau sensitive data di `PUBLIC_*` variables
> - File `.env` tidak boleh di-commit ke git (pastikan ada di `.gitignore`)
> - File `.env.example` adalah template yang di-commit untuk referensi team

## Fitur Utama

### 1. Autentikasi
- Token-based authentication menggunakan Axios interceptors
- Automatic token refresh
- Access token disimpan di Svelte store

### 2. Type Safety
- Full TypeScript support
- Generic types untuk API responses
- Type definitions untuk semua data models

### 3. Styling
- Tailwind CSS 4.x dengan Vite plugin
- Custom CSS untuk styling tambahan
- Responsive design ready

### 4. Code Quality
- ESLint untuk linting
- Prettier untuk formatting
- Svelte-check untuk type checking

## Best Practices

1. **Komponen**
   - Buat komponen reusable di `/src/lib/components/`
   - Gunakan TypeScript untuk props typing
   - Follow single responsibility principle

2. **State Management**
   - Gunakan Svelte stores untuk global state
   - Local state untuk UI state sederhana
   - Define stores di `/src/lib/stores.ts`

3. **API Calls**
   - Selalu gunakan instance Axios dari `axios-instance.ts`
   - Define types untuk request/response
   - Handle errors dengan proper error messages

4. **Routing**
   - Gunakan file-based routing SvelteKit
   - Organize routes berdasarkan fitur
   - Gunakan layout untuk shared UI

5. **Types**
   - Define semua types di `/src/lib/types.ts`
   - Gunakan generic types untuk reusability
   - Avoid using `any` type

## Referensi

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte Documentation](https://svelte.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
