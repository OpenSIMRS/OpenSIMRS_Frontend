<script lang="ts">
import Card from '$lib/components/ui/card.svelte';
import Button from '$lib/components/ui/button.svelte';
import type { FormulaJasa, DistribusiFormula, KategoriTindakan } from '$lib/types/jasa';
import jasaDummyData from '$lib/data/jasa-dummy.json';

const formulaList: FormulaJasa[] = jasaDummyData.formula_jasa as FormulaJasa[];
const kategoriList: KategoriTindakan[] = jasaDummyData.kategori_tindakan as KategoriTindakan[];
const distribusiList: DistribusiFormula[] = jasaDummyData.distribusi_formula as DistribusiFormula[];

let selectedFormula: FormulaJasa | null = null;
let showModal = false;
let isEdit = false;

// Form state
let formData = {
kode: '',
nama: '',
kategori_tindakan_id: '',
komponen_jasa_medis: 0,
komponen_jasa_sarana: 0,
komponen_jasa_rs: 0,
tanggal_berlaku: '',
tanggal_berakhir: ''
};

function openCreateModal() {
isEdit = false;
formData = {
kode: '',
nama: '',
kategori_tindakan_id: '',
komponen_jasa_medis: 0,
komponen_jasa_sarana: 0,
komponen_jasa_rs: 0,
tanggal_berlaku: new Date().toISOString().split('T')[0],
tanggal_berakhir: ''
};
showModal = true;
}

function openEditModal(formula: FormulaJasa) {
isEdit = true;
formData = {
kode: formula.kode,
nama: formula.nama,
kategori_tindakan_id: formula.kategori_tindakan_id,
komponen_jasa_medis: formula.komponen_jasa_medis,
komponen_jasa_sarana: formula.komponen_jasa_sarana,
komponen_jasa_rs: formula.komponen_jasa_rs,
tanggal_berlaku: formula.tanggal_berlaku,
tanggal_berakhir: formula.tanggal_berakhir || ''
};
selectedFormula = formula;
showModal = true;
}

function closeModal() {
showModal = false;
selectedFormula = null;
}

function handleSubmit() {
console.log('Form submitted:', formData);
// Here you would call the API
alert('Formula jasa berhasil disimpan (dummy)');
closeModal();
}

function viewDistribusi(formula: FormulaJasa) {
const dist = distribusiList.filter(d => d.formula_id === formula.id);
console.log('Distribusi for formula:', formula.nama, dist);
// Navigate to distribusi page or show modal
}

function getTotalKomponen(): number {
return formData.komponen_jasa_medis + formData.komponen_jasa_sarana + formData.komponen_jasa_rs;
}

function getKategoriNama(id: string): string {
return kategoriList.find(k => k.id === id)?.nama || '-';
}
</script>

<svelte:head>
<title>Setting Formula Jasa - OpenSIMRS</title>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
<div class="flex items-center justify-between">
<div>
<h1 class="text-3xl font-bold">Setting Formula Jasa</h1>
<p class="text-slate-600 mt-1">Kelola formula perhitungan jasa pelayanan</p>
</div>
<Button on:click={openCreateModal}>Tambah Formula</Button>
</div>

