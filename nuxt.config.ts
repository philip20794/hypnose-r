import { defineNuxtConfig } from 'nuxt/config'
import { SEO_ROUTES } from './src/constants/site'

const noindexHeaders = {
  headers: {
    'X-Robots-Tag': 'noindex, nofollow',
  },
}

const noindexFollowHeaders = {
  headers: {
    'X-Robots-Tag': 'noindex, follow',
  },
}

export default defineNuxtConfig({
  compatibilityDate: '2026-07-16',
  devtools: { enabled: false },
  experimental: {
    appManifest: false,
  },
  modules: [],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  css: [
    '@quasar/extras/material-icons/material-icons.css',
    'quasar/dist/quasar.css',
    '~/assets/design-system.css',
    '~/assets/main.css',
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'de',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#06030a' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/apple-touch-icon.png' },
      ],
    },
  },
  routeRules: {
    '/bestaetigen/**': { ...noindexHeaders, ssr: false, prerender: false },
    '/termin-reserviert': noindexHeaders,
    '/datenschutzerklaerung': noindexFollowHeaders,
    '/api/**': { ...noindexHeaders, ssr: false, prerender: false },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [
        ...SEO_ROUTES.map((route) => route.path),
        '/termin-reserviert',
        '/robots.txt',
        '/sitemap.xml',
      ],
    },
  },
})
