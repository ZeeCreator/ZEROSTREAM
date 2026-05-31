<template>
  <div v-if="loading" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
    <div class="animate-pulse space-y-6">
      <div class="h-8 bg-surface-container-highest rounded w-1/3"></div>
      <div class="h-4 bg-surface-container-highest rounded w-1/2"></div>
      <div class="h-64 bg-surface-container-highest rounded-xl"></div>
    </div>
  </div>
  <div v-else-if="movie" class="pb-section-gap">
    <section class="relative min-h-[400px] md:min-h-[500px] w-full overflow-hidden">
      <div class="absolute inset-0 z-0">
        <NuxtImg :src="movie.backdrop || movie.poster" class="w-full h-full object-cover opacity-40 brightness-50" :alt="movie.title" width="1920" height="1080" loading="eager" />
        <div class="absolute inset-0 hero-gradient"></div>
      </div>
      <div class="relative z-10 h-full flex flex-col justify-end px-margin-mobile md:px-margin-desktop pb-12 md:pb-16 max-w-container-max mx-auto pt-24">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-40 md:w-56 flex-none">
            <NuxtImg :src="movie.poster" class="w-full rounded-xl shadow-2xl border border-white/10" :alt="movie.title" width="400" height="600" />
          </div>
          <div class="flex-1">
            <h1 class="font-headline-lg text-headline-lg text-on-surface mb-3">{{ movie.title }}</h1>
            <div class="flex flex-wrap items-center gap-4 mb-4">
              <span class="flex items-center gap-1 text-secondary font-label-md">
                <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1">star</span>
                {{ movie.rating }}
              </span>
              <span class="text-on-surface-variant">|</span>
              <span class="text-on-surface-variant font-label-md">{{ movie.year }}</span>
              <span class="text-on-surface-variant">|</span>
              <span class="text-on-surface-variant font-label-md">{{ movie.runtime }}</span>
              <span class="px-2 py-0.5 rounded bg-surface-container-highest text-secondary border border-secondary/20 text-xs font-bold uppercase tracking-widest">4K Ultra HD</span>
              <span class="px-2 py-0.5 rounded bg-surface-container-highest text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest">Dolby Atmos</span>
            </div>
            <div class="flex flex-wrap gap-2 mb-6">
              <span v-for="g in movie.genre" :key="g" class="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30 text-xs font-label-caps">
                {{ g }}
              </span>
            </div>
            <p class="text-on-surface-variant font-body-lg text-body-lg leading-relaxed max-w-3xl">{{ movie.synopsis }}</p>
            <div class="flex items-center gap-4 mt-6">
              <NuxtLink :to="`/watch/${movie.slug}?type=movie`" class="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md flex items-center gap-2 glow-primary hover:scale-105 transition-all duration-300">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">play_arrow</span>
                Tonton Sekarang
              </NuxtLink>
              <button class="glass-panel border-secondary/50 text-secondary px-6 py-3 rounded-lg font-label-md flex items-center gap-2 glow-secondary hover:scale-105 transition-all">
                <span class="material-symbols-outlined">add</span>
                Favorit
              </button>
            </div>
            <div v-if="movie.cast?.length" class="mt-8">
              <h3 class="font-headline-md text-headline-md text-white mb-4">Pemeran</h3>
              <div class="flex flex-wrap gap-4">
                <div v-for="(actor, i) in movie.cast.slice(0, 6)" :key="i" class="flex items-center gap-2 glass-panel px-4 py-2 rounded-full">
                  <div class="w-8 h-8 rounded-full bg-surface-container-higher overflow-hidden">
                    <NuxtImg :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${actor}`" class="w-full h-full object-cover" :alt="actor" width="32" height="32" />
                  </div>
                  <span class="font-label-md text-label-md text-on-surface">{{ actor }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="movie.server?.length" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mt-8">
      <h2 class="font-headline-md text-headline-md mb-4">Server Streaming</h2>
      <div class="flex flex-wrap gap-3">
        <button v-for="(srv, i) in movie.server" :key="i" class="px-5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:bg-primary/20 hover:border-primary hover:text-primary transition-all font-label-md">
          {{ srv }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/types'

const route = useRoute()
const slug = route.params.slug as string
const loading = ref(true)
const movie = ref<Movie | null>(null)

onMounted(async () => {
  try {
    movie.value = await $fetch<Movie>(`/api/detail/movie/${slug}`)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

useHead({
  title: computed(() => movie.value ? `${movie.value.title} - ZeroStream` : 'Loading...')
})
</script>
