<template>
  <div>
    <section v-if="heroMovie" class="relative h-screen min-h-[600px] md:min-h-[700px] w-full overflow-hidden">
      <div v-if="showNotification" class="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-full px-margin-mobile md:px-margin-desktop pt-4 max-w-container-max pointer-events-none">
        <div class="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 pointer-events-auto">
          <span class="material-symbols-outlined text-secondary shrink-0" style="font-variation-settings: 'FILL' 1">info</span>
          <p class="font-body-md text-body-md text-white/90 flex-1">
            Masih dalam tahap pengembangan, terkadang ada error dan masih banyak iklan ( belum buat ads blocknya )
          </p>
          <button @click="closeNotification" class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
      <div class="absolute inset-0 z-0">
        <NuxtImg
          class="w-full h-full object-cover"
          :src="heroBgImage"
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
            <span class="bg-secondary/20 text-secondary border border-secondary/40 px-3 py-1 rounded text-label-caps font-label-caps">Z-STREAM</span>
            <span v-if="heroMovie.rating" class="flex items-center text-primary gap-1 font-label-md text-label-md">
              <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1">star</span>
              {{ heroMovie.rating }}
            </span>
          </div>
          <h1 class="font-display-hero text-4xl md:text-display-hero text-on-surface mb-4 leading-[1.1]">
            {{ heroMovie.title }}
          </h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant mb-8 md:mb-10 line-clamp-2 md:line-clamp-3">
            Tonton ribuan film berkualitas HD hanya di ZeroStream.
          </p>
          <div class="flex items-center gap-4">
            <NuxtLink
              :to="`/moviewatch/${heroMovie.slug}`"
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
    <!-- Lanjutkan Nonton (coming soon) -->
    <section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap content-visibility-auto">
      <div class="flex justify-between items-end mb-6">
        <h2 class="font-headline-lg text-headline-lg flex items-center gap-2">
          <span class="w-2 h-8 bg-primary rounded-full"></span>
          Movie
        </h2>
        <NuxtLink to="/movie" class="text-primary font-label-md text-label-md hover:underline">Lihat Semua</NuxtLink>
      </div>
      <div v-if="pending" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <div v-for="i in 12" :key="i" class="animate-pulse">
          <div class="aspect-[2/3] rounded-xl bg-surface-container-highest mb-3"></div>
          <div class="h-4 bg-surface-container-highest rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-surface-container-highest rounded w-1/2"></div>
        </div>
      </div>
      <div v-else-if="error" class="text-center py-12">
        <span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">error_outline</span>
        <p class="text-on-surface-variant font-body-lg">Gagal memuat data movie</p>
        <p class="text-on-surface-variant/60 font-body-md text-sm mt-2">{{ error }}</p>
        <button @click="refresh" class="mt-4 bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md hover:scale-105 transition-transform">Coba Lagi</button>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <NuxtLink
          v-for="(item, i) in rebahinMovies"
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
    </section>
    <section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap content-visibility-auto">
      <div class="flex justify-between items-end mb-6">
        <h2 class="font-headline-lg text-headline-lg flex items-center gap-2">
          <span class="w-2 h-8 bg-red-400 rounded-full"></span>
          Drakor
        </h2>
        <NuxtLink to="/drakor" class="text-red-400 font-label-md text-label-md hover:underline">Lihat Semua</NuxtLink>
      </div>
      <div v-if="drakorPending" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="aspect-[2/3] rounded-xl bg-surface-container-highest mb-3"></div>
          <div class="h-4 bg-surface-container-highest rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-surface-container-highest rounded w-1/2"></div>
        </div>
      </div>
      <div v-else-if="!drakorItems.length" class="text-center py-12">
        <span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">tv</span>
        <p class="text-on-surface-variant font-body-lg">Tidak ada drakor</p>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <NuxtLink
          v-for="(item, i) in drakorItems"
          :key="item.id || i"
          :to="item.type === 'tv' ? `/seriesdetail/${item.slug}` : `/moviewatch/${item.slug}`"
          class="group cursor-pointer block"
        >
          <div class="relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-transparent group-hover:border-red-400 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_30px_rgba(248,113,113,0.4)]">
            <NuxtImg
              :src="item.poster"
              :alt="item.title"
              class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              loading="lazy"
              width="400"
              height="600"
            />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <div class="w-12 h-12 rounded-full bg-red-400/90 flex items-center justify-center text-white">
                <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1">play_arrow</span>
              </div>
            </div>
            <div v-if="item.rating" class="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-red-400">
              {{ item.rating }}
            </div>
            <div v-if="item.episodeCount" class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-red-400 border border-red-400/30">
              {{ item.episodeCount }} Ep
            </div>
            <div v-else-if="item.quality" class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-red-400 border border-red-400/30">
              {{ item.quality }}
            </div>
          </div>
          <p class="mt-3 font-label-md text-label-md text-on-surface group-hover:text-red-400 truncate transition-colors">
            {{ item.title }}
          </p>
          <p v-if="item.episodeCount" class="text-on-surface-variant font-label-caps text-label-caps">{{ item.episodeCount }} Episode</p>
        </NuxtLink>
      </div>
    </section>
    <section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap content-visibility-auto">
      <div class="flex justify-between items-end mb-6">
        <h2 class="font-headline-lg text-headline-lg flex items-center gap-2">
          <span class="w-2 h-8 bg-primary rounded-full"></span>
          Series Terbaru
        </h2>
        <NuxtLink to="/series" class="text-primary font-label-md text-label-md hover:underline">Lihat Semua</NuxtLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <NuxtLink
          v-for="(item, i) in seriesList"
          :key="item.externalId || i"
          :to="`/seriesdetail/${item.slug}`"
          class="group cursor-pointer block"
        >
          <div class="relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_30px_rgba(221,183,255,0.4)]">
            <NuxtImg
              :src="item.posterUrl"
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
            <div class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-secondary border border-secondary/30">
              {{ item.episodeCount }} Ep
            </div>
          </div>
          <p class="mt-3 font-label-md text-label-md text-on-surface group-hover:text-primary truncate transition-colors">
            {{ item.title }}
          </p>
          <p class="text-on-surface-variant font-label-caps text-label-caps">{{ item.episodeCount }} Episode</p>
        </NuxtLink>
      </div>
    </section>
    <!-- Donghua Section -->
    <section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap content-visibility-auto">
      <div class="flex justify-between items-end mb-6">
        <h2 class="font-headline-lg text-headline-lg flex items-center gap-2">
          <span class="w-2 h-8 bg-emerald-400 rounded-full"></span>
          Donghua Popular
        </h2>
        <NuxtLink to="/donghua" class="text-emerald-400 font-label-md text-label-md hover:underline">Lihat Semua</NuxtLink>
      </div>
      <div v-if="donghuaPending" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="aspect-[2/3] rounded-xl bg-surface-container-highest mb-3"></div>
          <div class="h-4 bg-surface-container-highest rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-surface-container-highest rounded w-1/2"></div>
        </div>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <NuxtLink
          v-for="(item, i) in donghuaList"
          :key="i"
          :to="`/dongwatch/${item.slug}`"
          class="group cursor-pointer block"
        >
          <div class="relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-transparent group-hover:border-emerald-400 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_30px_rgba(52,211,153,0.4)]">
            <NuxtImg
              :src="item.poster"
              :alt="item.title"
              class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              loading="lazy"
              width="400"
              height="600"
            />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <div class="w-12 h-12 rounded-full bg-emerald-400/90 flex items-center justify-center text-white">
                <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1">play_arrow</span>
              </div>
            </div>
            <div class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-emerald-400 border border-emerald-400/30">
              {{ item.episode || 'Donghua' }}
            </div>
          </div>
          <p class="mt-3 font-label-md text-label-md text-on-surface group-hover:text-emerald-400 truncate transition-colors">
            {{ item.title }}
          </p>
        </NuxtLink>
      </div>
    </section>

    <!-- Anime Popular Hari Ini -->
    <section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap content-visibility-auto">
      <div class="flex justify-between items-end mb-6">
        <h2 class="font-headline-lg text-headline-lg flex items-center gap-2">
          <span class="w-2 h-8 bg-primary rounded-full"></span>
          Anime Popular Hari Ini
        </h2>
        <NuxtLink to="/anime" class="text-primary font-label-md text-label-md hover:underline">Lihat Semua</NuxtLink>
      </div>
      <div v-if="animePending" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="aspect-[2/3] rounded-xl bg-surface-container-highest mb-3"></div>
          <div class="h-4 bg-surface-container-highest rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-surface-container-highest rounded w-1/2"></div>
        </div>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <div v-for="(item, i) in animePopularToday" :key="i" class="group cursor-pointer block" @click="navigateTo(`/watch/${item.slug}?type=anime`)">
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
            <div v-if="item.episode" class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-secondary border border-secondary/30">{{ item.episode }}</div>
          </div>
          <p class="mt-3 font-label-md text-label-md text-on-surface group-hover:text-primary truncate transition-colors">{{ item.title }}</p>
        </div>
      </div>
    </section>

    <section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap">
      <div class="flex justify-between items-end mb-6">
        <h2 class="font-headline-lg text-headline-lg flex items-center gap-2">
          <span class="w-2 h-8 bg-primary rounded-full"></span>
          Jelajahi Genre
        </h2>
      </div>

      <!-- Mobile: first 4 genre, toggle for rest -->
      <div class="md:hidden">
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink
            v-for="(g, i) in showAllGenres ? genres : genres.slice(0, 4)"
            :key="i"
            :to="`/genre/${g.slug}`"
            class="glass-panel group hover:bg-primary/20 hover:border-primary transition-all duration-300 rounded-xl p-3 text-center cursor-pointer block"
          >
            <span class="material-symbols-outlined text-primary mb-1 block text-xl">{{ g.icon }}</span>
            <p class="text-xs font-medium">{{ g.name }}</p>
          </NuxtLink>
        </div>
        <button
          v-if="genres.length > 4"
          @click="showAllGenres = !showAllGenres"
          class="w-full mt-3 py-2 text-center text-primary font-label-md hover:underline"
        >
          {{ showAllGenres ? 'Tutup' : 'Tampilkan Semua (' + genres.length + ')' }}
        </button>
      </div>

      <!-- Desktop: all genres in horizontal carousel -->
      <div class="hidden md:block relative">
        <button
          @click="scrollCarousel(-320)"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-surface/90 backdrop-blur-xl border border-outline-variant/30 flex items-center justify-center text-on-surface hover:text-primary hover:border-primary transition-all -ml-5"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <div
          ref="genreCarousel"
          class="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-2 -mx-4 px-4 cursor-grab active:cursor-grabbing scroll-smooth"
          @wheel.prevent="onCarouselWheel"
        >
          <NuxtLink
            v-for="(g, i) in genres"
            :key="i"
            :to="`/genre/${g.slug}`"
            class="flex-none w-[160px] snap-start glass-panel group hover:bg-primary/20 hover:border-primary transition-all duration-300 rounded-xl p-6 text-center cursor-pointer block"
          >
            <span class="material-symbols-outlined text-primary mb-2 block text-3xl">{{ g.icon }}</span>
            <p class="font-label-md text-label-md">{{ g.name }}</p>
          </NuxtLink>
        </div>
        <button
          @click="scrollCarousel(320)"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-surface/90 backdrop-blur-xl border border-outline-variant/30 flex items-center justify-center text-on-surface hover:text-primary hover:border-primary transition-all -mr-5"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, GenreResponse, PaginatedResponse } from '~/types'

