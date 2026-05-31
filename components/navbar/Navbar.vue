<template>
  <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-3xl border-b border-white/10"
    :class="{ 'shadow-lg shadow-primary/5': scrolled }">
    <nav class="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 w-full max-w-container-max mx-auto">
      <div class="flex items-center gap-8 md:gap-12">
        <NuxtLink to="/" class="font-display-hero text-headline-md tracking-tighter text-primary">
          ZeroStream
        </NuxtLink>
        <div class="hidden md:flex items-center gap-8">
          <NuxtLink to="/" class="font-label-md text-label-md text-primary font-bold border-b-2 border-primary pb-1">
            Beranda
          </NuxtLink>
          <NuxtLink to="/trending" class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Trending
          </NuxtLink>
          <NuxtLink to="/movie" class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Movie
          </NuxtLink>
          <NuxtLink to="/anime" class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Anime
          </NuxtLink>
          <NuxtLink to="/drakor" class="font-label-md text-label-md text-on-surface-variant hover:text-red-400 transition-colors">
            Drakor
          </NuxtLink>
          <NuxtLink to="/donghua" class="font-label-md text-label-md text-on-surface-variant hover:text-emerald-400 transition-colors">
            Donghua
          </NuxtLink>
          <NuxtLink to="/watchlist" class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Favorit
          </NuxtLink>
        </div>
      </div>
      <div class="flex items-center gap-4 md:gap-6">
        <NuxtLink to="/search" class="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30 hover:border-primary/30 hover:bg-primary/5 transition-all group">
          <span class="material-symbols-outlined text-on-surface-variant mr-2 group-hover:text-primary transition-colors">search</span>
          <span class="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">Cari judul...</span>
        </NuxtLink>
        <NuxtLink to="/search" class="lg:hidden material-symbols-outlined text-on-surface-variant hover:text-primary transition-all">
          search
        </NuxtLink>
        <button @click="uiStore.toggleMobileMenu" class="md:hidden material-symbols-outlined text-on-surface-variant hover:text-primary transition-all">
          {{ uiStore.isMobileMenuOpen ? 'close' : 'menu' }}
        </button>
      </div>
    </nav>
  </header>

  <!-- Mobile Drawer -->
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="uiStore.isMobileMenuOpen" class="fixed inset-0 z-[60] md:hidden">
        <div @click="uiStore.toggleMobileMenu" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="absolute right-0 top-0 h-full w-72 bg-surface border-l border-white/10 shadow-2xl shadow-primary/10 p-6 pt-20">
          <div class="flex flex-col gap-2">
            <NuxtLink @click="uiStore.toggleMobileMenu" to="/" class="flex items-center gap-3 px-4 py-3 rounded-xl text-label-md text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all">
              <span class="material-symbols-outlined">home</span>
              Beranda
            </NuxtLink>
            <NuxtLink @click="uiStore.toggleMobileMenu" to="/trending" class="flex items-center gap-3 px-4 py-3 rounded-xl text-label-md text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all">
              <span class="material-symbols-outlined">trending_up</span>
              Trending
            </NuxtLink>
            <NuxtLink @click="uiStore.toggleMobileMenu" to="/movie" class="flex items-center gap-3 px-4 py-3 rounded-xl text-label-md text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all">
              <span class="material-symbols-outlined">movie</span>
              Movie
            </NuxtLink>
            <NuxtLink @click="uiStore.toggleMobileMenu" to="/anime" class="flex items-center gap-3 px-4 py-3 rounded-xl text-label-md text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all">
              <span class="material-symbols-outlined">auto_awesome</span>
              Anime
            </NuxtLink>
            <NuxtLink @click="uiStore.toggleMobileMenu" to="/drakor" class="flex items-center gap-3 px-4 py-3 rounded-xl text-label-md text-on-surface-variant hover:text-red-400 hover:bg-red-500/5 transition-all">
              <span class="material-symbols-outlined">tv</span>
              Drakor
            </NuxtLink>
            <NuxtLink @click="uiStore.toggleMobileMenu" to="/donghua" class="flex items-center gap-3 px-4 py-3 rounded-xl text-label-md text-on-surface-variant hover:text-emerald-400 hover:bg-emerald-500/5 transition-all">
              <span class="material-symbols-outlined">auto_awesome</span>
              Donghua
            </NuxtLink>
            <NuxtLink @click="uiStore.toggleMobileMenu" to="/watchlist" class="flex items-center gap-3 px-4 py-3 rounded-xl text-label-md text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all">
              <span class="material-symbols-outlined">favorite</span>
              Favorit
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  <div class="h-16 md:h-20"></div>
</template>

<script setup lang="ts">
const scrolled = ref(false)
const uiStore = useUiStore()

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 50
  })
})
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
