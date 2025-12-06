<script lang="ts">
	import { getUserInfo, redirectTo } from '$lib';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const publicPath = ['/login'];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- {#if publicPath.includes(window.location.pathname)}
	{@render children()}
{:else}
	{#await getUserInfo() then data} -->
		{@render children()}
	<!-- {:catch error}
		{redirectTo("Not Logged Redirecto login page...", "/login")}
	{/await}
{/if} -->
