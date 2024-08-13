import { fileURLToPath } from 'url'
import { SiteConfig } from './src/config'

export default defineNuxtConfig({
  modules: [
    "nuxt-icon-tw",
    "nuxt-delay-hydration",
    "@nuxtjs/sitemap",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@nuxt/ui"
  ],
  compatibilityDate: '2024-08-13',
  site: {
    url: SiteConfig.SiteURL,
  },
  i18n: {
    vueI18n: './i18n.config.js',
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: false
    },
  },
  image: {
    format: ['avif', 'webp', 'jpeg', 'png'],
    domains: [SiteConfig.SiteURL],
    provider: 'ipx',
    ipx: {
      modifiers: {
        format: 'avif',
      },
    },
  },

  sitemap: {
    xslTips: false,
    xslColumns: [
      { label: 'URL', width: '75%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
    ],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: SiteConfig.Language
      },
      title: SiteConfig.title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: SiteConfig.description }
      ],
    }
  },

  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css'
  ],

  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  delayHydration: {
    mode: 'mount'
  },
});