<script lang="ts">
import Card from '$lib/components/ui/card.svelte';
import Button from '$lib/components/ui/button.svelte';
import type { AkumulasiJasa, Pegawai } from '$lib/types/jasa';
import jasaDummyData from '$lib/data/jasa-dummy.json';

const akumulasiList: AkumulasiJasa[] = jasaDummyData.akumulasi_jasa as AkumulasiJasa[];
const pegawaiList: Pegawai[] = jasaDummyData.pegawai as Pegawai[];

let selectedTahun = 2025;
let selectedBulan = 1;
let selectedUnit = '';
let reportData: any[] = [];
let summary = {
total_jasa: 0,
rata_rata: 0,
top_performer: ''
};

const bulanNames = [
'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const unitOptions = [
{ id: '', nama: 'Semua Unit' },
{ id: 'unit-001', nama: 'Instalasi Bedah Sentral' },
{ id: 'unit-002', nama: 'Poli Penyakit Dalam' },
{ id: 'unit-003', nama: 'Ruang Rawat Inap' }
];

function formatCurrency(amount: number): string {
return new Intl.NumberFormat('id-ID', {
style: 'currency',
currency: 'IDR',
minimumFractionDigits: 0
}).format(amount);
}

function generateReport() {
// Filter akumulasi by period
const filteredAkumulasi = akumulasiList.filter(
a => a.periode_tahun === selectedTahun && a.periode_bulan === selectedBulan
);

// Generate report data
reportData = filteredAkumulasi.map(a => {
const pegawai = pegawaiList.find(p => p.id === a.pegawai_id);
if (!selectedUnit || pegawai?.unit_id === selectedUnit) {
return {
nama: pegawai?.nama || '',
jabatan: pegawai?.jabatan || '',
unit: pegawai?.unit_nama || '',
jumlah_tindakan: 10, // dummy
total_jasa: a.grand_total
};
}
return null;
}).filter(Boolean);

// Calculate summary
summary.total_jasa = reportData.reduce((sum: number, item: any) => sum + item.total_jasa, 0);
summary.rata_rata = reportData.length > 0 ? summary.total_jasa / reportData.length : 0;

const topPerformer = reportData.reduce((max: any, item: any) => 
item.total_jasa > (max?.total_jasa || 0) ? item : max, 
null
);
summary.top_performer = topPerformer?.nama || '-';
}

function exportExcel() {
alert('Export Excel (dummy)');
}

function exportPDF() {
alert('Export PDF (dummy)');
}
</script>

<svelte:head>
<title>Laporan Jasa per Unit - OpenSIMRS</title>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
<div>
<h1 class="text-3xl font-bold">Laporan Jasa per Unit</h1>
<p class="text-slate-600 mt-1">Lihat laporan distribusi jasa pelayanan per unit</p>
</div>

<!-- Filter -->
<Card class="p-6">
<h2 class="text-lg font-bold mb-4">Filter Laporan</h2>
<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
<div>
<label for="tahun" class="block text-sm font-medium mb-1">Tahun*</label>
<select
id="tahun"
bind:value={selectedTahun}
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
bind:value={selectedBulan}
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>
{#each bulanNames as nama, i}
<option value={i + 1}>{nama}</option>
{/each}
</select>
</div>
<div>
<label for="unit" class="block text-sm font-medium mb-1">Unit*</label>
<select
id="unit"
bind:value={selectedUnit}
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>
{#each unitOptions as unit}
<option value={unit.id}>{unit.nama}</option>
{/each}
</select>
</div>
<div class="flex items-end">
<Button on:click={generateReport} class="w-full">Generate Laporan</Button>
</div>
</div>
</Card>

{#if reportData.length > 0}
<!-- Summary Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Total Jasa Unit</h3>
<p class="text-2xl font-bold">{formatCurrency(summary.total_jasa)}</p>
</Card>
<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Rata-rata per Pegawai</h3>
<p class="text-2xl font-bold">{formatCurrency(summary.rata_rata)}</p>
</Card>
<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Top Performer</h3>
<p class="text-lg font-bold">{summary.top_performer}</p>
</Card>
</div>

<!-- Report Table -->
<Card class="p-6">
<div class="flex justify-between items-center mb-4">
<h2 class="text-lg font-bold">
Rincian Laporan - {bulanNames[selectedBulan - 1]} {selectedTahun}
</h2>
<div class="flex gap-2">
<Button variant="outline" on:click={exportExcel}>Export Excel</Button>
<Button variant="outline" on:click={exportPDF}>Export PDF</Button>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full">
<thead class="bg-slate-50 border-b">
<tr>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">No</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Nama</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Jabatan</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Unit</th>
<th class="px-4 py-3 text-center text-sm font-medium text-slate-600">Jumlah Tindakan</th>
<th class="px-4 py-3 text-right text-sm font-medium text-slate-600">Total Jasa</th>
</tr>
</thead>
<tbody>
{#each reportData as item, i}
<tr class="border-b hover:bg-slate-50">
<td class="px-4 py-3 text-sm">{i + 1}</td>
<td class="px-4 py-3 text-sm font-medium">{item.nama}</td>
<td class="px-4 py-3 text-sm">{item.jabatan}</td>
<td class="px-4 py-3 text-sm">{item.unit}</td>
<td class="px-4 py-3 text-sm text-center">{item.jumlah_tindakan}</td>
<td class="px-4 py-3 text-sm text-right font-bold">{formatCurrency(item.total_jasa)}</td>
</tr>
{/each}
</tbody>
<tfoot class="bg-slate-50 border-t-2">
<tr>
<td colspan="4" class="px-4 py-3 text-sm font-bold text-right">TOTAL</td>
<td class="px-4 py-3 text-sm font-bold text-center">
{reportData.reduce((sum, item) => sum + item.jumlah_tindakan, 0)}
</td>
<td class="px-4 py-3 text-sm font-bold text-right">
{formatCurrency(summary.total_jasa)}
</td>
</tr>
</tfoot>
</table>
</div>
</Card>

<!-- Visualization -->
<Card class="p-6">
<h2 class="text-lg font-bold mb-4">Distribusi Jasa per Pegawai</h2>
<div class="space-y-3">
{#each reportData.slice(0, 10) as item}
<div>
<div class="flex justify-between items-center mb-1">
<span class="text-sm font-medium">{item.nama}</span>
<span class="text-sm font-bold">{formatCurrency(item.total_jasa)}</span>
</div>
<div class="w-full bg-slate-200 rounded-full h-2">
<div
class="bg-blue-600 h-2 rounded-full"
style="width: {(item.total_jasa / summary.total_jasa) * 100}%"
></div>
</div>
</div>
{/each}
</div>
</Card>
{/if}
</div>
