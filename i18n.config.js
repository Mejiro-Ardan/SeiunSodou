import zh from '~/locale/zh'
import en from '~/locale/en'
import ja from '~/locale/ja'

export default defineI18nConfig(() => {
    return {
        legacy: false,
        locale: 'zh',
        fallbackLocale: 'zh',
        messages: { zh, en, ja }
    }
});