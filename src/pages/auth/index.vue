<script setup>
import { computed } from 'vue'
import Auth from '@/templates/auth/index.vue'

const { t } = useI18n();

const PageName = computed(() => {
    return `${t('account_authentication')} - ${t('Sitename')}`;
});

useSeoMeta({
    title: PageName.value,
    ogTitle: t('Sitename'),
    description: t('description'),
});

defineOgImageComponent('NuxtSeo')
</script>

<template>
    <Auth />
</template>