<Card class="p-6">
<div class="overflow-x-auto">
<table class="w-full">
<thead class="bg-slate-50 border-b">
<tr>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Kode</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Nama Formula</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Kategori</th>
<th class="px-4 py-3 text-center text-sm font-medium text-slate-600">Jasa Medis</th>
<th class="px-4 py-3 text-center text-sm font-medium text-slate-600">Jasa Sarana</th>
<th class="px-4 py-3 text-center text-sm font-medium text-slate-600">Jasa RS</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Berlaku</th>
<th class="px-4 py-3 text-center text-sm font-medium text-slate-600">Status</th>
<th class="px-4 py-3 text-center text-sm font-medium text-slate-600">Aksi</th>
</tr>
</thead>
<tbody>
{#each formulaList as formula}
<tr class="border-b hover:bg-slate-50">
<td class="px-4 py-3 text-sm font-mono">{formula.kode}</td>
<td class="px-4 py-3 text-sm font-medium">{formula.nama}</td>
<td class="px-4 py-3 text-sm">{getKategoriNama(formula.kategori_tindakan_id)}</td>
<td class="px-4 py-3 text-sm text-center">{formula.komponen_jasa_medis}%</td>
<td class="px-4 py-3 text-sm text-center">{formula.komponen_jasa_sarana}%</td>
<td class="px-4 py-3 text-sm text-center">{formula.komponen_jasa_rs}%</td>
<td class="px-4 py-3 text-sm">{formula.tanggal_berlaku}</td>
<td class="px-4 py-3 text-center">
{#if formula.is_active}
<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Aktif</span>
{:else}
<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Nonaktif</span>
{/if}
</td>
<td class="px-4 py-3 text-center">
<div class="flex gap-2 justify-center">
<button
on:click={() => viewDistribusi(formula)}
class="text-blue-600 hover:text-blue-800 text-sm"
>
Distribusi
</button>
<button
on:click={() => openEditModal(formula)}
class="text-slate-600 hover:text-slate-800 text-sm"
>
Edit
</button>
</div>
</td>
</tr>
{/each}
</tbody>
</table>
</div>
</Card>
</div>

<!-- Modal Form -->
{#if showModal}
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
<div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
<div class="p-6 border-b">
<h2 class="text-xl font-bold">{isEdit ? 'Edit' : 'Tambah'} Formula Jasa</h2>
</div>
<form on:submit|preventDefault={handleSubmit} class="p-6 space-y-4">
<div class="grid grid-cols-2 gap-4">
<div>
<label for="kode" class="block text-sm font-medium mb-1">Kode Formula*</label>
<input
type="text"
id="kode"
bind:value={formData.kode}
required
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
placeholder="FORM-BDH-01"
/>
</div>
<div>
<label for="kategori" class="block text-sm font-medium mb-1">Kategori Tindakan*</label>
<select
id="kategori"
bind:value={formData.kategori_tindakan_id}
required
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>
<option value="">Pilih Kategori</option>
{#each kategoriList as kategori}
<option value={kategori.id}>{kategori.nama}</option>
{/each}
</select>
</div>
</div>

<div>
<label for="nama" class="block text-sm font-medium mb-1">Nama Formula*</label>
<input
type="text"
id="nama"
bind:value={formData.nama}
required
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
placeholder="Formula Jasa Bedah Umum"
/>
</div>

<div class="border-t pt-4">
<h3 class="font-medium mb-3">Komponen Tarif</h3>
<div class="grid grid-cols-3 gap-4">
<div>
<label for="jasa_medis" class="block text-sm font-medium mb-1">Jasa Medis (%)*</label>
<input
type="number"
id="jasa_medis"
bind:value={formData.komponen_jasa_medis}
min="0"
max="100"
step="0.01"
required
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>
<div>
<label for="jasa_sarana" class="block text-sm font-medium mb-1">Jasa Sarana (%)*</label>
<input
type="number"
id="jasa_sarana"
bind:value={formData.komponen_jasa_sarana}
min="0"
max="100"
step="0.01"
required
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>
<div>
<label for="jasa_rs" class="block text-sm font-medium mb-1">Jasa RS (%)*</label>
<input
type="number"
id="jasa_rs"
bind:value={formData.komponen_jasa_rs}
min="0"
max="100"
step="0.01"
required
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>
</div>
<p class="text-sm mt-2" class:text-red-600={getTotalKomponen() !== 100} class:text-green-600={getTotalKomponen() === 100}>
Total: {getTotalKomponen()}% {getTotalKomponen() === 100 ? '✓' : '(harus 100%)'}
</p>
</div>

<div class="grid grid-cols-2 gap-4">
<div>
<label for="tanggal_berlaku" class="block text-sm font-medium mb-1">Tanggal Berlaku*</label>
<input
type="date"
id="tanggal_berlaku"
bind:value={formData.tanggal_berlaku}
required
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>
<div>
<label for="tanggal_berakhir" class="block text-sm font-medium mb-1">Tanggal Berakhir</label>
<input
type="date"
id="tanggal_berakhir"
bind:value={formData.tanggal_berakhir}
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>
</div>

<div class="flex gap-2 justify-end pt-4 border-t">
<Button type="button" variant="outline" on:click={closeModal}>Batal</Button>
<Button type="submit" disabled={getTotalKomponen() !== 100}>Simpan</Button>
</div>
</form>
</div>
</div>
{/if}
