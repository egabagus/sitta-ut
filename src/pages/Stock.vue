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
</script>

<template>
    <div class="w-[80%] mx-auto">
        <div class="heading text-center my-8">
            <div class="text-4xl font-bold text-blue-900">Stok Bahan Ajar</div>
        </div>

        <div class="p-8 bg-white shadow-xl rounded-2xl">
            <div class="filter mb-6 flex space-x-4 items-center">
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
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="9" class="border border-gray-300 px-4 py-2 text-center text-gray-500">
                            No data available.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>