const { data: rebahinMovies, pending, error, refresh } = useAsyncData<ContentItem[]>('rebahin-movies', () =>
  $fetch<ContentItem[]>('/api/movies/rebahin', {
    headers: { Accept: 'application/json' }
  }),
  {
    default: () => [],
    transform: (data) => data || [],
  }
)

const heroMovie = computed(() => {
  if (rebahinMovies.value?.length > 0) {
    return rebahinMovies.value[0]
  }
  return null
})

const heroBgImage = computed(() => {
  if (!heroMovie.value?.poster) return ''
  return heroMovie.value.poster.replace(/-\d+x\d+(?=\.[^.]+$)/, '')
})

const genreIconMap: Record<string, string> = {
  Action: 'bolt',
  Adventure: 'explore',
  Comedy: 'mood',
  Crime: 'gavel',
  Drama: 'theater_comedy',
  Fantasy: 'magic_button',
  Horror: 'dangerous',
  Mystery: 'psychology',
  Romance: 'favorite',
  'Science Fiction': 'computer',
  Thriller: 'visibility',
}

const { data: genreData } = useAsyncData<GenreResponse>('genres', () =>
  $fetch<GenreResponse>('/api/genres', {
    headers: { Accept: 'application/json' }
  }),
  { default: () => ({ success: false, code: 0, message: '', data: [] }) }
)

