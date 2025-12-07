<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { masterDataService } from '$lib/data/api-service';
	import type { MasterLookup } from '$lib/types';

	const categories = [
		{ id: 'AGAMA', label: 'Agama' },
		{ id: 'PENDIDIKAN', label: 'Pendidikan' },
		{ id: 'PEKERJAAN', label: 'Pekerjaan' },
		{ id: 'STATUS_PERKAWINAN', label: 'Status Perkawinan' },
		{ id: 'GOLONGAN_DARAH', label: 'Golongan Darah' },
		{ id: 'HUBUNGAN_KELUARGA', label: 'Hubungan Keluarga' }
	];

	let activeCategory = $state<string>('AGAMA');
	let lookupData = $state<MasterLookup[]>([]);
	let filteredData = $state<MasterLookup[]>([]);
	let isLoading = $state(false);
	let showForm = $state(false);
	let editingId = $state<string | null>(null);

	let formData = $state<Omit<MasterLookup, 'id'>>({
		value: '',
		category: 'AGAMA' as any
	});

	onMount(() => {
		loadData();
	});

	async function loadData() {
		isLoading = true;
		try {
			lookupData = await masterDataService.getMasterLookup();
			filterByCategory();
		} finally {
			isLoading = false;
		}
	}

	function filterByCategory() {
		filteredData = lookupData.filter(item => item.category === activeCategory);
	}

	$effect(() => {
		activeCategory;
		filterByCategory();
	});

	function handleAdd() {
		editingId = null;
		formData = {
			value: '',
			category: activeCategory as any
		};
		showForm = true;
	}

	function handleEdit(item: MasterLookup) {
		editingId = item.id;
		formData = {
			value: item.value,
			category: item.category
		};
		showForm = true;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		try {
			if (editingId) {
				await masterDataService.updateMasterLookup(editingId, formData);
				alert('Data berhasil diupdate!');
			} else {
				await masterDataService.createMasterLookup(formData);
				alert('Data berhasil ditambahkan!');
			}
			showForm = false;
			await loadData();
		} catch (error) {
			alert('Gagal menyimpan data. Silakan coba lagi.');
		}
	}

	async function handleDelete(item: MasterLookup) {
		if (confirm(`Apakah Anda yakin ingin menghapus "${item.value}"?`)) {
			try {
				await masterDataService.deleteMasterLookup(item.id);
				alert('Data berhasil dihapus!');
				await loadData();
			} catch (error) {
				alert('Gagal menghapus data. Silakan coba lagi.');
			}
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-5xl mx-auto p-6">
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Master Lookup</h1>
				<p class="text-gray-600">Kelola data referensi sistem</p>
			</div>
			<button
				onclick={() => goto('/master')}
				class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
			>
				← Kembali
			</button>
		</div>

		<!-- Category Tabs -->
		<div class="bg-white rounded-lg shadow-md mb-6">
			<div class="border-b border-gray-200">
				<div class="flex overflow-x-auto">
					{#each categories as category}
						<button
							onclick={() => activeCategory = category.id}
							class="px-6 py-3 text-sm font-medium whitespace-nowrap {activeCategory === category.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}"
						>
							{category.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="p-4">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-lg font-semibold text-gray-900">
						{categories.find(c => c.id === activeCategory)?.label}
					</h2>
					<button
						onclick={handleAdd}
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
					>
						+ Tambah Data
					</button>
				</div>

				{#if isLoading}
					<div class="py-12 text-center">
						<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<p class="mt-4 text-gray-600">Memuat data...</p>
					</div>
				{:else if filteredData.length === 0}
					<div class="py-12 text-center">
						<p class="text-gray-600 mb-4">Belum ada data untuk kategori ini</p>
						<button
							onclick={handleAdd}
							class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
						>
							+ Tambah Data
						</button>
					</div>
				{:else}
					<div class="space-y-2">
						{#each filteredData as item}
							<div class="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100">
								<span class="text-sm font-medium text-gray-900">{item.value}</span>
								<div class="flex gap-2">
									<button
										onclick={() => handleEdit(item)}
										class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded"
									>
										Edit
									</button>
									<button
										onclick={() => handleDelete(item)}
										class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded"
									>
										Hapus
									</button>
								</div>
							</div>
						{/each}
					</div>
					<div class="mt-4 text-center">
						<p class="text-sm text-gray-600">Total: {filteredData.length} data</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Form Modal -->
		{#if showForm}
			<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
					<h2 class="text-2xl font-bold text-gray-900 mb-4">
						{editingId ? 'Edit' : 'Tambah'} Data
					</h2>
					<form onsubmit={handleSubmit}>
						<div class="space-y-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Kategori
								</label>
								<input
									type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
									value={categories.find(c => c.id === formData.category)?.label}
									disabled
								/>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Nilai <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.value}
									required
									placeholder="Masukkan nilai..."
								/>
							</div>
						</div>

						<div class="flex gap-4 justify-end mt-6">
							<button
								type="button"
								onclick={() => showForm = false}
								class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
							>
								Batal
							</button>
							<button
								type="submit"
								class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
							>
								Simpan
							</button>
						</div>
					</form>
				</div>
			</div>
		{/if}

		<!-- Info Box -->
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
			<p class="text-sm text-blue-800">
				<strong>ℹ️ Informasi:</strong> Data referensi ini digunakan di berbagai form input. 
				Pastikan tidak menghapus data yang masih digunakan.
			</p>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
