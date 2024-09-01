<script setup>
import { ref, watchEffect, nextTick } from 'vue';
import ArticlesPanel from '@/components/ArticlesPanel.vue';
import { NCarousel, NPagination, NBackTop } from 'naive-ui';

// 当前页码
const page = ref(1);

// 文章数据
const newsArticles = ref([]);

// 总页数
const totalPages = ref(1);

// 获取文章数据的函数
const fetchArticles = async (pageNumber) => {
    const response = await $fetch(`/api/posts/get/list?page=${pageNumber}`);
    newsArticles.value = response.articles;
    totalPages.value = response.totalPages; // 假设API返回totalPages
};

// 监听页码变化，自动获取数据并滚动到顶部
watchEffect(async () => {
    await fetchArticles(page.value);
    await nextTick();
    document.getElementById('articles-panel').scrollIntoView({ behavior: 'smooth' });
});

</script>

<template>
    <NBackTop :right="100" />
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <NCarousel dot-type="line" dot-placement="right" show-arrow="showArrow" direction="direction" mousewheel
            draggable keyboard autoplay>
            <img class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=220" />
            <img class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=202" />
            <img class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=230" />
            <img class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=20" />
        </NCarousel>
        <ArticlesPanel id="articles-panel" :Articles="newsArticles" class="mt-4" />
        <NPagination v-model:page="page" :page-count="totalPages" />
    </div>
</template>

<style scoped>
.carousel-img {
    width: 100%;
    height: 240px;
    object-fit: cover;
}
</style>
