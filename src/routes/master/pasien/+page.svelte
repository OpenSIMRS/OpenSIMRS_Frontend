<script lang="ts">
import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-gray-50">
<div class="max-w-7xl mx-auto p-6">
<div class="flex justify-between items-center mb-6">
<div>
<h1 class="text-3xl font-bold text-gray-900 mb-2">Master Pasien</h1>
<p class="text-gray-600">Kelola data pasien (implementasi lengkap tersedia di form registrasi)</p>
</div>
<button
onclick={() => goto('/master')}
class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
>
← Kembali
</button>
</div>

<div class="bg-white rounded-lg shadow-md p-12 text-center">
<div class="text-6xl mb-4">👥</div>
<h3 class="text-xl font-semibold text-gray-900 mb-2">Master Pasien</h3>
<p class="text-gray-600 mb-6">
Untuk kelola data pasien, gunakan fitur:
</p>
<div class="flex gap-4 justify-center">
<button
onclick={() => goto('/pasien/search')}
class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
>
Cari Pasien
</button>
<button
onclick={() => goto('/pasien/register')}
class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
>
Daftar Pasien Baru
</button>
</div>
</div>
</div>
</div>

<style lang="postcss">
@reference "tailwindcss";
</style>
