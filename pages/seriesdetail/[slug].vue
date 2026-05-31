<template>
  <div v-if="pending && !detail" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
    <div class="animate-pulse space-y-6">
      <div class="h-8 bg-surface-container-highest rounded w-1/3"></div>
      <div class="h-4 bg-surface-container-highest rounded w-1/2"></div>
      <div class="h-64 bg-surface-container-highest rounded-xl"></div>
    </div>
  </div>
  <div v-else-if="detail" class="pb-section-gap">
    <header class="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden">
      <div class="absolute inset-0 z-0">
        <NuxtImg :src="detail.posterUrl" class="w-full h-full object-cover opacity-30 brightness-50" :alt="detail.title" width="1920" height="1080" loading="eager" />
        <div class="absolute inset-0 hero-gradient-overlay"></div>
      </div>
      <div class="relative z-10 h-full flex flex-col justify-end px-margin-mobile md:px-margin-desktop pb-12 md:pb-16 max-w-container-max mx-auto pt-24">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-40 md:w-56 flex-none -mt-16 md:mt-0">
            <NuxtImg :src="detail.posterUrl" class="w-full rounded-xl shadow-2xl border border-white/10" :alt="detail.title" width="400" height="600" />
          </div>
          <div class="flex-1 space-y-4">
            <div class="flex items-center gap-4">
              <span v-if="detail.quality" class="bg-secondary-container/20 text-secondary text-label-caps px-3 py-1 rounded-sm border border-secondary/30">{{ detail.quality }}</span>
              <span v-if="detail.rating" class="flex items-center gap-1 text-primary">
                <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1">star</span>
                <span class="font-bold">{{ detail.rating }}</span>
              </span>
            </div>
            <h1 class="font-display-hero text-3xl md:text-display-hero text-on-surface leading-none drop-shadow-lg">{{ detail.title }}</h1>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-on-surface-variant font-label-md text-label-md">
              <span>{{ detail.year }}</span>
              <span class="w-1 h-1 bg-outline rounded-full"></span>
              <span>{{ detail.duration }}</span>
              <span class="w-1 h-1 bg-outline rounded-full"></span>
              <span>{{ detail.episodeCount }} Episode</span>
              <div class="flex gap-2 ml-2">
                <span v-for="g in detail.genres" :key="g" class="bg-surface-container-highest px-3 py-1 rounded-full text-xs">{{ g }}</span>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-4 pt-4">
              <NuxtLink :to="`/watchseries/${detail.slug}?ep=${encodeURIComponent(detail.episodes[0]?.slug)}`" class="bg-primary hover:bg-primary-container text-on-primary font-bold px-8 py-4 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(221,183,255,0.4)]">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">play_arrow</span>
                Tonton Sekarang
              </NuxtLink>
              <button class="glass-panel text-on-surface font-bold px-8 py-4 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95">
                <span class="material-symbols-outlined">bookmark</span>
                Favorit
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-8 space-y-10">
        <section>
          <h2 class="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-3">
            <span class="w-8 h-[2px] bg-primary"></span>
            Sinopsis
          </h2>
          <p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{{ detail.description }}</p>
        </section>
        <section>
          <h2 class="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-3">
            <span class="w-8 h-[2px] bg-primary"></span>
            Episode ({{ detail.episodeCount }})
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NuxtLink
              v-for="(ep, i) in detail.episodes"
              :key="i"
              :to="`/watchseries/${detail.slug}?ep=${encodeURIComponent(ep.slug)}`"
              class="glass-panel px-5 py-4 rounded-xl flex items-center gap-3 hover:bg-primary/10 hover:border-primary/30 border border-outline-variant/20 transition-all group"
            >
              <span class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:bg-primary/20 group-hover:text-primary transition-all">
                <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1">play_arrow</span>
              </span>
              <div class="flex-1 min-w-0">
                <p class="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors truncate">{{ ep.title }}</p>
                <p class="text-xs text-on-surface-variant">{{ ep.episode }}</p>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl">chevron_right</span>
            </NuxtLink>
          </div>
        </section>
      </div>
      <aside class="lg:col-span-4 space-y-8">
        <section class="glass-panel p-6 rounded-xl border border-white/5">
          <h3 class="font-headline-md text-headline-md text-on-surface mb-6">Informasi</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary">calendar_month</span>
                <span class="text-on-surface-variant font-label-md text-label-md">Rilis</span>
              </div>
              <span class="text-on-surface font-bold">{{ detail.year }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary">schedule</span>
                <span class="text-on-surface-variant font-label-md text-label-md">Durasi</span>
              </div>
              <span class="text-on-surface font-bold">{{ detail.duration }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary">flag</span>
                <span class="text-on-surface-variant font-label-md text-label-md">Negara</span>
              </div>
              <span class="text-on-surface font-bold">{{ detail.country || '-' }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary">video_file</span>
                <span class="text-on-surface-variant font-label-md text-label-md">Episode</span>
              </div>
              <span class="text-on-surface font-bold">{{ detail.episodeCount }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary">verified</span>
                <span class="text-on-surface-variant font-label-md text-label-md">Rating</span>
              </div>
              <span class="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">{{ detail.rating || '-' }}</span>
            </div>
            <div class="pt-2">
              <p class="text-on-surface-variant font-label-md text-label-md mb-2">Genre</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="g in detail.genres" :key="g" class="bg-surface-container-highest px-3 py-1 rounded-full text-xs text-on-surface-variant border border-outline-variant/20">{{ g }}</span>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { SeriesDetailResponse } from '~/types'

const route = useRoute()
const slug = route.params.slug as string

const { data: seriesRes, pending } = useAsyncData<SeriesDetailResponse>('seriesdetail-' + slug, () =>
  $fetch<SeriesDetailResponse>(`/api/series/detail/${slug}`, {
    headers: { Accept: 'application/json' }
  }),
  { default: () => null }
)

const detail = computed(() => seriesRes.value?.data || null)

useHead({
  title: computed(() => detail.value ? `${detail.value.title} - ZeroStream` : 'Series - ZeroStream')
})
</script>
