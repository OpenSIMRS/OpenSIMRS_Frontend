<script lang="ts">
import { goto } from '$app/navigation';
import { onMount } from 'svelte';
import { masterDataService } from '$lib/data/api-service';
import type { Dokter, Poli } from '$lib/types';

let dokterList = $state<Dokter[]>([]);
let poliList = $state<Poli[]>([]);
let filteredList = $state<Dokter[]>([]);
let searchQuery = $state('');
let isLoading = $state(false);
let showForm = $state(false);
let editingId = $state<string | null>(null);

let formData = $state<Omit<Dokter, 'id' | 'created_at' | 'updated_at'>>({
nip: '',
nama_lengkap: '',
gelar_depan: '',
gelar_belakang: '',
spesialisasi: '',
no_sip: '',
poli_id: '',
is_active: true
});

onMount(() => {
loadData();
});

async function loadData() {
isLoading = true;
try {
[dokterList, poliList] = await Promise.all([
masterDataService.getDokter(),
masterDataService.getPoli()
]);
filterData();
} finally {
isLoading = false;
}
}

function filterData() {
if (!searchQuery.trim()) {
filteredList = [...dokterList];
} else {
const query = searchQuery.toLowerCase();
filteredList = dokterList.filter(d =>
d.nip.toLowerCase().includes(query) ||
d.nama_lengkap.toLowerCase().includes(query) ||
d.spesialisasi?.toLowerCase().includes(query) ||
d.no_sip?.toLowerCase().includes(query)
);
}
}

$effect(() => {
searchQuery;
filterData();
});

function handleAdd() {
editingId = null;
formData = {
nip: '',
nama_lengkap: '',
gelar_depan: '',
gelar_belakang: '',
spesialisasi: '',
no_sip: '',
poli_id: '',
is_active: true
};
showForm = true;
}

function handleEdit(dokter: Dokter) {
editingId = dokter.id;
formData = {
nip: dokter.nip,
nama_lengkap: dokter.nama_lengkap,
gelar_depan: dokter.gelar_depan || '',
gelar_belakang: dokter.gelar_belakang || '',
spesialisasi: dokter.spesialisasi || '',
no_sip: dokter.no_sip || '',
poli_id: dokter.poli_id || '',
is_active: dokter.is_active
};
showForm = true;
}

async function handleSubmit(e: Event) {
e.preventDefault();
try {
if (editingId) {
await masterDataService.updateDokter(editingId, formData);
alert('Dokter berhasil diupdate!');
} else {
await masterDataService.createDokter(formData);
alert('Dokter berhasil ditambahkan!');
}
showForm = false;
await loadData();
} catch (error) {
alert('Gagal menyimpan data. Silakan coba lagi.');
}
}

async function handleDelete(dokter: Dokter) {
if (confirm(`Apakah Anda yakin ingin menghapus dokter "${dokter.nama_lengkap}"?`)) {
try {
await masterDataService.deleteDokter(dokter.id);
alert('Dokter berhasil dihapus!');
await loadData();
} catch (error) {
alert('Gagal menghapus data. Silakan coba lagi.');
}
}
}

async function toggleActive(dokter: Dokter) {
try {
await masterDataService.updateDokter(dokter.id, { is_active: !dokter.is_active });
await loadData();
} catch (error) {
alert('Gagal mengubah status. Silakan coba lagi.');
}
}

function getPoliName(poliId?: string): string {
if (!poliId) return '-';
const poli = poliList.find(p => p.id === poliId);
return poli?.nama || '-';
}
</script>

<div class="min-h-screen bg-gray-50">
<div class="max-w-7xl mx-auto p-6">
<div class="flex justify-between items-center mb-6">
<div>
<h1 class="text-3xl font-bold text-gray-900 mb-2">Master Dokter</h1>
<p class="text-gray-600">Kelola data dokter dan tenaga medis</p>
</div>
<button
onclick={() => goto('/master')}
class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
>← Kembali</button>
</div>

<div class="bg-white rounded-lg shadow-md p-4 mb-6">
<div class="flex gap-4 items-center">
<div class="flex-1">
<input
type="text"
bind:value={searchQuery}
placeholder="Cari NIP, nama, spesialisasi, atau No. SIP..."
class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
/>
</div>
<button onclick={handleAdd} class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">+ Tambah Dokter</button>
</div>
</div>

