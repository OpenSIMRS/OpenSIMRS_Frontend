import axios from 'axios';
import { writable } from 'svelte/store';
import type { HttpResponse, PostAuthRefesh } from '$lib/types';
import { env } from '$env/dynamic/public';

// Svelte store for access token
export const accessToken = writable('');

// Create an Axios instance
const api = axios.create({
	baseURL: env.PUBLIC_BASE_API_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Request interceptor to add the access token to headers
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

// Response interceptor to handle token refresh
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
				// Call the refresh token endpoint
				const response = await axios.post<HttpResponse<PostAuthRefesh>>(env.PUBLIC_BASE_API_URL + '/v1/auth/refresh', {
					refreshToken
				});

				const newAccessToken = response.data.data.accessToken;

				// Update tokens
				accessToken.set(newAccessToken);

				// Retry the original request with the new access token
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

export default api;