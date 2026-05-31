<template>
  <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
    <SectionHeading title="Favorit Saya" />
    <div v-if="watchlist.length === 0" class="text-center py-20">
      <span class="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">bookmark</span>
      <p class="text-on-surface-variant font-body-lg mb-2">Belum ada favorit</p>
      <p class="text-on-surface-variant/60 font-body-md">Tambahkan anime atau movie ke favoritmu</p>
      <NuxtLink to="/" class="inline-block mt-6 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md hover:scale-105 transition-transform">
        Jelajahi Sekarang
      </NuxtLink>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
      <ContentCard v-for="(item, i) in watchlist" :key="i" :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem } from '~/types'

const watchlist = ref<ContentItem[]>([])

useHead({ title: 'Favorit - ZeroStream' })
</script>
