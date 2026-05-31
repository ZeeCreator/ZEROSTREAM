<template>
  <NuxtLink :to="link" class="group cursor-pointer block">
    <div class="relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_30px_rgba(221,183,255,0.4)]">
      <NuxtImg
        :src="item?.poster || 'https://placehold.co/400x600/1e1f26/ddb7ff?text=ZeroStream'"
        :alt="item?.title"
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
      <div v-if="item?.rating" class="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-primary">
        {{ item.rating }}
      </div>
      <div v-if="item?.episodeCount" class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-secondary">
        {{ item.episodeCount }} Ep
      </div>
      <div v-else-if="item?.quality" class="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-secondary border border-secondary/30">
        {{ item.quality }}
      </div>
    </div>
    <p class="mt-3 font-label-md text-label-md text-on-surface group-hover:text-primary truncate transition-colors">
      {{ item?.title }}
    </p>
    <p v-if="item?.year" class="text-on-surface-variant font-label-caps text-label-caps">
      {{ item.year }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ContentItem } from '~/types'

const props = defineProps<{
  item: ContentItem
  link?: string
}>()

const link = computed(() => {
  if (props.link) return props.link
  return `/${props.item.type}/${props.item.slug}`
})
</script>
