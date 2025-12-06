<script lang="ts">
	import type { Snippet } from 'svelte';
	type T = $$Generic;
	interface Props<T> {
		defaultState: T;
		children: Snippet<[state: T, setState: (newState: T) => void]>;
	}
	let { defaultState, children }: Props<T> = $props();
	let state: T = $state(defaultState);
	export function setState(newState: T) {
		state = newState;
	}
</script>

{#key state}
	{@render children(state, setState)}
{/key}
