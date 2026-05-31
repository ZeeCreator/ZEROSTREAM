<template>
  <div v-if="pending" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
    <div class="animate-pulse space-y-6">
      <div class="h-8 bg-surface-container-highest rounded w-1/3"></div>
      <div class="h-4 bg-surface-container-highest rounded w-1/2"></div>
      <div class="h-64 bg-surface-container-highest rounded-xl"></div>
    </div>
  </div>
  <div v-else-if="detail" class="pb-section-gap">
    <header class="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden">
      <div class="absolute inset-0 z-0">
        <NuxtImg :src="detail.poster" class="w-full h-full object-cover opacity-30 brightness-50" :alt="detail.title" width="1920" height="1080" loading="eager" />
        <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
      </div>
      <div class="relative z-10 h-full flex flex-col justify-end px-margin-mobile md:px-margin-desktop pb-12 md:pb-16 max-w-container-max mx-auto pt-24">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-40 md:w-56 flex-none -mt-16 md:mt-0">
            <NuxtImg :src="detail.poster" class="w-full rounded-xl shadow-2xl border border-white/10" :alt="detail.title" width="400" height="600" />
          </div>
          <div class="flex-1 space-y-4">
            <div class="flex items-center gap-4">
              <span v-if="detail.type" class="bg-emerald-400/20 text-emerald-400 text-label-caps px-3 py-1 rounded-sm border border-emerald-400/30">
                {{ detail.type }}
              </span>
              <span v-if="detail.rating" class="flex items-center gap-1 text-primary">
                <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1">star</span>
                <span class="font-bold">{{ detail.rating }}</span>
              </span>
            </div>
            <h1 class="font-display-hero text-3xl md:text-display-hero text-on-surface leading-none drop-shadow-lg">
              {{ detail.title }}
            </h1>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-on-surface-variant font-label-md text-label-md">
              <span>{{ detail.released }}</span>
              <span class="w-1 h-1 bg-outline rounded-full"></span>
              <span>{{ detail.duration }}</span>
              <span v-if="detail.season" class="w-1 h-1 bg-outline rounded-full"></span>
              <span v-if="detail.season">{{ detail.season }}</span>
              <span class="text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded">{{ detail.status }}</span>
              <div class="flex gap-2 ml-2">
                <span v-for="g in detail.genres" :key="g.slug" class="bg-surface-container-highest px-3 py-1 rounded-full text-xs">
                  {{ g.name }}
                </span>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-4 pt-4">
              <NuxtLink
                v-if="detail.episodes?.length"
                :to="`/dongwatch/${detail.episodes[0].slug}`"
                class="bg-emerald-400 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
              >
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">play_arrow</span>
                Tonton Episode Terbaru
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-8 space-y-10">
        <section>
          <h2 class="font-headline-md text-headline-md text-emerald-400 mb-6 flex items-center gap-3">
            <span class="w-8 h-[2px] bg-emerald-400"></span>
            Sinopsis
          </h2>
          <p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
            {{ detail.synopsis }}
          </p>
        </section>

        <section v-if="detail.episodes?.length">
          <h2 class="font-headline-md text-headline-md text-emerald-400 mb-6 flex items-center gap-3">
            <span class="w-8 h-[2px] bg-emerald-400"></span>
            Episode ({{ detail.episodes.length }})
          </h2>
          <div class="grid grid-cols-1 gap-3">
            <NuxtLink
              v-for="ep in detail.episodes"
              :key="ep.slug"
              :to="`/dongwatch/${ep.slug}`"
              class="flex items-center gap-4 glass-panel p-4 rounded-xl hover:bg-surface-container transition-all group"
            >
              <div class="w-10 h-10 rounded-full bg-emerald-400/10 flex items-center justify-center text-emerald-400 font-bold">
                {{ ep.number }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-label-md text-label-md text-on-surface group-hover:text-emerald-400 truncate transition-colors">
                  {{ ep.title }}
                </p>
                <p class="text-on-surface-variant text-xs font-label-caps">{{ ep.date }}</p>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant group-hover:text-emerald-400 transition-colors">play_arrow</span>
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
                <span class="material-symbols-outlined text-emerald-400">calendar_month</span>
                <span class="text-on-surface-variant font-label-md text-label-md">Rilis</span>
              </div>
              <span class="text-on-surface font-bold">{{ detail.released || '-' }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-emerald-400">schedule</span>
                <span class="text-on-surface-variant font-label-md text-label-md">Durasi</span>
              </div>
              <span class="text-on-surface font-bold">{{ detail.duration || '-' }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-emerald-400">flag</span>
                <span class="text-on-surface-variant font-label-md text-label-md">Status</span>
              </div>
              <span class="text-on-surface font-bold">{{ detail.status || '-' }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-emerald-400">subtitles</span>
                <span class="text-on-surface-variant font-label-md text-label-md">Fansub</span>
              </div>
              <span class="text-on-surface font-bold">{{ detail.fansub || '-' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-emerald-400">verified</span>
                <span class="text-on-surface-variant font-label-md text-label-md">Rating</span>
              </div>
              <span class="bg-emerald-400/10 text-emerald-400 px-2 py-0.5 rounded font-bold">{{ detail.rating || '-' }}</span>
            </div>
            <div class="pt-2">
              <p class="text-on-surface-variant font-label-md text-label-md mb-2">Genre</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="g in detail.genres" :key="g.slug" class="bg-surface-container-highest px-3 py-1 rounded-full text-xs text-on-surface-variant border border-outline-variant/20">
                  {{ g.name }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div v-if="episodeStats" class="glass-panel p-5 rounded-xl border border-white/5">
          <h3 class="font-label-md text-label-md text-on-surface mb-3">Info Streaming</h3>
          <div class="text-xs text-on-surface-variant space-y-2">
            <p v-if="detail.duration">Durasi: {{ detail.duration }}</p>
            <p v-if="detail.studio">Studio: {{ detail.studio }}</p>
            <p v-if="detail.network">Network: {{ detail.network }}</p>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
interface EpisodeInfo {
  number: string
  title: string
  slug: string
  date: string
}

interface DonghuaDetailWithEpisodes {
  title: string
  slug: string
  poster: string
  rating: number
  status: string
  studio: string | null
  network: string | null
  type: string
  season: string | null
  duration: string
  released: string
  fansub: string
  genres: { name: string; slug: string }[]
  synopsis: string
  episodes: EpisodeInfo[]
}

const route = useRoute()
const slug = route.params.slug as string

const { data, pending } = useAsyncData('donghua-detail-' + slug, () =>
  $fetch(`/api/donghua/detail/${slug}`)
    .then((res: any) => {
      const d = res?.data || res
      return {
        title: d.title || '',
        slug: d.slug || slug,
        poster: d.poster || '',
        rating: d.rating || 0,
        status: d.status || '',
        studio: d.studio || null,
        network: d.network || null,
        type: d.type || '',
        season: d.season || null,
        duration: d.duration || '',
        released: d.released || '',
        fansub: d.fansub || '',
        genres: d.genres || [],
        synopsis: d.synopsis || '',
        episodes: (d.episodes || []).map((ep: any) => ({
          number: ep.number || '',
          title: ep.title || '',
          slug: ep.slug || '',
          date: ep.date || '',
        })),
      }
    }),
  { default: () => null as DonghuaDetailWithEpisodes | null }
)

const detail = computed(() => data.value)
const episodeStats = computed(() => detail.value?.episodes?.length)

useHead({
  title: computed(() => detail.value ? `${detail.value.title} - ZeroStream` : 'Donghua - ZeroStream')
})
</script>
