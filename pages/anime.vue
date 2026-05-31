<template>
  <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <SectionHeading title="Daftar Anime" />
      <div class="relative w-full md:w-72">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari anime..."
          class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-10 py-2.5 text-label-md text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
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
      <p class="text-on-surface-variant font-body-lg">Gagal memuat daftar anime</p>
      <button @click="refresh" class="mt-4 bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md hover:scale-105 transition-transform">Coba Lagi</button>
    </div>

    <template v-else>
      <div v-if="filteredList.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">search_off</span>
        <p class="text-on-surface-variant font-body-lg">Anime tidak ditemukan</p>
        <p class="text-on-surface-variant/60 font-body-md text-sm mt-1">Coba kata kunci lain</p>
      </div>
      <template v-else>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
          <div
            v-for="(item, i) in filteredList"
            :key="i"
            class="group cursor-pointer block"
            @click="navigateTo(item.link?.includes('/anime/') ? `/animedetail/${item.slug}` : `/watch/${item.slug}?type=anime`)"
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
              <div class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-secondary border border-secondary/30">
                {{ item.episode === 'Ongoing' ? 'Ongoing' : item.type }}
              </div>
            </div>
            <p class="mt-3 font-label-md text-label-md text-on-surface group-hover:text-primary truncate transition-colors">
              {{ item.title }}
            </p>
            <p class="text-on-surface-variant font-label-caps text-label-caps truncate">{{ item.episode }}</p>
          </div>
        </div>
        <div class="flex items-center justify-center gap-4 mt-10">
          <button
            :disabled="!hasPrev"
            @click="goToPage(currentPage - 1)"
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            :class="hasPrev ? 'bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary' : 'bg-surface-container-low text-on-surface-variant/50'"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <span class="text-label-md text-on-surface-variant">Halaman {{ currentPage }} / {{ totalPages }}</span>
          <button
            :disabled="!hasNext"
            @click="goToPage(currentPage + 1)"
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            :class="hasNext ? 'bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary' : 'bg-surface-container-low text-on-surface-variant/50'"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AnimeV2Item } from '~/types'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const currentPage = computed(() => Number(route.query.page) || 1)

const { data, pending, error, refresh } = useAsyncData<{
  data: AnimeV2Item[]
  meta: { page: number; totalPages: number; hasNext: boolean; hasPrev: boolean }
}>('anime-list-' + currentPage.value, () =>
  $fetch(`/api/anime/v2-list?page=${currentPage.value}`, {
    headers: { Accept: 'application/json' }
  }),
  {
    default: () => ({ data: [], meta: { page: 1, totalPages: 1, hasNext: false, hasPrev: false } }),
    watch: [currentPage],
  }
)

const animeList = computed(() => data.value?.data || [])
const totalPages = computed(() => data.value?.meta?.totalPages || 1)
const hasPrev = computed(() => currentPage.value > 1)
const hasNext = computed(() => currentPage.value < totalPages.value)

const filteredList = computed(() => {
  const list = animeList.value
  if (!searchQuery.value) return list
  const q = searchQuery.value.toLowerCase()
  return list.filter(item => item.title.toLowerCase().includes(q))
})

const goToPage = (page: number) => {
  router.push({ path: '/anime', query: { page: page > 1 ? page : undefined } })
}

useHead({ title: 'Anime - ZeroStream' })
</script>
