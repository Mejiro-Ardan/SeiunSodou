<script setup>
import { computed } from 'vue'

import SignUp from '@/layouts/auth/signup.vue'

const { t } = useI18n();

const PageName = computed(() => {
    return `${t('signUp')} - ${t('Sitename')}`
});

useSeoMeta({
    title: PageName.value,
    ogTitle: t('Sitename'),
    description: t('description'),
});

defineOgImageComponent('NuxtSeo');
</script>

<template>
    <SignUp />
</template>