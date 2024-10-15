<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { NCarousel, NPagination } from 'naive-ui';

import ArticlesPanel from '@/components/ArticlesStreamPanel.vue';
import Footer from '@/components/Footer.vue';

// 当前页码
const page = ref(1);

// 文章数据
const newsArticles = ref<PagingData['articles']>([]); // 显式声明类型

// 总页数
const totalPages = ref(1);

// 控制 NCarousel 显示状态
const isCarouselVisible = ref(false);

// 获取文章数据的函数
const fetchArticles = async (pageNumber?: number) => {
    const { data: articlesData } = await useAsyncData<PagingData>('Paging', async () => {
        const response = await $fetch<PagingData>(`/api/articles/getPaging?page=${pageNumber}`);
        return response;
    });
    newsArticles.value = articlesData.value?.articles || [];
    totalPages.value = articlesData.value?.totalPages || 1; // 假设API返回totalPages
};

await fetchArticles();

// 页面加载完成后显示 NCarousel
onMounted(() => {
    isCarouselVisible.value = true;
    const carouselElement = document.getElementById('carousel');
    if (carouselElement) {
        carouselElement.scrollIntoView({ behavior: 'smooth' });
    }
});

// 分页变化处理函数
const handlePageChange = async () => {
    await fetchArticles(page.value);
    await nextTick();
    const articlesPanelElement = document.getElementById('articles-panel');
    if (articlesPanelElement) {
        articlesPanelElement.scrollIntoView({ behavior: 'smooth' });
    }
};
</script>
<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <NCarousel id="carousel" v-show="isCarouselVisible" dot-type="line" dot-placement="right" direction="horizontal"
            mousewheel draggable keyboard autoplay show-arrow>
            <NuxtImg class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=220"
                loading="eager" decoding="async" />
            <NuxtImg class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=202"
                loading="eager" decoding="async" />
            <NuxtImg class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=230"
                loading="eager" decoding="async" />
            <NuxtImg class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=20"
                loading="eager" decoding="async" />
        </NCarousel>
        <ArticlesPanel id="articles-panel" :ArticlesStream="newsArticles" class="mt-4" />
        <NPagination v-model:page="page" :page-count="totalPages" class="mt-4 mb-8" @update:page="handlePageChange" />
    </div>
    <Footer />
</template>

<style scoped>
.carousel-img {
    width: 100%;
    height: 240px;
    object-fit: cover;
}
</style>