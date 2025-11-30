<script setup lang="ts">
import { ref, computed } from 'vue';
import type { StockItem } from '../types/stock.type';

const stokData = ref<StockItem[]>([
    {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
    },
    {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "<strong>Cover baru</strong>"
    },
    {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
    },
    {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
    }
])

const upbjjOptions = ref<string[]>([
    "Jakarta",
    "Surabaya",
    "Makassar",
    "Padang",
    "Denpasar"
]);

// Filter reactive variables
const searchText = ref<string>('');
const selectedUpbjj = ref<string>('');

// Computed filtered data
const filteredStokData = computed(() => {
    let filtered = stokData.value;

    // Filter by search text (kode or judul)
    if (searchText.value.trim()) {
        const search = searchText.value.toLowerCase().trim();
        filtered = filtered.filter(item => 
            item.kode.toLowerCase().includes(search) || 
            item.judul.toLowerCase().includes(search)
        );
    }

    // Filter by UPBJJ
    if (selectedUpbjj.value) {
        filtered = filtered.filter(item => item.upbjj === selectedUpbjj.value);
    }

    return filtered;
});

const isLowStock = (qty: number, safety: number) => qty <= safety

const resetFilter = () => {
    searchText.value = '';
    selectedUpbjj.value = '';
}

// Modal and editing functionality
const isEditModalOpen = ref<boolean>(false);
const isAddModalOpen = ref<boolean>(false);
const editingItem = ref<StockItem | null>(null);
const editForm = ref<StockItem>({
    kode: '',
    judul: '',
    kategori: '',
    upbjj: '',
    lokasiRak: '',
    harga: 0,
    qty: 0,
    safety: 0,
    catatanHTML: ''
});

const addForm = ref<StockItem>({
    kode: '',
    judul: '',
    kategori: '',
    upbjj: '',
    lokasiRak: '',
    harga: 0,
    qty: 0,
    safety: 0,
    catatanHTML: ''
});

const kategoriOptions = ref<string[]>([
    "MK Wajib",
    "MK Pilihan",
    "Praktikum"
]);

const openEditModal = (item: StockItem) => {
    editingItem.value = item;
    editForm.value = { ...item };
    isEditModalOpen.value = true;
}

const closeEditModal = () => {
    isEditModalOpen.value = false;
    editingItem.value = null;
    editForm.value = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ''
    };
}

const saveEdit = () => {
    if (editingItem.value) {
        const index = stokData.value.findIndex(item => item.kode === editingItem.value?.kode);
        if (index !== -1) {
            stokData.value[index] = { ...editForm.value };
        }
    }
    closeEditModal();
}

const deleteItem = (kode: string) => {
    if (confirm(`Are you sure you want to delete item ${kode}?`)) {
        const index = stokData.value.findIndex(item => item.kode === kode);
        if (index !== -1) {
            stokData.value.splice(index, 1);
        }
    }
}

const openAddModal = () => {
    addForm.value = {
        kode: '',
        judul: '',
        kategori: 'MK Wajib',
        upbjj: 'Jakarta',
        lokasiRak: '',
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ''
    };
    isAddModalOpen.value = true;
}

const closeAddModal = () => {
    isAddModalOpen.value = false;
    addForm.value = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ''
    };
}

const saveAdd = () => {
    const existingItem = stokData.value.find(item => item.kode === addForm.value.kode);
    if (existingItem) {
        alert('Kode already exists! Please use a different code.');
        return;
    }
    
    stokData.value.push({ ...addForm.value });
    closeAddModal();
}
</script>

