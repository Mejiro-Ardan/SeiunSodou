<script setup>
import { useAuthStore } from '@/stores/verifyAuth';

const authStore = useAuthStore();

const signinStatus = ref();
const userInfo = ref();

const route = useRoute();

const updateUserInfo = async () => {
    await authStore.initializeToken();
    if (authStore.Status && authStore.Status.code === '200') {
        signinStatus.value = true;
        await authStore.get_userinfo();
        userInfo.value = authStore.userInfo;
    } else {
        signinStatus.value = false;
    }
};

await updateUserInfo();

// 监听路由变化并更新用户信息
watch(route, updateUserInfo);
</script>
<template>
    <div class="flex flex-col md:flex-row flex-1 gap-4 p-4 md:p-6">
        <!-- 主内容容器 -->
        <div class="flex-1 overflow-y-auto">
            <div class="rounded-lg border bg-card w-full">
                <slot />
            </div>
        </div>
        <!-- 侧边栏 -->
        <div class="flex flex-col gap-4 w-full md:w-[250px] md:max-w-md md:sticky md:top-0">
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden" data-v0-t="card">
                <div class="p-4 text-center">
                    <div class="space-y-1.5 flex flex-col items-center gap-2 bg-muted/50 p-4">
                        亲爱的 {{ userInfo.nick }} 很高兴
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>