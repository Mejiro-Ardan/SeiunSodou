<script setup>
import { computed } from 'vue'
import Reset from '@/layouts/auth/reset.vue'

const { t } = useI18n();

const PageName = computed(() => {
    return `${t('resetPassword')} - ${t('Sitename')}`;
});

useSeoMeta({
    title: PageName.value,
    ogTitle: t('Sitename'),
    description: t('description'),
})
</script>

<template>
    <Reset />
</template>