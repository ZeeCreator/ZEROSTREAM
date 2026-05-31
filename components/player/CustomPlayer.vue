<template>
  <div
    ref="containerRef"
    class="relative aspect-video rounded-xl overflow-hidden bg-black group shadow-2xl"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousemove="onMouseMove"
    @keydown="onKeydown"
    tabindex="0"
  >
    <video
      ref="videoRef"
      class="w-full h-full outline-none"
      :class="{ 'cursor-none': !showControls }"
      :poster="poster"
      playsinline
      preload="auto"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @waiting="onWaiting"
      @canplay="onCanPlay"
      @error="onVideoError"
      @click="togglePlay"
    ></video>

    <div
      v-if="state === 'loading'"
      class="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-on-surface-variant font-label-md text-label-md">Memuat video...</p>
      </div>
    </div>

    <div
      v-if="state === 'error'"
      class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 gap-3 px-6 text-center"
    >
      <span class="material-symbols-outlined text-5xl text-on-surface-variant/40">error_outline</span>
      <p class="text-on-surface-variant font-body-md">{{ errorMessage }}</p>
      <button
        @click="retry"
        class="mt-2 px-5 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:scale-105 transition-transform"
      >
        Coba Lagi
      </button>
    </div>

    <div
      v-if="state !== 'loading' && state !== 'error' && !isPlaying"
      class="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
      @click="togglePlay"
    >
      <div
        class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/40 flex items-center justify-center transition-transform duration-500"
        :class="showControls ? 'scale-110' : 'scale-100'"
      >
        <span class="material-symbols-outlined text-4xl md:text-5xl text-primary" style="font-variation-settings: 'FILL' 1">play_arrow</span>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="showControls && state !== 'error'"
        class="absolute inset-0 flex flex-col justify-end p-3 md:p-5 z-20 pointer-events-none"
        style="background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 40%, rgba(0,0,0,0.1) 100%);"
      >
        <div
          ref="progressRef"
          class="relative w-full h-2 md:h-2.5 bg-white/15 rounded-full mb-3 md:mb-4 cursor-pointer group/progress pointer-events-auto"
          @click="seek"
        >
          <div
            class="absolute top-0 left-0 h-full bg-secondary rounded-full"
            :style="{ width: progressPercent + '%' }"
          >
            <div
              class="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 bg-white rounded-full border-2 border-secondary scale-0 group-hover/progress:scale-100 transition-transform shadow-lg"
            ></div>
          </div>
          <div
            v-if="bufferedPercent > 0"
            class="absolute top-0 left-0 h-full bg-white/10 rounded-full"
            :style="{ width: bufferedPercent + '%' }"
          ></div>
        </div>

        <div class="flex items-center justify-between pointer-events-auto">
          <div class="flex items-center gap-3 md:gap-4">
            <button
              @click="togglePlay"
              class="material-symbols-outlined text-2xl md:text-3xl hover:text-secondary transition-colors drop-shadow-lg"
              style="font-variation-settings: 'FILL' 1"
              :title="isPlaying ? 'Jeda' : 'Putar'"
            >
              {{ isPlaying ? 'pause' : 'play_arrow' }}
            </button>
            <button
              @click="toggleMute"
              class="material-symbols-outlined text-xl md:text-2xl hover:text-secondary transition-colors drop-shadow-lg hidden sm:block"
              :title="isMuted ? 'Aktifkan suara' : 'Matikan suara'"
            >
              {{ isMuted ? 'volume_off' : (volume > 0.5 ? 'volume_up' : 'volume_down') }}
            </button>
            <div class="hidden md:flex items-center w-20 h-1.5 bg-white/20 rounded-full cursor-pointer relative pointer-events-auto" @click="setVolume">
              <div class="h-full bg-white rounded-full" :style="{ width: volume * 100 + '%' }"></div>
            </div>
            <span class="font-label-md text-xs md:text-sm text-white/80 drop-shadow-lg whitespace-nowrap select-none pointer-events-auto">
              {{ currentTimeStr }}
              <span class="text-white/40">/ {{ durationStr }}</span>
            </span>
          </div>
          <div class="flex items-center gap-3 md:gap-4 pointer-events-auto">
            <button
              v-if="quality"
              class="font-label-caps text-label-caps text-white/80 hover:text-secondary transition-colors drop-shadow-lg hidden sm:block px-2 py-0.5 rounded border border-white/20"
            >
              {{ quality }}
            </button>
            <button
              @click="toggleFullscreen"
              class="material-symbols-outlined text-xl md:text-2xl hover:text-secondary transition-colors drop-shadow-lg"
              :title="isFullscreen ? 'Keluar fullscreen' : 'Fullscreen'"
            >
              {{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps<{
  videoUrl: string | null
  type?: 'hls' | 'mp4'
  poster?: string
  quality?: string
}>()

const emit = defineEmits<{
  (e: 'error', message: string): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

const state = ref<'loading' | 'ready' | 'error'>('loading')
const errorMessage = ref('')
const showControls = ref(true)
const isPlaying = ref(false)
const isMuted = ref(false)
const isFullscreen = ref(false)
const isLoading = ref(true)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const buffered = ref(0)

let controlsTimeout: ReturnType<typeof setTimeout> | null = null
let hlsInstance: any = null
let fullscreenChangeTarget: Element | null = null

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const bufferedPercent = computed(() => {
  if (!duration.value) return 0
  return (buffered.value / duration.value) * 100
})

const currentTimeStr = computed(() => formatTime(currentTime.value))
const durationStr = computed(() => formatTime(duration.value))

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

function resetPlayer() {
  if (hlsInstance) {
    hlsInstance.destroy()
    hlsInstance = null
  }
  if (videoRef.value) {
    videoRef.value.removeAttribute('src')
    videoRef.value.load()
  }
  state.value = 'loading'
  isLoading.value = true
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
  buffered.value = 0
  errorMessage.value = ''
}

async function loadSource(url: string, type?: string) {
  resetPlayer()
  await nextTick()
  const video = videoRef.value
  if (!video) return

  const isHls = type === 'hls' || url.includes('.m3u8')

  if (isHls) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url
      video.load()
      return
    }

    try {
      const Hls = await loadHlsScript()
      if (Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })
        hlsInstance.loadSource(url)
        hlsInstance.attachMedia(video)
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          isLoading.value = false
          state.value = 'ready'
        })
        hlsInstance.on(Hls.Events.ERROR, (_event: any, data: any) => {
          if (data.fatal) {
            onError('Gagal memuat video - coba server lain')
          }
        })
        return
      }
    } catch {
      onError('Gagal memuat player HLS')
      return
    }
  }

  video.src = url
  video.load()
}

function loadHlsScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).Hls) {
      resolve((window as any).Hls)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@^1'
    script.integrity = ''
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve((window as any).Hls)
    script.onerror = () => reject(new Error('Gagal load hls.js'))
    document.head.appendChild(script)
  })
}

function onError(msg: string) {
  errorMessage.value = msg
  state.value = 'error'
  isLoading.value = false
  emit('error', msg)
}

function retry() {
  if (props.videoUrl) {
    loadSource(props.videoUrl, props.type)
  }
}

function togglePlay() {
  if (!videoRef.value || state.value === 'error') return
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play().catch(() => {})
  }
}

function toggleMute() {
  if (!videoRef.value) return
  videoRef.value.muted = !videoRef.value.muted
  isMuted.value = videoRef.value.muted
}

function seek(e: MouseEvent) {
  if (!videoRef.value || !progressRef.value || !duration.value) return
  const rect = progressRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  videoRef.value.currentTime = percent * duration.value
}

function setVolume(e: MouseEvent) {
  if (!videoRef.value) return
  const parent = (e.currentTarget as HTMLElement)
  const rect = parent.getBoundingClientRect()
  const val = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  volume.value = val
  videoRef.value.volume = val
  videoRef.value.muted = false
  isMuted.value = false
}

function toggleFullscreen() {
  const el = containerRef.value
  if (!el) return
  if (!document.fullscreenElement) {
    fullscreenChangeTarget = el
    el.requestFullscreen?.()
  } else {
    fullscreenChangeTarget = null
    document.exitFullscreen?.()
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function onMouseEnter() {
  showControls.value = true
  if (controlsTimeout) clearTimeout(controlsTimeout)
}

function onMouseLeave() {
  if (isPlaying.value) {
    controlsTimeout = setTimeout(() => {
      showControls.value = false
    }, 1500)
  }
}

function onMouseMove() {
  showControls.value = true
  if (controlsTimeout) clearTimeout(controlsTimeout)
  if (isPlaying.value) {
    controlsTimeout = setTimeout(() => {
      showControls.value = false
    }, 3000)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === ' ' || e.key === 'k') {
    e.preventDefault()
    togglePlay()
  }
  if (e.key === 'f') {
    e.preventDefault()
    toggleFullscreen()
  }
  if (e.key === 'm') {
    e.preventDefault()
    toggleMute()
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    if (videoRef.value) videoRef.value.currentTime = Math.max(0, videoRef.value.currentTime - 10)
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    if (videoRef.value && duration.value) videoRef.value.currentTime = Math.min(duration.value, videoRef.value.currentTime + 10)
  }
}

function onTimeUpdate() {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
    if (videoRef.value.buffered.length > 0) {
      buffered.value = videoRef.value.buffered.end(videoRef.value.buffered.length - 1)
    }
  }
}

function onLoadedMetadata() {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
    isLoading.value = false
    state.value = 'ready'
  }
}

function onPlay() {
  isPlaying.value = true
  autoHideControls()
}

function onPause() {
  isPlaying.value = false
  showControls.value = true
  if (controlsTimeout) clearTimeout(controlsTimeout)
}

function onEnded() {
  isPlaying.value = false
  showControls.value = true
}

function onWaiting() {
  isLoading.value = true
}

function onCanPlay() {
  isLoading.value = false
}

function onVideoError() {
  if (!errorMessage.value) {
    onError('Gagal memuat video')
  }
}

function autoHideControls() {
  if (controlsTimeout) clearTimeout(controlsTimeout)
  controlsTimeout = setTimeout(() => {
    if (isPlaying.value) showControls.value = false
  }, 3000)
}

watch(() => props.videoUrl, (newUrl) => {
  if (newUrl && newUrl !== videoRef.value?.src) {
    loadSource(newUrl, props.type)
  }
})

onMounted(() => {
  if (props.videoUrl) {
    loadSource(props.videoUrl, props.type)
  }
  document.addEventListener('fullscreenchange', onFullscreenChange)
  containerRef.value?.focus()
})

onUnmounted(() => {
  if (controlsTimeout) clearTimeout(controlsTimeout)
  if (hlsInstance) {
    hlsInstance.destroy()
    hlsInstance = null
  }
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
