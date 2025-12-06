<script lang="ts">
import Card from '$lib/components/ui/card.svelte';
import Button from '$lib/components/ui/button.svelte';
import type { InputPelaksana, Tindakan, Pegawai, PeranTindakan } from '$lib/types/jasa';
import jasaDummyData from '$lib/data/jasa-dummy.json';

const tindakanList: Tindakan[] = jasaDummyData.tindakan as Tindakan[];
const pegawaiList: Pegawai[] = jasaDummyData.pegawai as Pegawai[];

let selectedTindakan: Tindakan | null = null;
let pelaksanaList: InputPelaksana[] = [];

const peranOptions: { value: PeranTindakan; label: string }[] = [
{ value: 'OPERATOR', label: 'Operator Utama' },
{ value: 'ASISTEN_1', label: 'Asisten 1' },
{ value: 'ASISTEN_2', label: 'Asisten 2' },
{ value: 'ANESTESI', label: 'Anestesi' },
{ value: 'PERAWAT', label: 'Perawat' },
{ value: 'LAINNYA', label: 'Lainnya' }
];

function selectTindakan(tindakan: Tindakan) {
selectedTindakan = tindakan;
pelaksanaList = [];
}

function addPelaksana() {
pelaksanaList = [
...pelaksanaList,
{
peran: 'OPERATOR',
pegawai_id: '',
persentase: 0,
nilai_jasa: 0
}
];
}

function removePelaksana(index: number) {
pelaksanaList = pelaksanaList.filter((_, i) => i !== index);
}

function updatePersentase(index: number, value: number) {
pelaksanaList[index].persentase = value;
calculateNilaiJasa(index);
}

function calculateNilaiJasa(index: number) {
if (!selectedTindakan) return;
const persentase = pelaksanaList[index].persentase;
const komponenJasa = selectedTindakan.komponen_jasa;
pelaksanaList[index].nilai_jasa = (komponenJasa * persentase) / 100;
}

function getTotalPersentase(): number {
return pelaksanaList.reduce((sum, p) => sum + p.persentase, 0);
}

function getTotalNilaiJasa(): number {
return pelaksanaList.reduce((sum, p) => sum + p.nilai_jasa, 0);
}

function isValid(): boolean {
if (!selectedTindakan) return false;
if (pelaksanaList.length === 0) return false;
if (!pelaksanaList.some(p => p.peran === 'OPERATOR')) return false;
if (getTotalPersentase() !== 100) return false;
if (pelaksanaList.some(p => !p.pegawai_id)) return false;
return true;
}

function handleSubmit() {
if (!isValid()) {
alert('Data belum valid. Pastikan total persentase = 100% dan operator sudah diisi.');
return;
}
console.log('Pelaksana data:', pelaksanaList);
alert('Data pelaksana berhasil disimpan (dummy)');
}

function formatCurrency(amount: number): string {
return new Intl.NumberFormat('id-ID', {
style: 'currency',
currency: 'IDR',
minimumFractionDigits: 0
}).format(amount);
}

function getPegawaiNama(id: string): string {
return pegawaiList.find(p => p.id === id)?.nama || '';
}
</script>

<svelte:head>
<title>Input Pelaksana Tindakan - OpenSIMRS</title>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
<div>
<h1 class="text-3xl font-bold">Input Pelaksana Tindakan</h1>
<p class="text-slate-600 mt-1">Catat pelaksana untuk setiap tindakan medis</p>
</div>

