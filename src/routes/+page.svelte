<script lang="ts">
	import { goto } from '$app/navigation';

	const menuItems = [
		{
			title: 'Cari Pasien',
			description: 'Cari data pasien yang sudah terdaftar',
			icon: '🔍',
			href: '/pasien/search',
			color: 'blue'
		},
		{
			title: 'Daftar Pasien Baru',
			description: 'Mendaftarkan pasien baru ke sistem',
			icon: '👤',
			href: '/pasien/register',
			color: 'green'
		},
		{
			title: 'Daftar Kunjungan',
			description: 'Pendaftaran kunjungan rawat jalan',
			icon: '📋',
			href: '/kunjungan/register',
			color: 'purple'
		},
		{
			title: 'Daftar Antrian Poli',
			description: 'Lihat antrian pasien di poli',
			icon: '🏥',
			href: '/poli/antrian',
			color: 'orange'
		},
		{
			title: 'Master Data',
			description: 'Kelola data master sistem',
			icon: '⚙️',
			href: '/master',
			color: 'gray'
		}
	];

	function getColorClasses(color: string) {
		const colors: Record<string, { bg: string; hover: string; icon: string }> = {
			blue: { bg: 'bg-blue-50', hover: 'hover:bg-blue-100', icon: 'text-blue-600' },
			green: { bg: 'bg-green-50', hover: 'hover:bg-green-100', icon: 'text-green-600' },
			purple: { bg: 'bg-purple-50', hover: 'hover:bg-purple-100', icon: 'text-purple-600' },
			orange: { bg: 'bg-orange-50', hover: 'hover:bg-orange-100', icon: 'text-orange-600' },
			gray: { bg: 'bg-gray-50', hover: 'hover:bg-gray-100', icon: 'text-gray-600' }
		};
		return colors[color] || colors.gray;
	}

	function navigateTo(href: string) {
		goto(href);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto p-6">
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">Dashboard OpenSIMRS</h1>
			<p class="text-gray-600">Selamat datang di Sistem Informasi Manajemen Rumah Sakit</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each menuItems as item}
				{@const colors = getColorClasses(item.color)}
				<button
					onclick={() => navigateTo(item.href)}
					class="text-left bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg hover:-translate-y-1 {colors.hover}"
				>
					<div class="flex items-start gap-4">
						<div class="text-4xl {colors.icon} flex-shrink-0">
							{item.icon}
						</div>
						<div>
							<h3 class="text-xl font-semibold text-gray-900 mb-1">
								{item.title}
							</h3>
							<p class="text-sm text-gray-600">
								{item.description}
							</p>
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
