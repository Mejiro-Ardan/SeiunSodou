import { fileURLToPath } from 'url';
import { appConfig } from './app.config'; // 确保正确导入 appConfig
require('dotenv').config();

export default defineNuxtConfig({
  appConfig: appConfig,
  modules: [
    "nuxt-icon-tw",
    "nuxt-delay-hydration",
    "@nuxtjs/sitemap",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@nuxt/ui",
    "@pinia/nuxt",
    "nuxtjs-naive-ui"
  ],
  runtimeConfig: {
    public: {
      Api_Endpoint: process.env.API_ENDPOINT,
    }
  },
  ui: {
    notifications: {
      position: 'top-0 left-0'
    }
  },
  compatibilityDate: '2024-08-13',
  site: {
    url: appConfig.SiteConfig.SiteURL,
  },
  i18n: {
    locales: [
      { code: 'en', name: 'English' },
      { code: 'zh', name: '中文' },
      { code: 'ja', name: '日本語' }
    ],
    defaultLocale: 'zh',
    vueI18n: './i18n.config.js',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  image: {
    format: ['avif', 'webp', 'jpeg', 'png'],
    domains: [appConfig.SiteConfig.SiteURL],
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
        lang: appConfig.SiteConfig.Language
      },
      title: appConfig.SiteConfig.title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: appConfig.SiteConfig.description }
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