<script lang="ts">
	import { getUserInfo, redirectTo } from '$lib';
	import api, { accessToken } from '$lib/axios-instance';
	import Stateful from '$lib/components/Stateful.svelte';
	import type { HttpResponse, PostAuthLogin } from '$lib/types';
	import { redirect } from '@sveltejs/kit';

	let email = $state('');
	let password = $state('');
</script>

{#await getUserInfo()}
	"Checking authentication..."
{:then data}
	{redirectTo('Already Logged In Redirect to home page...', '/')}
{:catch error}
	<div class="flex flex-col mr-auto w-80">
		<span>Login to your account</span>
		<label>
			<span>Email</span>
			<input type="email" placeholder="Enter your email" bind:value={email} />
		</label>
		<label>
			<span>
				<span>Password</span>
			</span>
			<input type="password" placeholder="Enter your Password" bind:value={password} />
		</label>
		<Stateful defaultState={false}>
			{#snippet children(state, setState)}
				<button
					onclick={async () => {
						setState(true);
						try {
							const response = await api.post('/v1/auth/login', { email, password });
							$accessToken = response.data.data.accessToken;
							localStorage.setItem('refreshToken', response.data.data.refreshToken);
							window.location.href = '/';
						} catch (error: any) {
							console.log(error);
							alert(error.response?.data?.error || error.message);
						} finally {
							setState(false);
						}
					}}
					disabled={state}
				>
					Login Now{#if state}...{/if}
				</button>
			{/snippet}
		</Stateful>
	</div>
{/await}

<style lang="postcss">
	@reference "tailwindcss";

	input {
		@apply rounded-lg text-sm outline-3 outline-offset-[-1.50px] outline-blue-100;
	}
</style>
