<script setup>
import { SiteConfig, NavigationTopConfig } from '@/config'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import Home from '@/layouts/Home.vue'

const route = useRoute();
const currentPath = route.path;
const { t } = useI18n();

const PageName = computed(() => {
    const entry = NavigationTopConfig.sections.find((entry) => entry.path === currentPath);
    return entry ? `${t(entry.name)} - ${SiteConfig.title}` : SiteConfig.title;
});

useSeoMeta({
    title: PageName.value,
    ogTitle: SiteConfig.title,
    description: SiteConfig.description,
})
</script>

<template>
    <Home />
</template>