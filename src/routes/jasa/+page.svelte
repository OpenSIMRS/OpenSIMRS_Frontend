<script lang="ts">
import Card from '$lib/components/ui/card.svelte';
import type { DashboardJasa } from '$lib/types/jasa';
import jasaDummyData from '$lib/data/jasa-dummy.json';

const dashboardData: DashboardJasa = jasaDummyData.dashboard_jasa as DashboardJasa;

function formatCurrency(amount: number): string {
return new Intl.NumberFormat('id-ID', {
style: 'currency',
currency: 'IDR',
minimumFractionDigits: 0
}).format(amount);
}

function formatPercentage(value: number): string {
return value > 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
}
</script>

<svelte:head>
<title>Dashboard Jasa Pelayanan - OpenSIMRS</title>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
<div class="flex items-center justify-between">
<h1 class="text-3xl font-bold">Dashboard Jasa Pelayanan</h1>
<div class="flex gap-2">
<a href="/jasa/formula" class="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700">
Setting Formula
</a>
<a href="/jasa/kalkulasi" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
Kalkulasi Jasa
</a>
</div>
</div>

<!-- Summary Cards -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Total Jasa Bulan Ini</h3>
<p class="text-2xl font-bold">{formatCurrency(dashboardData.total_bulan_ini)}</p>
</Card>

<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Perbandingan Bulan Lalu</h3>
<p class="text-2xl font-bold">{formatCurrency(dashboardData.perbandingan_bulan_lalu.nilai)}</p>
<p class="text-sm mt-1" class:text-green-600={dashboardData.perbandingan_bulan_lalu.persentase > 0} class:text-red-600={dashboardData.perbandingan_bulan_lalu.persentase < 0}>
{formatPercentage(dashboardData.perbandingan_bulan_lalu.persentase)}
</p>
</Card>

<Card class="p-6">
<h3 class="text-sm font-medium text-slate-600 mb-2">Total Penerima</h3>
<p class="text-2xl font-bold">{dashboardData.top_penerima.length}</p>
<p class="text-sm text-slate-500 mt-1">Pegawai aktif</p>
</Card>
</div>

<!-- Top Penerima -->
<Card class="p-6">
<h2 class="text-xl font-bold mb-4">Top 10 Penerima Jasa</h2>
<div class="overflow-x-auto">
<table class="w-full">
<thead class="bg-slate-50 border-b">
<tr>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">No</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Nama</th>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Unit</th>
<th class="px-4 py-3 text-right text-sm font-medium text-slate-600">Total Jasa</th>
</tr>
</thead>
<tbody>
{#each dashboardData.top_penerima as penerima, i}
<tr class="border-b hover:bg-slate-50">
<td class="px-4 py-3 text-sm">{i + 1}</td>
<td class="px-4 py-3 text-sm font-medium">{penerima.nama}</td>
<td class="px-4 py-3 text-sm text-slate-600">{penerima.unit}</td>
<td class="px-4 py-3 text-sm text-right font-medium">{formatCurrency(penerima.total)}</td>
</tr>
{/each}
</tbody>
</table>
</div>
</Card>

<!-- Distribusi per Unit -->
<Card class="p-6">
<h2 class="text-xl font-bold mb-4">Distribusi Jasa per Unit</h2>
<div class="space-y-3">
{#each dashboardData.distribusi_unit as unit}
<div>
<div class="flex justify-between items-center mb-1">
<span class="text-sm font-medium">{unit.unit}</span>
<span class="text-sm font-bold">{formatCurrency(unit.total)}</span>
</div>
<div class="w-full bg-slate-200 rounded-full h-2">
<div
class="bg-blue-600 h-2 rounded-full"
style="width: {(unit.total / dashboardData.total_bulan_ini) * 100}%"
></div>
</div>
</div>
{/each}
</div>
</Card>

<!-- Trend 12 Bulan -->
<Card class="p-6">
<h2 class="text-xl font-bold mb-4">Trend Jasa 12 Bulan Terakhir</h2>
<div class="overflow-x-auto">
<table class="w-full">
<thead class="bg-slate-50 border-b">
<tr>
<th class="px-4 py-3 text-left text-sm font-medium text-slate-600">Periode</th>
<th class="px-4 py-3 text-right text-sm font-medium text-slate-600">Total</th>
</tr>
</thead>
<tbody>
{#each dashboardData.trend_12_bulan as trend}
<tr class="border-b hover:bg-slate-50">
<td class="px-4 py-3 text-sm">{trend.bulan}</td>
<td class="px-4 py-3 text-sm text-right font-medium">{formatCurrency(trend.total)}</td>
</tr>
{/each}
</tbody>
</table>
</div>
</Card>
</div>
