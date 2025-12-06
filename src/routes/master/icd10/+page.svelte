<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import CardDescription from '$lib/components/ui/card-description.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import type { MasterICD10 } from '$lib/types';
	import icd10Data from '$lib/data/icd10.json';

	let searchQuery = $state('');
	let icd10List = $state<MasterICD10[]>(icd10Data as MasterICD10[]);
	
	let filteredICD10 = $derived(
		searchQuery
			? icd10List.filter(
					(icd) =>
						icd.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
						icd.nama_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
						icd.nama_en.toLowerCase().includes(searchQuery.toLowerCase())
			  )
			: icd10List
	);
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Master ICD-10</h1>
			<p class="text-muted-foreground mt-1">
				International Classification of Diseases - Kode Diagnosis Penyakit
			</p>
		</div>
		<Button>➕ Tambah ICD-10</Button>
	</div>

	<!-- Search -->
	<Card>
		<CardHeader>
			<h3 class="text-lg font-semibold">Pencarian ICD-10</h3>
			<CardDescription>Cari berdasarkan kode atau nama penyakit</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="flex gap-4">
				<div class="flex-1">
					<Label for="search">Pencarian</Label>
					<Input
						id="search"
						type="text"
						placeholder="Masukkan kode atau nama penyakit..."
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
			<h3 class="text-lg font-semibold">Daftar ICD-10</h3>
			<CardDescription>Ditemukan {filteredICD10.length} kode diagnosa</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b">
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground">Kode</th>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground"
								>Nama (Indonesia)</th
							>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground"
								>Nama (English)</th
							>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground">Kategori</th>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
							<th class="pb-3 text-left text-sm font-medium text-muted-foreground">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredICD10 as icd}
							<tr class="border-b hover:bg-accent">
								<td class="py-3 text-sm font-mono font-semibold">{icd.kode}</td>
								<td class="py-3 text-sm">{icd.nama_id}</td>
								<td class="py-3 text-sm text-muted-foreground">{icd.nama_en}</td>
								<td class="py-3 text-sm">
									{#if icd.kategori}
										<span
											class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
										>
											{icd.kategori}
										</span>
									{:else}
										<span class="text-muted-foreground">-</span>
									{/if}
								</td>
								<td class="py-3 text-sm">
									{#if icd.is_active}
										<span
											class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
										>
											Aktif
										</span>
									{:else}
										<span
											class="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
										>
											Nonaktif
										</span>
									{/if}
								</td>
								<td class="py-3">
									<div class="flex gap-2">
										<Button size="sm" variant="outline">👁️ Lihat</Button>
										<Button size="sm" variant="outline">✏️ Edit</Button>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="6" class="py-8 text-center text-muted-foreground">
									Tidak ada data ICD-10 yang ditemukan
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</CardContent>
	</Card>
</div>
