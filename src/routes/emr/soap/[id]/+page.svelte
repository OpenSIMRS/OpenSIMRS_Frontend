<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { 
		kunjunganService,
		patientService,
		masterDataService,
		emrService
	} from '$lib/data/api-service';
	import type { Kunjungan, Patient, AsesmenKeperawatan, SOAPFormInput } from '$lib/types';

	let kunjunganId = $state('');
	let kunjungan = $state<Kunjungan | null>(null);
	let patient = $state<Patient | null>(null);
	let asesmen = $state<AsesmenKeperawatan | null>(null);
	let isLoading = $state(false);
	let isSaving = $state(false);

	let formData = $state<SOAPFormInput>({
		kunjungan_id: '',
		pasien_id: '',
		tanggal_pemeriksaan: new Date().toISOString().split('T')[0],
		waktu_pemeriksaan: new Date().toTimeString().split(' ')[0].substring(0, 5),
		subjective: '',
		objective: '',
		assessment: '',
		plan: '',
		td_sistole: 120,
		td_diastole: 80,
		nadi: 75,
		respirasi: 20,
		suhu: 36.5,
		dokter_id: 'dokter-dummy-001',
		is_dpjp: true
	});

	onMount(async () => {
		kunjunganId = window.location.pathname.split('/').pop() || '';
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		try {
			kunjungan = await kunjunganService.getKunjunganById(kunjunganId);
			if (kunjungan) {
				patient = await patientService.getPatientById(kunjungan.pasien_id);
				formData.kunjungan_id = kunjungan.id;
				formData.pasien_id = kunjungan.pasien_id;

				// Load nursing assessment if available
				asesmen = await emrService.getAsesmenByKunjungan(kunjungan.id);
				if (asesmen) {
					// Copy vital signs from assessment
					formData.td_sistole = asesmen.td_sistole;
					formData.td_diastole = asesmen.td_diastole;
					formData.nadi = asesmen.nadi;
					formData.respirasi = asesmen.respirasi;
					formData.suhu = asesmen.suhu;

					// Pre-fill subjective with chief complaint
					formData.subjective = `Keluhan Utama: ${asesmen.keluhan_utama}\n\n${asesmen.riwayat_penyakit_sekarang}`;
				}
			}
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSaving = true;

		try {
			await emrService.createSOAP(formData);
			// Update visit status to SELESAI
			await kunjunganService.updateKunjungan(kunjunganId, {
				status_kunjungan: 'SELESAI'
			});
			alert('SOAP berhasil disimpan!\nKunjungan telah diselesaikan.');
			goto('/poli/antrian');
		} catch (error) {
			console.error('Error saving SOAP:', error);
			alert('Gagal menyimpan SOAP. Silakan coba lagi.');
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-5xl mx-auto p-6">
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Pemeriksaan Dokter (SOAP)</h1>
				<p class="text-gray-600">Form pemeriksaan dan diagnosa dokter</p>
			</div>
			<button
				onclick={() => goto('/poli/antrian')}
				class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
			>
				← Kembali ke Antrian
			</button>
		</div>

		{#if isLoading}
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Memuat data...</p>
			</div>
		{:else if !kunjungan || !patient}
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<p class="text-gray-600">Data kunjungan tidak ditemukan</p>
				<button
					onclick={() => goto('/poli/antrian')}
					class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
				>
					Kembali ke Antrian
				</button>
			</div>
		{:else}
			<!-- Patient Info -->
			<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div>
						<p class="text-xs text-gray-600">No. RM</p>
						<p class="font-semibold">{patient.no_rm}</p>
					</div>
					<div>
						<p class="text-xs text-gray-600">No. Registrasi</p>
						<p class="font-semibold">{kunjungan.no_registrasi}</p>
					</div>
					<div class="col-span-2">
						<p class="text-xs text-gray-600">Nama Pasien</p>
						<p class="font-semibold">{patient.nama_lengkap}</p>
					</div>
					<div>
						<p class="text-xs text-gray-600">Tanggal Lahir</p>
						<p class="font-semibold">{new Date(patient.tanggal_lahir).toLocaleDateString('id-ID')}</p>
					</div>
					<div>
						<p class="text-xs text-gray-600">Jenis Kelamin</p>
						<p class="font-semibold">{patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
					</div>
					<div>
						<p class="text-xs text-gray-600">No. Antrian</p>
						<p class="font-semibold text-2xl text-blue-600">{kunjungan.no_antrian}</p>
					</div>
				</div>
			</div>

			<!-- Nursing Assessment Summary (if available) -->
			{#if asesmen}
				<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
					<h3 class="text-sm font-semibold text-green-900 mb-2">📋 Asesmen Perawat</h3>
					<div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
						<div>
							<p class="text-xs text-green-700">TD</p>
							<p class="font-semibold">{asesmen.td_sistole}/{asesmen.td_diastole} mmHg</p>
						</div>
						<div>
							<p class="text-xs text-green-700">Nadi</p>
							<p class="font-semibold">{asesmen.nadi} x/mnt</p>
						</div>
						<div>
							<p class="text-xs text-green-700">Respirasi</p>
							<p class="font-semibold">{asesmen.respirasi} x/mnt</p>
						</div>
						<div>
							<p class="text-xs text-green-700">Suhu</p>
							<p class="font-semibold">{asesmen.suhu} °C</p>
						</div>
						<div>
							<p class="text-xs text-green-700">SpO2</p>
							<p class="font-semibold">{asesmen.spo2}%</p>
						</div>
					</div>
					{#if asesmen.alergi_obat || asesmen.alergi_makanan}
						<div class="mt-3 p-2 bg-red-100 rounded border border-red-300">
							<p class="text-xs font-semibold text-red-900">⚠️ Alergi:</p>
							<p class="text-sm text-red-800">
								{#if asesmen.alergi_obat}Obat: {asesmen.alergi_obat}{/if}
								{#if asesmen.alergi_makanan}{asesmen.alergi_obat ? ' | ' : ''}Makanan: {asesmen.alergi_makanan}{/if}
							</p>
						</div>
					{/if}
				</div>
			{/if}

			<!-- SOAP Form -->
			<div class="bg-white rounded-lg shadow-md p-6">
				<form onsubmit={handleSubmit}>
					<!-- Subjective -->
					<div class="mb-6">
						<h2 class="text-xl font-semibold text-gray-900 mb-4">S - Subjective (Keluhan Pasien)</h2>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Keluhan dan Anamnesis <span class="text-red-500">*</span>
							</label>
							<textarea
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.subjective}
								required
								rows="4"
								placeholder="Keluhan pasien, anamnesis, riwayat penyakit..."
							></textarea>
						</div>
					</div>

					<!-- Objective -->
					<div class="mb-6">
						<h2 class="text-xl font-semibold text-gray-900 mb-4">O - Objective (Pemeriksaan Fisik)</h2>
						
						<!-- Vital Signs -->
						<div class="mb-4">
							<h3 class="text-sm font-semibold text-gray-700 mb-2">Tanda Vital</h3>
							<div class="grid grid-cols-2 md:grid-cols-5 gap-3">
								<div>
									<label class="block text-xs text-gray-600 mb-1">TD Sistole *</label>
									<div class="flex items-center gap-1">
										<input
											type="number"
											class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
											bind:value={formData.td_sistole}
											required
											min="0"
										/>
										<span class="text-xs text-gray-600">mmHg</span>
									</div>
								</div>

								<div>
									<label class="block text-xs text-gray-600 mb-1">TD Diastole *</label>
									<div class="flex items-center gap-1">
										<input
											type="number"
											class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
											bind:value={formData.td_diastole}
											required
											min="0"
										/>
										<span class="text-xs text-gray-600">mmHg</span>
									</div>
								</div>

								<div>
									<label class="block text-xs text-gray-600 mb-1">Nadi *</label>
									<div class="flex items-center gap-1">
										<input
											type="number"
											class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
											bind:value={formData.nadi}
											required
											min="0"
										/>
										<span class="text-xs text-gray-600">x/mnt</span>
									</div>
								</div>

								<div>
									<label class="block text-xs text-gray-600 mb-1">Respirasi *</label>
									<div class="flex items-center gap-1">
										<input
											type="number"
											class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
											bind:value={formData.respirasi}
											required
											min="0"
										/>
										<span class="text-xs text-gray-600">x/mnt</span>
									</div>
								</div>

								<div>
									<label class="block text-xs text-gray-600 mb-1">Suhu *</label>
									<div class="flex items-center gap-1">
										<input
											type="number"
											step="0.1"
											class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
											bind:value={formData.suhu}
											required
											min="0"
										/>
										<span class="text-xs text-gray-600">°C</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Physical Examination -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Hasil Pemeriksaan Fisik <span class="text-red-500">*</span>
							</label>
							<textarea
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.objective}
								required
								rows="4"
								placeholder="Hasil pemeriksaan fisik: kepala, thorax, abdomen, ekstremitas, dll..."
							></textarea>
						</div>
					</div>

					<!-- Assessment -->
					<div class="mb-6">
						<h2 class="text-xl font-semibold text-gray-900 mb-4">A - Assessment (Diagnosa)</h2>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Diagnosa & Penilaian <span class="text-red-500">*</span>
							</label>
							<textarea
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.assessment}
								required
								rows="3"
								placeholder="Diagnosa utama dan diagnosa tambahan (jika ada), kode ICD-10..."
							></textarea>
							<p class="text-xs text-gray-500 mt-1">
								Contoh: Hipertensi Grade 1 (I10) | Diabetes Mellitus Tipe 2 (E11)
							</p>
						</div>
					</div>

					<!-- Plan -->
					<div class="mb-6">
						<h2 class="text-xl font-semibold text-gray-900 mb-4">P - Plan (Rencana Terapi)</h2>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Rencana Terapi & Tindak Lanjut <span class="text-red-500">*</span>
							</label>
							<textarea
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.plan}
								required
								rows="4"
								placeholder="Rencana terapi, resep obat, tindakan, pemeriksaan penunjang, edukasi, kontrol ulang..."
							></textarea>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="flex gap-4 justify-end pt-6 border-t">
						<button
							type="button"
							onclick={() => goto('/poli/antrian')}
							class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
							disabled={isSaving}
						>
							Batal
						</button>
						<button
							type="submit"
							class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:bg-gray-400"
							disabled={isSaving}
						>
							{isSaving ? 'Menyimpan...' : '✓ Simpan & Selesaikan Kunjungan'}
						</button>
					</div>
				</form>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
