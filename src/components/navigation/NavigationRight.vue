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
                <template v-if="signinStatus">
                    <div class="p-4 text-center">
                        <div class="space-y-1.5 flex flex-col items-center gap-2 bg-muted/50 p-4">
                            <span class="relative flex shrink-0 overflow-hidden mask mask-squircle h-[4.5rem] w-[4.5rem]">
                                <NuxtImg class="h-full w-full" :src="userInfo.avatar" />
                            </span>
                            <div class="grid gap-0.5 text-center">
                                <div class="font-semibold text-lg p-1">{{ userInfo.nick }}</div>
                                <div class="text-sm text-muted-foreground">{{ userInfo.bio }}</div>
                            </div>
                        </div>
                        <div class="divider"></div>
                        <div class="p-2">
                            <table class="w-full mt-4 mb-4">
                                <tbody>
                                    <tr>
                                        <!-- todo : -->
                                        <td class="text-center">
                                            <span class="font-semibold text-base">{{ userInfo.post_count }}</span>
                                            <div class="text-muted-foreground text-sm mt-1">{{ $t('post') }}</div>
                                        </td>
                                        <td class="text-center">
                                            <span class="font-semibold text-base">0</span>
                                            <div class="text-muted-foreground text-sm mt-1">{{ $t('favorites') }}</div>
                                        </td>
                                        <td class="text-center">
                                            <span class="font-semibold text-base">0</span>
                                            <div class="text-muted-foreground text-sm mt-1">{{ $t('following') }}</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="p-4 text-center">
                        <div class="space-y-1.5 flex flex-col items-center gap-2 bg-muted/50 p-4">
                            <div class="grid gap-0.5 text-center text-base sm:text-lg">
                                {{ $t('Sitename') }}
                            </div>
                            <div class="text-sm sm:text-base text-muted-foreground">
                                {{ $t('description') }}
                            </div>
                        </div>
                        <div class="divider"></div>
                        <div id="auth">
                            <NuxtLink role="button" class="btn text-white btn-sm bg-primary hover:bg-primary/90"
                                to="/auth/signup">
                                {{ $t('signUp') }}
                            </NuxtLink>
                            <div class="text-sm sm:text-base mt-2">
                                <div class="mt-4 text-center text-sm sm:text-base">
                                    {{ $t('alreadyHaveAccount') }}{{ " " }}
                                    <NuxtLink class="text-primary hover:underline" to="/auth/signin">
                                        {{ $t('signIn') }}
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>