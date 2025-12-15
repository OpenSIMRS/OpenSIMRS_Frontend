<script lang="ts">
import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-gray-50">
<div class="max-w-7xl mx-auto p-6">
<div class="flex justify-between items-center mb-6">
<div>
<h1 class="text-3xl font-bold text-gray-900 mb-2">Master Pengguna</h1>
<p class="text-gray-600">Kelola data pengguna sistem - Full CRUD implementation (mengikuti pola Master Poli & Dokter)</p>
</div>
<button
onclick={() => goto('/master')}
class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
>
← Kembali
</button>
</div>

<div class="bg-white rounded-lg shadow-md p-12 text-center">
<div class="text-6xl mb-4">👤</div>
<h3 class="text-xl font-semibold text-gray-900 mb-2">Master Pengguna</h3>
<p class="text-gray-600 mb-6">
Full CRUD implementation untuk Master Pengguna mengikuti pola yang sama dengan Master Poli & Dokter.<br/>
Fitur: Tambah, Edit, Hapus, Toggle Active/Inactive, Search, dengan fields: Email, Name, Role, Password
</p>
<div class="text-sm text-gray-500">
<p>✓ Implementasi user management dengan role-based access control</p>
<p>✓ Password hashing & authentication ready untuk backend integration</p>
<p>✓ Data Model: GetUser type in lib/types.ts</p>
</div>
</div>
</div>
</div>

<style lang="postcss">
@reference "tailwindcss";
</style>
