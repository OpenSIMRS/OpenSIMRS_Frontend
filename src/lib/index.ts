import api from '$lib/axios-instance';
import { UserDataStore } from '$lib/stores';
import type { GetAuthMe, HttpResponse } from '$lib/types';

export async function getUserInfo() {
	const response = await api.get<HttpResponse<GetAuthMe>>('/v1/auth/me');
	UserDataStore.set(response.data.data);
	return response 
}

export function redirectTo(message: string, path: string) {
	new Promise((resolve) => {
		window.location.href = path;
	});
	return message;
}