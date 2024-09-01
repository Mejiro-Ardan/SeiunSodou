<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/verifyAuth';

const authStore = useAuthStore();
const route = useRoute();

const userInfo = ref(null);
const signinStatus = ref(false);

const updateUserInfo = async () => {
    await authStore.initializeToken();
    if (authStore.Status && authStore.Status.code === '200') {
        await authStore.get_userinfo();
        userInfo.value = authStore.userInfo;
        signinStatus.value = true;
    } else {
        signinStatus.value = false;
    }
};

await updateUserInfo();
watch(route, updateUserInfo);
</script>

<template>
    <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div class="flex items-center justify-center py-12">
            <div class="mx-auto w-[350px] space-y-6">
                <template v-if="signinStatus">
                    <div class="space-y-2 text-center">
                        <img :src="userInfo.avatar" alt="User Avatar" class="w-16 h-16 rounded-full mx-auto" />
                        <h1 class="text-3xl font-bold">{{ userInfo.nick }}</h1>
                        <p class="text-muted-foreground">{{ userInfo.bio }}</p>
                        <NuxtLink role="button"
                            class="inline-flex text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-6"
                            type="button" to="/">
                            {{ $t('goToHome') }}
                        </NuxtLink>
                    </div>
                </template>
                <template v-else>
                    <div class="space-y-2 text-center">
                        <h1 class="text-3xl font-bold">{{ $t('welcome') }}</h1>
                        <p class="text-muted-foreground">{{ $t('enterCredentials') }}</p>
                        <NuxtLink role="button"
                            class="inline-flex text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-6"
                            type="button" to="/auth/signin">
                            {{ $t('signIn') }}
                        </NuxtLink>
                    </div>
                </template>
            </div>
        </div>
        <div class="hidden bg-muted lg:block">
            <div class="flex h-full flex-col items-center justify-center gap-6 px-4 md:px-6">
                <div class="grid gap-4 text-center">
                    <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl">{{ $t('Sitename') }}</h2>
                    <p
                        class="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {{ $t('description') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>