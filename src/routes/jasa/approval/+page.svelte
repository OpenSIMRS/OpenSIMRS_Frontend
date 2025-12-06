<script lang="ts">
import Card from '$lib/components/ui/card.svelte';
import Button from '$lib/components/ui/button.svelte';
import type { AkumulasiJasa, AkumulasiJasaDetail, Pegawai } from '$lib/types/jasa';
import jasaDummyData from '$lib/data/jasa-dummy.json';

const akumulasiList: AkumulasiJasa[] = jasaDummyData.akumulasi_jasa as AkumulasiJasa[];
const pegawaiList: Pegawai[] = jasaDummyData.pegawai as Pegawai[];
const detailList: AkumulasiJasaDetail[] = jasaDummyData.akumulasi_jasa_detail as AkumulasiJasaDetail[];

let selectedAkumulasi: AkumulasiJasa | null = null;
let showDetailModal = false;
let detailData: AkumulasiJasaDetail[] = [];

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

function getPegawaiNama(id: string): string {
return pegawaiList.find(p => p.id === id)?.nama || '';
}

function getPegawaiUnit(id: string): string {
return pegawaiList.find(p => p.id === id)?.unit_nama || '';
}

function getPeriodeNama(akumulasi: AkumulasiJasa): string {
return `${bulanNames[akumulasi.periode_bulan - 1]} ${akumulasi.periode_tahun}`;
}

function viewDetail(akumulasi: AkumulasiJasa) {
selectedAkumulasi = akumulasi;
detailData = detailList.filter(d => d.akumulasi_id === akumulasi.id);
showDetailModal = true;
}

function closeModal() {
showDetailModal = false;
selectedAkumulasi = null;
detailData = [];
}

function approve(akumulasi: AkumulasiJasa) {
if (confirm(`Approve jasa untuk ${getPegawaiNama(akumulasi.pegawai_id)}?`)) {
alert('Jasa berhasil diapprove (dummy)');
}
}

function reject(akumulasi: AkumulasiJasa) {
const reason = prompt('Alasan penolakan:');
if (reason) {
alert(`Jasa ditolak dengan alasan: ${reason} (dummy)`);
}
}

function approveBatch() {
const pendingCount = akumulasiList.filter(a => a.status === 'DRAFT').length;
if (confirm(`Approve ${pendingCount} jasa sekaligus?`)) {
alert(`${pendingCount} jasa berhasil diapprove (dummy)`);
}
}

function getTotalPending(): number {
return akumulasiList
.filter(a => a.status === 'DRAFT')
.reduce((sum, a) => sum + a.grand_total, 0);
}

function getPendingCount(): number {
return akumulasiList.filter(a => a.status === 'DRAFT').length;
}
</script>

