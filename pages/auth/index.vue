<script setup>
import { computed } from 'vue'
import Auth from '@/layouts/auth/index.vue'

const { t } = useI18n();

const PageName = computed(() => {
    return `${t('account_authentication')} - ${t('Sitename')}`;
});

useSeoMeta({
    title: PageName.value,
    ogTitle: t('Sitename'),
    description: t('description'),
})
</script>

<template>
    <Auth />
</template>