<template>
  <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8 space-y-8">
    <div class="max-w-2xl mx-auto w-full">
      <div class="relative">
        <span class="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">search</span>
        <input
          v-model="searchInput"
          ref="searchRef"
          class="w-full bg-surface-container-low border-2 border-outline-variant/30 rounded-2xl py-4 pl-14 pr-12 text-label-md text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary/50 focus:shadow-[0_0_30px_rgba(221,183,255,0.15)] transition-all"
          placeholder="Cari movie, anime, atau series..."
          type="text"
          autofocus
        />
        <button
          v-if="searchInput"
          @click="searchInput = ''"
          class="absolute right-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors"
        >close</button>
      </div>
    </div>
    <div v-if="searchInput && pending" class="flex justify-center py-16">
      <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else-if="searchInput && !allResults.length" class="text-center py-16 space-y-4">
      <span class="material-symbols-outlined text-6xl text-on-surface-variant/30">search_off</span>
      <p class="text-on-surface-variant font-body-lg">Tidak ditemukan hasil untuk "{{ searchInput }}"</p>
    </div>
    <div v-else-if="allResults.length" class="space-y-6">
      <p class="text-on-surface-variant font-label-md">
        {{ allResults.length }} hasil untuk "<span class="text-on-surface font-bold">{{ searchInput }}</span>"
      </p>
      <!-- Filter tabs -->
      <div class="flex items-center gap-3">
        <button
          v-for="tab in filterTabs"
          :key="tab.key"
          @click="activeFilter = tab.key"
          class="px-4 py-2 rounded-lg font-label-md transition-all"
          :class="activeFilter === tab.key ? 'bg-primary text-on-primary' : 'glass-panel text-on-surface-variant hover:text-on-surface'"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <NuxtLink
          v-for="(item, i) in filteredResults"
          :key="item.id || i"
          :to="itemLink(item)"
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
            <div v-if="item.rating" class="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-primary flex items-center gap-0.5">
              <span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1">star</span>
              {{ item.rating }}
            </div>
            <div class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold border"
              :class="item.type === 'tv' ? 'text-secondary border-secondary/30' : 'text-secondary border-secondary/30'"
            >
              {{ itemBadge(item) }}
            </div>
            <div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold"
              :class="typeColor(item)"
            >
              {{ typeLabel(item) }}
            </div>
          </div>
          <p class="mt-3 font-label-md text-label-md text-on-surface group-hover:text-primary truncate transition-colors">
            {{ item.title }}
          </p>
        </NuxtLink>
      </div>
    </div>
    <div v-else class="text-center py-16 space-y-4">
      <span class="material-symbols-outlined text-6xl text-on-surface-variant/30">travel_explore</span>
      <p class="text-on-surface-variant font-body-lg">Mulai ketik untuk mencari movie atau series</p>
    </div>

    <!-- Adult Section -->
    <Transition name="adult">
      <div v-if="adultUnlocked" class="relative overflow-hidden rounded-2xl border-2 border-red-500/30 p-6 md:p-8 space-y-6">
        <div class="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-red-950/10"></div>
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>

        <div class="flex items-start justify-between gap-3 relative z-10">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-3xl text-red-400" style="font-variation-settings: 'FILL' 1">block</span>
            <div>
              <h2 class="font-headline-md text-headline-md text-red-400">Konten 18+</h2>
              <p class="text-label-md text-on-surface-variant">Akses diizinkan — ketik kata kunci untuk menjelajah</p>
            </div>
          </div>
          <button @click="adultUnlocked = false; adultItems = []" class="material-symbols-outlined text-on-surface-variant hover:text-red-400 transition-colors">
            close
          </button>
        </div>

        <div v-if="adultPending" class="flex justify-center py-8 relative z-10">
          <div class="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="!adultItems.length" class="text-center py-8 relative z-10">
          <p class="text-on-surface-variant font-body-md">Tidak ada konten 18+ untuk pencarian ini</p>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter relative z-10">
          <NuxtLink
            v-for="(item, i) in adultItems"
            :key="'adult-'+ (item.id || i)"
            :to="adultItemLink(item)"
            class="group cursor-pointer block"
          >
            <div class="relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-transparent group-hover:border-red-500/50 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_30px_rgba(255,50,50,0.3)]">
              <NuxtImg
                :src="item.poster"
                :alt="item.title"
                class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                loading="lazy"
                width="400"
                height="600"
              />
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <div class="w-12 h-12 rounded-full bg-red-500/90 flex items-center justify-center text-white">
                  <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1">play_arrow</span>
                </div>
              </div>
              <div v-if="item.rating" class="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-red-400 flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1">star</span>
                {{ item.rating }}
              </div>
              <div class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold border border-red-500/30 text-red-400">
                18+
              </div>
              <div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold"
                :class="item.type === 'tv' ? 'text-cyan-400' : item.type === 'anime' ? 'text-green-400' : 'text-purple-400'"
              >
                {{ item.type === 'tv' ? 'Series' : item.type === 'anime' ? 'Anime' : 'Movie' }}
              </div>
            </div>
            <p class="mt-3 font-label-md text-label-md text-on-surface group-hover:text-red-400 truncate transition-colors">
              {{ item.title }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { ContentItem, AnimeV2Item, DonghuaItem } from '~/types'

const route = useRoute()
const router = useRouter()
const searchRef = ref<HTMLInputElement | null>(null)
const searchInput = ref('')
const results = ref<ContentItem[]>([])
const animeResults = ref<AnimeV2Item[]>([])
const donghuaResults = ref<DonghuaItem[]>([])
const pending = ref(false)

const adultItems = ref<ContentItem[]>([])
const adultPending = ref(false)
const adultUnlocked = ref(false)

const activeFilter = ref<'all' | 'movie' | 'anime' | 'series' | 'donghua'>('all')

const filterTabs = [
  { key: 'all' as const, label: 'Semua' },
  { key: 'movie' as const, label: 'Movie' },
  { key: 'anime' as const, label: 'Anime' },
  { key: 'donghua' as const, label: 'Donghua' },
  { key: 'series' as const, label: 'Series' },
]

const allResults = computed(() => {
  const animeSlugs = new Set(animeResults.value.map(a => a.slug))
  const movieSeries = results.value.filter(r => !animeSlugs.has(r.slug)).map(r => ({ ...r, _src: 'v1' as const }))
  const anime = animeResults.value.map(a => ({
    id: a.slug,
    title: a.title,
    slug: a.slug,
    poster: a.poster,
    rating: a.rating || undefined,
    quality: a.quality || undefined,
    type: 'anime' as const,
    year: a.year || undefined,
    episodeCount: a.episode || undefined,
    _src: 'anime' as const,
    link: a.link || undefined,
  }))
  const donghua = donghuaResults.value.map(d => ({
    id: d.slug,
    title: d.title,
    slug: d.slug,
    poster: d.poster,
    rating: undefined,
    quality: undefined,
    type: 'donghua' as const,
    year: undefined,
    episodeCount: d.episode || undefined,
    _src: 'donghua' as const,
  }))
  const seen = new Set<string>()
  return [...anime, ...donghua, ...movieSeries].filter(item => {
    if (seen.has(item.slug)) return false
    seen.add(item.slug)
    return true
  })
})

const filteredResults = computed(() => {
  if (activeFilter.value === 'all') return allResults.value
  return allResults.value.filter(item => item.type === activeFilter.value || (activeFilter.value === 'donghua' && item._src === 'donghua'))
})

const itemLink = (item: any) => {
  if (item._src === 'donghua') {
    const ep = item.episodeCount || ''
    if (ep === 'Ongoing' || ep === 'Completed' || ep === 'Hiatus') return `/dongdetail/${item.slug}`
    return `/dongwatch/${item.slug}`
  }
  if (item._src === 'anime') {
    return item.link?.includes('/anime/') ? `/animedetail/${item.slug}` : `/watch/${item.slug}?type=anime`
  }
  if (item.type === 'tv') return `/seriesdetail/${item.slug}`
  return `/moviewatch/${item.slug}`
}

const itemBadge = (item: any) => {
  if (item._src === 'donghua') return item.episodeCount || 'Donghua'
  if (item._src === 'anime') return item.episodeCount || 'Anime'
  if (item.type === 'tv') return (item.episodeCount || '') + ' Ep'
  return item.quality || 'HD'
}

const typeLabel = (item: any) => {
  if (item._src === 'donghua') return 'Donghua'
  if (item._src === 'anime') return 'Anime'
  return item.type === 'tv' ? 'Series' : 'Movie'
}

const typeColor = (item: any) => {
  if (item._src === 'donghua') return 'text-emerald-400'
  if (item._src === 'anime') return 'text-green-400'
  return item.type === 'tv' ? 'text-cyan-400' : 'text-purple-400'
}

const adultItemLink = (item: any) => {
  if (item._src === 'anime') {
    return item.link?.includes('/anime/') ? `/animedetail/${item.slug}` : `/watch/${item.slug}?type=anime`
  }
  if (item.type === 'tv') return `/seriesdetail/${item.slug}`
  return `/moviewatch/${item.slug}`
}

const queryCache = new Map<string, { results: ContentItem[], anime: AnimeV2Item[], donghua: DonghuaItem[], adult: any[] }>()

const doSearch = useDebounceFn(async (q: string) => {
  if (!q.trim()) {
    results.value = []
    animeResults.value = []
    donghuaResults.value = []
    pending.value = false
    return
  }
  const cached = queryCache.get(q)
  if (cached) {
    results.value = cached.results
    animeResults.value = cached.anime
    donghuaResults.value = cached.donghua
    if (adultUnlocked.value && cached.adult.length) {
      adultItems.value = cached.adult
    }
    return
  }
  pending.value = true
  const [v1, anime, donghua] = await Promise.allSettled([
    $fetch<{ items: ContentItem[] }>(`/api/search?q=${encodeURIComponent(q)}`),
    $fetch<any>(`/api/anime/search?q=${encodeURIComponent(q)}`),
    $fetch<any>(`/api/donghua/search?q=${encodeURIComponent(q)}`),
  ])
  const v1Items = v1.status === 'fulfilled' ? (v1.value.items || []) : []
  const animeData = anime.status === 'fulfilled' ? anime.value : null
  const animeItems = animeData ? (animeData.data || []) as AnimeV2Item[] : []
  const donghuaItems = donghua.status === 'fulfilled' ? (donghua.value?.data?.items || []) as DonghuaItem[] : []

  let adultMapped: any[] = []
  if (adultUnlocked.value && animeData?.adult?.length) {
    adultMapped = animeData.adult.map((a: any) => ({
      id: a.slug,
      title: a.title,
      slug: a.slug,
      poster: a.poster,
      rating: a.rating || undefined,
      quality: a.quality || undefined,
      type: 'anime' as const,
      year: a.year || undefined,
      episodeCount: a.episode || undefined,
      _src: 'anime' as const,
      link: a.link || undefined,
    }))
    adultItems.value = [...adultItems.value, ...adultMapped]
  }

  results.value = v1Items
  animeResults.value = animeItems
  donghuaResults.value = donghuaItems
  pending.value = false

  queryCache.set(q, { results: v1Items, anime: animeItems, donghua: donghuaItems, adult: adultMapped })
  if (queryCache.size > 50) {
    const first = queryCache.keys().next().value
    if (first) queryCache.delete(first)
  }
}, 400)

const adultCache = new Map<string, any[]>()

const doAdultSearch = useDebounceFn(async (q: string) => {
  if (!adultUnlocked.value || !q.trim()) {
    adultItems.value = []
    adultPending.value = false
    return
  }
  const cached = adultCache.get(q)
  if (cached) {
    adultItems.value = cached
    return
  }
  adultPending.value = true
  const [v1Res, animeRes] = await Promise.allSettled([
    $fetch<{ items: ContentItem[] }>(`/api/search?q=${encodeURIComponent(q)}&adult=true`),
    $fetch(`/api/anime/search?q=${encodeURIComponent(q)}`),
  ])
  const v1 = v1Res.status === 'fulfilled' ? (v1Res.value.items || []).map(r => ({ ...r, _src: 'v1' as const })) : []
  const v2 = animeRes.status === 'fulfilled' ? ((animeRes.value as any)?.adult || []).map((a: any) => ({
    id: a.slug,
    title: a.title,
    slug: a.slug,
    poster: a.poster,
    rating: a.rating || undefined,
    quality: a.quality || undefined,
    type: 'anime' as const,
    year: a.year || undefined,
    episodeCount: a.episode || undefined,
    _src: 'anime' as const,
    link: a.link || undefined,
  })) : []
  const seen = new Set(adultItems.value.map(i => i.slug))
  const merged = [...adultItems.value, ...v1, ...v2].filter(i => {
    if (seen.has(i.slug)) return false
    seen.add(i.slug)
    return true
  })
  adultItems.value = merged
  adultPending.value = false

  adultCache.set(q, merged)
  if (adultCache.size > 20) {
    const first = adultCache.keys().next().value
    if (first) adultCache.delete(first)
  }
}, 400)

watch(searchInput, (val) => {
  const trimmed = val.trim()
  const newPath = val ? `/search?q=${encodeURIComponent(val)}` : '/search'
  router.replace(newPath, { replace: true })

  if (trimmed.toLowerCase() === 'kucingpeduli.ea' && !adultUnlocked.value) {
    adultUnlocked.value = true
  }

  doSearch(trimmed)
  doAdultSearch(trimmed)
})

onMounted(() => {
  const q = route.query.q as string
  if (q) {
    searchInput.value = q
    if (q.trim().toLowerCase() === 'kucingpeduli.ea') {
      adultUnlocked.value = true
    }
    doSearch(q.trim())
    if (adultUnlocked.value) doAdultSearch(q.trim())
  }
})

useHead({
  title: computed(() => searchInput.value ? `"${searchInput.value}" - Pencarian ZeroStream` : 'Pencarian - ZeroStream')
})
</script>

<style scoped>
.adult-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.adult-leave-active {
  transition: all 0.3s ease-in;
}
.adult-enter-from {
  opacity: 0;
  transform: scale(0.85) rotateX(-8deg);
  filter: blur(8px);
}
.adult-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
