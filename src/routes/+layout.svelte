<script lang="ts">
	import { getUserInfo, redirectTo } from '$lib';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppLayout from '$lib/components/AppLayout.svelte';

	let { children } = $props();

	const publicPath = ['/login'];
	
	// Check if we're on a public path
	let isPublicPath = $state(false);
	if (typeof window !== 'undefined') {
		isPublicPath = publicPath.includes(window.location.pathname);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>OpenSIMRS - Sistem Informasi Manajemen Rumah Sakit</title>
</svelte:head>

<!-- {#if publicPath.includes(window.location.pathname)}
	{@render children()}
{:else}
	{#await getUserInfo() then data} -->
		{#if isPublicPath}
			{@render children()}
		{:else}
			<AppLayout>
				{@render children()}
			</AppLayout>
		{/if}
	<!-- {:catch error}
		{redirectTo("Not Logged Redirecto login page...", "/login")}
	{/await}
{/if} -->
