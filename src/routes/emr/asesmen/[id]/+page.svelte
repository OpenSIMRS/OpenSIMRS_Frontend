<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { 
		kunjunganService,
		patientService,
		masterDataService,
		emrService
	} from '$lib/data/api-service';
	import type { Kunjungan, Patient, AsesmenFormInput } from '$lib/types';

	let kunjunganId = $state('');
	let kunjungan = $state<Kunjungan | null>(null);
	let patient = $state<Patient | null>(null);
	let isLoading = $state(false);
	let isSaving = $state(false);

	let formData = $state<AsesmenFormInput>({
		kunjungan_id: '',
		pasien_id: '',
		waktu_asesmen: new Date().toISOString(),
		keluhan_utama: '',
		riwayat_penyakit_sekarang: '',
		riwayat_penyakit_dahulu: '',
		riwayat_penyakit_keluarga: '',
		alergi_obat: '',
		alergi_makanan: '',
		alergi_lainnya: '',
		td_sistole: 120,
		td_diastole: 80,
		nadi: 75,
		respirasi: 20,
		suhu: 36.5,
		tinggi_badan: 0,
		berat_badan: 0,
		spo2: 98,
		nyeri_skor: 0,
		perawat_id: 'perawat-dummy-001'
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
			}
		} finally {
			isLoading = false;
		}
	}

	function calculateBMI(): string {
		if (formData.tinggi_badan && formData.berat_badan) {
			const heightInMeters = formData.tinggi_badan / 100;
			const bmi = formData.berat_badan / (heightInMeters * heightInMeters);
			return bmi.toFixed(1);
		}
		return '-';
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSaving = true;

		try {
			await emrService.createAsesmen(formData);
			alert('Asesmen berhasil disimpan!');
			// Navigate to SOAP form for doctor
			goto(`/emr/soap/${kunjunganId}`);
		} catch (error) {
			console.error('Error saving assessment:', error);
			alert('Gagal menyimpan asesmen. Silakan coba lagi.');
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-5xl mx-auto p-6">
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Asesmen Keperawatan</h1>
				<p class="text-gray-600">Form asesmen awal oleh perawat</p>
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

			<!-- Assessment Form -->
			<div class="bg-white rounded-lg shadow-md p-6">
				<form onsubmit={handleSubmit}>
					<!-- Keluhan & Riwayat -->
					<div class="mb-6">
						<h2 class="text-xl font-semibold text-gray-900 mb-4">Keluhan & Riwayat</h2>
						<div class="space-y-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Keluhan Utama <span class="text-red-500">*</span>
								</label>
								<textarea
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.keluhan_utama}
									required
									rows="3"
									placeholder="Masukkan keluhan utama pasien..."
								></textarea>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Riwayat Penyakit Sekarang <span class="text-red-500">*</span>
								</label>
								<textarea
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.riwayat_penyakit_sekarang}
									required
									rows="3"
									placeholder="Riwayat penyakit saat ini..."
								></textarea>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1">
										Riwayat Penyakit Dahulu
									</label>
									<textarea
										class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										bind:value={formData.riwayat_penyakit_dahulu}
										rows="2"
										placeholder="Riwayat penyakit terdahulu..."
									></textarea>
								</div>

								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1">
										Riwayat Penyakit Keluarga
									</label>
									<textarea
										class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										bind:value={formData.riwayat_penyakit_keluarga}
										rows="2"
										placeholder="Riwayat penyakit keluarga..."
									></textarea>
								</div>
							</div>
						</div>
					</div>

					<!-- Alergi -->
					<div class="mb-6">
						<h2 class="text-xl font-semibold text-gray-900 mb-4">Alergi</h2>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Alergi Obat
								</label>
								<input
									type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.alergi_obat}
									placeholder="Nama obat..."
								/>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Alergi Makanan
								</label>
								<input
									type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.alergi_makanan}
									placeholder="Jenis makanan..."
								/>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Alergi Lainnya
								</label>
								<input
									type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.alergi_lainnya}
									placeholder="Alergi lain..."
								/>
							</div>
						</div>
					</div>

					<!-- Tanda Vital -->
					<div class="mb-6">
						<h2 class="text-xl font-semibold text-gray-900 mb-4">Tanda Vital</h2>
						<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Tekanan Darah Sistole <span class="text-red-500">*</span>
								</label>
								<div class="flex items-center gap-2">
									<input
										type="number"
										class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										bind:value={formData.td_sistole}
										required
										min="0"
									/>
									<span class="text-sm text-gray-600">mmHg</span>
								</div>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Tekanan Darah Diastole <span class="text-red-500">*</span>
								</label>
								<div class="flex items-center gap-2">
									<input
										type="number"
										class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										bind:value={formData.td_diastole}
										required
										min="0"
									/>
									<span class="text-sm text-gray-600">mmHg</span>
								</div>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Nadi <span class="text-red-500">*</span>
								</label>
								<div class="flex items-center gap-2">
									<input
										type="number"
										class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										bind:value={formData.nadi}
										required
										min="0"
									/>
									<span class="text-sm text-gray-600">x/mnt</span>
								</div>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Respirasi <span class="text-red-500">*</span>
								</label>
								<div class="flex items-center gap-2">
									<input
										type="number"
										class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										bind:value={formData.respirasi}
										required
										min="0"
									/>
									<span class="text-sm text-gray-600">x/mnt</span>
								</div>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Suhu <span class="text-red-500">*</span>
								</label>
								<div class="flex items-center gap-2">
									<input
										type="number"
										step="0.1"
										class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										bind:value={formData.suhu}
										required
										min="0"
									/>
									<span class="text-sm text-gray-600">°C</span>
								</div>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									SpO2
								</label>
								<div class="flex items-center gap-2">
									<input
										type="number"
										class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										bind:value={formData.spo2}
										min="0"
										max="100"
									/>
									<span class="text-sm text-gray-600">%</span>
								</div>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Tinggi Badan
								</label>
								<div class="flex items-center gap-2">
									<input
										type="number"
										step="0.1"
										class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										bind:value={formData.tinggi_badan}
										min="0"
									/>
									<span class="text-sm text-gray-600">cm</span>
								</div>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Berat Badan
								</label>
								<div class="flex items-center gap-2">
									<input
										type="number"
										step="0.1"
										class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										bind:value={formData.berat_badan}
										min="0"
									/>
									<span class="text-sm text-gray-600">kg</span>
								</div>
							</div>
						</div>

						{#if formData.tinggi_badan && formData.berat_badan}
							<div class="mt-4 p-3 bg-blue-50 rounded-md">
								<p class="text-sm text-gray-700">
									<span class="font-medium">IMT (Indeks Massa Tubuh):</span>
									<span class="ml-2 text-lg font-bold text-blue-600">{calculateBMI()}</span>
								</p>
							</div>
						{/if}
					</div>

					<!-- Skala Nyeri -->
					<div class="mb-6">
						<h2 class="text-xl font-semibold text-gray-900 mb-4">Skala Nyeri</h2>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Skor Nyeri (0-10)
							</label>
							<div class="flex items-center gap-4">
								<input
									type="range"
									min="0"
									max="10"
									class="flex-1"
									bind:value={formData.nyeri_skor}
								/>
								<div class="w-16 text-center">
									<span class="text-2xl font-bold text-blue-600">{formData.nyeri_skor}</span>
								</div>
							</div>
							<div class="flex justify-between text-xs text-gray-500 mt-1">
								<span>0 - Tidak Nyeri</span>
								<span>10 - Sangat Nyeri</span>
							</div>
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
							class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400"
							disabled={isSaving}
						>
							{isSaving ? 'Menyimpan...' : 'Simpan & Lanjut ke Dokter'}
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
