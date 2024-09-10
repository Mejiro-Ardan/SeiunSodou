<script setup>
import { computed } from 'vue'
import Articles from '@/layouts/Articles.vue'

const { t } = useI18n();

const route = useRoute();


const { data: articleInfo } = await useFetch(`/api/articles/get/detail?id=${route.params.id}`);

articleInfo.value.code != 200 ? showError({ statusCode: 404, statusMessage: "Page Not Found" }) : null;

const PageName = computed(() => {
    return `${articleInfo.value.data.title} - ${t('Sitename')}`;
});

useSeoMeta({
    title: PageName.value,
    ogTitle: t('Sitename'),
    description: t('description'),
});

defineOgImageComponent('NuxtSeo');
</script>

<template>
    <Articles :articles="articleInfo.data" />
</template>