<template>
  <div v-if="loading" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
    <div class="animate-pulse space-y-6">
      <div class="h-8 bg-surface-container-highest rounded w-1/3"></div>
      <div class="h-4 bg-surface-container-highest rounded w-1/2"></div>
      <div class="h-64 bg-surface-container-highest rounded-xl"></div>
    </div>
  </div>
  <div v-else-if="anime" class="pb-section-gap">
    <section class="relative min-h-[400px] md:min-h-[500px] w-full overflow-hidden">
      <div class="absolute inset-0 z-0">
        <NuxtImg :src="anime.poster" class="w-full h-full object-cover opacity-40" :alt="anime.title" width="1920" height="1080" loading="eager" />
        <div class="absolute inset-0 hero-gradient"></div>
      </div>
      <div class="relative z-10 h-full flex flex-col justify-end px-margin-mobile md:px-margin-desktop pb-12 md:pb-16 max-w-container-max mx-auto pt-24">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-40 md:w-56 flex-none">
            <NuxtImg :src="anime.poster" class="w-full rounded-xl shadow-2xl border border-white/10" :alt="anime.title" width="400" height="600" />
          </div>
          <div class="flex-1">
            <h1 class="font-headline-lg text-headline-lg text-on-surface mb-3">{{ anime.title }}</h1>
            <div class="flex flex-wrap items-center gap-4 mb-4">
              <span class="flex items-center gap-1 text-primary font-label-md">
                <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1">star</span>
                {{ anime.rating }}
              </span>
              <span class="text-on-surface-variant">|</span>
              <span class="text-on-surface-variant font-label-md">{{ anime.year }}</span>
              <span class="text-on-surface-variant">|</span>
              <span class="px-2 py-0.5 rounded bg-surface-container-highest text-secondary border border-secondary/20 text-xs font-bold uppercase tracking-widest">{{ anime.status }}</span>
              <span v-if="anime.duration" class="px-2 py-0.5 rounded bg-surface-container-highest text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest">{{ anime.duration }}</span>
            </div>
            <div class="flex flex-wrap gap-2 mb-6">
              <span v-for="g in anime.genre" :key="g" class="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30 text-xs font-label-caps">
                {{ g }}
              </span>
            </div>
            <p class="text-on-surface-variant font-body-lg text-body-lg leading-relaxed max-w-3xl">{{ anime.synopsis }}</p>
            <div class="flex items-center gap-4 mt-6">
              <NuxtLink :to="`/watch/${anime.slug}?type=anime`" class="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md flex items-center gap-2 glow-primary hover:scale-105 transition-all duration-300">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">play_arrow</span>
                Tonton Sekarang
              </NuxtLink>
              <button class="glass-panel border-secondary/50 text-secondary px-6 py-3 rounded-lg font-label-md flex items-center gap-2 glow-secondary hover:scale-105 transition-all">
                <span class="material-symbols-outlined">add</span>
                Favorit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="anime.episodes?.length" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mt-8">
      <h2 class="font-headline-md text-headline-md mb-6 flex items-center gap-2">
        <span class="w-2 h-8 bg-secondary rounded-full"></span>
        Daftar Episode ({{ anime.episodes.length }})
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="ep in anime.episodes"
          :key="ep.id"
          :to="`/watch/${anime.slug}?ep=${ep.id}`"
          class="flex items-center gap-4 glass-panel p-4 rounded-xl hover:bg-surface-container transition-all group"
        >
          <div class="w-16 h-16 rounded-lg overflow-hidden flex-none">
            <NuxtImg :src="ep.thumbnail || anime.poster" class="w-full h-full object-cover" :alt="ep.title" width="64" height="64" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-label-md text-label-md text-on-surface group-hover:text-primary truncate transition-colors">
              Episode {{ ep.id }}: {{ ep.title }}
            </p>
            <p class="text-on-surface-variant text-xs font-label-caps">{{ ep.duration }}</p>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">play_arrow</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from '~/types'

const route = useRoute()
const slug = route.params.slug as string
const loading = ref(true)
const anime = ref<Anime | null>(null)

onMounted(async () => {
  try {
    anime.value = await $fetch<Anime>(`/api/detail/anime/${slug}`)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

useHead({
  title: computed(() => anime.value ? `${anime.value.title} - ZeroStream` : 'Loading...')
})
</script>
