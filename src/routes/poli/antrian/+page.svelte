<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { 
		kunjunganService,
		patientService,
		masterDataService
	} from '$lib/data/api-service';
	import type { Kunjungan, Patient, Poli, Dokter, KunjunganWithDetails } from '$lib/types';

	let kunjunganList = $state<KunjunganWithDetails[]>([]);
	let poliList = $state<Poli[]>([]);
	let selectedPoli = $state('');
	let selectedStatus = $state('DAFTAR');
	let isLoading = $state(false);
	let selectedDate = $state(new Date().toISOString().split('T')[0]);

	const statusOptions = [
		{ value: 'DAFTAR', label: 'Terdaftar', color: 'blue' },
		{ value: 'DILAYANI', label: 'Sedang Dilayani', color: 'yellow' },
		{ value: 'SELESAI', label: 'Selesai', color: 'green' },
		{ value: 'BATAL', label: 'Batal', color: 'red' }
	];

	onMount(() => {
		loadData();
	});

	async function loadData() {
		isLoading = true;
		try {
			// Load poli and visits
			poliList = await masterDataService.getPoli();
			await loadVisits();
		} finally {
			isLoading = false;
		}
	}

	async function loadVisits() {
		const visits = await kunjunganService.getKunjungan(selectedStatus, selectedDate);
		
		// Load patient, poli, and dokter data for each visit
		const visitsWithDetails = await Promise.all(
			visits.map(async (v) => {
				const [patient, poli, dokter] = await Promise.all([
					patientService.getPatientById(v.pasien_id),
					masterDataService.getPoliById(v.poli_id || ''),
					masterDataService.getDokterById(v.dokter_id)
				]);
				
				return {
					...v,
					pasien: patient,
					poli: poli,
					dokter: dokter
				} as KunjunganWithDetails;
			})
		);

		// Filter by poli if selected
		if (selectedPoli) {
			kunjunganList = visitsWithDetails.filter(v => v.poli_id === selectedPoli);
		} else {
			kunjunganList = visitsWithDetails;
		}
	}

	async function handleAcceptVisit(kunjungan: Kunjungan) {
		if (confirm(`Terima pasien ${kunjungan.pasien?.nama_lengkap}?`)) {
			await kunjunganService.updateKunjungan(kunjungan.id, {
				status_kunjungan: 'DILAYANI'
			});
			await loadVisits();
			// Navigate to nursing assessment
			goto(`/emr/asesmen/${kunjungan.id}`);
		}
	}

	async function handleCompleteVisit(kunjungan: Kunjungan) {
		if (confirm(`Selesaikan kunjungan pasien ${kunjungan.pasien?.nama_lengkap}?`)) {
			await kunjunganService.updateKunjungan(kunjungan.id, {
				status_kunjungan: 'SELESAI'
			});
			await loadVisits();
		}
	}

	function getStatusColor(status: string) {
		const option = statusOptions.find(o => o.value === status);
		return option?.color || 'gray';
	}

	function getStatusLabel(status: string) {
		const option = statusOptions.find(o => o.value === status);
		return option?.label || status;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto p-6">
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Antrian Poli</h1>
				<p class="text-gray-600">Kelola antrian pasien di poliklinik</p>
			</div>
			<button
				onclick={() => goto('/')}
				class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
			>
				← Kembali
			</button>
		</div>

		<!-- Filters -->
		<div class="bg-white rounded-lg shadow-md p-4 mb-6">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
					<input
						type="date"
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
						bind:value={selectedDate}
						onchange={() => loadVisits()}
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Poli</label>
					<select
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
						bind:value={selectedPoli}
						onchange={() => loadVisits()}
					>
						<option value="">Semua Poli</option>
						{#each poliList.filter(p => p.is_active) as poli}
							<option value={poli.id}>{poli.nama}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
					<select
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
						bind:value={selectedStatus}
						onchange={() => loadVisits()}
					>
						{#each statusOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>

				<div class="flex items-end">
					<button
						onclick={() => loadVisits()}
						class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
						disabled={isLoading}
					>
						🔄 Refresh
					</button>
				</div>
			</div>
		</div>

		<!-- Queue List -->
		{#if isLoading}
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Memuat data antrian...</p>
			</div>
		{:else if kunjunganList.length === 0}
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="text-6xl mb-4">📋</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">Belum ada antrian</h3>
				<p class="text-gray-600">Tidak ada pasien yang terdaftar untuk filter yang dipilih</p>
			</div>
		{:else}
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Antrian</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. RM</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pasien</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poli</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokter</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each kunjunganList as kunjungan}
								{@const statusColor = getStatusColor(kunjungan.status_kunjungan)}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-2xl font-bold text-blue-600">
											{kunjungan.no_antrian}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{kunjungan.pasien?.no_rm || '-'}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{kunjungan.pasien?.nama_lengkap || '-'}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
										{kunjungan.poli?.nama || '-'}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
										{kunjungan.dokter?.gelar_depan || ''} {kunjungan.dokter?.nama_lengkap || '-'}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
										{kunjungan.waktu_kunjungan}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-{statusColor}-100 text-{statusColor}-800">
											{getStatusLabel(kunjungan.status_kunjungan)}
										</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
										{#if kunjungan.status_kunjungan === 'DAFTAR'}
											<button
												onclick={() => handleAcceptVisit(kunjungan)}
												class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
											>
												✓ Terima
											</button>
										{:else if kunjungan.status_kunjungan === 'DILAYANI'}
											<button
												onclick={() => handleCompleteVisit(kunjungan)}
												class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
											>
												Selesai
											</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
					<p class="text-sm text-gray-600">Total: {kunjunganList.length} pasien</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
