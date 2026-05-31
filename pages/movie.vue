<template>
  <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
    <h1 class="font-headline-lg text-headline-lg flex items-center gap-2 mb-8">
      <span class="w-2 h-8 bg-primary rounded-full"></span>
      Daftar Movie
    </h1>
    <div v-if="pending && !movieItems.length" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
      <div v-for="i in 12" :key="i" class="animate-pulse">
        <div class="aspect-[2/3] rounded-xl bg-surface-container-highest mb-3"></div>
        <div class="h-4 bg-surface-container-highest rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-surface-container-highest rounded w-1/2"></div>
      </div>
    </div>
    <div v-else-if="!movieItems.length" class="text-center py-20">
      <span class="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">movie</span>
      <p class="text-on-surface-variant font-body-lg">Tidak ada movie</p>
    </div>
    <div v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <NuxtLink
          v-for="(item, i) in movieItems"
          :key="item.id || i"
          :to="`/moviewatch/${item.slug}`"
          class="group cursor-pointer block"
        >
          <div class="relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_30px_rgba(221,183,255,0.4)]">
            <NuxtImg
              :src="item.poster"
              :alt="item.title"
              class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              loading="lazy"
              width="400"
              height="600"
            />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <div class="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-on-primary">
                <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1">play_arrow</span>
              </div>
            </div>
            <div v-if="item.rating" class="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-primary">
              {{ item.rating }}
            </div>
            <div v-if="item.quality" class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-secondary border border-secondary/30">
              {{ item.quality }}
            </div>
          </div>
          <p class="mt-3 font-label-md text-label-md text-on-surface group-hover:text-primary truncate transition-colors">
            {{ item.title }}
          </p>
          <p v-if="item.year" class="text-on-surface-variant font-label-caps text-label-caps">{{ item.year }}</p>
        </NuxtLink>
      </div>
      <div class="flex items-center justify-center gap-4 mt-10">
        <NuxtLink
          :to="currentPage > 1 ? '/movie?page=' + (currentPage - 1) : undefined"
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </NuxtLink>
        <span class="text-label-md text-on-surface-variant">Halaman {{ currentPage }}</span>
        <NuxtLink
          :to="'/movie?page=' + (currentPage + 1)"
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaginatedResponse } from '~/types'

const route = useRoute()
const currentPage = computed(() => Number(route.query.page) || 1)

const { data: movieData, pending } = useAsyncData<PaginatedResponse>('movies-' + currentPage.value, () =>
  $fetch<PaginatedResponse>(`/api/movies?page=${currentPage.value}`, {
    headers: { Accept: 'application/json' }
  }),
  {
    default: () => ({ items: [], meta: { page: 1, totalPages: 1, hasNext: false, hasPrev: false } }),
    watch: [currentPage],
  }
)

const movieItems = computed(() => movieData.value?.items || [])

useHead({ title: 'Movie - ZeroStream' })
</script>
