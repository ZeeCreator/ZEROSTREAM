export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
  ],
  image: {
    domains: ['image.tmdb.org', 'placehold.co', 'api.dicebear.com', 'i0.wp.com', 'i1.wp.com', 'i2.wp.com', 'i3.wp.com', 'anichin.ro'],
    format: ['webp', 'avif'],
    quality: 60,
    densities: [1],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'ZeroStream - Streaming Anime & Movie',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'ZeroStream - Platform streaming anime dan movie modern dengan tampilan premium' },
        { name: 'theme-color', content: '#09090b' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'preload', as: 'style', href: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Hanken+Grotesk:wght@400;500;600&family=Geist:wght@400;500;600&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Hanken+Grotesk:wght@400;500;600&family=Geist:wght@400;500;600&display=swap', media: 'print', onload: 'this.media=\"all\"' },
        { rel: 'preload', as: 'style', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap', media: 'print', onload: 'this.media=\"all\"' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: 'https://lk-21-apis.vercel.app',
      animeApiBase: 'https://errra.vercel.app',
      anichinApiBase: 'https://lk-21-apis.vercel.app'
    }
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
    routeRules: {
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/favicon.ico': { headers: { 'cache-control': 'public, max-age=86400' } },
      '/': { swr: 300 },
      '/donghua': { swr: 300 },
      '/anime': { swr: 300 },
      '/movie': { swr: 300 },
      '/trending': { swr: 300 },
      '/drakor': { swr: 300 },
      '/search': { swr: 300 },
      '/dongwatch/**': { swr: 300 },
      '/dongdetail/**': { swr: 300 },
      '/api/search': { swr: 600 },
      '/api/anime/search': { swr: 600 },
      '/api/donghua/search': { swr: 600 },
      '/api/donghua/home': { swr: 600 },
      '/api/donghua/latest': { swr: 600 },
      '/api/donghua/detail/**': { swr: 600 },
      '/api/donghua/episode/**': { swr: 600 },
      '/api/trending': { swr: 600 },
      '/api/movies': { swr: 600 },
      '/api/movies/rebahin': { swr: 600 },
      '/api/series/latest': { swr: 600 },
      '/api/genres': { swr: 600 },
      '/api/drakor': { swr: 600 },
      '/api/anime/v2-home': { swr: 600 },
      '/api/anime/v2-list': { swr: 600 },
    },
  },
  tailwindcss: {
    config: {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            surface: '#12131a',
            'surface-dim': '#12131a',
            'surface-bright': '#383941',
            'surface-container-lowest': '#0d0e15',
            'surface-container-low': '#1a1b22',
            'surface-container': '#1e1f26',
            'surface-container-high': '#292931',
            'surface-container-highest': '#33343c',
            'on-surface': '#e3e1ec',
            'on-surface-variant': '#cfc2d6',
            'inverse-surface': '#e3e1ec',
            'inverse-on-surface': '#2f3038',
            outline: '#988d9f',
            'outline-variant': '#4d4354',
            'surface-tint': '#ddb7ff',
            primary: '#ddb7ff',
            'on-primary': '#490080',
            'primary-container': '#b76dff',
            'on-primary-container': '#400071',
            'inverse-primary': '#842bd2',
            secondary: '#4cd7f6',
            'on-secondary': '#003640',
            'secondary-container': '#03b5d3',
            'on-secondary-container': '#00424e',
            tertiary: '#c8c6c8',
            'on-tertiary': '#313032',
            'tertiary-container': '#929093',
            'on-tertiary-container': '#2a292c',
            error: '#ffb4ab',
            'on-error': '#690005',
            'error-container': '#93000a',
            'on-error-container': '#ffdad6',
            'primary-fixed': '#f0dbff',
            'primary-fixed-dim': '#ddb7ff',
            'on-primary-fixed': '#2c0051',
            'on-primary-fixed-variant': '#6900b3',
            'secondary-fixed': '#acedff',
            'secondary-fixed-dim': '#4cd7f6',
            'on-secondary-fixed': '#001f26',
            'on-secondary-fixed-variant': '#004e5c',
            'tertiary-fixed': '#e5e1e4',
            'tertiary-fixed-dim': '#c8c6c8',
            'on-tertiary-fixed': '#1c1b1d',
            'on-tertiary-fixed-variant': '#474649',
            background: '#12131a',
            'on-background': '#e3e1ec',
            'surface-variant': '#33343c',
            'deep-bg': '#09090b'
          },
          fontFamily: {
            'display-hero': ['Sora', 'sans-serif'],
            'headline-lg': ['Sora', 'sans-serif'],
            'headline-md': ['Sora', 'sans-serif'],
            'headline-lg-mobile': ['Sora', 'sans-serif'],
            'body-lg': ['Hanken Grotesk', 'sans-serif'],
            'body-md': ['Hanken Grotesk', 'sans-serif'],
            'label-caps': ['Geist', 'sans-serif'],
            'label-md': ['Geist', 'sans-serif']
          },
          fontSize: {
            'display-hero': ['64px', { lineHeight: '72px', letterSpacing: '-0.02em', fontWeight: '800' }],
            'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '700' }],
            'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '700' }],
            'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
            'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
            'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
            'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
            'label-md': ['14px', { lineHeight: '20px', fontWeight: '500' }]
          },
          spacing: {
            'margin-desktop': '64px',
            'margin-mobile': '20px',
            'container-max': '1440px',
            'section-gap': '48px',
            'gutter': '24px',
            'unit': '4px'
          },
          borderRadius: {
            DEFAULT: '0.25rem',
            lg: '0.5rem',
            xl: '0.75rem',
            '2xl': '1rem'
          }
        }
      }
    }
  }
})
