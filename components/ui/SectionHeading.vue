<template>
  <div class="flex justify-between items-end mb-6">
    <h2 class="font-headline-lg text-headline-lg flex items-center gap-2">
      <span class="w-2 h-8 bg-primary rounded-full"></span>
      {{ title }}
    </h2>
    <NuxtLink v-if="link" :to="link" class="text-primary font-label-md text-label-md hover:underline">
      Lihat Semua
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  icon?: string
  link?: string
}>()
</script>
