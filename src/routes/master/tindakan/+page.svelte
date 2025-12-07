<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto p-6">
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Master Tindakan</h1>
				<p class="text-gray-600">Kelola data tindakan medis (Placeholder - implementasi CRUD sama seperti Master Poli)</p>
			</div>
			<button
				onclick={() => goto('/master')}
				class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
			>
				← Kembali
			</button>
		</div>

		<div class="bg-white rounded-lg shadow-md p-12 text-center">
			<div class="text-6xl mb-4">💉</div>
			<h3 class="text-xl font-semibold text-gray-900 mb-2">Master Tindakan - Placeholder</h3>
			<p class="text-gray-600">
				Implementasi CRUD lengkap mengikuti pola yang sama dengan Master Poli
			</p>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
