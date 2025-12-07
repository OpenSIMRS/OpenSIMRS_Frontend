<script lang="ts">
	import { goto } from '$app/navigation';
	import { patientService, masterDataService } from '$lib/data/api-service';
	import type { MasterLookup, PatientFormInput } from '$lib/types';

	let formData = $state<PatientFormInput>({
		nik: '',
		nama_lengkap: '',
		tempat_lahir: '',
		tanggal_lahir: '',
		jenis_kelamin: 'L',
		alamat: '',
		kode_wilayah: '',
		no_hp: '',
		agama_id: '',
		status_perkawinan_id: '',
		nama_ibu: ''
	});

	let lookupData = $state<MasterLookup[]>([]);
	let isLoading = $state(false);
	let isSaving = $state(false);

	$effect(() => {
		loadLookupData();
	});

	async function loadLookupData() {
		isLoading = true;
		try {
			lookupData = await masterDataService.getMasterLookup();
		} finally {
			isLoading = false;
		}
	}

	function getLookupByCategory(category: string) {
		return lookupData.filter(l => l.category === category);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSaving = true;
		
		try {
			const patient = await patientService.createPatient(formData);
			alert(`Pasien berhasil didaftarkan dengan No. RM: ${patient.no_rm}`);
			goto(`/kunjungan/register?pasien_id=${patient.id}`);
		} catch (error) {
			console.error('Error creating patient:', error);
			alert('Gagal mendaftarkan pasien. Silakan coba lagi.');
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto p-6">
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Daftar Pasien Baru</h1>
				<p class="text-gray-600">Masukkan data pasien baru ke sistem</p>
			</div>
			<button
				onclick={() => goto('/')}
				class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
			>
				← Kembali
			</button>
		</div>

		<div class="bg-white rounded-lg shadow-md p-6">
			<form onsubmit={handleSubmit}>
				<!-- Data Identitas -->
				<div class="mb-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-4">Data Identitas</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								NIK <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.nik}
								required
								pattern="[0-9]{16}"
								maxlength="16"
								placeholder="16 digit NIK"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Nama Lengkap <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.nama_lengkap}
								required
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Tempat Lahir <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.tempat_lahir}
								required
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Tanggal Lahir <span class="text-red-500">*</span>
							</label>
							<input
								type="date"
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.tanggal_lahir}
								required
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Jenis Kelamin <span class="text-red-500">*</span>
							</label>
							<select
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.jenis_kelamin}
								required
							>
								<option value="L">Laki-laki</option>
								<option value="P">Perempuan</option>
							</select>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Golongan Darah
							</label>
							<select
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.golongan_darah}
							>
								<option value="">Pilih Golongan Darah</option>
								<option value="A">A</option>
								<option value="B">B</option>
								<option value="AB">AB</option>
								<option value="O">O</option>
								<option value="-">Tidak Tahu</option>
							</select>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Agama <span class="text-red-500">*</span>
							</label>
							<select
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.agama_id}
								required
							>
								<option value="">Pilih Agama</option>
								{#each getLookupByCategory('AGAMA') as agama}
									<option value={agama.id}>{agama.value}</option>
								{/each}
							</select>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Status Perkawinan <span class="text-red-500">*</span>
							</label>
							<select
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.status_perkawinan_id}
								required
							>
								<option value="">Pilih Status</option>
								{#each getLookupByCategory('STATUS_PERKAWINAN') as status}
									<option value={status.id}>{status.value}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>

				<!-- Alamat & Kontak -->
				<div class="mb-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-4">Alamat & Kontak</h2>
					<div class="grid grid-cols-1 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Alamat Lengkap <span class="text-red-500">*</span>
							</label>
							<textarea
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.alamat}
								required
								rows="3"
							></textarea>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">RT</label>
								<input
									type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.rt}
									maxlength="3"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">RW</label>
								<input
									type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.rw}
									maxlength="3"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
								<input
									type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.kode_pos}
									maxlength="5"
								/>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Kode Wilayah (PP.KK.CC.DDDD) <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.kode_wilayah}
								required
								placeholder="31.71.01.1001"
							/>
							<p class="text-xs text-gray-500 mt-1">
								PP=Provinsi, KK=Kabupaten/Kota, CC=Kecamatan, DDDD=Desa/Kelurahan
							</p>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									No. HP <span class="text-red-500">*</span>
								</label>
								<input
									type="tel"
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.no_hp}
									required
									placeholder="08xxxxxxxxxx"
								/>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
								<input
									type="tel"
									class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									bind:value={formData.no_telepon}
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Informasi Keluarga -->
				<div class="mb-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-4">Informasi Keluarga</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Nama Ibu Kandung <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.nama_ibu}
								required
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Nama Ayah</label>
							<input
								type="text"
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.nama_ayah}
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Pekerjaan</label>
							<select
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.pekerjaan_id}
							>
								<option value="">Pilih Pekerjaan</option>
								{#each getLookupByCategory('PEKERJAAN') as pekerjaan}
									<option value={pekerjaan.id}>{pekerjaan.value}</option>
								{/each}
							</select>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Pendidikan</label>
							<select
								class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								bind:value={formData.pendidikan_id}
							>
								<option value="">Pilih Pendidikan</option>
								{#each getLookupByCategory('PENDIDIKAN') as pendidikan}
									<option value={pendidikan.id}>{pendidikan.value}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>

				<!-- Action Buttons -->
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
						disabled={isSaving}
					>
						{isSaving ? 'Menyimpan...' : 'Daftar Pasien'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
