<template>
  <div v-if="pending && !detail" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
    <div class="animate-pulse">
      <div class="aspect-video bg-surface-container-highest rounded-xl mb-8"></div>
      <div class="h-8 bg-surface-container-highest rounded w-1/3 mb-4"></div>
    </div>
  </div>
  <div v-else class="pb-section-gap">
    <section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div class="lg:col-span-8 xl:col-span-9 space-y-6">
          <div class="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
            <iframe
              v-if="selectedSource"
              :src="selectedSource.url"
              class="w-full h-full"
              allowfullscreen
              allow="autoplay; encrypted-media"
            ></iframe>
            <div v-else class="w-full h-full flex items-center justify-center bg-surface-container-high">
              <div class="text-center">
                <span class="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">play_circle</span>
                <p class="text-on-surface-variant font-body-md">Pilih server untuk memutar</p>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 class="font-headline-lg text-headline-lg text-on-surface mb-2">{{ detail?.title }} {{ currentEp ? '- ' + currentEp.episode : '' }}</h1>
                <div class="flex flex-wrap items-center gap-3">
                  <span class="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-0.5 rounded text-label-caps font-label-caps">{{ detail?.quality || 'HD' }}</span>
                  <span class="text-primary flex items-center gap-1 font-label-md text-label-md">
                    <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1">star</span>
                    {{ detail?.rating || '' }} Rating
                  </span>
                  <span class="text-on-surface-variant font-label-md">{{ detail?.episodeCount }} Episode</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button class="p-3 glass-panel rounded-xl hover:text-primary transition-colors">
                  <span class="material-symbols-outlined">thumb_up</span>
                </button>
                <button class="p-3 glass-panel rounded-xl hover:text-primary transition-colors">
                  <span class="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>
            <!-- Server Selection -->
            <div v-if="sourcesLoading" class="text-on-surface-variant font-label-md">Memuat server...</div>
            <div v-else-if="watchSources.length">
              <div class="flex items-center mb-3">
                <span class="text-on-surface-variant font-label-md">Pilih Server</span>
              </div>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="(src, i) in watchSources"
                  :key="i"
                  @click="selectSource(src)"
                  class="px-5 py-2.5 rounded-lg font-label-md text-label-md transition-all"
                  :class="selectedSource?.url === src.url ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(221,183,255,0.3)]' : 'glass-panel border border-outline-variant/30 text-on-surface-variant hover:bg-primary/20 hover:border-primary hover:text-primary'"
                >
                  <span class="material-symbols-outlined text-lg mr-2" style="font-variation-settings: 'FILL' 1">play_circle</span>
                  {{ src.server }}
                </button>
              </div>
            </div>
            <div v-else-if="!sourcesLoading && currentEp" class="text-on-surface-variant font-label-md">Tidak ada server tersedia untuk episode ini.</div>
            <div class="glass-panel p-6 rounded-2xl">
              <h3 class="font-headline-md text-headline-md mb-4 text-primary">Sinopsis</h3>
              <p class="text-on-surface-variant font-body-lg text-body-lg leading-relaxed">{{ detail?.description || 'Tidak ada sinopsis tersedia.' }}</p>
            </div>
          </div>
        </div>
        <aside class="lg:col-span-4 xl:col-span-3 space-y-6">
          <div class="glass-panel rounded-2xl p-5" style="height: 600px; display: flex; flex-direction: column;">
            <div class="mb-4">
              <div class="flex items-center justify-between">
                <h2 class="font-headline-md text-headline-md">Episode</h2>
                <span class="text-on-surface-variant font-label-md">{{ detail?.episodes?.length || 0 }} Total</span>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto pr-2 space-y-2 hide-scrollbar">
              <button
                v-for="(ep, i) in detail?.episodes || []"
                :key="i"
                @click="selectEpisode(ep)"
                class="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                :class="currentEp?.slug === ep.slug ? 'bg-primary/10 border border-primary/30' : 'hover:bg-surface-container-high border border-transparent'"
              >
                <div class="w-16 h-10 rounded-lg overflow-hidden flex-none bg-surface-container-high flex items-center justify-center">
                  <span class="material-symbols-outlined text-on-surface-variant text-lg" :class="currentEp?.slug === ep.slug ? 'text-primary' : ''" style="font-variation-settings: 'FILL' 1">play_arrow</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-label-md truncate" :class="currentEp?.slug === ep.slug ? 'text-primary' : 'text-on-surface'">{{ ep.title }}</p>
                  <p class="text-[10px] text-on-surface-variant font-label-caps">{{ ep.episode }}</p>
                </div>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>

<script setup lang="ts">
import type { SeriesDetailResponse, WatchSource } from '~/types'

const route = useRoute()
const slug = route.params.slug as string
const selectedSource = ref<WatchSource | null>(null)
const currentEp = ref<{ title: string; slug: string; episode: string } | null>(null)
const watchSources = ref<WatchSource[]>([])
const sourcesLoading = ref(false)

const { data: seriesRes, pending } = useAsyncData<SeriesDetailResponse>('watchseries-detail-' + slug, () =>
  $fetch<SeriesDetailResponse>(`/api/series/detail/${slug}`, {
    headers: { Accept: 'application/json' }
  }),
  { default: () => null }
)

const detail = computed(() => seriesRes.value?.data || null)

const fetchEpisodeSources = async (epSlug: string) => {
  sourcesLoading.value = true
  selectedSource.value = null
  watchSources.value = []
  try {
    const res = await $fetch<{ success: boolean; data: WatchSource[] }>(`/api/stream-series/${epSlug}`, {
      headers: { Accept: 'application/json' }
    })
    watchSources.value = res.data || []
    if (watchSources.value.length) {
      selectedSource.value = watchSources.value[0]
    }
  } catch {
    watchSources.value = []
  } finally {
    sourcesLoading.value = false
  }
}

const selectSource = (src: WatchSource) => {
  selectedSource.value = src
}

const selectEpisode = async (ep: { title: string; slug: string; episode: string }) => {
  currentEp.value = ep
  await fetchEpisodeSources(ep.slug)
}

watch(detail, (val) => {
  if (!val || !val.episodes?.length) return
  const epSlug = route.query.ep as string | undefined
  let found = epSlug ? val.episodes.find(e => e.slug === epSlug) : null
  if (!found) found = val.episodes[0]
  currentEp.value = found
  fetchEpisodeSources(found.slug)
}, { immediate: true })

useHead({
  title: computed(() => detail.value ? `${detail.value.title} - ZeroStream` : 'Nonton Series - ZeroStream')
})
</script>
