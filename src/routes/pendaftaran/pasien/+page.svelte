<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import CardDescription from '$lib/components/ui/card-description.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import type { MasterPasien } from '$lib/types';
	import pasienData from '$lib/data/master-pasien.json';

	let searchQuery = $state('');
	let patients = $state<any[]>(pasienData);
	let filteredPatients = $derived(
		searchQuery
			? patients.filter(
					(p) =>
						p.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
						p.no_rm.toLowerCase().includes(searchQuery.toLowerCase()) ||
						p.nik.includes(searchQuery)
			  )
			: patients
	);

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
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
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Master Pasien</h1>
			<p class="text-muted-foreground mt-1">Daftar seluruh data pasien terdaftar</p>
		</div>
		<Button onclick={() => (window.location.href = '/pendaftaran/pasien/tambah')}>
			➕ Tambah Pasien Baru
		</Button>
	</div>

	<!-- Search and Filter -->
	<Card>
		<CardHeader>
			<h3 class="text-lg font-semibold">Pencarian Pasien</h3>
			<CardDescription>Cari berdasarkan nama, No. RM, atau NIK</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="flex gap-4">
				<div class="flex-1">
					<Label for="search">Pencarian</Label>
					<Input
						id="search"
						type="text"
						placeholder="Masukkan nama, No. RM, atau NIK..."
						bind:value={searchQuery}
					/>
				</div>
				<div class="flex items-end">
					<Button variant="outline" onclick={() => (searchQuery = '')}>Reset</Button>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Results -->
	<Card>
		<CardHeader>
			<h3 class="text-lg font-semibold">Hasil Pencarian</h3>
			<CardDescription>Ditemukan {filteredPatients.length} pasien</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b">
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground">No. RM</th>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground">NIK</th>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground">Nama Lengkap</th>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground"
								>Tanggal Lahir</th
							>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground">Umur</th>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground"
								>Jenis Kelamin</th
							>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground">No. HP</th>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredPatients as patient}
							<tr class="border-b hover:bg-accent">
								<td class="py-3 text-sm font-mono">{patient.no_rm}</td>
								<td class="py-3 text-sm font-mono">{patient.nik}</td>
								<td class="py-3 text-sm font-medium">{patient.nama_lengkap}</td>
								<td class="py-3 text-sm">{formatDate(patient.tanggal_lahir)}</td>
								<td class="py-3 text-sm">{calculateAge(patient.tanggal_lahir)} tahun</td>
								<td class="py-3 text-sm">
									<span
										class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
										class:bg-blue-100={patient.jenis_kelamin === 'L'}
										class:text-blue-700={patient.jenis_kelamin === 'L'}
										class:bg-pink-100={patient.jenis_kelamin === 'P'}
										class:text-pink-700={patient.jenis_kelamin === 'P'}
									>
										{patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
									</span>
								</td>
								<td class="py-3 text-sm">{patient.no_hp}</td>
								<td class="py-3">
									<div class="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											onclick={() =>
												(window.location.href = `/pendaftaran/pasien/${patient.id}`)}
										>
											👁️ Lihat
										</Button>
										<Button
											size="sm"
											variant="outline"
											onclick={() =>
												(window.location.href = `/pendaftaran/kunjungan?pasien=${patient.id}`)}
										>
											📋 Daftar
										</Button>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="8" class="py-8 text-center text-muted-foreground">
									Tidak ada data pasien yang ditemukan
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</CardContent>
	</Card>
</div>
