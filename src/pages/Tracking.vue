<script setup lang="ts">
import { ref } from 'vue'

interface TrackingStep {
    waktu: string
    keterangan: string
}

interface TrackingOrder {
    nim: string
    nama: string
    status: string
    ekspedisi: string
    tanggalKirim: string
    paket: string
    total: number
    perjalanan: TrackingStep[]
}

interface TrackingResult extends TrackingOrder {
    trackingNumber: string
}

type TrackingData = Record<string, TrackingOrder>

const trackingNumber = ref('')
const searchResult = ref<TrackingResult | null>(null)
const showResult = ref(false)
const errorMessage = ref('')

const tracking: TrackingData = {
    "DO2025-0001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE",
        tanggalKirim: "2025-08-25",
        paket: "PAKET-UT-001",
        total: 120000,
        perjalanan: [
            { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
            { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
            { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
        ]
    }
};

const findTrackOrder = (): void => {
    errorMessage.value = ''
    showResult.value = false
    
    if (!trackingNumber.value.trim()) {
        errorMessage.value = 'Please enter a tracking number'
        return
    }
    
    const order: TrackingOrder | undefined = tracking[trackingNumber.value.toUpperCase()]
    
    if (order) {
        searchResult.value = {
            trackingNumber: trackingNumber.value.toUpperCase(),
            ...order
        }
        showResult.value = true
    } else {
        errorMessage.value = 'Tracking number not found. Please check your tracking number.'
    }
}

const handleSubmit = (event: Event): void => {
    event.preventDefault()
    findTrackOrder()
}

const resetSearch = (): void => {
    trackingNumber.value = ''
    searchResult.value = null
    showResult.value = false
    errorMessage.value = ''
}
</script>

<template>
    <div class="w-[80%] mx-auto">
        <div class="heading text-center my-8">
            <div class="text-4xl font-bold text-blue-900">Tracking Delivery Order</div>
        </div>

        <div class="p-8 w-[60%] mx-auto bg-white shadow-xl rounded-2xl">
            <form @submit="handleSubmit">
                <div>
                    <label for="trackingNumber" class="block text-lg font-medium text-gray-700 mb-2">Enter Tracking Number:</label>
                    <input 
                        type="text" 
                        id="trackingNumber" 
                        v-model="trackingNumber"
                        placeholder="e.g., DO2025-0001" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    >
                </div>
                
                <!-- Error Message -->
                <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {{ errorMessage }}
                </div>
                
                <div class="mt-6 text-center">
                    <button type="submit" class="w-full py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                        Track Order
                    </button>
                </div>
            </form>
        </div>

        <!-- Search Results -->
        <div v-if="showResult && searchResult" class="mt-8 p-8 w-[60%] mx-auto bg-white shadow-xl rounded-2xl">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-blue-900">Tracking Results</h2>
                <button @click="resetSearch" class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                    Search Again
                </button>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Tracking Number</p>
                    <p class="text-lg font-semibold">{{ searchResult.trackingNumber }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Status</p>
                    <p class="text-lg font-semibold" :class="{'text-green-600': searchResult.status === 'Delivered', 'text-yellow-600': searchResult.status === 'Dalam Perjalanan', 'text-blue-600': searchResult.status === 'Shipped'}">
                        {{ searchResult.status }}
                    </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Recipient</p>
                    <p class="text-lg font-semibold">{{ searchResult.nama }}</p>
                    <p class="text-sm text-gray-500">NIM: {{ searchResult.nim }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Courier</p>
                    <p class="text-lg font-semibold">{{ searchResult.ekspedisi }}</p>
                    <p class="text-sm text-gray-500">Sent: {{ searchResult.tanggalKirim }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Package</p>
                    <p class="text-lg font-semibold">{{ searchResult.paket }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Total</p>
                    <p class="text-lg font-semibold">Rp {{ searchResult.total.toLocaleString('id-ID') }}</p>
                </div>
            </div>

            <!-- Tracking Timeline -->
            <div class="mt-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Tracking Timeline</h3>
                <div class="space-y-4">
                    <div 
                        v-for="(step, index) in searchResult.perjalanan" 
                        :key="index"
                        class="flex items-start"
                    >
                        <div class="flex-shrink-0 w-4 h-4 bg-blue-900 rounded-full mt-1.5"></div>
                        <div class="ml-4">
                            <p class="text-sm text-gray-600">{{ step.waktu }}</p>
                            <p class="text-gray-800">{{ step.keterangan }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>