<template>
  <section class="relative h-screen min-h-[600px] md:min-h-[700px] w-full overflow-hidden">
    <div class="absolute inset-0 z-0">
      <NuxtImg
        class="w-full h-full object-cover"
        :src="item?.backdrop || item?.poster || 'https://placehold.co/1920x1080/09090b/ddb7ff?text=ZeroStream'"
        alt="Hero"
        width="1920"
        height="1080"
        loading="eager"
        fetchpriority="high"
      />
      <div class="absolute inset-0 hero-gradient"></div>
    </div>
    <div class="relative z-10 h-full flex flex-col justify-end px-margin-mobile md:px-margin-desktop pb-16 md:pb-24 max-w-container-max mx-auto">
      <div class="max-w-xl md:max-w-2xl">
        <div class="flex items-center gap-3 mb-4">
          <span v-if="label" class="bg-secondary/20 text-secondary border border-secondary/40 px-3 py-1 rounded text-label-caps font-label-caps">
            {{ label }}
          </span>
          <span v-if="item?.rating" class="flex items-center text-primary gap-1 font-label-md text-label-md">
            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1">star</span>
            {{ item.rating }}
          </span>
        </div>
        <h1 class="font-display-hero text-4xl md:text-display-hero text-on-surface mb-4 leading-[1.1]">
          {{ title }}
        </h1>
        <div v-if="item?.genre" class="flex flex-wrap gap-4 mb-6 text-on-surface-variant font-label-md text-label-md">
          <span v-for="(g, i) in item.genre.slice(0, 4)" :key="i">
            {{ g }}
            <span v-if="i < Math.min(item.genre.length, 4) - 1" class="opacity-30 ml-4">|</span>
          </span>
        </div>
        <p class="font-body-lg text-body-lg text-on-surface-variant mb-8 md:mb-10 line-clamp-2 md:line-clamp-3">
          {{ synopsis }}
        </p>
        <div class="flex items-center gap-4">
          <NuxtLink
            :to="watchLink"
            class="bg-primary text-on-primary px-6 md:px-8 py-3 md:py-4 rounded-lg font-headline-md text-headline-md flex items-center gap-2 glow-primary transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">play_arrow</span>
            Tonton
          </NuxtLink>
          <button class="glass-panel border-secondary/50 text-secondary px-6 md:px-8 py-3 md:py-4 rounded-lg font-headline-md text-headline-md flex items-center gap-2 glow-secondary transition-all duration-300 hover:scale-105">
            <span class="material-symbols-outlined">add</span>
            Favorit
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ContentItem, Anime, Movie } from '~/types'

const props = defineProps<{
  title: string
  synopsis?: string
  label?: string
  watchLink?: string
  item?: ContentItem | Anime | Movie | null
}>()
</script>
