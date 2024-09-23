<script setup>
import { NTabs, NTabPane, NInput, NSelect } from 'naive-ui';

const toast = useToast();
const { t } = useI18n();
const token = useCookie('token');

const ThemeText = ref('');
const ContentText = ref('');
const tags = ref([]);
const category = ref();
const isLoading = ref(false);

const response = await $fetch('/api/articles/get/category');
const categoryOptions = ref(response.categories.map(category => ({
    label: category,
    value: category.toLowerCase()
})));

const handleUpload = async () => {
    isLoading.value = true;
    try {
        const up_response = await $fetch('/api/articles/upload', {
            method: 'POST',
            body: {
                tags: tags.value,
                category: category.value,
                themetext: ThemeText.value,
                contenttext: ContentText.value
            },
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        });
        if (up_response.compliance) {
            toast.add({ title: t('uploadSuccess') });
            await navigateTo('/');
        } else {
            toast.add({ title: t('uploadFailed'), color: "red", icon: "material-symbols:error-outline", description: up_response.reason, });
        }
    } catch (error) {
        toast.add({ title: error, color: "red", icon: "material-symbols:error-outline" })
        console.error('ArticlesCreate_failed:', error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="p-6 dark:bg-gray-800 dark:text-white">
        <UCard class="w-full max-w-screen-xl mx-auto p-6 md:py-10 space-y-10 dark:bg-gray-900">
            <h1 class="text-2xl font-bold mb-4">{{ $t('writeNewChapter') }}</h1>
            <div class="space-y-2">
                <NInput :placeholder="$t('enterTitle')" v-model:value="ThemeText"
                    class="mb-6 dark:bg-gray-700 dark:text-white" />
            </div>

            <NTabs type="line" animated default-value="content" class="card-tabs">
                <NTabPane name="content" :tab="$t('content')">
                    <div class="space-y-2">
                        <h3 class="text-lg font-medium mb-4">{{ $t('content') }}</h3>
                        <NInput v-model:value="ContentText" type="textarea" :placeholder="$t('enterMarkdown')"
                            class="w-full h-96 dark:bg-gray-700 dark:text-white" />
                    </div>
                </NTabPane>
                <NTabPane name="preview" :tab="$t('preview')">
                    <div class="space-y-2">
                        <h3 class="text-lg font-medium mb-4">{{ $t('preview') }}</h3>
                        <MDC :value="ContentText ? ContentText : $t('noContent')" tag="preview" />
                    </div>
                </NTabPane>
            </NTabs>

            <div class="flex flex-col space-y-6 md:flex-row md:items-start md:space-y-0 md:space-x-6 mt-4">
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">{{ $t('tags') }}</h3>
                    <NSelect v-model:value="tags" filterable multiple tag placeholder="多选，输入新标签后按回车确认"
                        :show-arrow="false" :show="false" />
                </div>

                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">{{ $t('category') }}</h3>
                    <NSelect v-model:value="category" filterable tag :options="categoryOptions"
                        placeholder="单选，输入新分类后按回车确认" />
                </div>
            </div>
            <template #footer>
                <div class="float-right">
                    <button
                        class="btn text-white btn-sm bg-primary hover:bg-primary/90 dark:bg-primary/70 dark:hover:bg-primary/50"
                        @click.prevent="handleUpload()" :disabled="isLoading">
                        <span v-if="isLoading" class="loading loading-spinner items-center justify-center"></span>
                        {{ isLoading ? $t('loading') : $t('submit') }}
                    </button>
                </div>
            </template>
        </UCard>
    </div>
</template>

<style scoped>
.card-tabs .n-tabs-nav--bar-type {
    padding-left: 4px;
}
</style>