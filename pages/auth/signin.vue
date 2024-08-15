<script setup>
import { computed } from 'vue'

import SignIn from '@/layouts/auth/signin.vue'

const { t } = useI18n();

const PageName = computed(() => {
    return `${t('signIn')} - ${t('Sitename')}`;
});

useSeoMeta({
    title: PageName.value,
    ogTitle: t('Sitename'),
    description: t('description'),
})
</script>

<template>
    <SignIn />
</template>