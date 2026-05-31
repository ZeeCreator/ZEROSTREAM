<template>
  <div v-if="pending" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
    <div class="animate-pulse">
      <div class="aspect-video bg-surface-container-highest rounded-xl mb-8"></div>
      <div class="h-8 bg-surface-container-highest rounded w-1/3 mb-4"></div>
    </div>
  </div>
  <div v-else-if="episode" class="pb-section-gap">
    <section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div class="lg:col-span-8 xl:col-span-9 space-y-6">
          <div class="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
            <iframe
              v-if="selectedEmbed"
              :key="selectedEmbed"
              :src="selectedEmbed"
              class="w-full h-full"
              allowfullscreen
              allow="autoplay; encrypted-media"
            ></iframe>
            <div v-else class="w-full h-full flex items-center justify-center text-on-surface-variant">
              <div class="text-center">
                <span class="material-symbols-outlined text-5xl mb-2 block">play_circle</span>
                <p class="font-body-lg">Tidak ada server tersedia</p>
              </div>
            </div>
          </div>

          <div v-if="episode.streamServers?.length" class="flex items-center gap-3">
            <span class="material-symbols-outlined text-on-surface-variant text-lg">cast</span>
            <select
              v-model="selectedServerIndex"
              class="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-label-md text-on-surface focus:outline-none focus:border-emerald-400/50 cursor-pointer min-w-[200px]"
            >
              <option
                v-for="s in episode.streamServers"
                :key="s.index"
                :value="s.index"
              >
                {{ s.name }}
              </option>
            </select>
          </div>

          <div class="space-y-4">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 class="font-headline-lg text-headline-lg text-on-surface mb-2">{{ episode.title }}</h1>
                <div class="flex flex-wrap items-center gap-3">
                  <span v-if="episode.seriesInfo?.rating" class="text-primary flex items-center gap-1 font-label-md text-label-md">
                    <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1">star</span>
                    {{ episode.seriesInfo.rating }}
                  </span>
                  <span class="text-on-surface-variant font-label-md text-label-md">{{ episode.releaseDate }}</span>
                </div>
                <p v-if="episode.seriesTitle" class="text-emerald-400 font-label-md text-label-md mt-2 inline-block">
                  {{ episode.seriesTitle }}
                </p>
                <p v-else-if="episode.seriesInfo?.title" class="text-emerald-400 font-label-md text-label-md mt-2 inline-block">
                  {{ episode.seriesInfo.title }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <NuxtLink
                v-if="episode.prevEpisode?.slug"
                :to="`/dongwatch/${episode.prevEpisode.slug}`"
                class="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl hover:bg-surface-container transition-all text-label-md"
              >
                <span class="material-symbols-outlined text-lg">chevron_left</span>
                Episode Sebelumnya
              </NuxtLink>
              <NuxtLink
                v-if="episode.nextEpisode?.slug"
                :to="`/dongwatch/${episode.nextEpisode.slug}`"
                class="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl hover:bg-surface-container transition-all text-label-md"
              >
                Episode Selanjutnya
                <span class="material-symbols-outlined text-lg">chevron_right</span>
              </NuxtLink>
            </div>

            <div v-if="episode.downloads?.length">
              <h3 class="font-headline-md text-headline-md mb-4 text-emerald-400">Download</h3>
              <div class="space-y-4">
                <div v-for="group in episode.downloads" :key="group.title" class="space-y-3">
                  <p class="font-headline-md text-headline-md text-on-surface">{{ group.title }}</p>
                  <div v-for="quality in group.qualities" :key="quality.quality" class="space-y-2">
                    <p class="font-label-md text-label-md text-on-surface-variant">{{ quality.quality }}</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        v-for="(link, i) in quality.links"
                        :key="i"
                        :href="link.url"
                        target="_blank"
                        rel="noopener"
                        class="glass-panel px-4 py-2.5 rounded-xl flex items-center gap-3 hover:bg-emerald-400/10 hover:border-emerald-400/30 border border-outline-variant/20 transition-all group"
                      >
                        <span class="material-symbols-outlined text-emerald-400 text-lg">download</span>
                        <span class="font-label-md text-label-md text-on-surface group-hover:text-emerald-400 transition-colors truncate">{{ link.provider }}</span>
                        <span class="material-symbols-outlined text-on-surface-variant group-hover:text-emerald-400 text-lg ml-auto">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside class="lg:col-span-4 xl:col-span-3 space-y-6">
          <div v-if="episode.seriesInfo" class="glass-panel rounded-2xl p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-16 h-20 rounded-lg overflow-hidden flex-none">
                <NuxtImg :src="episode.seriesInfo.poster || episode.poster" class="w-full h-full object-cover" :alt="episode.seriesInfo.title" width="64" height="80" />
              </div>
              <div>
                <p class="font-label-md text-label-md text-on-surface">{{ episode.seriesInfo.title }}</p>
                <p class="text-xs text-on-surface-variant mt-1">Episode {{ episode.episodeNumber }}</p>
              </div>
            </div>
            <NuxtLink
              :to="`/dongdetail/${episode.slug?.replace(/-episode-\d+.*/, '') || episode.seriesSlug}`"
              class="w-full text-center block py-2 rounded-lg bg-emerald-400/10 text-emerald-400 font-label-md hover:bg-emerald-400/20 transition-all"
            >
              Lihat Detail Series
            </NuxtLink>
          </div>

          <div class="glass-panel rounded-2xl overflow-hidden group">
            <div class="p-4 bg-gradient-to-r from-emerald-400/20 to-primary/20 border-b border-white/5">
              <span class="text-label-caps font-label-caps text-emerald-400">Navigasi Episode</span>
            </div>
            <div class="p-4 space-y-3">
              <NuxtLink
                v-if="episode.prevEpisode?.slug"
                :to="`/dongwatch/${episode.prevEpisode.slug}`"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-all"
              >
                <span class="material-symbols-outlined text-emerald-400">skip_previous</span>
                <span class="text-label-md text-label-md text-on-surface">Episode Sebelumnya</span>
              </NuxtLink>
              <NuxtLink
                v-if="episode.nextEpisode?.slug"
                :to="`/dongwatch/${episode.nextEpisode.slug}`"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-all"
              >
                <span class="material-symbols-outlined text-emerald-400">skip_next</span>
                <span class="text-label-md text-label-md text-on-surface">Episode Selanjutnya</span>
              </NuxtLink>
              <p v-if="!episode.prevEpisode?.slug && !episode.nextEpisode?.slug" class="text-on-surface-variant text-center py-4 font-body-md">
                Hanya 1 episode tersedia
              </p>
            </div>
          </div>

          <div v-if="episode.seriesInfo?.genres?.length" class="glass-panel rounded-2xl p-5">
            <h3 class="font-label-md text-label-md text-on-surface mb-3">Genre</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="g in episode.seriesInfo.genres" :key="g.slug" class="bg-surface-container-highest px-3 py-1 rounded-full text-xs text-on-surface-variant border border-outline-variant/20">
                {{ g.name }}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { DonghuaEpisodeData } from '~/types'

const route = useRoute()
const slug = computed(() => route.params.id as string)

const { data, pending } = useAsyncData<DonghuaEpisodeData>(
  () => `watch-donghua-${slug.value}`,
  () => $fetch(`/api/donghua/episode/${slug.value}`)
    .then((res: any) => res?.data || null),
  { default: () => null, lazy: true, watch: [slug] }
)

const episode = computed(() => data.value || null)

const selectedServerIndex = ref(1)

const selectedEmbed = computed(() => {
  const ep = episode.value
  if (!ep) return null
  const server = ep.streamServers?.find((s: any) => s.index === selectedServerIndex.value)
  return server?.embed || ep.currentEmbed || null
})

useHead({
  title: computed(() => episode.value ? `Nonton ${episode.value.title} - ZeroStream` : 'Nonton - ZeroStream')
})
</script>
