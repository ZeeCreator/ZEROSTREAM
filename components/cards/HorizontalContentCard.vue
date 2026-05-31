<template>
  <NuxtLink :to="link" class="flex-none w-[300px] md:w-[380px] snap-start group cursor-pointer block">
    <div class="relative rounded-2xl overflow-hidden mb-3 aspect-[16/9] border-2 border-transparent group-hover:border-secondary transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(76,215,246,0.3)]">
      <NuxtImg
        :src="item?.poster || 'https://placehold.co/640x360/1e1f26/ddb7ff?text=ZeroStream'"
        :alt="item?.title"
        class="w-full h-full object-cover"
        loading="lazy"
        width="640"
        height="360"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div class="absolute bottom-3 md:bottom-4 left-3 md:left-4">
        <span v-if="badge" class="bg-secondary text-on-secondary px-2 py-1 rounded text-[10px] font-bold">{{ badge }}</span>
      </div>
    </div>
    <h3 class="font-headline-md text-body-lg text-on-surface group-hover:text-secondary transition-colors truncate">
      {{ item?.title }}
    </h3>
    <p class="text-on-surface-variant font-label-md text-label-md">{{ subtitle }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ContentItem } from '~/types'

const props = defineProps<{
  item: ContentItem
  badge?: string
  subtitle?: string
  link?: string
}>()

const link = computed(() => {
  if (props.link) return props.link
  return `/${props.item.type}/${props.item.slug}`
})
</script>
