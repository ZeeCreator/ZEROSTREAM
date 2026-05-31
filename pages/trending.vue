<template>
  <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8 space-y-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h1 class="font-headline-lg text-headline-lg flex items-center gap-2">
        <span class="w-2 h-8 bg-primary rounded-full"></span>
        Trending
      </h1>
      <div class="flex items-center gap-2 bg-surface-container-highest/50 rounded-xl p-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key; currentPage = 1"
          class="px-5 py-2 rounded-lg font-label-md text-label-md transition-all"
          :class="activeTab === tab.key ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    <div v-if="pending && !allItems.length" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
      <div v-for="i in 12" :key="i" class="animate-pulse">
        <div class="aspect-[2/3] rounded-xl bg-surface-container-highest mb-3"></div>
        <div class="h-4 bg-surface-container-highest rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-surface-container-highest rounded w-1/2"></div>
      </div>
    </div>
    <template v-else>
      <div v-if="!paginatedItems.length" class="text-center py-20">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">trending_flat</span>
        <p class="text-on-surface-variant font-body-lg">Tidak ada konten</p>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        <NuxtLink
          v-for="(item, i) in paginatedItems"
          :key="item.id || i"
          :to="item.type === 'tv' ? `/seriesdetail/${item.slug}` : `/moviewatch/${item.slug}`"
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
              {{ item.type === 'tv' ? (item.episodeCount + ' Ep') : (item.quality || 'HD') }}
            </div>
            <div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold"
              :class="item.type === 'tv' ? 'text-cyan-400' : 'text-purple-400'"
            >
              {{ item.type === 'tv' ? 'Series' : 'Movie' }}
            </div>
          </div>
          <p class="mt-3 font-label-md text-label-md text-on-surface group-hover:text-primary truncate transition-colors">
            {{ item.title }}
          </p>
        </NuxtLink>
      </div>
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 mt-6">
        <button
          @click="currentPage > 1 && currentPage--"
          :disabled="currentPage <= 1"
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          :class="currentPage <= 1 ? 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed' : 'bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary'"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="p in pageNumbers"
            :key="p"
            @click="currentPage = p"
            class="w-9 h-9 rounded-lg font-label-md text-label-md transition-all"
            :class="p === currentPage ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'"
          >{{ p }}</button>
        </div>
        <button
          @click="currentPage < totalPages && currentPage++"
          :disabled="currentPage >= totalPages"
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          :class="currentPage >= totalPages ? 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed' : 'bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary'"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem } from '~/types'

const route = useRoute()
const currentPage = ref(Number(route.query.page) || 1)
const activeTab = ref<string>('all')
const perPage = 24

const tabs = [
  { key: 'all', label: 'Semua' },
  { key: 'movie', label: 'Movie' },
  { key: 'tv', label: 'Series' },
]

const { data: trendingRes, pending } = useAsyncData<{ items: ContentItem[] }>('trending', () =>
  $fetch<{ items: ContentItem[] }>('/api/trending?page=1', {
    headers: { Accept: 'application/json' }
  }),
  { default: () => ({ items: [] }) }
)

const allItems = computed(() => trendingRes.value?.items || [])

const filteredItems = computed(() => {
  const items = allItems.value
  if (activeTab.value === 'all') return items
  return items.filter(i => i.type === activeTab.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / perPage)))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredItems.value.slice(start, start + perPage)
})

const pageNumbers = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const cur = currentPage.value
  let start = Math.max(1, cur - 2)
  let end = Math.min(total, cur + 2)
  if (end - start < 4) {
    if (start === 1) end = Math.min(total, start + 4)
    else start = Math.max(1, end - 4)
  }
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

watch(activeTab, () => { currentPage.value = 1 })

watch(currentPage, (val) => {
  navigateTo({ query: { page: val > 1 ? val : undefined } }, { replace: true })
})

onMounted(() => {
  const p = Number(route.query.page)
  if (p > 1) currentPage.value = p
})

useHead({ title: 'Trending - ZeroStream' })
</script>