<template>
    <div class="w-[80%] mx-auto">
        <div class="heading text-center my-8">
            <div class="text-4xl font-bold text-blue-900">Stok Bahan Ajar</div>
        </div>

        <div class="p-8 bg-white shadow-xl rounded-2xl">
            <div class="filter mb-6 flex space-x-4 items-center justify-between">
                <div class="flex space-x-4 items-center">
                    <div>Filter:</div>
                    <input type="text" placeholder="Cari kode atau judul..." 
                           v-model="searchText"
                           class="border bg-gray-100 border-none rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <select v-model="selectedUpbjj" class="border bg-gray-100 border-none h-full rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Semua UPBJJ</option>
                        <option v-for="upbjj in upbjjOptions" :key="upbjj" :value="upbjj">
                            {{ upbjj }}
                        </option>
                    </select>
                    <button @click="resetFilter" class="px-4 py-2 bg-white text-blue-900 font-semibold rounded-lg shadow-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                        Reset Filter
                    </button>
                </div>
                <button @click="openAddModal" class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
                    Add Data
                </button>
            </div>
            <table class="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr class="bg-blue-900 text-white">
                        <th class="border border-gray-300 px-4 py-2 text-left">Kode</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">Judul</th>
                        <th class="border border-gray-300 px-4 py-2 text-center">Kategori</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">UPBJJ</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">Lokasi Rak</th>
                        <th class="border border-gray-300 px-4 py-2 text-right">Harga</th>
                        <th class="border border-gray-300 px-4 py-2 text-right">Qty</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">Catatan</th>
                        <th class="border border-gray-300 px-4 py-2 text-center">Status</th>
                        <th class="border border-gray-300 px-4 py-2 text-center">Action</th>
                    </tr>
                </thead>
                <tbody v-if="filteredStokData.length > 0">
                    <tr v-for="item in filteredStokData" :key="item.kode" 
                        :class="{ 'bg-red-100': isLowStock(item.qty, item.safety) }">
                        <td class="border border-gray-300 px-4 py-2 font-mono">{{ item.kode }}</td>
                        <td class="border border-gray-300 px-4 py-2">{{ item.judul }}</td>
                        <td class="border border-gray-300 px-4 py-2 text-center">
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                {{ item.kategori }}
                            </span>
                        </td>
                        <td class="border border-gray-300 px-4 py-2">{{ item.upbjj }}</td>
                        <td class="border border-gray-300 px-4 py-2 font-mono">{{ item.lokasiRak }}</td>
                        <td class="border border-gray-300 px-4 py-2 text-right">
                            Rp {{ item.harga.toLocaleString('id-ID') }}
                        </td>
                        <td class="border border-gray-300 px-4 py-2 text-right font-bold"
                            :class="{ 'text-red-600': isLowStock(item.qty, item.safety) }">
                            {{ item.qty }}
                        </td>
                        <td class="border border-gray-300 px-4 py-2" v-html="item.catatanHTML"></td>
                        <td class="border border-gray-300 px-4 py-2 text-center font-bold">
                            <span v-if="isLowStock(item.qty, item.safety)" 
                                  class="px-2 py-1 bg-red-500 text-white rounded text-sm font-bold">
                                Low Stock
                            </span>
                            <span v-else 
                                  class="px-2 py-1 bg-green-500 text-white rounded text-sm font-bold">
                                In Stock
                            </span>
                        </td>
                        <td class="border border-gray-300 px-4 py-2 text-center">
                            <button @click="openEditModal(item)" 
                                    class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 mr-2">
                                Edit
                            </button>
                            <button @click="deleteItem(item.kode)" 
                                    class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="10" class="border border-gray-300 px-4 py-2 text-center text-gray-500">
                            No data available.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Edit Modal -->
        <div v-if="isEditModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
                <h2 class="text-2xl font-bold mb-4 text-blue-900">Edit Bahan Ajar</h2>
                
                <form @submit.prevent="saveEdit" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kode</label>
                            <input v-model="editForm.kode" 
                                   type="text" 
                                   class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   readonly>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select v-model="editForm.kategori" 
                                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option v-for="kategori in kategoriOptions" :key="kategori" :value="kategori">
                                    {{ kategori }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                        <input v-model="editForm.judul" 
                               type="text" 
                               class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                               required>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">UPBJJ</label>
                            <select v-model="editForm.upbjj" 
                                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option v-for="upbjj in upbjjOptions" :key="upbjj" :value="upbjj">
                                    {{ upbjj }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi Rak</label>
                            <input v-model="editForm.lokasiRak" 
                                   type="text" 
                                   class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   required>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                            <input v-model.number="editForm.harga" 
                                   type="number" 
                                   class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                            <input v-model.number="editForm.qty" 
                                   type="number" 
                                   class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Safety Stock</label>
                            <input v-model.number="editForm.safety" 
                                   type="number" 
                                   class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   required>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Catatan (HTML)</label>
                        <textarea v-model="editForm.catatanHTML" 
                                  class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  rows="3"></textarea>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" 
                                @click="closeEditModal"
                                class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit"
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Add Modal -->
        <div v-if="isAddModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
                <h2 class="text-2xl font-bold mb-4 text-green-600">Tambah Bahan Ajar Baru</h2>
                
                <form @submit.prevent="saveAdd" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kode *</label>
                            <input v-model="addForm.kode" 
                                   type="text" 
                                   class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                   placeholder="e.g., EKMA4117"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                            <select v-model="addForm.kategori" 
                                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required>
                                <option v-for="kategori in kategoriOptions" :key="kategori" :value="kategori">
                                    {{ kategori }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                        <input v-model="addForm.judul" 
                               type="text" 
                               class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="e.g., Pengantar Ekonomi Mikro"
                               required>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">UPBJJ *</label>
                            <select v-model="addForm.upbjj" 
                                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required>
                                <option v-for="upbjj in upbjjOptions" :key="upbjj" :value="upbjj">
                                    {{ upbjj }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi Rak *</label>
                            <input v-model="addForm.lokasiRak" 
                                   type="text" 
                                   class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                   placeholder="e.g., R1-A5"
                                   required>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Harga *</label>
                            <input v-model.number="addForm.harga" 
                                   type="number" 
                                   class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                   placeholder="65000"
                                   min="0"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Qty *</label>
                            <input v-model.number="addForm.qty" 
                                   type="number" 
                                   class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                   placeholder="25"
                                   min="0"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Safety Stock *</label>
                            <input v-model.number="addForm.safety" 
                                   type="number" 
                                   class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                   placeholder="10"
                                   min="0"
                                   required>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Catatan (HTML)</label>
                        <textarea v-model="addForm.catatanHTML" 
                                  class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  rows="3"
                                  placeholder="e.g., <em>Edisi terbaru</em>"></textarea>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" 
                                @click="closeAddModal"
                                class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit"
                                class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            Add Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>