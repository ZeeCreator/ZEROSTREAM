<template>
  <div
    class="relative aspect-video rounded-xl overflow-hidden bg-black group shadow-2xl"
    @mouseenter="showControls = true"
    @mouseleave="showControls = false"
    @mousemove="showControls = true"
  >
    <NuxtImg
      :src="thumbnail || 'https://placehold.co/1920x1080/09090b/4cd7f6?text=ZeroStream'"
      class="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-700"
      alt="Video thumbnail"
      width="1920"
      height="1080"
    />
    <div
      class="absolute inset-0 flex flex-col justify-end p-4 md:p-6 player-gradient transition-opacity duration-500"
      :class="showControls ? 'opacity-100' : 'opacity-0'"
    >
      <div v-if="showSkipIntro" class="absolute top-4 right-4 md:top-6 md:right-6">
        <button class="bg-surface-container/60 backdrop-blur-md border border-white/10 px-4 md:px-6 py-2 rounded-lg font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all flex items-center gap-2">
          Skip Intro
          <span class="material-symbols-outlined text-sm">fast_forward</span>
        </button>
      </div>
      <div class="w-full h-1.5 bg-white/20 rounded-full mb-4 md:mb-6 cursor-pointer relative">
        <div
          class="absolute top-0 left-0 h-full bg-secondary rounded-full shadow-[0_0_10px_rgba(76,215,246,0.6)]"
          :style="{ width: progress + '%' }"
        ></div>
        <div
          class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-secondary scale-0 group-hover:scale-100 transition-transform"
          :style="{ left: progress + '%' }"
        ></div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 md:gap-6">
          <button @click="isPlaying = !isPlaying" class="material-symbols-outlined text-3xl hover:text-primary transition-colors" style="font-variation-settings: 'FILL' 1">
            {{ isPlaying ? 'pause' : 'play_arrow' }}
          </button>
          <button class="material-symbols-outlined text-2xl hover:text-primary transition-colors">skip_next</button>
          <div class="hidden sm:flex items-center gap-3">
            <button class="material-symbols-outlined text-2xl hover:text-primary transition-colors">volume_up</button>
            <div class="w-16 md:w-20 h-1 bg-white/20 rounded-full">
              <div class="h-full w-3/4 bg-white rounded-full"></div>
            </div>
          </div>
          <span class="font-label-md text-sm text-on-surface-variant">{{ currentTime }} / {{ duration }}</span>
        </div>
        <div class="flex items-center gap-4 md:gap-6">
          <button class="material-symbols-outlined text-2xl hover:text-primary transition-colors">subtitles</button>
          <button class="material-symbols-outlined text-2xl hover:text-primary transition-colors">settings</button>
          <button class="material-symbols-outlined text-2xl hover:text-primary transition-colors">fullscreen</button>
        </div>
      </div>
    </div>
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-500">
      <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/40 flex items-center justify-center">
        <span class="material-symbols-outlined text-4xl md:text-5xl text-primary" style="font-variation-settings: 'FILL' 1">play_arrow</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  thumbnail?: string
  title?: string
  progress?: number
  currentTime?: string
  duration?: string
  showSkipIntro?: boolean
}>()

const showControls = ref(true)
const isPlaying = ref(false)
</script>
