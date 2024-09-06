<script setup>
import dayjs from 'dayjs';

import Footer from '@/components/Footer.vue'
import MarkdownRender from '@/components/render/Markdown.vue'

const appConfig = useAppConfig();

const props = defineProps({
    articles: {
        required: true
    }
})

const article = props.articles

</script>
<template>
    <div class="container mx-auto p-4 max-w-3xl">
        <button class="btn btn-ghost mb-4 flex items-center space-x-2" @click="$router.back();">
            <Icon name="mingcute:left-line" />
            <span>{{ $t('backToArticles') }}</span>
        </button>

        <!-- 标题 -->
        <h1 class="text-4xl font-bold mb-4">{{ article.title }}</h1>

        <!-- 日期信息 -->
        <div class="text-sm text-muted-foreground mb-2">
            <div class="flex items-center space-x-2">
                <Icon name="mdi:calendar-outline" class="h-4 w-4" />
                <span class="ml-2">
                    <span>{{ $t('createdAt') }} </span>
                    <time :datetime="article.created"
                        :title="`${$t('createdAt')}: ${dayjs(article.created).format('YYYY-MM-DD HH:mm')}`">
                        {{ dayjs(article.created).format('YYYY-MM-DD HH:mm') }}
                    </time>
                </span>
                <template v-if="article.modified">
                    <span class="mx-2">•</span>
                    <span>{{ $t('modifiedAt') }} </span>
                    <time :datetime="article.modified"
                        :title="`${$t('modifiedAt')}: ${dayjs(article.modified).format('YYYY-MM-DD HH:mm')}`">
                        {{ dayjs(article.modified).format('YYYY-MM-DD HH:mm') }}
                    </time>
                </template>
            </div>
        </div>

        <!-- 标签和分类信息 -->
        <div class="flex flex-wrap gap-2 mb-6">
            <span class="badge badge-neutral" v-for="tag in article.tags" :key="tag">{{ tag }}</span>
            <span class="badge badge-primary">{{ article.category }}</span>
        </div>

        <!-- 重新设计作者头像和签名信息 -->
        <div class="flex items-center space-x-4 mb-6">
            <div class="avatar h-14 w-14 rounded-full overflow-hidden border border-gray-300">
                <NuxtImg :src="article.author.avatar" :alt="article.author.nick" />
            </div>
            <div>
                <p class="text-lg font-semibold">{{ article.author.nick }}</p>
                <p class="text-sm text-muted-foreground">{{ article.author.bio }}</p>
            </div>
        </div>

        <!-- AI Summary 卡片 -->
        <UCard class="mb-6">
            <div class="flex items-start space-x-2">
                <Icon name="mdi:sparkles" class="h-5 w-5 mt-1 text-yellow-500" />
                <div>
                    <h3 class="text-lg font-bold">{{ $t('aiSummary') }}</h3>
                    <div class="divider"></div>
                    <p class="text-sm text-muted-foreground">{{ article.summary }}</p>
                </div>
            </div>
        </UCard>

        <!-- 文章内容 -->
        <MarkdownRender class="prose max-w-none mb-6" :text="article.text"></MarkdownRender>

        <div class="divider"></div>

        <!-- License 和 操作按钮 -->
        <UCard>
            <div class="flex items-center justify-between p-6">
                <div class="flex items-center space-x-4">
                    <div
                        class="relative transition overflow-hidden bg-[var(--license-block-bg)] py-5 px-6 mb-6 rounded-xl license-container onload-animation">
                        <div class="transition font-bold text-black/75 dark:text-white/75">
                            {{ article.title }}
                        </div>
                        <a :href="`${appConfig.SiteConfig.SiteURL}${$route.fullPath}`" class="link text-primary">
                            {{ appConfig.SiteConfig.SiteURL + $route.fullPath }}
                        </a>
                        <div class="flex gap-6 mt-2">
                            <div>
                                <div class="transition text-black/30 dark:text-white/30 text-sm">{{ $t('author') }}
                                </div>
                                <div class="transition text-black/75 dark:text-white/75 whitespace-nowrap">{{
                                    article.author.nick }}</div>
                            </div>
                            <div>
                                <div class="transition text-black/30 dark:text-white/30 text-sm">{{ $t('createdAt') }}
                                </div>
                                <div class="transition text-black/75 dark:text-white/75 whitespace-nowrap">
                                    {{ dayjs(article.created).format('YYYY-MM-DD HH:mm') }}
                                </div>
                            </div>
                            <div v-if="article.modified">
                                <div class="transition text-black/30 dark:text-white/30 text-sm">{{ $t('modifiedAt') }}
                                </div>
                                <div class="transition text-black/75 dark:text-white/75 whitespace-nowrap">
                                    {{ dayjs(article.modified).format('YYYY-MM-DD HH:mm') }}
                                </div>
                            </div>
                            <div>
                                <div class="transition text-black/30 dark:text-white/30 text-sm">{{ $t('license') }}
                                </div>
                                <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"
                                    class="link text-primary whitespace-nowrap">{{ $t('ccByNcSa') }}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button class="btn btn-outline" size="icon">
                        <Icon name="material-symbols:bookmark-add-outline" class="h-6 w-6" />
                        <span class="sr-only">{{ $t('bookmark') }}</span>
                    </button>
                    <button class="btn btn-outline" size="icon">
                        <Icon name="material-symbols:share" class="h-6 w-6" />
                        <span class="sr-only">{{ $t('share') }}</span>
                    </button>
                </div>
            </div>
        </UCard>
    </div>
    <Footer />
</template>