{#if !selectedTindakan}
<!-- Pilih Tindakan -->
<Card class="p-6">
<h2 class="text-lg font-bold mb-4">Pilih Tindakan</h2>
<div class="space-y-2">
{#each tindakanList as tindakan}
<button
on:click={() => selectTindakan(tindakan)}
class="w-full p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors"
>
<div class="flex justify-between items-start">
<div>
<div class="font-bold">{tindakan.nama}</div>
<div class="text-sm text-slate-600">
Kode: {tindakan.kode} | Kategori: {tindakan.kategori_nama}
</div>
</div>
<div class="text-right">
<div class="text-sm text-slate-600">Tarif</div>
<div class="font-bold">{formatCurrency(tindakan.tarif)}</div>
<div class="text-sm text-blue-600">Komponen Jasa: {formatCurrency(tindakan.komponen_jasa)}</div>
</div>
</div>
</button>
{/each}
</div>
</Card>
{:else}
<!-- Form Input Pelaksana -->
<Card class="p-6">
<div class="flex justify-between items-start mb-4">
<div>
<h2 class="text-lg font-bold">{selectedTindakan.nama}</h2>
<p class="text-sm text-slate-600">
Tarif: {formatCurrency(selectedTindakan.tarif)} | 
Komponen Jasa: {formatCurrency(selectedTindakan.komponen_jasa)}
</p>
</div>
<Button variant="outline" on:click={() => selectedTindakan = null}>
Ganti Tindakan
</Button>
</div>

<div class="border-t pt-4">
<div class="flex justify-between items-center mb-4">
<h3 class="font-bold">Daftar Pelaksana</h3>
<Button on:click={addPelaksana}>Tambah Pelaksana</Button>
</div>

{#if pelaksanaList.length === 0}
<div class="text-center py-8 text-slate-500">
Belum ada pelaksana. Klik "Tambah Pelaksana" untuk mulai.
</div>
{:else}
<div class="overflow-x-auto">
<table class="w-full">
<thead class="bg-slate-50 border-b">
<tr>
<th class="px-4 py-3 text-left text-sm font-medium">Peran*</th>
<th class="px-4 py-3 text-left text-sm font-medium">Nama Pegawai*</th>
<th class="px-4 py-3 text-center text-sm font-medium">Persentase*</th>
<th class="px-4 py-3 text-right text-sm font-medium">Nilai Jasa</th>
<th class="px-4 py-3 text-center text-sm font-medium">Aksi</th>
</tr>
</thead>
<tbody>
{#each pelaksanaList as pelaksana, i}
<tr class="border-b">
<td class="px-4 py-3">
<select
bind:value={pelaksana.peran}
class="w-full px-3 py-2 border rounded-md text-sm"
>
{#each peranOptions as option}
<option value={option.value}>{option.label}</option>
{/each}
</select>
</td>
<td class="px-4 py-3">
<select
bind:value={pelaksana.pegawai_id}
class="w-full px-3 py-2 border rounded-md text-sm"
>
<option value="">Pilih Pegawai</option>
{#each pegawaiList as pegawai}
<option value={pegawai.id}>{pegawai.nama} ({pegawai.jabatan})</option>
{/each}
</select>
</td>
<td class="px-4 py-3">
<input
type="number"
min="0"
max="100"
step="0.01"
bind:value={pelaksana.persentase}
on:input={() => updatePersentase(i, pelaksana.persentase)}
class="w-24 px-3 py-2 border rounded-md text-sm text-center"
/>
</td>
<td class="px-4 py-3 text-right text-sm font-medium">
{formatCurrency(pelaksana.nilai_jasa)}
</td>
<td class="px-4 py-3 text-center">
<button
on:click={() => removePelaksana(i)}
class="text-red-600 hover:text-red-800 text-sm"
>
Hapus
</button>
</td>
</tr>
{/each}
</tbody>
<tfoot class="bg-slate-50 border-t-2">
<tr>
<td colspan="2" class="px-4 py-3 text-sm font-bold text-right">TOTAL</td>
<td class="px-4 py-3 text-sm font-bold text-center">
<span class:text-green-600={getTotalPersentase() === 100} class:text-red-600={getTotalPersentase() !== 100}>
{getTotalPersentase()}%
</span>
</td>
<td class="px-4 py-3 text-sm font-bold text-right">
{formatCurrency(getTotalNilaiJasa())}
</td>
<td></td>
</tr>
</tfoot>
</table>
</div>

<div class="mt-4 p-4 bg-blue-50 rounded-lg">
<h4 class="font-bold text-sm mb-2">Validasi:</h4>
<ul class="text-sm space-y-1">
<li class:text-green-600={pelaksanaList.some(p => p.peran === 'OPERATOR')} class:text-red-600={!pelaksanaList.some(p => p.peran === 'OPERATOR')}>
{pelaksanaList.some(p => p.peran === 'OPERATOR') ? '✓' : '✗'} Operator wajib diisi
</li>
<li class:text-green-600={getTotalPersentase() === 100} class:text-red-600={getTotalPersentase() !== 100}>
{getTotalPersentase() === 100 ? '✓' : '✗'} Total persentase = 100%
</li>
<li class:text-green-600={!pelaksanaList.some(p => !p.pegawai_id)} class:text-red-600={pelaksanaList.some(p => !p.pegawai_id)}>
{!pelaksanaList.some(p => !p.pegawai_id) ? '✓' : '✗'} Semua pegawai sudah dipilih
</li>
</ul>
</div>

<div class="flex gap-2 justify-end mt-6">
<Button variant="outline" on:click={() => pelaksanaList = []}>Reset</Button>
<Button on:click={handleSubmit} disabled={!isValid()}>Simpan Pelaksana</Button>
</div>
{/if}
</div>
</Card>
{/if}
</div>
