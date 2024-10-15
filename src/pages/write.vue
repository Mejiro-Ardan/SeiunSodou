<script setup>
import { computed } from 'vue'
import WritePage from '@/templates/Write.vue'

const { t } = useI18n();

const PageName = computed(() => {
    return `${t('Writepage')} - ${t('Sitename')}`;
});

useSeoMeta({
    title: PageName.value,
    ogTitle: t('Sitename'),
    description: t('description'),
});

defineOgImageComponent('NuxtSeo');
</script>

<template>
    <WritePage />
</template>