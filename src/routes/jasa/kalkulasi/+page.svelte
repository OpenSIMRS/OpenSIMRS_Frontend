<script lang="ts">
import Card from '$lib/components/ui/card.svelte';
import Button from '$lib/components/ui/button.svelte';
import type { PreviewKalkulasi, AkumulasiJasa, Pegawai } from '$lib/types/jasa';
import jasaDummyData from '$lib/data/jasa-dummy.json';

const akumulasiList: AkumulasiJasa[] = jasaDummyData.akumulasi_jasa as AkumulasiJasa[];
const pegawaiList: Pegawai[] = jasaDummyData.pegawai as Pegawai[];

let periode_tahun = 2025;
let periode_bulan = 1;
let unit_id = '';
let pegawai_id = '';
let preview: PreviewKalkulasi[] = [];
let isCalculating = false;

const bulanNames = [
'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function formatCurrency(amount: number): string {
return new Intl.NumberFormat('id-ID', {
style: 'currency',
currency: 'IDR',
minimumFractionDigits: 0
}).format(amount);
}

function hitungJasa() {
isCalculating = true;

// Simulate API call
setTimeout(() => {
// Convert akumulasi to preview format
preview = akumulasiList
.filter(a => a.periode_tahun === periode_tahun && a.periode_bulan === periode_bulan)
.map(a => {
const pegawai = pegawaiList.find(p => p.id === a.pegawai_id);
return {
nip: pegawai?.nip || '',
nama: pegawai?.nama || '',
unit: pegawai?.unit_nama || '',
jasa_medis: a.total_jasa_medis,
jasa_keperawatan: a.total_jasa_keperawatan,
jasa_lainnya: a.total_jasa_lainnya,
total: a.grand_total
};
});

isCalculating = false;
}, 1000);
}

function saveDraft() {
alert('Data berhasil disimpan sebagai draft');
}

function submitApproval() {
if (confirm('Kirim untuk approval?')) {
alert('Data berhasil dikirim untuk approval');
}
}

function exportExcel() {
alert('Export Excel (dummy)');
}

function getTotalJasa(): number {
return preview.reduce((sum, item) => sum + item.total, 0);
}
</script>

<svelte:head>
<title>Kalkulasi Jasa Periode - OpenSIMRS</title>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
<div>
<h1 class="text-3xl font-bold">Kalkulasi Jasa Periode</h1>
<p class="text-slate-600 mt-1">Hitung dan proses jasa pelayanan per periode</p>
</div>

<!-- Filter Form -->
<Card class="p-6">
<h2 class="text-lg font-bold mb-4">Filter Periode</h2>
<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
<div>
<label for="tahun" class="block text-sm font-medium mb-1">Tahun*</label>
<select
id="tahun"
bind:value={periode_tahun}
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>
<option value={2024}>2024</option>
<option value={2025}>2025</option>
<option value={2026}>2026</option>
</select>
</div>
<div>
<label for="bulan" class="block text-sm font-medium mb-1">Bulan*</label>
<select
id="bulan"
bind:value={periode_bulan}
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>
{#each bulanNames as nama, i}
<option value={i + 1}>{nama}</option>
{/each}
</select>
</div>
<div>
<label for="unit" class="block text-sm font-medium mb-1">Unit (opsional)</label>
<select
id="unit"
bind:value={unit_id}
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>
<option value="">Semua Unit</option>
<option value="unit-001">Instalasi Bedah Sentral</option>
<option value="unit-002">Poli Penyakit Dalam</option>
<option value="unit-003">Ruang Rawat Inap</option>
</select>
</div>
<div class="flex items-end">
<Button on:click={hitungJasa} disabled={isCalculating} class="w-full">
{isCalculating ? 'Menghitung...' : 'Hitung Jasa'}
</Button>
</div>
</div>
</Card>

{#if preview.length > 0}
<!-- Summary -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Total Pegawai</h3>
<p class="text-2xl font-bold">{preview.length}</p>
</Card>
<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Total Jasa</h3>
<p class="text-2xl font-bold">{formatCurrency(getTotalJasa())}</p>
</Card>
<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Rata-rata per Pegawai</h3>
<p class="text-2xl font-bold">{formatCurrency(getTotalJasa() / preview.length)}</p>
</Card>
</div>

<!-- Preview Result -->
<Card class="p-6">
<div class="flex justify-between items-center mb-4">
<h2 class="text-lg font-bold">Preview Hasil Kalkulasi</h2>
<div class="flex gap-2">
<Button variant="outline" on:click={exportExcel}>Export Excel</Button>
<Button variant="outline" on:click={saveDraft}>Simpan Draft</Button>
<Button on:click={submitApproval}>Submit Approval</Button>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full">
<thead class="bg-slate-50 border-b">
<tr>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">No</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">NIP</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Nama</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Unit</th>
<th class="px-4 py-3 text-right text-sm font-medium text-slate-600">Jasa Medis</th>
<th class="px-4 py-3 text-right text-sm font-medium text-slate-600">Jasa Keperawatan</th>
<th class="px-4 py-3 text-right text-sm font-medium text-slate-600">Total</th>
</tr>
</thead>
<tbody>
{#each preview as item, i}
<tr class="border-b hover:bg-slate-50">
<td class="px-4 py-3 text-sm">{i + 1}</td>
<td class="px-4 py-3 text-sm font-mono">{item.nip}</td>
<td class="px-4 py-3 text-sm font-medium">{item.nama}</td>
<td class="px-4 py-3 text-sm">{item.unit}</td>
<td class="px-4 py-3 text-sm text-right">{formatCurrency(item.jasa_medis)}</td>
<td class="px-4 py-3 text-sm text-right">{formatCurrency(item.jasa_keperawatan)}</td>
<td class="px-4 py-3 text-sm text-right font-bold">{formatCurrency(item.total)}</td>
</tr>
{/each}
</tbody>
<tfoot class="bg-slate-50 border-t-2">
<tr>
<td colspan="6" class="px-4 py-3 text-sm font-bold text-right">TOTAL</td>
<td class="px-4 py-3 text-sm text-right font-bold">{formatCurrency(getTotalJasa())}</td>
</tr>
</tfoot>
</table>
</div>
</Card>
{/if}
</div>
