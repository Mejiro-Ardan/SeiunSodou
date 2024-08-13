<script setup>
import { SiteConfig } from '@/config'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n';

import Register from '@/layouts/auth/signup.vue'

const { t } = useI18n();

const PageName = computed(() => {
    return `${t('signUp')} - ${SiteConfig.title}`;
});

useSeoMeta({
    title: PageName.value,
    ogTitle: SiteConfig.title,
    description: SiteConfig.description,
})
</script>

<template>
    <Register />
</template>