<script lang="ts">
	import { getUserInfo, redirectTo } from "$lib";
	import api, { accessToken } from "$lib/axios-instance";
	import type { HttpResponse, PostAuthLogin } from "$lib/types";

	let email = $state("")
	let password = $state("")
	let isLoading = $state(false);

	async function handleLogin() {
		isLoading = true;
		try {
			// Dummy login - just redirect without actual API call
			// In real implementation, uncomment below:
			/*
			const response = await api.post<HttpResponse<PostAuthLogin>>('/v1/auth/login', { email, password })
			$accessToken = response.data.data.accessToken
			localStorage.setItem('refreshToken', response.data.data.refreshToken)
			*/
			
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 500));
			
			// Set dummy token
			$accessToken = 'dummy-access-token';
			localStorage.setItem('refreshToken', 'dummy-refresh-token');
			
			window.location.href = '/';
		} catch (error: any) {
			console.log(error);
			alert(error.response?.data?.error || error.message);
		} finally {
			isLoading = false;
		}
	}
</script>

<!-- {#await getUserInfo()}
	"Checking authentication..."
{:then data} 
	{redirectTo("Already Logged In Redirect to home page...", "/")}
{:catch error} -->
	<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
		<div class="w-full max-w-md">
			<div class="bg-white rounded-lg shadow-lg p-8">
				<div class="text-center mb-8">
					<h1 class="text-3xl font-bold text-gray-900 mb-2">OpenSIMRS</h1>
					<p class="text-sm text-gray-600">Sistem Informasi Manajemen Rumah Sakit</p>
				</div>

				<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
					<div class="mb-4">
						<label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
							Email
						</label>
						<input 
							id="email"
							type="email" 
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
							placeholder="Masukkan email Anda" 
							bind:value={email}
							required
							disabled={isLoading}
						/>
					</div>

					<div class="mb-6">
						<label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
							Password
						</label>
						<input 
							id="password"
							type="password" 
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
							placeholder="Masukkan password Anda" 
							bind:value={password}
							required
							disabled={isLoading}
						/>
					</div>

					<button
						type="submit"
						class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
						disabled={isLoading}
					>
						{isLoading ? 'Logging in...' : 'Login'}
					</button>
				</form>

				<div class="mt-6 text-center">
					<p class="text-xs text-gray-500">
						Gunakan email dan password apa saja untuk login (dummy auth)
					</p>
				</div>
			</div>
		</div>
	</div>
<!-- {/await} -->

<style lang="postcss">
	@reference "tailwindcss";
</style>