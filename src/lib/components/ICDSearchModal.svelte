<script lang="ts">
	import { icdService } from '$lib/data/api-service';
	import type { ICD10, ICD9 } from '$lib/types';

	type Props = {
		isOpen: boolean;
		onClose: () => void;
		onSelect: (item: ICD10 | ICD9) => void;
		type: 'ICD10' | 'ICD9';
		title?: string;
	};

	let { isOpen = $bindable(false), onClose, onSelect, type, title }: Props = $props();

	let searchQuery = $state('');
	let searchResults = $state<(ICD10 | ICD9)[]>([]);
	let isSearching = $state(false);
	let debounceTimer: NodeJS.Timeout;

	async function handleSearch() {
		isSearching = true;
		try {
			if (type === 'ICD10') {
				searchResults = await icdService.searchICD10(searchQuery);
			} else {
				searchResults = await icdService.searchICD9(searchQuery);
			}
		} finally {
			isSearching = false;
		}
	}

	function debouncedSearch() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			handleSearch();
		}, 300);
	}

	$effect(() => {
		if (isOpen) {
			searchQuery = '';
			searchResults = [];
			handleSearch(); // Load initial data
		}
	});

	function handleSelectItem(item: ICD10 | ICD9) {
		onSelect(item);
		onClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
			<!-- Header -->
			<div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
				<div>
					<h2 class="text-xl font-semibold text-gray-900">
						{title || (type === 'ICD10' ? 'Pilih Kode Diagnosis ICD-10' : 'Pilih Kode Prosedur ICD-9')}
					</h2>
					<p class="text-sm text-gray-600 mt-1">
						{type === 'ICD10' ? 'Cari dan pilih kode diagnosis' : 'Cari dan pilih kode prosedur/tindakan'}
					</p>
				</div>
				<button
					onclick={onClose}
					class="text-gray-400 hover:text-gray-600 transition-colors"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Search -->
			<div class="px-6 py-4 border-b border-gray-200">
				<div class="relative">
					<input
						type="text"
						bind:value={searchQuery}
						oninput={debouncedSearch}
						placeholder={type === 'ICD10' ? 'Cari kode atau nama diagnosis...' : 'Cari kode atau nama prosedur...'}
						class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						autofocus
					/>
					<svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
			</div>

			<!-- Results -->
			<div class="flex-1 overflow-y-auto px-6 py-4">
				{#if isSearching}
					<div class="text-center py-8">
						<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<p class="text-gray-600 mt-2">Mencari...</p>
					</div>
				{:else if searchResults.length === 0}
					<div class="text-center py-8 text-gray-500">
						<svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<p>Tidak ada hasil ditemukan</p>
						<p class="text-sm mt-1">Coba kata kunci lain</p>
					</div>
				{:else}
					<div class="space-y-1">
						{#each searchResults as item (item.id)}
							<button
								onclick={() => handleSelectItem(item)}
								class="w-full text-left px-4 py-3 rounded-md hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
							>
								<div class="flex items-start gap-3">
									<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-mono rounded flex-shrink-0">
										{item.code}
									</span>
									<div class="flex-1 min-w-0">
										<p class="font-medium text-gray-900">{item.name}</p>
										{#if item.category}
											<p class="text-sm text-gray-500 mt-1">Kategori: {item.category}</p>
										{/if}
									</div>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
				<div class="flex justify-between items-center text-sm text-gray-600">
					<span>
						{searchResults.length > 0 ? `${searchResults.length} hasil ditemukan` : 'Gunakan pencarian untuk menemukan kode'}
					</span>
					<button
						onclick={onClose}
						class="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
					>
						Tutup
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
</style>
