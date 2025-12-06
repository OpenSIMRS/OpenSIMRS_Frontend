<script lang="ts">
import Card from '$lib/components/ui/card.svelte';
import Button from '$lib/components/ui/button.svelte';
import type { SlipJasa, Pegawai } from '$lib/types/jasa';
import jasaDummyData from '$lib/data/jasa-dummy.json';

const pegawaiList: Pegawai[] = jasaDummyData.pegawai as Pegawai[];

let selectedPegawai = '';
let selectedTahun = 2025;
let selectedBulan = 1;
let slipData: SlipJasa | null = null;

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

function formatDate(dateStr: string): string {
return new Date(dateStr).toLocaleDateString('id-ID', {
day: '2-digit',
month: '2-digit',
year: 'numeric'
});
}

function viewSlip() {
if (!selectedPegawai) {
alert('Pilih pegawai terlebih dahulu');
return;
}

const pegawai = pegawaiList.find(p => p.id === selectedPegawai);
if (!pegawai) return;

// Dummy slip data
slipData = {
pegawai: {
nip: pegawai.nip,
nama: pegawai.nama,
unit: pegawai.unit_nama
},
periode: {
tahun: selectedTahun,
bulan: selectedBulan,
bulan_nama: bulanNames[selectedBulan - 1]
},
rincian: [
{
tanggal: '2025-01-05',
tindakan: 'Operasi Appendektomi',
pasien: 'Budi Santoso',
rm: 'RM-001',
nilai: 2500000
},
{
tanggal: '2025-01-10',
tindakan: 'Operasi Hernia',
pasien: 'Ani Wijaya',
rm: 'RM-002',
nilai: 3000000
},
{
tanggal: '2025-01-15',
tindakan: 'Konsultasi Bedah',
pasien: 'Citra Dewi',
rm: 'RM-003',
nilai: 500000
}
],
total_bruto: 15000000,
potongan_pajak: 750000,
potongan_lainnya: 0,
total_netto: 14250000
};
}

function downloadPDF() {
alert('Download PDF (dummy)');
}

function printSlip() {
window.print();
}
</script>

<svelte:head>
<title>Slip Jasa Individual - OpenSIMRS</title>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
<div>
<h1 class="text-3xl font-bold">Slip Jasa Individual</h1>
<p class="text-slate-600 mt-1">Lihat rincian jasa pelayanan individual</p>
</div>

<!-- Filter Form -->
<Card class="p-6 print:hidden">
<h2 class="text-lg font-bold mb-4">Pilih Pegawai dan Periode</h2>
<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
<div class="md:col-span-2">
<label for="pegawai" class="block text-sm font-medium mb-1">Pegawai*</label>
<select
id="pegawai"
bind:value={selectedPegawai}
class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>
<option value="">Pilih Pegawai</option>
{#each pegawaiList as pegawai}
<option value={pegawai.id}>{pegawai.nip} - {pegawai.nama}</option>
{/each}
</select>
</div>
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
</div>
<div class="mt-4">
<Button on:click={viewSlip}>Lihat Slip</Button>
</div>
</Card>

{#if slipData}
<!-- Slip Preview -->
<Card class="p-8">
<div class="flex justify-end gap-2 mb-4 print:hidden">
<Button variant="outline" on:click={printSlip}>Print</Button>
<Button variant="outline" on:click={downloadPDF}>Download PDF</Button>
</div>

<!-- Slip Content -->
<div class="border-2 border-slate-300 p-8 bg-white">
<!-- Header -->
<div class="text-center mb-6 border-b-2 pb-4">
<h2 class="text-2xl font-bold">SLIP JASA PELAYANAN</h2>
<p class="text-lg mt-2">Periode: {slipData.periode.bulan_nama} {slipData.periode.tahun}</p>
</div>

<!-- Employee Info -->
<div class="mb-6 space-y-1">
<div class="grid grid-cols-3">
<div class="font-medium">NIP</div>
<div class="col-span-2">: {slipData.pegawai.nip}</div>
</div>
<div class="grid grid-cols-3">
<div class="font-medium">Nama</div>
<div class="col-span-2">: {slipData.pegawai.nama}</div>
</div>
<div class="grid grid-cols-3">
<div class="font-medium">Unit</div>
<div class="col-span-2">: {slipData.pegawai.unit}</div>
</div>
</div>

<!-- Details -->
<div class="mb-6">
<h3 class="font-bold text-lg mb-3 border-b pb-2">RINCIAN JASA</h3>
<div class="space-y-4">
{#each slipData.rincian as item}
<div class="border-l-4 border-blue-500 pl-4 py-2">
<div class="flex justify-between items-start">
<div>
<div class="font-bold">{item.tindakan}</div>
<div class="text-sm text-slate-600">
Pasien: {item.pasien} (RM: {item.rm})
</div>
<div class="text-sm text-slate-600">
Tanggal: {formatDate(item.tanggal)}
</div>
</div>
<div class="text-right font-bold">{formatCurrency(item.nilai)}</div>
</div>
</div>
{/each}
</div>
</div>

<!-- Summary -->
<div class="border-t-2 pt-4">
<div class="space-y-2 max-w-md ml-auto">
<div class="flex justify-between text-lg">
<div>TOTAL BRUTO</div>
<div class="font-bold">{formatCurrency(slipData.total_bruto)}</div>
</div>
<div class="flex justify-between text-sm text-red-600">
<div>Potongan Pajak (5%)</div>
<div>({formatCurrency(slipData.potongan_pajak)})</div>
</div>
{#if slipData.potongan_lainnya > 0}
<div class="flex justify-between text-sm text-red-600">
<div>Potongan Lainnya</div>
<div>({formatCurrency(slipData.potongan_lainnya)})</div>
</div>
{/if}
<div class="flex justify-between text-xl font-bold border-t-2 pt-2">
<div>TOTAL NETTO</div>
<div>{formatCurrency(slipData.total_netto)}</div>
</div>
</div>
</div>

<!-- Footer -->
<div class="mt-8 text-center text-sm text-slate-500">
<p>Slip ini dicetak secara otomatis oleh sistem</p>
<p>Tanggal cetak: {new Date().toLocaleDateString('id-ID')}</p>
</div>
</div>
</Card>
{/if}
</div>

<style>
@media print {
.print\:hidden {
display: none !important;
}
}
</style>
