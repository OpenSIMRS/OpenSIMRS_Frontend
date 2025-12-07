<script lang="ts">
	import { goto } from '$app/navigation';

	const masterPages = [
		{
			title: 'Master Pasien',
			description: 'Kelola data pasien',
			icon: '👥',
			href: '/master/pasien',
			color: 'blue'
		},
		{
			title: 'Master Poli',
			description: 'Kelola poliklinik',
			icon: '🏥',
			href: '/master/poli',
			color: 'green'
		},
		{
			title: 'Master Dokter',
			description: 'Kelola data dokter',
			icon: '👨‍⚕️',
			href: '/master/dokter',
			color: 'purple'
		},
		{
			title: 'Master Ruangan',
			description: 'Kelola ruangan',
			icon: '🚪',
			href: '/master/ruangan',
			color: 'orange'
		},
		{
			title: 'Master Tindakan',
			description: 'Kelola tindakan medis',
			icon: '💉',
			href: '/master/tindakan',
			color: 'red'
		},
		{
			title: 'Master Penjamin',
			description: 'Kelola penjamin/asuransi',
			icon: '💳',
			href: '/master/penjamin',
			color: 'indigo'
		},
		{
			title: 'Master Pengguna',
			description: 'Kelola pengguna sistem',
			icon: '👤',
			href: '/master/pengguna',
			color: 'pink'
		},
		{
			title: 'Master Lookup',
			description: 'Kelola data referensi (Agama, Pendidikan, dll)',
			icon: '📚',
			href: '/master/lookup',
			color: 'gray'
		}
	];

	function getColorClasses(color: string) {
		const colors: Record<string, { bg: string; hover: string; icon: string }> = {
			blue: { bg: 'bg-blue-50', hover: 'hover:bg-blue-100', icon: 'text-blue-600' },
			green: { bg: 'bg-green-50', hover: 'hover:bg-green-100', icon: 'text-green-600' },
			purple: { bg: 'bg-purple-50', hover: 'hover:bg-purple-100', icon: 'text-purple-600' },
			orange: { bg: 'bg-orange-50', hover: 'hover:bg-orange-100', icon: 'text-orange-600' },
			red: { bg: 'bg-red-50', hover: 'hover:bg-red-100', icon: 'text-red-600' },
			indigo: { bg: 'bg-indigo-50', hover: 'hover:bg-indigo-100', icon: 'text-indigo-600' },
			pink: { bg: 'bg-pink-50', hover: 'hover:bg-pink-100', icon: 'text-pink-600' },
			gray: { bg: 'bg-gray-50', hover: 'hover:bg-gray-100', icon: 'text-gray-600' }
		};
		return colors[color] || colors.gray;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto p-6">
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-4xl font-bold text-gray-900 mb-2">Master Data Management</h1>
				<p class="text-gray-600">Kelola semua data master sistem</p>
			</div>
			<button
				onclick={() => goto('/')}
				class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
			>
				← Kembali ke Dashboard
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each masterPages as item}
				{@const colors = getColorClasses(item.color)}
				<button
					onclick={() => goto(item.href)}
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

		<div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-blue-900 mb-2">ℹ️ Informasi</h3>
			<ul class="text-sm text-blue-800 space-y-2">
				<li>• <strong>Master Data Kompleks</strong> (Pasien, Poli, Dokter, dll) memiliki halaman CRUD tersendiri</li>
				<li>• <strong>Master Lookup</strong> untuk data referensi sederhana dikelola dalam satu halaman dengan tab kategori</li>
				<li>• Semua data yang sudah digunakan dalam transaksi tidak dapat dihapus, hanya dapat dinonaktifkan</li>
			</ul>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
