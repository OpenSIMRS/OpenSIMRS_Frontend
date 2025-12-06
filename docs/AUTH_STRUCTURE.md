# Auth Structure & Configuration

Dokumentasi tentang struktur autentikasi di aplikasi OpenSIMRS Frontend dan cara mengaktifkan/menonaktifkan auth untuk pengembangan lokal.

## Overview

Aplikasi menggunakan **JWT-based authentication** dengan:

- **Access Token**: Token dengan masa berlaku pendek untuk autentikasi request
- **Refresh Token**: Token dengan masa berlaku lebih panjang untuk mendapatkan access token baru

## File Structure

```
src/lib/
├── axios-instance.ts    # Konfigurasi Axios dengan auth interceptors
├── stores.ts            # Svelte stores termasuk accessToken store
└── types.ts             # Type definitions untuk auth responses

src/routes/
├── login/
│   └── +page.svelte     # Halaman login
└── +layout.ts           # Auth check di layout (dapat di-disable untuk dev)
```

## Auth Flow

### 1. Login Flow

```
┌─────────────┐
│ User Login  │
│ Form Submit │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ POST /v1/auth/login     │
│ {email, password}       │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Response:               │
│ - accessToken           │
│ - refreshToken          │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Store Tokens:           │
│ - accessToken → store   │
│ - refreshToken → localStorage │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Redirect to Dashboard   │
└─────────────────────────┘
```

### 2. Request Flow with Auth

```
┌─────────────────┐
│ API Request     │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ Request Interceptor      │
│ Add Authorization header │
│ Bearer {accessToken}     │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Send Request to Backend  │
└────────┬─────────────────┘
         │
         ├─ Success (200) ──────────┐
         │                          │
         └─ Error (401) ─┐          │
                         │          │
                         ▼          │
         ┌──────────────────────┐  │
         │ Response Interceptor │  │
         │ Attempt Token Refresh│  │
         └────────┬─────────────┘  │
                  │                │
                  ▼                │
         ┌──────────────────────┐  │
         │ POST /v1/auth/refresh│  │
         │ {refreshToken}       │  │
         └────────┬─────────────┘  │
                  │                │
                  ├─ Success ──┐   │
                  │            │   │
                  ▼            ▼   ▼
         ┌──────────────────────────┐
         │ Update accessToken       │
         │ Retry Original Request   │
         └──────────────────────────┘
                  │
                  └─ Failure ──┐
                               │
                               ▼
                  ┌────────────────────┐
                  │ Clear Tokens       │
                  │ Redirect to Login  │
                  └────────────────────┘
```

## Auth Implementation Details

### 1. Axios Instance (`src/lib/axios-instance.ts`)

File ini berisi konfigurasi Axios dengan interceptors untuk auth:

```typescript
// Request interceptor: Add access token to headers
api.interceptors.request.use(
	async (config) => {
		let token;
		accessToken.subscribe((value) => (token = value));
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		config.headers.TZ = timezone;
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			const refreshToken = localStorage.getItem('refreshToken');
			if (!refreshToken) {
				console.error('No refresh token found');
				return Promise.reject(error);
			}

			try {
				const response = await axios.post<HttpResponse<PostAuthRefesh>>(
					env.PUBLIC_BASE_API_URL + '/v1/auth/refresh',
					{ refreshToken }
				);

				const newAccessToken = response.data.data.accessToken;
				accessToken.set(newAccessToken);

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError);
				accessToken.set('');
				localStorage.removeItem('refreshToken');
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);
```

**Key Points:**

- Request interceptor menambahkan `Authorization` header dengan access token
- Response interceptor menangani error 401 dengan mencoba refresh token
- Jika refresh gagal, token dihapus dan user harus login ulang

### 2. Access Token Store (`src/lib/stores.ts`)

```typescript
import { writable } from 'svelte/store';

export const accessToken = writable('');
```

**Usage:**

```typescript
import { accessToken } from '$lib/stores';

// Set token
accessToken.set('new-token-value');

// Subscribe to changes
accessToken.subscribe((value) => {
	console.log('Token changed:', value);
});
```

### 3. Type Definitions (`src/lib/types.ts`)

```typescript
export type PostAuthLogin = {
	accessToken: string;
	refreshToken: string;
};

export type PostAuthRefesh = {
	accessToken: string;
};

export type GetAuthMe = {
	ID: string;
	Email: string;
	Name: string;
	Role: string;
} & GormModel;
```

## Disabling Auth for Local Development

Untuk pengembangan lokal, Anda dapat menonaktifkan auth dengan beberapa cara:

### Option 1: Disable Request Interceptor (Recommended)

Edit `src/lib/axios-instance.ts`:

