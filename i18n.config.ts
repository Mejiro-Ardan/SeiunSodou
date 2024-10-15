import zh from '~/locales/zh.json'
import en from '~/locales/en.json'
import ja from '~/locales/ja.json'

export default defineI18nConfig(() => {
    return {
        legacy: false,
        locale: 'zh',
        fallbackLocale: 'zh',
        messages: { zh, en, ja }
    }
});