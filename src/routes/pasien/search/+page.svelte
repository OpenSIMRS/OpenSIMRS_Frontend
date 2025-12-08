<script lang="ts">
	import { goto } from '$app/navigation';
	import { patientService, masterDataService } from '$lib/data/api-service';
	import type { Patient, MasterLookup, PatientWithDetails } from '$lib/types';

	let searchQuery = $state('');
	let patients = $state<PatientWithDetails[]>([]);
	let lookupData = $state<MasterLookup[]>([]);
	let isLoading = $state(false);
	let hasSearched = $state(false);

	$effect(() => {
		// Load lookup data on mount
		loadLookupData();
	});

	async function loadLookupData() {
		lookupData = await masterDataService.getMasterLookup();
	}

	function getLookupValue(id: string | undefined): string {
		if (!id) return '-';
		const item = lookupData.find(l => l.id === id);
		return item?.value || '-';
	}

	function calculateAge(birthDate: string): number {
		const today = new Date();
		const birth = new Date(birthDate);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		return age;
	}

	async function handleSearch(e: Event) {
		e.preventDefault();
		if (!searchQuery.trim()) return;

		isLoading = true;
		hasSearched = true;
		try {
			const results = await patientService.searchPatient(searchQuery);
			patients = results.map(p => ({
				...p,
				agama: getLookupValue(p.agama_id),
				pendidikan: getLookupValue(p.pendidikan_id),
				pekerjaan: getLookupValue(p.pekerjaan_id),
				status_perkawinan: getLookupValue(p.status_perkawinan_id),
				umur: calculateAge(p.tanggal_lahir)
			}));
		} catch (error) {
			console.error('Error searching patients:', error);
			alert('Terjadi kesalahan saat mencari data pasien');
		} finally {
			isLoading = false;
		}
	}

	function viewPatientProfile(patient: Patient) {
		// Navigate to patient profile page
		goto(`/pasien/${patient.id}`);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto p-6">
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Cari Pasien</h1>
				<p class="text-gray-600">Cari pasien berdasarkan No. RM, NIK, Nama, atau No. HP</p>
			</div>
			<button
				onclick={() => goto('/')}
				class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
			>
				← Kembali
			</button>
		</div>

		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<form onsubmit={handleSearch} class="flex gap-3">
				<input
					type="text"
					class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
					placeholder="Masukkan No. RM, NIK, Nama, atau No. HP..."
					bind:value={searchQuery}
					disabled={isLoading}
				/>
				<button 
					type="submit"
					class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:bg-gray-400"
					disabled={isLoading || !searchQuery.trim()}
				>
					🔍 Cari
				</button>
			</form>
		</div>

		{#if isLoading}
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Mencari data pasien...</p>
			</div>
		{:else if hasSearched}
			{#if patients.length > 0}
				<div class="bg-white rounded-lg shadow-md overflow-hidden">
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. RM</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Lahir</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Umur</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JK</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. HP</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each patients as patient}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.no_rm}</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{patient.nik}</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.nama_lengkap}</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
											{new Date(patient.tanggal_lahir).toLocaleDateString('id-ID')}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{patient.umur} th</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
											{patient.jenis_kelamin === 'L' ? 'L' : 'P'}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{patient.no_hp}</td>
										<td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
											{patient.alamat}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<button 
												onclick={() => viewPatientProfile(patient)}
												class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
											>
												Lihat Profil
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
						<p class="text-sm text-gray-600">Ditemukan {patients.length} pasien</p>
					</div>
				</div>
			{:else}
				<div class="bg-white rounded-lg shadow-md p-12 text-center">
					<div class="text-6xl mb-4">👤</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">Tidak ada pasien ditemukan</h3>
					<p class="text-gray-600 mb-6">Coba gunakan kata kunci lain atau daftarkan pasien baru</p>
					<button
						onclick={() => goto('/pasien/register')}
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
					>
						Daftar Pasien Baru
					</button>
				</div>
			{/if}
		{:else}
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="text-6xl mb-4">🔍</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">Mulai Pencarian</h3>
				<p class="text-gray-600">Masukkan No. RM, NIK, Nama, atau No. HP pasien untuk mencari</p>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
