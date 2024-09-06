<script setup>
const props = defineProps({
    ArticlesStream: {
        type: Array,
        required: true
    }
})
</script>

<template>
    <div class="container mx-auto p-4">
        <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <UCard v-for="article in props.ArticlesStream" :key="article.slug" class="flex flex-col overflow-hidden">
                <template #header class="p-0">
                    <img :src="article.image" :alt="`Illustration for ${article.title}`"
                        class="h-48 w-full object-cover" />
                </template>
                <div class="flex-grow p-4">
                    <div class="flex flex-wrap gap-2 mb-2">
                        <span v-for="tag in article.tags" :key="tag" class="badge badge-primary">{{ tag }}</span>
                    </div>
                    <h2 class="mb-2 line-clamp-2">{{ article.title }}</h2>
                    <p class="mb-4 line-clamp-3 text-sm text-gray-600">{{ article.summary }}</p>
                    <div class="text-xs text-gray-500 mt-4">{{ article.category }}</div>
                </div>
                <template #footer class="flex items-center justify-between p-4">
                    <div class="flex items-center space-x-3 flex-grow">
                        <div class="avatar">
                            <div class="w-8 h-8 rounded-full">
                                <NuxtImg :src="article.author.avatar" :alt="article.author.nick" />
                            </div>
                        </div>
                        <div class="flex-1">
                            <span class="text-sm font-medium">{{ article.author.nick }}</span>
                        </div>
                        <NuxtLink :to="`/p/${article.slug}`" class="text-sm font-semibold text-primary hover:underline"
                            :aria-label="`Read more about ${article.title}`">
                            Read more
                            <Icon name="weui:arrow-filled" />
                        </NuxtLink>
                    </div>
                </template>
            </UCard>
        </div>
    </div>
</template>