<template>
  <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
    <h1 class="font-headline-lg text-headline-lg flex items-center gap-2 mb-8">
      <span class="w-2 h-8 bg-red-400 rounded-full"></span>
      Daftar Drakor
    </h1>
    <div v-if="pending && !drakorItems.length" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
      <div v-for="i in 12" :key="i" class="animate-pulse">
        <div class="aspect-[2/3] rounded-xl bg-surface-container-highest mb-3"></div>
        <div class="h-4 bg-surface-container-highest rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-surface-container-highest rounded w-1/2"></div>
      </div>
    </div>
    <div v-else-if="!drakorItems.length" class="text-center py-20">
      <span class="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">tv</span>
      <p class="text-on-surface-variant font-body-lg">Tidak ada drakor</p>
    </div>
    <div v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
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
      <div class="flex items-center justify-center gap-4 mt-10">
        <button
          :disabled="!hasPrev"
          @click="goToPage(currentPage - 1)"
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          :class="hasPrev ? 'bg-surface-container-highest text-on-surface hover:bg-red-400 hover:text-white' : 'bg-surface-container-low text-on-surface-variant/50'"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <span class="text-label-md text-on-surface-variant">Halaman {{ currentPage }} / {{ totalPages }}</span>
        <button
          :disabled="!hasNext"
          @click="goToPage(currentPage + 1)"
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          :class="hasNext ? 'bg-surface-container-highest text-on-surface hover:bg-red-400 hover:text-white' : 'bg-surface-container-low text-on-surface-variant/50'"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaginatedResponse } from '~/types'

const route = useRoute()
const router = useRouter()
const currentPage = computed(() => Number(route.query.page) || 1)
const drakorKey = computed(() => 'drakor-' + currentPage.value)

const { data: drakorData, pending } = useAsyncData<PaginatedResponse>(drakorKey, () =>
  $fetch<PaginatedResponse>(`/api/drakor?page=${currentPage.value}`, {
    headers: { Accept: 'application/json' }
  }),
  {
    default: () => ({ items: [], meta: { page: 1, totalPages: 1, hasNext: false, hasPrev: false } }),
    watch: [currentPage],
  }
)

const totalPages = computed(() => drakorData.value?.meta?.totalPages || 1)
const hasPrev = computed(() => currentPage.value > 1)
const hasNext = computed(() => currentPage.value < totalPages.value)
const drakorItems = computed(() => drakorData.value?.items || [])

const goToPage = (page: number) => {
  router.push({ path: '/drakor', query: { page: page > 1 ? page : undefined } })
}

useHead({ title: 'Drakor - ZeroStream' })
</script>
