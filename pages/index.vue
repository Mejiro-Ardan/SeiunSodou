<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const appConfig = useAppConfig();

import Home from '@/layouts/Home.vue'

const route = useRoute();
const currentPath = route.path;
const { t } = useI18n();

const PageName = computed(() => {
    const entry = appConfig['NavigationTopConfig']['sections'].find((entry) => entry.path === currentPath);
    return entry ? `${t(entry.name)} - ${t('Sitename')}` : t('Sitename');
});

useSeoMeta({
    title: PageName.value,
    ogTitle: t('Sitename'),
    description: t('description'),
})
</script>

<template>
    <Home />
</template>