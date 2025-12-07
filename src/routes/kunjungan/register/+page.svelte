<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { 
		patientService, 
		masterDataService, 
		kunjunganService 
	} from '$lib/data/api-service';
	import type { Patient, Poli, Dokter, Penjamin, KunjunganFormInput } from '$lib/types';

	let pasienId = $state('');
	let selectedPatient = $state<Patient | null>(null);
	let poliList = $state<Poli[]>([]);
	let dokterList = $state<Dokter[]>([]);
	let penjaminList = $state<Penjamin[]>([]);
	let filteredDokter = $state<Dokter[]>([]);
	
	let formData = $state<KunjunganFormInput>({
		pasien_id: '',
		tanggal_kunjungan: new Date().toISOString().split('T')[0],
		waktu_kunjungan: new Date().toTimeString().split(' ')[0].substring(0, 5),
		jenis_kunjungan: 'RAJAL',
		poli_id: '',
		ruangan_id: '',
		dokter_id: '',
		penjamin_id: '',
		no_penjamin: '',
		keterangan: ''
	});

	let isLoading = $state(false);
	let isSaving = $state(false);

	onMount(async () => {
		// Get patient ID from URL params
		const urlParams = new URLSearchParams(window.location.search);
		pasienId = urlParams.get('pasien_id') || '';
		
		await loadData();
		
		if (pasienId) {
			await loadPatient(pasienId);
		}
	});

	async function loadData() {
		isLoading = true;
		try {
			[poliList, dokterList, penjaminList] = await Promise.all([
				masterDataService.getPoli(),
				masterDataService.getDokter(),
				masterDataService.getPenjamin()
			]);
		} finally {
			isLoading = false;
		}
	}

	async function loadPatient(id: string) {
		const patient = await patientService.getPatientById(id);
		if (patient) {
			selectedPatient = patient;
			formData.pasien_id = patient.id;
		}
	}

	function handlePoliChange() {
		// Filter doctors by selected poli
		filteredDokter = dokterList.filter(d => d.poli_id === formData.poli_id && d.is_active);
		formData.dokter_id = '';
		
		// Set ruangan_id same as poli for simplicity
		const selectedPoli = poliList.find(p => p.id === formData.poli_id);
		if (selectedPoli) {
			formData.ruangan_id = `ruangan-${selectedPoli.kode}`;
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!selectedPatient) {
			alert('Silakan pilih pasien terlebih dahulu');
			return;
		}

		isSaving = true;
		try {
			const kunjungan = await kunjunganService.createKunjungan(formData);
			alert(`Pendaftaran berhasil!\n\nNo. Registrasi: ${kunjungan.no_registrasi}\nNo. Antrian: ${kunjungan.no_antrian}\n\nSilakan menunggu di poli ${poliList.find(p => p.id === formData.poli_id)?.nama}`);
			goto('/poli/antrian');
		} catch (error) {
			console.error('Error creating visit:', error);
			alert('Gagal mendaftarkan kunjungan. Silakan coba lagi.');
		} finally {
			isSaving = false;
		}
	}

	function searchPatient() {
		goto('/pasien/search');
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto p-6">
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Pendaftaran Kunjungan Rawat Jalan</h1>
				<p class="text-gray-600">Daftarkan kunjungan pasien ke poli</p>
			</div>
			<button
				onclick={() => goto('/')}
				class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
			>
				← Kembali
			</button>
		</div>

		<!-- Patient Info -->
		{#if selectedPatient}
			<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div>
						<p class="text-xs text-gray-600">No. RM</p>
						<p class="font-semibold">{selectedPatient.no_rm}</p>
					</div>
					<div>
						<p class="text-xs text-gray-600">NIK</p>
						<p class="font-semibold">{selectedPatient.nik}</p>
					</div>
					<div class="col-span-2">
						<p class="text-xs text-gray-600">Nama Pasien</p>
						<p class="font-semibold">{selectedPatient.nama_lengkap}</p>
					</div>
					<div>
						<p class="text-xs text-gray-600">Tanggal Lahir</p>
						<p class="font-semibold">{new Date(selectedPatient.tanggal_lahir).toLocaleDateString('id-ID')}</p>
					</div>
					<div>
						<p class="text-xs text-gray-600">No. HP</p>
						<p class="font-semibold">{selectedPatient.no_hp}</p>
					</div>
					<div class="col-span-2">
						<p class="text-xs text-gray-600">Alamat</p>
						<p class="font-semibold text-sm">{selectedPatient.alamat}</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-center">
				<p class="text-gray-700 mb-4">Belum ada pasien yang dipilih</p>
				<button
					onclick={searchPatient}
					class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
				>
					Cari Pasien
				</button>
			</div>
		{/if}

		<!-- Registration Form -->
		<div class="bg-white rounded-lg shadow-md p-6">
			<form onsubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Tanggal Kunjungan <span class="text-red-500">*</span>
						</label>
						<input
							type="date"
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
							bind:value={formData.tanggal_kunjungan}
							required
							disabled={!selectedPatient}
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Waktu Kunjungan <span class="text-red-500">*</span>
						</label>
						<input
							type="time"
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
							bind:value={formData.waktu_kunjungan}
							required
							disabled={!selectedPatient}
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Poli Tujuan <span class="text-red-500">*</span>
						</label>
						<select
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
							bind:value={formData.poli_id}
							onchange={handlePoliChange}
							required
							disabled={!selectedPatient}
						>
							<option value="">Pilih Poli</option>
							{#each poliList.filter(p => p.is_active) as poli}
								<option value={poli.id}>{poli.nama}</option>
							{/each}
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Dokter <span class="text-red-500">*</span>
						</label>
						<select
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
							bind:value={formData.dokter_id}
							required
							disabled={!selectedPatient || !formData.poli_id}
						>
							<option value="">Pilih Dokter</option>
							{#each filteredDokter as dokter}
								<option value={dokter.id}>
									{dokter.gelar_depan} {dokter.nama_lengkap}{dokter.gelar_belakang ? ', ' + dokter.gelar_belakang : ''}
								</option>
							{/each}
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Jenis Penjamin <span class="text-red-500">*</span>
						</label>
						<select
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
							bind:value={formData.penjamin_id}
							required
							disabled={!selectedPatient}
						>
							<option value="">Pilih Penjamin</option>
							{#each penjaminList.filter(p => p.is_active) as penjamin}
								<option value={penjamin.id}>{penjamin.nama}</option>
							{/each}
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							No. Kartu Penjamin
						</label>
						<input
							type="text"
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
							bind:value={formData.no_penjamin}
							placeholder="Jika menggunakan BPJS/Asuransi"
							disabled={!selectedPatient || formData.penjamin_id === 'penjamin-1'}
						/>
					</div>
				</div>

				<div class="mb-6">
					<label class="block text-sm font-medium text-gray-700 mb-1">
						Keluhan/Keterangan
					</label>
					<textarea
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
						bind:value={formData.keterangan}
						rows="3"
						placeholder="Keluhan awal pasien (opsional)"
						disabled={!selectedPatient}
					></textarea>
				</div>

				<div class="flex gap-4 justify-end">
					<button
						type="button"
						onclick={() => goto('/')}
						class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
						disabled={isSaving}
					>
						Batal
					</button>
					<button
						type="submit"
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400"
						disabled={isSaving || !selectedPatient}
					>
						{isSaving ? 'Mendaftarkan...' : 'Daftar Kunjungan'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
