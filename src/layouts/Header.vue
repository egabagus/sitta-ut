<script setup lang="ts">
</script>

<template>
    <header class="bg-blue-900 text-white p-4">
        <div class="flex justify-between items-center w-[80%] mx-auto">
            <div>
                <h1 class="text-2xl font-bold">SITTA UT</h1>
            </div>
            <div>
                <nav class="ml-auto">
                    <ul class="flex space-x-8">
                        <li>
                            <router-link to="/">Stok Bahan Ajar</router-link>
                        </li>
                        <li>
                            <router-link to="/tracking">Tracking DO</router-link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
</template>