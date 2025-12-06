<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import CardDescription from '$lib/components/ui/card-description.svelte';
	import type { DashboardStats } from '$lib/types';

	// Mock dashboard stats
	const stats: DashboardStats = {
		total_kunjungan_hari_ini: 47,
		total_pasien_aktif: 156,
		total_bed_terisi: 120,
		total_bed_kosong: 30,
		bor: 80.0,
		alos: 4.5,
		pendapatan_hari_ini: 15250000,
		pendapatan_bulan_ini: 425800000
	};

	// Format currency
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	const currentDate = new Date().toLocaleDateString('id-ID', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
		<p class="text-muted-foreground mt-1">{currentDate}</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card>
			<CardHeader>
				<CardDescription>Kunjungan Hari Ini</CardDescription>
				<div class="flex items-baseline gap-2">
					<span class="text-3xl font-bold">{stats.total_kunjungan_hari_ini}</span>
					<span class="text-sm text-muted-foreground">pasien</span>
				</div>
			</CardHeader>
			<CardContent>
				<div class="flex items-center text-sm">
					<span class="text-green-600">↑ 12%</span>
					<span class="ml-1 text-muted-foreground">dari kemarin</span>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardDescription>Pasien Aktif</CardDescription>
				<div class="flex items-baseline gap-2">
					<span class="text-3xl font-bold">{stats.total_pasien_aktif}</span>
					<span class="text-sm text-muted-foreground">pasien</span>
				</div>
			</CardHeader>
			<CardContent>
				<div class="text-sm text-muted-foreground">
					Rawat Jalan: 89 | IGD: 12 | Rawat Inap: 55
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardDescription>Bed Occupancy Rate (BOR)</CardDescription>
				<div class="flex items-baseline gap-2">
					<span class="text-3xl font-bold">{stats.bor.toFixed(1)}%</span>
				</div>
			</CardHeader>
			<CardContent>
				<div class="text-sm text-muted-foreground">
					Terisi: {stats.total_bed_terisi} | Kosong: {stats.total_bed_kosong}
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardDescription>Average Length of Stay (ALOS)</CardDescription>
				<div class="flex items-baseline gap-2">
					<span class="text-3xl font-bold">{stats.alos.toFixed(1)}</span>
					<span class="text-sm text-muted-foreground">hari</span>
				</div>
			</CardHeader>
			<CardContent>
				<div class="flex items-center text-sm">
					<span class="text-green-600">↓ 0.3</span>
					<span class="ml-1 text-muted-foreground">dari bulan lalu</span>
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Revenue Cards -->
	<div class="grid gap-4 md:grid-cols-2">
		<Card>
			<CardHeader>
				<CardDescription>Pendapatan Hari Ini</CardDescription>
				<div class="text-2xl font-bold">
					{formatCurrency(stats.pendapatan_hari_ini)}
				</div>
			</CardHeader>
			<CardContent>
				<div class="flex items-center text-sm">
					<span class="text-green-600">↑ 8%</span>
					<span class="ml-1 text-muted-foreground">dari rata-rata harian</span>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardDescription>Pendapatan Bulan Ini</CardDescription>
				<div class="text-2xl font-bold">
					{formatCurrency(stats.pendapatan_bulan_ini)}
				</div>
			</CardHeader>
			<CardContent>
				<div class="flex items-center text-sm">
					<span class="text-green-600">↑ 15%</span>
					<span class="ml-1 text-muted-foreground">dari bulan lalu</span>
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Recent Activities & Top Diseases -->
	<div class="grid gap-4 lg:grid-cols-2">
		<Card>
			<CardHeader>
				<h3 class="text-lg font-semibold">Antrian Hari Ini</h3>
				<CardDescription>Daftar antrian pasien per ruangan</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-3">
					<div class="flex items-center justify-between border-b pb-2">
						<div>
							<p class="font-medium">Poli Penyakit Dalam</p>
							<p class="text-sm text-muted-foreground">Dr. Budi Hartono, Sp.PD</p>
						</div>
						<div class="text-right">
							<p class="font-semibold">No. 5</p>
							<p class="text-xs text-muted-foreground">15 pasien</p>
						</div>
					</div>
					<div class="flex items-center justify-between border-b pb-2">
						<div>
							<p class="font-medium">Poli Anak</p>
							<p class="text-sm text-muted-foreground">Dr. Siti Nurhaliza, Sp.A</p>
						</div>
						<div class="text-right">
							<p class="font-semibold">No. 3</p>
							<p class="text-xs text-muted-foreground">12 pasien</p>
						</div>
					</div>
					<div class="flex items-center justify-between border-b pb-2">
						<div>
							<p class="font-medium">IGD</p>
							<p class="text-sm text-muted-foreground">Dr. Ahmad Fauzi</p>
						</div>
						<div class="text-right">
							<p class="font-semibold">No. 2</p>
							<p class="text-xs text-muted-foreground">8 pasien</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<h3 class="text-lg font-semibold">Top 10 Penyakit</h3>
				<CardDescription>Diagnosa terbanyak bulan ini</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-2">
					{#each [
						{ kode: 'J18.9', nama: 'Pneumonia', jumlah: 45 },
						{ kode: 'A09', nama: 'Gastroenteritis', jumlah: 38 },
						{ kode: 'E11.9', nama: 'Diabetes Melitus Tipe 2', jumlah: 32 },
						{ kode: 'I10', nama: 'Hipertensi Esensial', jumlah: 29 },
						{ kode: 'J00', nama: 'Nasofaringitis Akut', jumlah: 27 }
					] as disease, i}
						<div class="flex items-center justify-between text-sm">
							<div class="flex items-center gap-2">
								<span class="font-mono text-xs text-muted-foreground">{i + 1}.</span>
								<span class="font-medium">{disease.kode}</span>
								<span class="text-muted-foreground">{disease.nama}</span>
							</div>
							<span class="font-semibold">{disease.jumlah}</span>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Quick Actions -->
	<Card>
		<CardHeader>
			<h3 class="text-lg font-semibold">Aksi Cepat</h3>
			<CardDescription>Fitur yang sering digunakan</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
				<a
					href="/pendaftaran/kunjungan"
					class="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
				>
					<span class="text-2xl">📋</span>
					<div>
						<p class="font-medium">Registrasi Pasien</p>
						<p class="text-xs text-muted-foreground">Daftar kunjungan baru</p>
					</div>
				</a>
				<a
					href="/emr/rawat-jalan"
					class="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
				>
					<span class="text-2xl">📝</span>
					<div>
						<p class="font-medium">EMR</p>
						<p class="text-xs text-muted-foreground">Catatan medis</p>
					</div>
				</a>
				<a
					href="/penunjang/laboratorium"
					class="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
				>
					<span class="text-2xl">🔬</span>
					<div>
						<p class="font-medium">Lab</p>
						<p class="text-xs text-muted-foreground">Order pemeriksaan</p>
					</div>
				</a>
				<a
					href="/billing"
					class="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
				>
					<span class="text-2xl">💰</span>
					<div>
						<p class="font-medium">Billing</p>
						<p class="text-xs text-muted-foreground">Pembayaran kasir</p>
					</div>
				</a>
			</div>
		</CardContent>
	</Card>
</div>

