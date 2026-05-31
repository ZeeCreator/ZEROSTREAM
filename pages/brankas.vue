<template>
  <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8 space-y-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <span class="material-symbols-outlined text-red-400" style="font-variation-settings: 'FILL' 1">lock_open</span>
        </div>
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface">Brankas</h1>
          <p class="text-on-surface-variant font-label-md">Konten dewasa 18+</p>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative max-w-2xl">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">search</span>
      <input
        v-model="searchQ"
        class="w-full bg-surface-container-low border-2 border-outline-variant/30 rounded-xl py-3 pl-12 pr-10 text-label-md text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-red-400/50 focus:shadow-[0_0_20px_rgba(255,50,50,0.1)] transition-all"
        placeholder="Cari di brankas..."
      />
      <button v-if="searchQ" @click="searchQ = ''" class="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant hover:text-on-surface">close</button>
    </div>

    <div v-if="pending" class="flex justify-center py-8">
      <div class="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="items.length === 0" class="text-center py-12">
      <span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">block</span>
      <p class="text-on-surface-variant font-body-lg">Tidak ada konten</p>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
      <NuxtLink
        v-for="(item, i) in items"
        :key="i"
        :to="item._src === 'anime' ? (item.link?.includes('/anime/') ? `/animedetail/${item.slug}` : `/watch/${item.slug}?type=anime`) : item.type === 'tv' ? `/seriesdetail/${item.slug}` : `/moviewatch/${item.slug}`"
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
          <div class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold border border-red-500/30 text-red-400">18+</div>
          <div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold"
            :class="item.type === 'tv' ? 'text-cyan-400' : item.type === 'anime' ? 'text-green-400' : 'text-purple-400'"
          >
            {{ item.type === 'tv' ? 'Series' : item.type === 'anime' ? 'Anime' : 'Movie' }}
          </div>
        </div>
        <p class="mt-3 font-label-md text-label-md text-on-surface group-hover:text-red-400 truncate transition-colors">{{ item.title }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { ContentItem, AnimeV2Item } from '~/types'

const searchQ = ref('')
const items = ref<(ContentItem & { _src?: string })[]>([])
const pending = ref(false)

let hentaiAnime: AnimeV2Item[] = []

const loadItems = useDebounceFn(async (q?: string) => {
  pending.value = true
  try {
    const query = q?.trim() || ''
    const [v1Res] = await Promise.all([
      $fetch<{ items: ContentItem[] }>(`/api/search?q=${encodeURIComponent(query || 'a')}&adult=true`, {
        headers: { Accept: 'application/json' }
      }),
    ])
    const v1 = (v1Res.items || []).filter(i => i.poster)

    if (hentaiAnime.length === 0) {
      const res = await $fetch('/api/anime/v2-hentai', {
        headers: { Accept: 'application/json' }
      }).then((r: any) => r.data || [])
      hentaiAnime = res
    }
    const v2Anime = hentaiAnime.map(a => ({
      id: a.slug,
      title: a.title,
      slug: a.slug,
      poster: a.poster,
      rating: a.rating || undefined,
      type: 'anime' as const,
      _src: 'anime' as const,
      link: a.link || undefined,
    }))

    const all = [...v1, ...v2Anime]
    if (query) {
      const ql = query.toLowerCase()
      items.value = all.filter(i => i.title.toLowerCase().includes(ql))
    } else {
      items.value = all
    }
  } catch {
    items.value = []
  } finally {
    pending.value = false
  }
}, 300)

watch(searchQ, (val) => {
  loadItems(val)
})

onMounted(() => {
  loadItems()
})

useHead({ title: 'Brankas - ZeroStream' })
</script>
