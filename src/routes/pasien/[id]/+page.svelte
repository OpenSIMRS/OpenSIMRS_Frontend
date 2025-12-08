<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { patientService, masterDataService } from '$lib/data/api-service';
	import type { Patient, MasterLookup } from '$lib/types';

	let patientId = $state('');
	let patient = $state<Patient | null>(null);
	let lookupData = $state<MasterLookup[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		// Get patient ID from URL
		const pathParts = window.location.pathname.split('/');
		patientId = pathParts[pathParts.length - 1];
		
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		try {
			[patient, lookupData] = await Promise.all([
				patientService.getPatientById(patientId),
				masterDataService.getMasterLookup()
			]);
		} catch (error) {
			console.error('Error loading patient:', error);
			alert('Gagal memuat data pasien');
		} finally {
			isLoading = false;
		}
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

	function registerVisit() {
		if (patient) {
			goto(`/kunjungan/register?pasien_id=${patient.id}`);
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-5xl mx-auto p-6">
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Profil Pasien</h1>
				<p class="text-gray-600">Detail informasi pasien</p>
			</div>
			<div class="flex gap-3">
				<button
					onclick={() => goto('/pasien/search')}
					class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
				>
					← Kembali
				</button>
			</div>
		</div>

		{#if isLoading}
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Memuat data pasien...</p>
			</div>
		{:else if patient}
			<!-- Patient Header Card -->
			<div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-6 text-white">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="md:col-span-2">
						<div class="flex items-center gap-4 mb-4">
							<div class="bg-white bg-opacity-20 rounded-full p-4">
								<svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
								</svg>
							</div>
							<div>
								<h2 class="text-3xl font-bold">{patient.nama_lengkap}</h2>
								<p class="text-blue-100 text-lg">No. RM: {patient.no_rm}</p>
							</div>
						</div>
						<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
							<div>
								<p class="text-blue-200">NIK</p>
								<p class="font-semibold">{patient.nik}</p>
							</div>
							<div>
								<p class="text-blue-200">Jenis Kelamin</p>
								<p class="font-semibold">{patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
							</div>
							<div>
								<p class="text-blue-200">Umur</p>
								<p class="font-semibold">{calculateAge(patient.tanggal_lahir)} tahun</p>
							</div>
							<div>
								<p class="text-blue-200">Gol. Darah</p>
								<p class="font-semibold">{patient.golongan_darah || '-'}</p>
							</div>
						</div>
					</div>
					<div class="flex flex-col justify-center gap-3">
						<button
							onclick={registerVisit}
							class="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
							Daftarkan Kunjungan
						</button>
					</div>
				</div>
			</div>

			<!-- Data Identitas -->
			<div class="bg-white rounded-lg shadow-md p-6 mb-6">
				<h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
					</svg>
					Data Identitas
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<p class="text-sm text-gray-600 mb-1">Nama Lengkap</p>
						<p class="font-semibold text-gray-900">{patient.nama_lengkap}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">NIK</p>
						<p class="font-semibold text-gray-900">{patient.nik}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">No. RM</p>
						<p class="font-semibold text-gray-900">{patient.no_rm}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">Tempat, Tanggal Lahir</p>
						<p class="font-semibold text-gray-900">
							{patient.tempat_lahir}, {new Date(patient.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
						</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">Umur</p>
						<p class="font-semibold text-gray-900">{calculateAge(patient.tanggal_lahir)} tahun</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">Jenis Kelamin</p>
						<p class="font-semibold text-gray-900">{patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">Golongan Darah</p>
						<p class="font-semibold text-gray-900">{patient.golongan_darah || '-'}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">Agama</p>
						<p class="font-semibold text-gray-900">{getLookupValue(patient.agama_id)}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">Status Perkawinan</p>
						<p class="font-semibold text-gray-900">{getLookupValue(patient.status_perkawinan_id)}</p>
					</div>
				</div>
			</div>

			<!-- Alamat & Kontak -->
			<div class="bg-white rounded-lg shadow-md p-6 mb-6">
				<h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					Alamat & Kontak
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="md:col-span-3">
						<p class="text-sm text-gray-600 mb-1">Alamat Lengkap</p>
						<p class="font-semibold text-gray-900">{patient.alamat}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">RT / RW</p>
						<p class="font-semibold text-gray-900">{patient.rt || '-'} / {patient.rw || '-'}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">Kode Pos</p>
						<p class="font-semibold text-gray-900">{patient.kode_pos || '-'}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">Kode Wilayah</p>
						<p class="font-semibold text-gray-900">{patient.kode_wilayah}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">No. HP</p>
						<p class="font-semibold text-gray-900">{patient.no_hp}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">No. Telepon</p>
						<p class="font-semibold text-gray-900">{patient.no_telepon || '-'}</p>
					</div>
				</div>
			</div>

			<!-- Informasi Keluarga -->
			<div class="bg-white rounded-lg shadow-md p-6">
				<h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
					Informasi Keluarga
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<p class="text-sm text-gray-600 mb-1">Nama Ibu Kandung</p>
						<p class="font-semibold text-gray-900">{patient.nama_ibu}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">Nama Ayah</p>
						<p class="font-semibold text-gray-900">{patient.nama_ayah || '-'}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">Pekerjaan</p>
						<p class="font-semibold text-gray-900">{getLookupValue(patient.pekerjaan_id)}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 mb-1">Pendidikan</p>
						<p class="font-semibold text-gray-900">{getLookupValue(patient.pendidikan_id)}</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="text-6xl mb-4">❌</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">Pasien Tidak Ditemukan</h3>
				<p class="text-gray-600 mb-6">Data pasien tidak tersedia di sistem</p>
				<button
					onclick={() => goto('/pasien/search')}
					class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
				>
					Kembali ke Pencarian
				</button>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
