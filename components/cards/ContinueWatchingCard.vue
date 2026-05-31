<template>
  <NuxtLink :to="`/movie/${item.slug}`" class="flex-none w-[280px] md:w-[320px] snap-start group cursor-pointer block">
    <div class="relative rounded-xl overflow-hidden glass-panel aspect-video mb-3 group-hover:scale-[1.02] transition-transform duration-300">
      <NuxtImg
        :src="item?.poster || 'https://placehold.co/640x360/1e1f26/4cd7f6?text=Continue'"
        :alt="item?.title"
        class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        loading="lazy"
        width="640"
        height="360"
      />
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div class="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-on-primary">
          <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1">play_arrow</span>
    </div>
  </NuxtLink>
      <div class="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div class="h-full bg-secondary" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
    <h3 class="font-headline-md text-body-lg text-on-surface group-hover:text-primary transition-colors truncate">
      {{ item?.title }}
    </h3>
    <p class="text-on-surface-variant font-label-md text-label-md">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem } from '~/types'

defineProps<{
  item: ContentItem
  progress?: number
  subtitle?: string
}>()
</script>
