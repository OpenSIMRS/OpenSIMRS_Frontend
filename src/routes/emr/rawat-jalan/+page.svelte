<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import CardDescription from '$lib/components/ui/card-description.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import type { Kunjungan, MasterPasien } from '$lib/types';
	import { normalizeData } from '$lib/data-utils';
	import kunjunganData from '$lib/data/kunjungan.json';
	import pasienData from '$lib/data/master-pasien.json';

	let visits = $state<Kunjungan[]>(normalizeData<Kunjungan[]>(kunjunganData));
	let patients = $state<MasterPasien[]>(normalizeData<MasterPasien[]>(pasienData));
	
	// Filter only today's RAJAL visits
	let todayVisits = $derived(
		visits
			.filter((v) => v.jenis_kunjungan === 'RAJAL' && v.tanggal_kunjungan === new Date().toISOString().slice(0, 10))
			.map((v) => ({
				...v,
				pasien: patients.find((p) => p.id === v.pasien_id)
			}))
	);

	let selectedVisit = $state<(Kunjungan & { pasien?: MasterPasien }) | null>(null);

	// SOAP Form
	let soapForm = $state({
		subjective: '',
		objective: '',
		assessment: '',
		plan: ''
	});

	// Asesmen Keperawatan Form
	let asesmenForm = $state({
		keluhan_utama: '',
		td_sistole: '',
		td_diastole: '',
		nadi: '',
		respirasi: '',
		suhu: '',
		berat_badan: '',
		tinggi_badan: ''
	});

	function selectVisit(visit: Kunjungan & { pasien?: MasterPasien }) {
		selectedVisit = visit;
	}

	function saveSoap() {
		if (!selectedVisit) return;
		alert('SOAP berhasil disimpan!');
		// Reset form
		soapForm = {
			subjective: '',
			objective: '',
			assessment: '',
			plan: ''
		};
	}

	function saveAsesmen() {
		if (!selectedVisit) return;
		alert('Asesmen keperawatan berhasil disimpan!');
	}
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div>
		<h1 class="text-3xl font-bold tracking-tight">EMR Rawat Jalan</h1>
		<p class="text-muted-foreground mt-1">Electronic Medical Record - Poliklinik</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Patient Queue -->
		<div class="lg:col-span-1">
			<Card>
				<CardHeader>
					<h3 class="text-lg font-semibold">Antrian Pasien Hari Ini</h3>
					<CardDescription>{todayVisits.length} pasien menunggu</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-2">
						{#each todayVisits as visit}
							<button
								class="w-full rounded-md border p-3 text-left hover:bg-accent"
								class:bg-accent={selectedVisit?.id === visit.id}
								onclick={() => selectVisit(visit)}
							>
								<div class="mb-1 flex items-center justify-between">
									<span class="font-semibold">No. {visit.no_antrian}</span>
									<span
										class="rounded-full px-2 py-0.5 text-xs font-medium"
										class:bg-yellow-100={visit.status_kunjungan === 'DAFTAR'}
										class:text-yellow-700={visit.status_kunjungan === 'DAFTAR'}
										class:bg-blue-100={visit.status_kunjungan === 'DILAYANI'}
										class:text-blue-700={visit.status_kunjungan === 'DILAYANI'}
									>
										{visit.status_kunjungan}
									</span>
								</div>
								<div class="text-sm font-medium">{visit.pasien?.nama_lengkap || 'Unknown'}</div>
								<div class="text-xs text-muted-foreground">
									{visit.pasien?.no_rm} • {visit.waktu_kunjungan.slice(0, 5)}
								</div>
							</button>
						{:else}
							<p class="py-4 text-center text-sm text-muted-foreground">
								Tidak ada antrian pasien
							</p>
						{/each}
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- EMR Form -->
		<div class="lg:col-span-2">
			{#if selectedVisit}
				<div class="space-y-6">
					<!-- Patient Info -->
					<Card>
						<CardHeader>
							<h3 class="text-lg font-semibold">Informasi Pasien</h3>
						</CardHeader>
						<CardContent>
							<div class="grid gap-4 md:grid-cols-2">
								<div>
									<span class="text-sm text-muted-foreground">No. RM:</span>
									<p class="font-mono font-medium">{selectedVisit.pasien?.no_rm}</p>
								</div>
								<div>
									<span class="text-sm text-muted-foreground">Nama:</span>
									<p class="font-medium">{selectedVisit.pasien?.nama_lengkap}</p>
								</div>
								<div>
									<span class="text-sm text-muted-foreground">NIK:</span>
									<p class="font-mono">{selectedVisit.pasien?.nik}</p>
								</div>
								<div>
									<span class="text-sm text-muted-foreground">Jenis Kelamin:</span>
									<p>{selectedVisit.pasien?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<!-- Vital Signs -->
					<Card>
						<CardHeader>
							<h3 class="text-lg font-semibold">Tanda Vital & Asesmen Keperawatan</h3>
						</CardHeader>
						<CardContent>
							<div class="grid gap-4 md:grid-cols-3">
								<div>
									<Label for="keluhan">Keluhan Utama</Label>
									<Input
										id="keluhan"
										type="text"
										placeholder="Keluhan pasien..."
										bind:value={asesmenForm.keluhan_utama}
									/>
								</div>
								<div>
									<Label for="td">Tekanan Darah (mmHg)</Label>
									<div class="flex gap-2">
										<Input
											id="td-sistole"
											type="number"
											placeholder="Sistole"
											bind:value={asesmenForm.td_sistole}
										/>
										<span class="flex items-center">/</span>
										<Input
											id="td-diastole"
											type="number"
											placeholder="Diastole"
											bind:value={asesmenForm.td_diastole}
										/>
									</div>
								</div>
								<div>
									<Label for="nadi">Nadi (x/menit)</Label>
									<Input id="nadi" type="number" bind:value={asesmenForm.nadi} />
								</div>
								<div>
									<Label for="respirasi">Respirasi (x/menit)</Label>
									<Input id="respirasi" type="number" bind:value={asesmenForm.respirasi} />
								</div>
								<div>
									<Label for="suhu">Suhu (°C)</Label>
									<Input id="suhu" type="number" step="0.1" bind:value={asesmenForm.suhu} />
								</div>
								<div>
									<Label for="bb">Berat Badan (kg)</Label>
									<Input id="bb" type="number" step="0.1" bind:value={asesmenForm.berat_badan} />
								</div>
							</div>
							<div class="mt-4">
								<Button size="sm" onclick={saveAsesmen}>Simpan Asesmen</Button>
							</div>
						</CardContent>
					</Card>

					<!-- SOAP -->
					<Card>
						<CardHeader>
							<h3 class="text-lg font-semibold">SOAP</h3>
							<CardDescription>Subjective, Objective, Assessment, Plan</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-4">
								<div>
									<Label for="subjective">Subjective (Keluhan Pasien)</Label>
									<textarea
										id="subjective"
										bind:value={soapForm.subjective}
										class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
										placeholder="Apa yang dikeluhkan pasien..."
									></textarea>
								</div>
								<div>
									<Label for="objective">Objective (Hasil Pemeriksaan)</Label>
									<textarea
										id="objective"
										bind:value={soapForm.objective}
										class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
										placeholder="Hasil pemeriksaan fisik, lab, dll..."
									></textarea>
								</div>
								<div>
									<Label for="assessment">Assessment (Diagnosis)</Label>
									<textarea
										id="assessment"
										bind:value={soapForm.assessment}
										class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
										placeholder="Diagnosis kerja..."
									></textarea>
								</div>
								<div>
									<Label for="plan">Plan (Rencana Tindakan)</Label>
									<textarea
										id="plan"
										bind:value={soapForm.plan}
										class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
										placeholder="Rencana terapi, tindakan, dll..."
									></textarea>
								</div>
							</div>
						</CardContent>
					</Card>

					<!-- Actions -->
					<Card>
						<CardContent class="pt-6">
							<div class="flex gap-3">
								<Button onclick={saveSoap}>💾 Simpan SOAP</Button>
								<Button variant="outline">📋 Order Lab</Button>
								<Button variant="outline">🔬 Order Radiologi</Button>
								<Button variant="outline">💊 Tulis Resep</Button>
								<Button variant="outline">✅ Selesai Pelayanan</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			{:else}
				<Card>
					<CardContent class="py-12">
						<div class="text-center text-muted-foreground">
							<p class="text-lg">Pilih pasien dari antrian untuk memulai pelayanan</p>
						</div>
					</CardContent>
				</Card>
			{/if}
		</div>
	</div>
</div>