{#if isLoading}
<div class="bg-white rounded-lg shadow-md p-12 text-center">
<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
<p class="mt-4 text-gray-600">Memuat data...</p>
</div>
{:else}
<div class="bg-white rounded-lg shadow-md overflow-hidden">
<table class="min-w-full divide-y divide-gray-200">
<thead class="bg-gray-50">
<tr>
<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP</th>
<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Lengkap</th>
<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spesialisasi</th>
<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poli</th>
<th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
<th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
</tr>
</thead>
<tbody class="bg-white divide-y divide-gray-200">
{#each filteredList as dokter}
<tr class="hover:bg-gray-50">
<td class="px-6 py-4 text-sm">{dokter.nip}</td>
<td class="px-6 py-4 text-sm font-medium">
{dokter.gelar_depan ? dokter.gelar_depan + ' ' : ''}{dokter.nama_lengkap}{dokter.gelar_belakang ? ', ' + dokter.gelar_belakang : ''}
</td>
<td class="px-6 py-4 text-sm">{dokter.spesialisasi || '-'}</td>
<td class="px-6 py-4 text-sm">{getPoliName(dokter.poli_id)}</td>
<td class="px-6 py-4 text-center">
<button onclick={() => toggleActive(dokter)} class="px-3 py-1 text-xs rounded-full {dokter.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
{dokter.is_active ? 'Aktif' : 'Nonaktif'}
</button>
</td>
<td class="px-6 py-4">
<div class="flex gap-2 justify-center">
<button onclick={() => handleEdit(dokter)} class="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white rounded">Edit</button>
<button onclick={() => handleDelete(dokter)} class="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded">Hapus</button>
</div>
</td>
</tr>
{/each}
</tbody>
</table>
{#if filteredList.length === 0}
<div class="text-center py-8 text-gray-500">Tidak ada data dokter{searchQuery ? ' yang sesuai dengan pencarian' : ''}</div>
{/if}
</div>
{/if}
</div>
</div>

{#if showForm}
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
<div class="px-6 py-4 border-b">
<h2 class="text-xl font-semibold">{editingId ? 'Edit Dokter' : 'Tambah Dokter'}</h2>
</div>
<form onsubmit={handleSubmit} class="p-6">
<div class="grid grid-cols-2 gap-4 mb-4">
<div class="col-span-2">
<label class="block text-sm font-medium mb-1">NIP <span class="text-red-500">*</span></label>
<input type="text" bind:value={formData.nip} required class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="198501012010011001" />
</div>
<div>
<label class="block text-sm font-medium mb-1">Gelar Depan</label>
<input type="text" bind:value={formData.gelar_depan} class="w-full px-4 py-2 border rounded-md" placeholder="dr., drg." />
</div>
<div>
<label class="block text-sm font-medium mb-1">Gelar Belakang</label>
<input type="text" bind:value={formData.gelar_belakang} class="w-full px-4 py-2 border rounded-md" placeholder="Sp.PD" />
</div>
<div class="col-span-2">
<label class="block text-sm font-medium mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
<input type="text" bind:value={formData.nama_lengkap} required class="w-full px-4 py-2 border rounded-md" />
</div>
<div>
<label class="block text-sm font-medium mb-1">Spesialisasi</label>
<input type="text" bind:value={formData.spesialisasi} class="w-full px-4 py-2 border rounded-md" />
</div>
<div>
<label class="block text-sm font-medium mb-1">No. SIP</label>
<input type="text" bind:value={formData.no_sip} class="w-full px-4 py-2 border rounded-md" />
</div>
<div class="col-span-2">
<label class="block text-sm font-medium mb-1">Poli</label>
<select bind:value={formData.poli_id} class="w-full px-4 py-2 border rounded-md">
<option value="">- Pilih Poli -</option>
{#each poliList as poli}
<option value={poli.id}>{poli.nama}</option>
{/each}
</select>
</div>
<div class="col-span-2">
<label class="flex items-center">
<input type="checkbox" bind:checked={formData.is_active} class="rounded" />
<span class="ml-2 text-sm">Aktif</span>
</label>
</div>
</div>
<div class="flex gap-4 justify-end pt-4 border-t">
<button type="button" onclick={() => showForm = false} class="px-6 py-2 border rounded-md hover:bg-gray-50">Batal</button>
<button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Simpan</button>
</div>
</form>
</div>
</div>
{/if}

<style lang="postcss">
@reference "tailwindcss";
</style>
