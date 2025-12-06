<script lang="ts">
	import type { Snippet } from "svelte";

	type NavItem = {
		label: string;
		href: string;
		icon?: string;
		children?: NavItem[];
	};

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();

	let sidebarOpen = $state(true);

	const navItems: NavItem[] = [
		{
			label: "Dashboard",
			href: "/",
			icon: "📊"
		},
		{
			label: "Pendaftaran & Admisi",
			href: "/pendaftaran",
			icon: "📋",
			children: [
				{ label: "Daftar Pasien", href: "/pendaftaran/pasien" },
				{ label: "Registrasi Kunjungan", href: "/pendaftaran/kunjungan" },
				{ label: "Rawat Inap", href: "/pendaftaran/rawat-inap" }
			]
		},
		{
			label: "EMR",
			href: "/emr",
			icon: "📝",
			children: [
				{ label: "Rawat Jalan", href: "/emr/rawat-jalan" },
				{ label: "IGD", href: "/emr/igd" },
				{ label: "Rawat Inap", href: "/emr/rawat-inap" }
			]
		},
		{
			label: "Penunjang Medis",
			href: "/penunjang",
			icon: "🔬",
			children: [
				{ label: "Laboratorium", href: "/penunjang/laboratorium" },
				{ label: "Radiologi", href: "/penunjang/radiologi" }
			]
		},
		{
			label: "Farmasi",
			href: "/farmasi",
			icon: "💊"
		},
		{
			label: "Gizi",
			href: "/gizi",
			icon: "🍽️"
		},
		{
			label: "Gudang & Logistik",
			href: "/gudang",
			icon: "📦"
		},
		{
			label: "Billing & Kasir",
			href: "/billing",
			icon: "💰"
		},
		{
			label: "Master Data",
			href: "/master",
			icon: "📚",
			children: [
				{ label: "ICD-10", href: "/master/icd10" },
				{ label: "ICD-9 CM", href: "/master/icd9cm" },
				{ label: "Tindakan", href: "/master/tindakan" },
				{ label: "Obat", href: "/master/obat" },
				{ label: "Pegawai", href: "/master/pegawai" },
				{ label: "Ruangan", href: "/master/ruangan" },
				{ label: "Penjamin", href: "/master/penjamin" }
			]
		},
		{
			label: "Laporan",
			href: "/laporan",
			icon: "📈"
		},
		{
			label: "Audit Trail",
			href: "/audit",
			icon: "🔍"
		}
	];

	let expandedItems = $state<Set<string>>(new Set());

	function toggleItem(href: string) {
		if (expandedItems.has(href)) {
			expandedItems.delete(href);
		} else {
			expandedItems.add(href);
		}
		expandedItems = expandedItems; // trigger reactivity
	}
</script>

<div class="flex h-screen bg-background">
	<!-- Sidebar -->
	<aside
		class="flex flex-col border-r bg-card transition-all duration-300"
		style="width: {sidebarOpen ? '16rem' : '4rem'}"
	>
		<!-- Header -->
		<div class="flex h-16 items-center justify-between border-b px-4">
			{#if sidebarOpen}
				<h1 class="text-lg font-bold text-primary">OpenSIMRS</h1>
			{:else}
				<span class="text-lg font-bold text-primary">OS</span>
			{/if}
			<button
				onclick={() => (sidebarOpen = !sidebarOpen)}
				class="rounded-md p-1.5 hover:bg-accent"
				aria-label="Toggle sidebar"
			>
				{sidebarOpen ? "◀" : "▶"}
			</button>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 overflow-y-auto p-2">
			<ul class="space-y-1">
				{#each navItems as item}
					<li>
						{#if item.children}
							<div>
								<button
									onclick={() => toggleItem(item.href)}
									class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
								>
									<span class="text-lg">{item.icon}</span>
									{#if sidebarOpen}
										<span class="flex-1 text-left">{item.label}</span>
										<span class="text-xs">
											{expandedItems.has(item.href) ? "▼" : "▶"}
										</span>
									{/if}
								</button>
								{#if expandedItems.has(item.href) && sidebarOpen}
									<ul class="ml-8 mt-1 space-y-1">
										{#each item.children as child}
											<li>
												<a
													href={child.href}
													class="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
												>
													{child.label}
												</a>
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						{:else}
							<a
								href={item.href}
								class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
							>
								<span class="text-lg">{item.icon}</span>
								{#if sidebarOpen}
									<span>{item.label}</span>
								{/if}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>

		<!-- User Info -->
		<div class="border-t p-4">
			{#if sidebarOpen}
				<div class="flex items-center gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
						U
					</div>
					<div class="flex-1">
						<p class="text-sm font-medium">User</p>
						<p class="text-xs text-muted-foreground">Admin</p>
					</div>
				</div>
			{:else}
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
					U
				</div>
			{/if}
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex flex-1 flex-col">
		<!-- Header -->
		<header class="flex h-16 items-center justify-between border-b bg-card px-6">
			<div class="flex items-center gap-4">
				<h2 class="text-xl font-semibold">Sistem Informasi Manajemen Rumah Sakit</h2>
			</div>
			<div class="flex items-center gap-4">
				<button class="rounded-md p-2 hover:bg-accent">
					<span class="text-lg">🔔</span>
				</button>
				<button class="rounded-md p-2 hover:bg-accent">
					<span class="text-lg">⚙️</span>
				</button>
			</div>
		</header>

		<!-- Page Content -->
		<main class="flex-1 overflow-y-auto p-6">
			{@render children?.()}
		</main>
	</div>
</div>

<style>
	/* Add custom scrollbar styling */
	:global(aside nav) {
		scrollbar-width: thin;
		scrollbar-color: hsl(var(--muted)) transparent;
	}

	:global(aside nav::-webkit-scrollbar) {
		width: 6px;
	}

	:global(aside nav::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(aside nav::-webkit-scrollbar-thumb) {
		background-color: hsl(var(--muted));
		border-radius: 3px;
	}
</style>