<svelte:head>
<title>Approval Jasa - OpenSIMRS</title>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
<div class="flex items-center justify-between">
<div>
<h1 class="text-3xl font-bold">Approval Jasa Pelayanan</h1>
<p class="text-slate-600 mt-1">Review dan approve akumulasi jasa pegawai</p>
</div>
{#if getPendingCount() > 0}
<Button on:click={approveBatch}>Approve Semua ({getPendingCount()})</Button>
{/if}
</div>

<!-- Summary Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Pending Approval</h3>
<p class="text-2xl font-bold">{getPendingCount()}</p>
</Card>
<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Total Nilai Pending</h3>
<p class="text-2xl font-bold">{formatCurrency(getTotalPending())}</p>
</Card>
<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Approved</h3>
<p class="text-2xl font-bold">{akumulasiList.filter(a => a.status === 'APPROVED').length}</p>
</Card>
</div>

<!-- List -->
<Card class="p-6">
<h2 class="text-lg font-bold mb-4">Daftar Pending Approval</h2>
<div class="overflow-x-auto">
<table class="w-full">
<thead class="bg-slate-50 border-b">
<tr>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Periode</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">NIP</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Nama</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Unit</th>
<th class="px-4 py-3 text-right text-sm font-medium text-slate-600">Jasa Medis</th>
<th class="px-4 py-3 text-right text-sm font-medium text-slate-600">Jasa Keperawatan</th>
<th class="px-4 py-3 text-right text-sm font-medium text-slate-600">Total</th>
<th class="px-4 py-3 text-center text-sm font-medium text-slate-600">Status</th>
<th class="px-4 py-3 text-center text-sm font-medium text-slate-600">Aksi</th>
</tr>
</thead>
<tbody>
{#each akumulasiList as akumulasi}
<tr class="border-b hover:bg-slate-50">
<td class="px-4 py-3 text-sm">{getPeriodeNama(akumulasi)}</td>
<td class="px-4 py-3 text-sm font-mono">{pegawaiList.find(p => p.id === akumulasi.pegawai_id)?.nip}</td>
<td class="px-4 py-3 text-sm font-medium">{getPegawaiNama(akumulasi.pegawai_id)}</td>
<td class="px-4 py-3 text-sm">{getPegawaiUnit(akumulasi.pegawai_id)}</td>
<td class="px-4 py-3 text-sm text-right">{formatCurrency(akumulasi.total_jasa_medis)}</td>
<td class="px-4 py-3 text-sm text-right">{formatCurrency(akumulasi.total_jasa_keperawatan)}</td>
<td class="px-4 py-3 text-sm text-right font-bold">{formatCurrency(akumulasi.grand_total)}</td>
<td class="px-4 py-3 text-center">
{#if akumulasi.status === 'DRAFT'}
<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>
{:else if akumulasi.status === 'APPROVED'}
<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Approved</span>
{:else}
<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{akumulasi.status}</span>
{/if}
</td>
<td class="px-4 py-3">
<div class="flex gap-2 justify-center">
<button
on:click={() => viewDetail(akumulasi)}
class="text-blue-600 hover:text-blue-800 text-sm"
>
Detail
</button>
{#if akumulasi.status === 'DRAFT'}
<button
on:click={() => approve(akumulasi)}
class="text-green-600 hover:text-green-800 text-sm"
>
Approve
</button>
<button
on:click={() => reject(akumulasi)}
class="text-red-600 hover:text-red-800 text-sm"
>
Reject
</button>
{/if}
</div>
</td>
</tr>
{/each}
</tbody>
</table>
</div>
</Card>
</div>

<!-- Detail Modal -->
{#if showDetailModal && selectedAkumulasi}
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
<div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
<div class="p-6 border-b">
<div class="flex justify-between items-start">
<div>
<h2 class="text-xl font-bold">Detail Akumulasi Jasa</h2>
<p class="text-sm text-slate-600 mt-1">
{getPegawaiNama(selectedAkumulasi.pegawai_id)} - {getPeriodeNama(selectedAkumulasi)}
</p>
</div>
<button on:click={closeModal} class="text-slate-400 hover:text-slate-600">
<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>
</button>
</div>
</div>
<div class="p-6 space-y-6">
<!-- Summary -->
<div class="grid grid-cols-2 gap-4">
<div>
<div class="text-sm text-slate-600">Jasa Medis</div>
<div class="text-lg font-bold">{formatCurrency(selectedAkumulasi.total_jasa_medis)}</div>
</div>
<div>
<div class="text-sm text-slate-600">Jasa Keperawatan</div>
<div class="text-lg font-bold">{formatCurrency(selectedAkumulasi.total_jasa_keperawatan)}</div>
</div>
<div>
<div class="text-sm text-slate-600">Potongan Pajak</div>
<div class="text-lg font-bold text-red-600">({formatCurrency(selectedAkumulasi.potongan_pajak)})</div>
</div>
<div>
<div class="text-sm text-slate-600">Netto</div>
<div class="text-xl font-bold text-green-600">{formatCurrency(selectedAkumulasi.netto)}</div>
</div>
</div>

<!-- Rincian -->
<div class="border-t pt-4">
<h3 class="font-bold mb-3">Rincian Tindakan</h3>
<div class="overflow-x-auto">
<table class="w-full text-sm">
<thead class="bg-slate-50 border-b">
<tr>
<th class="px-3 py-2 text-left">Tanggal</th>
<th class="px-3 py-2 text-left">Tindakan</th>
<th class="px-3 py-2 text-left">Pasien</th>
<th class="px-3 py-2 text-left">Peran</th>
<th class="px-3 py-2 text-right">Nilai</th>
</tr>
</thead>
<tbody>
{#each detailData as detail}
<tr class="border-b">
<td class="px-3 py-2">{formatDate(detail.tanggal)}</td>
<td class="px-3 py-2">{detail.tindakan_nama}</td>
<td class="px-3 py-2">{detail.pasien_nama}</td>
<td class="px-3 py-2">{detail.peran}</td>
<td class="px-3 py-2 text-right font-medium">{formatCurrency(detail.nilai_jasa)}</td>
</tr>
{/each}
</tbody>
<tfoot class="bg-slate-50 border-t-2">
<tr>
<td colspan="4" class="px-3 py-2 text-right font-bold">TOTAL</td>
<td class="px-3 py-2 text-right font-bold">
{formatCurrency(detailData.reduce((sum, d) => sum + d.nilai_jasa, 0))}
</td>
</tr>
</tfoot>
</table>
</div>
</div>

<!-- Actions -->
{#if selectedAkumulasi.status === 'DRAFT'}
<div class="flex gap-2 justify-end border-t pt-4">
<Button variant="outline" on:click={closeModal}>Tutup</Button>
<Button variant="destructive" on:click={() => { reject(selectedAkumulasi); closeModal(); }}>
Reject
</Button>
<Button on:click={() => { approve(selectedAkumulasi); closeModal(); }}>
Approve
</Button>
</div>
{:else}
<div class="flex justify-end border-t pt-4">
<Button on:click={closeModal}>Tutup</Button>
</div>
{/if}
</div>
</div>
</div>
{/if}
