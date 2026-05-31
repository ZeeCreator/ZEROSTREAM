<template>
  <footer class="bg-surface-container-lowest w-full py-section-gap border-t border-outline-variant">
    <div class="flex flex-col items-center gap-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div class="flex flex-col items-center gap-4">
        <span class="font-display-hero text-headline-md text-primary">ZeroStream</span>
        <p class="text-on-surface-variant text-center max-w-md font-body-md text-body-md">
          Platform streaming anime dan movie modern untuk generasi masa depan.
        </p>
      </div>
      <div class="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-4">
        <NuxtLink to="/" class="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md">
          Kebijakan Privasi
        </NuxtLink>
        <NuxtLink to="/" class="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md">
          Ketentuan Layanan
        </NuxtLink>
        <NuxtLink to="/" class="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md">
          Pusat Bantuan
        </NuxtLink>
        <NuxtLink to="/" class="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md">
          Hubungi Kami
        </NuxtLink>
        <NuxtLink to="/" class="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md">
          Tentang ZeroStream
        </NuxtLink>
      </div>
      <div class="flex gap-6 mt-4">
        <div class="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all duration-300 cursor-pointer">
          <span class="material-symbols-outlined">share</span>
        </div>
        <div class="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all duration-300 cursor-pointer">
          <span class="material-symbols-outlined">public</span>
        </div>
        <div class="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all duration-300 cursor-pointer">
          <span class="material-symbols-outlined">mail</span>
        </div>
      </div>
      <div class="text-on-surface-variant/60 font-label-md text-label-md">
        &copy; {{ new Date().getFullYear() }} ZeroStream. Hak cipta dilindungi.
      </div>
    </div>
  </footer>
</template>
