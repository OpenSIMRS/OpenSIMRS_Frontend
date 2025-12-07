<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { masterDataService } from '$lib/data/api-service';
	import type { Poli } from '$lib/types';

	let poliList = $state<Poli[]>([]);
	let filteredList = $state<Poli[]>([]);
	let searchQuery = $state('');
	let isLoading = $state(false);
	let showForm = $state(false);
	let editingId = $state<string | null>(null);

	let formData = $state<Omit<Poli, 'id' | 'created_at' | 'updated_at'>>({
		kode: '',
		nama: '',
		is_active: true
	});

	onMount(() => {
		loadData();
	});

	async function loadData() {
		isLoading = true;
		try {
			poliList = await masterDataService.getPoli();
			filterData();
		} finally {
			isLoading = false;
		}
	}

	function filterData() {
		if (!searchQuery.trim()) {
			filteredList = [...poliList];
		} else {
			const query = searchQuery.toLowerCase();
			filteredList = poliList.filter(p =>
				p.kode.toLowerCase().includes(query) ||
				p.nama.toLowerCase().includes(query)
			);
		}
	}

	$effect(() => {
		searchQuery;
		filterData();
	});

	function handleAdd() {
		editingId = null;
		formData = {
			kode: '',
			nama: '',
			is_active: true
		};
		showForm = true;
	}

	function handleEdit(poli: Poli) {
		editingId = poli.id;
		formData = {
			kode: poli.kode,
			nama: poli.nama,
			is_active: poli.is_active
		};
		showForm = true;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		try {
			if (editingId) {
				await masterDataService.updatePoli(editingId, formData);
				alert('Poli berhasil diupdate!');
			} else {
				await masterDataService.createPoli(formData);
				alert('Poli berhasil ditambahkan!');
			}
			showForm = false;
			await loadData();
		} catch (error) {
			alert('Gagal menyimpan data. Silakan coba lagi.');
		}
	}

	async function handleDelete(poli: Poli) {
		if (confirm(`Apakah Anda yakin ingin menghapus poli "${poli.nama}"?`)) {
			try {
				await masterDataService.deletePoli(poli.id);
				alert('Poli berhasil dihapus!');
				await loadData();
			} catch (error) {
				alert('Gagal menghapus data. Silakan coba lagi.');
			}
		}
	}

	async function toggleActive(poli: Poli) {
		try {
			await masterDataService.updatePoli(poli.id, {
				is_active: !poli.is_active
			});
			await loadData();
		} catch (error) {
			alert('Gagal mengubah status. Silakan coba lagi.');
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto p-6">
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Master Poli</h1>
				<p class="text-gray-600">Kelola data poliklinik</p>
			</div>
			<button
				onclick={() => goto('/master')}
				class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
			>
				← Kembali
			</button>
		</div>

		<!-- Actions Bar -->
		<div class="bg-white rounded-lg shadow-md p-4 mb-6">
			<div class="flex gap-4 items-center">
				<input
					type="text"
					class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
					placeholder="Cari kode atau nama poli..."
					bind:value={searchQuery}
				/>
				<button
					onclick={handleAdd}
					class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
				>
					+ Tambah Poli
				</button>
			</div>
		</div>

		<!-- Form Modal -->
		{#if showForm}
			<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
					<h2 class="text-2xl font-bold text-gray-900 mb-4">
						{editingId ? 'Edit' : 'Tambah'} Poli
					</h2>
					<form onsubmit={handleSubmit}>
						<div class="space-y-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Kode <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.kode}
									required
									placeholder="POL-001"
								/>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Nama Poli <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.nama}
									required
									placeholder="Poli Umum"
								/>
							</div>

							<div class="flex items-center gap-2">
								<input
									type="checkbox"
									id="is_active"
									class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
									bind:checked={formData.is_active}
								/>
								<label for="is_active" class="text-sm font-medium text-gray-700">
									Aktif
								</label>
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

		<!-- Data Table -->
		{#if isLoading}
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Memuat data...</p>
			</div>
		{:else if filteredList.length === 0}
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="text-6xl mb-4">🏥</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">Tidak ada data</h3>
				<p class="text-gray-600 mb-6">
					{searchQuery ? 'Tidak ditemukan hasil untuk pencarian Anda' : 'Belum ada data poli'}
				</p>
				{#if !searchQuery}
					<button
						onclick={handleAdd}
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
					>
						+ Tambah Poli
					</button>
				{/if}
			</div>
		{:else}
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Poli</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each filteredList as poli}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{poli.kode}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{poli.nama}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<button
										onclick={() => toggleActive(poli)}
										class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full {poli.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}"
									>
										{poli.is_active ? '✓ Aktif' : '✗ Nonaktif'}
									</button>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<div class="flex gap-2">
										<button
											onclick={() => handleEdit(poli)}
											class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded"
										>
											Edit
										</button>
										<button
											onclick={() => handleDelete(poli)}
											class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded"
										>
											Hapus
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div class="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
					<p class="text-sm text-gray-600">Total: {filteredList.length} poli</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
