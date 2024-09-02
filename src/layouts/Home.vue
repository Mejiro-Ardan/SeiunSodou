<script setup>
import { ref, nextTick, onMounted } from 'vue';
import ArticlesPanel from '@/components/ArticlesPanel.vue';
import { NCarousel, NPagination } from 'naive-ui';

// 当前页码
const page = ref(1);

// 文章数据
const newsArticles = ref([]);

// 总页数
const totalPages = ref(1);

// 控制 NCarousel 显示状态
const isCarouselVisible = ref(false);

// 获取文章数据的函数
const fetchArticles = async (pageNumber) => {
    const response = await $fetch(`/api/posts/get/list?page=${pageNumber}`);
    newsArticles.value = response.articles;
    totalPages.value = response.totalPages; // 假设API返回totalPages
};

await fetchArticles();

// 页面加载完成后显示 NCarousel
onMounted(() => {
    isCarouselVisible.value = true;
    document.getElementById('carousel').scrollIntoView({ behavior: 'smooth' });
});

// 分页变化处理函数
const handlePageChange = async () => {
    await fetchArticles(page.value);
    await nextTick();
    document.getElementById('articles-panel').scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <NCarousel id="carousel" v-show="isCarouselVisible" dot-type="line" dot-placement="right" direction="direction"
            mousewheel draggable keyboard autoplay show-arrow>
            <img class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=220" />
            <img class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=202" />
            <img class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=230" />
            <img class="carousel-img" src="https://api-space.tnxg.top/images/wallpaper/?type=cdn&123=20" />
        </NCarousel>
        <ArticlesPanel id="articles-panel" :Articles="newsArticles" class="mt-4" />
        <NPagination v-model:page="page" :page-count="totalPages" class="mt-4 mb-8" @update:page="handlePageChange" />
    </div>
    <footer class="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
        <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <div class="sm:flex sm:items-center sm:justify-between">
                <div class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                    <NuxtImg src="https://cdn.moefan.top/images/050fe041134042b25e3e660317daa2ad.png" class="h-8"
                        alt="SeiunSodou Logo" />
                    <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        {{ $t('Sitename') }}</span>
                </div>
                <ul
                    class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                    <li>
                        <a href="#" class="hover:underline me-4 md:me-6">{{ $t('About') }}</a>
                    </li>
                    <li>
                        <a href="#" class="hover:underline me-4 md:me-6">{{ $t('PrivacyPolicy') }}</a>
                    </li>
                    <li>
                        <a href="#" class="hover:underline me-4 md:me-6">{{ $t('Licensing') }}</a>
                    </li>
                    <li>
                        <a href="#" class="hover:underline">{{ $t('Contact') }}</a>
                    </li>
                </ul>
            </div>
            <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
                © {{ new Date().getFullYear() }} <a class="text-text-primary hover:underline">{{
                    $t('Sitename') }}</a>. {{ $t('AllRightsReserved') }}
            </span>
        </div>
    </footer>
</template>

<style scoped>
.carousel-img {
    width: 100%;
    height: 240px;
    object-fit: cover;
}
</style>