const { data: drakorData, pending: drakorPending } = useAsyncData<PaginatedResponse>('drakor-home', () =>
  $fetch<PaginatedResponse>('/api/drakor?page=1', {
    headers: { Accept: 'application/json' }
  }),
  { default: () => ({ items: [], meta: { page: 1, totalPages: 1, hasNext: false, hasPrev: false } }) }
)

const drakorItems = computed(() => drakorData.value?.items?.slice(0, 12) || [])

const { data: seriesData } = useAsyncData<{ success: boolean; data: any[] }>('series-latest', () =>
  $fetch('/api/series/latest', {
    headers: { Accept: 'application/json' }
  }),
  { default: () => ({ success: false, data: [] }) }
)

const seriesList = computed(() => {
  return (seriesData.value?.data || []).slice(0, 12)
})

const { data: animeData, pending: animePending } = useAsyncData('anime-home', () =>
  $fetch('/api/anime/v2-home', {
    headers: { Accept: 'application/json' }
  }).then((res: any) => res.data || res),
  { default: () => ({ popularToday: [], latest: [], popularWeekly: [] }) }
)

const animePopularToday = computed(() => (animeData.value?.popularToday || []).slice(0, 6))

const { data: donghuaData, pending: donghuaPending } = useAsyncData('donghua-home', () =>
  $fetch('/api/donghua/home')
    .then((res: any) => {
      const popular = res?.data?.popularToday || []
      const latest = res?.data?.latestRelease || []
      return popular.length > 0 ? popular : latest
    }),
  { default: () => [] }
)

const donghuaList = computed(() => (donghuaData.value || []).slice(0, 6))

const genres = computed(() => {
  return (genreData.value?.data || []).map(g => ({
    name: g.name,
    slug: g.slug,
    icon: genreIconMap[g.name] || 'category'
  }))
})

const showNotification = ref(true)

function closeNotification() {
  showNotification.value = false
}

const showAllGenres = ref(false)
const genreCarousel = ref<HTMLElement | null>(null)

const onCarouselWheel = (e: WheelEvent) => {
  if (genreCarousel.value) {
    genreCarousel.value.scrollLeft += e.deltaY
  }
}

const scrollCarousel = (amount: number) => {
  if (genreCarousel.value) {
    genreCarousel.value.scrollBy({ left: amount, behavior: 'smooth' })
  }
}

useHead({
  title: 'ZeroStream - Streaming Movie & Anime Premium'
})
</script>
