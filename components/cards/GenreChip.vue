<template>
  <NuxtLink
    :to="`/genre/${genre.toLowerCase()}`"
    class="glass-panel group hover:bg-primary/20 hover:border-primary transition-all duration-300 rounded-xl p-4 md:p-6 text-center cursor-pointer block"
  >
    <span class="material-symbols-outlined text-primary mb-2 block text-2xl md:text-3xl">{{ icon }}</span>
    <p class="font-label-md text-label-md">{{ genre }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  genre: string
  icon?: string
}>()
</script>
