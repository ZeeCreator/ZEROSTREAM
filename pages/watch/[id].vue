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
          <!-- Player -->
          <div class="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
            <iframe
              v-if="selectedServer"
              :src="selectedServer.url"
              class="w-full h-full"
              allowfullscreen
              allow="autoplay; encrypted-media"
            ></iframe>
            <div v-else class="w-full h-full flex items-center justify-center text-on-surface-variant">
              <div class="text-center">
                <span class="material-symbols-outlined text-5xl mb-2 block">play_circle</span>
                <p class="font-body-lg">Pilih server untuk memulai</p>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="space-y-4">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 class="font-headline-lg text-headline-lg text-on-surface mb-2">{{ episode.title }}</h1>
                <div class="flex flex-wrap items-center gap-3">
                  <span class="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-0.5 rounded text-label-caps font-label-caps">{{ episode.type }}</span>
                  <span v-if="episode.rating" class="text-primary flex items-center gap-1 font-label-md text-label-md">
                    <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1">star</span>
                    {{ episode.rating }}
                  </span>
                  <span class="text-on-surface-variant font-label-md text-label-md">{{ episode.releaseDate }}</span>
                </div>
                <NuxtLink :to="`/animedetail/${episode.seriesSlug}`" class="text-primary font-label-md text-label-md hover:underline mt-2 inline-block">
                  {{ episode.seriesTitle }}
                </NuxtLink>
              </div>
              <div class="flex items-center gap-2">
                <button class="p-3 glass-panel rounded-xl hover:text-primary transition-colors">
                  <span class="material-symbols-outlined">share</span>
                </button>
                <button class="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary font-label-md text-label-md rounded-xl glow-primary transition-all">
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">add</span>
                  Favorit
                </button>
              </div>
            </div>

            <!-- Prev / Next -->
            <div class="flex items-center gap-4">
              <NuxtLink
                v-if="episode.prevEpisode?.slug"
                :to="`/watch/${episode.prevEpisode.slug}`"
                class="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl hover:bg-surface-container transition-all text-label-md"
              >
                <span class="material-symbols-outlined text-lg">chevron_left</span>
                Episode {{ episode.prevEpisode.title || 'Sebelumnya' }}
              </NuxtLink>
              <NuxtLink
                v-if="episode.nextEpisode?.slug"
                :to="`/watch/${episode.nextEpisode.slug}`"
                class="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl hover:bg-surface-container transition-all text-label-md"
              >
                Episode {{ episode.nextEpisode.title || 'Selanjutnya' }}
                <span class="material-symbols-outlined text-lg">chevron_right</span>
              </NuxtLink>
            </div>

            <!-- Server Selection -->
            <div v-if="episode.streamServers?.length">
              <h3 class="font-headline-md text-headline-md text-primary mb-4">Pilih Server</h3>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="server in episode.streamServers"
                  :key="server.index"
                  @click="selectServer(server)"
                  class="px-6 py-3 rounded-lg font-label-md transition-all"
                  :class="selectedServer?.url === server.url ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(221,183,255,0.3)]' : 'glass-panel border border-outline-variant/30 text-on-surface-variant hover:bg-primary/20 hover:border-primary hover:text-primary'"
                >
                  <span class="material-symbols-outlined text-lg mr-2" style="font-variation-settings: 'FILL' 1">play_circle</span>
                  {{ server.name }}
                </button>
              </div>
            </div>

            <!-- Downloads -->
            <div v-if="episode.downloads?.length">
              <h3 class="font-headline-md text-headline-md mb-4 text-primary">Download</h3>
              <div class="space-y-4">
                <div v-for="group in episode.downloads" :key="group.quality">
                  <p class="font-label-md text-label-md text-on-surface mb-2">{{ group.quality }}</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      v-for="(link, i) in group.links"
                      :key="i"
                      :href="link.url"
                      target="_blank"
                      rel="noopener"
                      class="glass-panel px-4 py-2.5 rounded-xl flex items-center gap-3 hover:bg-primary/10 hover:border-primary/30 border border-outline-variant/20 transition-all group"
                    >
                      <span class="material-symbols-outlined text-secondary text-lg">download</span>
                      <span class="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors truncate">{{ link.provider }}</span>
                      <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-lg ml-auto">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="lg:col-span-4 xl:col-span-3 space-y-6">
          <div class="glass-panel rounded-2xl p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-16 h-20 rounded-lg overflow-hidden flex-none">
                <NuxtImg :src="episode.poster" class="w-full h-full object-cover" :alt="episode.seriesTitle" width="64" height="80" />
              </div>
              <div>
                <p class="font-label-md text-label-md text-on-surface">{{ episode.seriesTitle }}</p>
                <p class="text-xs text-on-surface-variant mt-1">Episode {{ episode.episodeNumber }}</p>
              </div>
            </div>
            <NuxtLink
              :to="`/animedetail/${episode.seriesSlug}`"
              class="w-full text-center block py-2 rounded-lg bg-primary/10 text-primary font-label-md hover:bg-primary/20 transition-all"
            >
              Lihat Detail Series
            </NuxtLink>
          </div>

          <div class="glass-panel rounded-2xl overflow-hidden group">
            <div class="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/5">
              <span class="text-label-caps font-label-caps text-primary">Navigasi Episode</span>
            </div>
            <div class="p-4 space-y-3">
              <NuxtLink
                v-if="episode.prevEpisode?.slug"
                :to="`/watch/${episode.prevEpisode.slug}`"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-all"
              >
                <span class="material-symbols-outlined text-primary">skip_previous</span>
                <span class="text-label-md text-label-md text-on-surface">Episode Sebelumnya</span>
              </NuxtLink>
              <NuxtLink
                v-if="episode.nextEpisode?.slug"
                :to="`/watch/${episode.nextEpisode.slug}`"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-all"
              >
                <span class="material-symbols-outlined text-primary">skip_next</span>
                <span class="text-label-md text-label-md text-on-surface">Episode Selanjutnya</span>
              </NuxtLink>
              <p v-if="!episode.prevEpisode?.slug && !episode.nextEpisode?.slug" class="text-on-surface-variant text-center py-4 font-body-md">
                Hanya 1 episode tersedia
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AnimeV2EpisodeWatch, AnimeV2StreamServer } from '~/types'

const route = useRoute()
const slug = route.params.id as string

const { data, pending } = useAsyncData<AnimeV2EpisodeWatch>('watch-episode-' + slug, () =>
  $fetch(`/api/anime/v2-episode/${slug}`, {
    headers: { Accept: 'application/json' }
  }).then((res: any) => res.data || null),
  { default: () => null }
)

const episode = computed(() => data.value || null)

const selectedServer = ref<AnimeV2StreamServer | null>(null)

const selectServer = (server: AnimeV2StreamServer) => {
  selectedServer.value = server
}

useHead({
  title: computed(() => episode.value ? `Nonton ${episode.value.title} - ZeroStream` : 'Nonton - ZeroStream')
})
</script>