```typescript
// Comment out the authorization header
api.interceptors.request.use(
	async (config) => {
		// DEVELOPMENT MODE: Auth disabled
		// let token;
		// accessToken.subscribe((value) => (token = value));
		// if (token) {
		//   config.headers.Authorization = `Bearer ${token}`;
		// }

		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		config.headers.TZ = timezone;
		return config;
	},
	(error) => Promise.reject(error)
);
```

### Option 2: Disable Response Interceptor

Jika backend tidak mengembalikan 401, Anda bisa disable response interceptor:

```typescript
// Comment out the response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // ... refresh logic
//   }
// );
```

### Option 3: Use Environment Variable

Tambahkan environment variable untuk mengontrol auth:

**.env:**

```env
PUBLIC_BASE_API_URL=http://localhost:3000
PUBLIC_AUTH_ENABLED=false
```

**axios-instance.ts:**

```typescript
import { env } from '$env/dynamic/public';

const authEnabled = env.PUBLIC_AUTH_ENABLED === 'true';

api.interceptors.request.use(
	async (config) => {
		if (authEnabled) {
			let token;
			accessToken.subscribe((value) => (token = value));
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}

		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		config.headers.TZ = timezone;
		return config;
	},
	(error) => Promise.reject(error)
);
```

### Option 4: Bypass Login Page

Edit `src/routes/+layout.ts` untuk skip auth check:

```typescript
export const load = async ({ url }) => {
	// DEVELOPMENT MODE: Skip auth check
	// if (url.pathname !== '/login') {
	//   const token = get(accessToken);
	//   if (!token) {
	//     throw redirect(307, '/login');
	//   }
	// }

	return {};
};
```

## Re-enabling Auth

Untuk mengaktifkan kembali auth:

1. **Uncomment interceptors** di `axios-instance.ts`
2. **Set environment variable** `PUBLIC_AUTH_ENABLED=true`
3. **Uncomment auth check** di `+layout.ts`
4. **Ensure backend** auth endpoints are working

## Auth Endpoints

Lihat [API_ENDPOINTS.md](./API_ENDPOINTS.md#authentication-endpoints) untuk detail lengkap endpoint auth:

- `POST /v1/auth/login` - Login
- `POST /v1/auth/refresh` - Refresh token
- `GET /v1/auth/me` - Get current user
- `POST /v1/auth/logout` - Logout

## Security Best Practices

1. **Never commit tokens** ke version control
2. **Use HTTPS** di production
3. **Set proper CORS** di backend
4. **Validate tokens** di backend untuk setiap request
5. **Use short-lived access tokens** (e.g., 15 minutes)
6. **Use longer-lived refresh tokens** (e.g., 7 days)
7. **Store refresh token** di httpOnly cookie (lebih aman) atau localStorage
8. **Clear tokens** on logout
9. **Implement token rotation** untuk refresh tokens

## Testing Auth Flow

### Manual Testing

1. **Test Login:**

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@hospital.com", "password": "password123"}'
```

2. **Test Authenticated Request:**

```bash
curl -X GET http://localhost:3000/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

3. **Test Token Refresh:**

```bash
curl -X POST http://localhost:3000/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

### Automated Testing

Buat test untuk auth flow:

```typescript
import { describe, it, expect } from 'vitest';
import api from '$lib/axios-instance';

describe('Auth Flow', () => {
	it('should login successfully', async () => {
		const response = await api.post('/v1/auth/login', {
			email: 'test@hospital.com',
			password: 'password123'
		});

		expect(response.status).toBe(200);
		expect(response.data.data).toHaveProperty('accessToken');
		expect(response.data.data).toHaveProperty('refreshToken');
	});

	it('should refresh token', async () => {
		// ... test refresh logic
	});
});
```

## Troubleshooting

### Problem: "No refresh token found"

**Solution:** Pastikan refresh token disimpan di localStorage setelah login:

```typescript
localStorage.setItem('refreshToken', response.data.data.refreshToken);
```

### Problem: Infinite refresh loop

**Solution:** Pastikan `originalRequest._retry` flag di-set untuk mencegah retry berulang.

### Problem: CORS error

**Solution:** Pastikan backend mengizinkan origin frontend dan credentials:

```javascript
// Backend CORS config
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true
	})
);
```

### Problem: Token expired too quickly

**Solution:** Sesuaikan token expiry di backend:

```javascript
// Backend JWT config
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' });
```

## Changelog

### Current State (Development)

- ✅ Auth structure implemented
- ✅ Token refresh logic implemented
- ✅ Login page implemented
- ⚠️ Auth can be disabled for local development
- ⚠️ Backend auth endpoints may not be active yet

### Future Enhancements

- [ ] Implement role-based access control (RBAC)
- [ ] Add permission checks for each route
- [ ] Implement remember me functionality
- [ ] Add multi-factor authentication (MFA)
- [ ] Implement session management
- [ ] Add audit log for auth events
