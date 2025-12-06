<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import CardDescription from '$lib/components/ui/card-description.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import type { MasterPasien, Kunjungan } from '$lib/types';
	import { normalizeData } from '$lib/data-utils';
	import pasienData from '$lib/data/master-pasien.json';
	import kunjunganData from '$lib/data/kunjungan.json';

	let searchQuery = $state('');
	let selectedPatient = $state<MasterPasien | null>(null);
	let patients = $state<MasterPasien[]>(normalizeData<MasterPasien[]>(pasienData));
	let visits = $state<Kunjungan[]>(normalizeData<Kunjungan[]>(kunjunganData));
	
	let filteredPatients = $derived(
		searchQuery && !selectedPatient
			? patients.filter(
					(p) =>
						p.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
						p.no_rm.toLowerCase().includes(searchQuery.toLowerCase()) ||
						p.nik.includes(searchQuery)
			  )
			: []
	);

	// Form state
	let formData = $state({
		jenis_kunjungan: 'RAJAL' as 'RAJAL' | 'IGD' | 'RANAP',
		ruangan_id: '',
		dokter_id: '',
		penjamin_id: '',
		no_penjamin: '',
		keterangan: ''
	});

	function selectPatient(patient: MasterPasien) {
		selectedPatient = patient;
		searchQuery = `${patient.no_rm} - ${patient.nama_lengkap}`;
	}

	function clearPatient() {
		selectedPatient = null;
		searchQuery = '';
	}

	function handleSubmit() {
		if (!selectedPatient) {
			alert('Pilih pasien terlebih dahulu');
			return;
		}

		// Create new visit
		const newVisit: Partial<Kunjungan> = {
			id: `kunjungan-${Date.now()}`,
			no_registrasi: `REG${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(visits.length + 1).padStart(3, '0')}`,
			pasien_id: selectedPatient.id,
			tanggal_kunjungan: new Date().toISOString().slice(0, 10),
			waktu_kunjungan: new Date().toTimeString().slice(0, 8),
			jenis_kunjungan: formData.jenis_kunjungan as any,
			ruangan_id: formData.ruangan_id,
			dokter_id: formData.dokter_id,
			penjamin_id: formData.penjamin_id,
			no_penjamin: formData.no_penjamin || undefined,
			status_kunjungan: 'DAFTAR' as any,
			no_antrian: visits.filter((v) => v.tanggal_kunjungan === new Date().toISOString().slice(0, 10)).length + 1,
			keterangan: formData.keterangan || undefined,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			created_by: 'user-001',
			updated_by: 'user-001'
		};

		alert(`Registrasi berhasil!\nNo. Registrasi: ${newVisit.no_registrasi}\nNo. Antrian: ${newVisit.no_antrian}`);
		
		// Reset form
		selectedPatient = null;
		searchQuery = '';
		formData = {
			jenis_kunjungan: 'RAJAL',
			ruangan_id: '',
			dokter_id: '',
			penjamin_id: '',
			no_penjamin: '',
			keterangan: ''
		};
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
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Registrasi Kunjungan</h1>
		<p class="text-muted-foreground mt-1">Daftarkan kunjungan pasien baru</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Patient Search -->
		<div class="lg:col-span-1">
			<Card>
				<CardHeader>
					<h3 class="text-lg font-semibold">Cari Pasien</h3>
					<CardDescription>Cari berdasarkan nama, No. RM, atau NIK</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div>
							<Label for="patient-search">Pencarian Pasien</Label>
							<Input
								id="patient-search"
								type="text"
								placeholder="Nama / No. RM / NIK..."
								bind:value={searchQuery}
								disabled={!!selectedPatient}
							/>
						</div>

						{#if selectedPatient}
							<div class="rounded-lg border bg-accent p-4">
								<div class="mb-3 flex items-start justify-between">
									<h4 class="font-semibold">Pasien Terpilih</h4>
									<Button size="sm" variant="ghost" onclick={clearPatient}>✕</Button>
								</div>
								<div class="space-y-2 text-sm">
									<div>
										<span class="text-muted-foreground">No. RM:</span>
										<span class="ml-2 font-mono font-medium">{selectedPatient.no_rm}</span>
									</div>
									<div>
										<span class="text-muted-foreground">NIK:</span>
										<span class="ml-2 font-mono">{selectedPatient.nik}</span>
									</div>
									<div>
										<span class="text-muted-foreground">Nama:</span>
										<span class="ml-2 font-medium">{selectedPatient.nama_lengkap}</span>
									</div>
									<div>
										<span class="text-muted-foreground">Umur:</span>
										<span class="ml-2">{calculateAge(selectedPatient.tanggal_lahir)} tahun</span>
									</div>
									<div>
										<span class="text-muted-foreground">Jenis Kelamin:</span>
										<span class="ml-2"
											>{selectedPatient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span
										>
									</div>
									<div>
										<span class="text-muted-foreground">No. HP:</span>
										<span class="ml-2">{selectedPatient.no_hp}</span>
									</div>
								</div>
							</div>
						{:else if filteredPatients.length > 0}
							<div class="space-y-2">
								<p class="text-sm font-medium">Hasil Pencarian:</p>
								<div class="max-h-64 space-y-1 overflow-y-auto">
									{#each filteredPatients as patient}
										<button
											class="w-full rounded-md border p-3 text-left text-sm hover:bg-accent"
											onclick={() => selectPatient(patient)}
										>
											<div class="font-medium">{patient.nama_lengkap}</div>
											<div class="text-muted-foreground">
												{patient.no_rm} • {patient.nik}
											</div>
										</button>
									{/each}
								</div>
							</div>
						{/if}

						<div class="pt-2">
							<Button
								variant="outline"
								class="w-full"
								onclick={() => (window.location.href = '/pendaftaran/pasien/tambah')}
							>
								➕ Pasien Baru
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Registration Form -->
		<div class="lg:col-span-2">
			<Card>
				<CardHeader>
					<h3 class="text-lg font-semibold">Data Kunjungan</h3>
					<CardDescription>Lengkapi informasi kunjungan pasien</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onsubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
						class="space-y-4"
					>
						<div>
							<Label for="jenis-kunjungan">Jenis Kunjungan</Label>
							<select
								id="jenis-kunjungan"
								bind:value={formData.jenis_kunjungan}
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								required
							>
								<option value="RAJAL">Rawat Jalan</option>
								<option value="IGD">IGD (Instalasi Gawat Darurat)</option>
								<option value="RANAP">Rawat Inap</option>
							</select>
						</div>

						<div>
							<Label for="ruangan">Ruangan / Poli</Label>
							<select
								id="ruangan"
								bind:value={formData.ruangan_id}
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								required
							>
								<option value="">-- Pilih Ruangan --</option>
								<option value="ruangan-poli-001">Poli Penyakit Dalam</option>
								<option value="ruangan-poli-002">Poli Anak</option>
								<option value="ruangan-poli-003">Poli Kandungan</option>
								<option value="ruangan-igd-001">IGD</option>
							</select>
						</div>

						<div>
							<Label for="dokter">Dokter</Label>
							<select
								id="dokter"
								bind:value={formData.dokter_id}
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								required
							>
								<option value="">-- Pilih Dokter --</option>
								<option value="pegawai-dokter-001">Dr. Budi Hartono, Sp.PD</option>
								<option value="pegawai-dokter-002">Dr. Siti Rahayu</option>
								<option value="pegawai-dokter-003">Dr. Ahmad Fauzi, Sp.A</option>
							</select>
						</div>

						<div>
							<Label for="penjamin">Jenis Penjamin</Label>
							<select
								id="penjamin"
								bind:value={formData.penjamin_id}
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								required
							>
								<option value="">-- Pilih Penjamin --</option>
								<option value="penjamin-001">BPJS Kesehatan</option>
								<option value="penjamin-002">Umum / Tunai</option>
								<option value="penjamin-003">Asuransi Swasta</option>
							</select>
						</div>

						{#if formData.penjamin_id === 'penjamin-001' || formData.penjamin_id === 'penjamin-003'}
							<div>
								<Label for="no-penjamin">Nomor Kartu Penjamin</Label>
								<Input
									id="no-penjamin"
									type="text"
									placeholder="Nomor kartu BPJS / Asuransi"
									bind:value={formData.no_penjamin}
									required
								/>
							</div>
						{/if}

						<div>
							<Label for="keterangan">Keterangan (Opsional)</Label>
							<textarea
								id="keterangan"
								bind:value={formData.keterangan}
								class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								placeholder="Catatan tambahan..."
							></textarea>
						</div>

						<div class="flex gap-3 pt-4">
							<Button type="submit" disabled={!selectedPatient}>Daftar Kunjungan</Button>
							<Button
								type="button"
								variant="outline"
								onclick={() => (window.location.href = '/pendaftaran/pasien')}
							>
								Batal
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	</div>
</div>
