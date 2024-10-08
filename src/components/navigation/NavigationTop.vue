<script setup>
import { useAuthStore } from '@/stores/verifyAuth';

const appConfig = useAppConfig();
const toast = useToast();
const authStore = useAuthStore();
const route = useRoute();
const { t } = useI18n();

const NavigationTopConfig = appConfig.NavigationTopConfig;

const userInfo = ref(null);
const items = ref([]);

const signinStatus = ref(null); // null 表示正在加载

const updateUserInfo = async () => {
    await authStore.initializeToken();
    if (authStore.Status && authStore.Status.code === '200') {
        await authStore.get_userinfo();
        userInfo.value = authStore.userInfo;
        signinStatus.value = true;
        items.value = [
            [{
                label: userInfo.value.uid,
                slot: 'account',
                disabled: true
            }], [{
                label: 'Settings',
                icon: 'i-heroicons-cog-8-tooth'
            }], [{
                label: 'Documentation',
                icon: 'i-heroicons-book-open'
            }, {
                label: 'Changelog',
                icon: 'i-heroicons-megaphone'
            }, {
                label: 'Status',
                icon: 'i-heroicons-signal'
            }], [{
                label: 'Sign out',
                icon: 'i-heroicons-arrow-left-on-rectangle',
                click: async () => {
                    try {
                        authStore.clearToken();
                        toast.add({ title: t('signout_success') });
                        await navigateTo('/auth/');
                    } catch (error) {
                        toast.add({ title: t('signout_failed'), color: "red" });
                        console.error('Signout_failed:', error);
                    }
                }
            }]
        ];
    } else {
        signinStatus.value = false;
        items.value = [
            [{
                slot: 'recommend',
                disabled: true
            }],
            [{
                label: t('signIn'),
                icon: 'ri:login-box-line',
                click: () => navigateTo('/auth/signin')
            }],
            [{
                label: t('signUp'),
                icon: 'ri:file-list-2-line',
                click: () => navigateTo('/auth/signup')
            }]
        ];
    }
};

// 避免重复调用的防抖机制
const debouncedUpdateUserInfo = debounce(updateUserInfo, 300);

await updateUserInfo();
watch(route, debouncedUpdateUserInfo, { immediate: true });
watch(() => authStore.token, debouncedUpdateUserInfo, { immediate: true });

function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}
</script>
<template>
    <div class="flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-800">
        <header
            class="flex items-center h-16 px-4 border-b border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-900 md:px-6">
            <nav
                class="flex w-full items-center gap-6 text-lg font-medium text-gray-900 dark:text-gray-200 md:gap-5 md:text-sm">
                <!-- Logo -->
                <div class="flex items-center">
                    <div class="mask mask-squircle w-12 h-12 overflow-hidden">
                        <img src="https://cdn.moefan.top/images/050fe041134042b25e3e660317daa2ad.png" alt="logo"
                            class="w-full h-full object-cover" />
                    </div>
                </div>

                <!-- Navigation Links -->
                <div class="flex flex-1 items-center space-x-4">
                    <template v-for="(item, index) in NavigationTopConfig.sections" :key="index">
                        <NuxtLink role="button" :to="item.path" v-if="$route.path !== item.path"
                            class="btn text-white btn-sm bg-primary hover:bg-primary/90 dark:bg-primary/80">
                            {{ $t(item.name) }}
                        </NuxtLink>
                    </template>
                </div>

                <!-- User Dropdown -->
                <div class="flex items-center gap-4">
                    <template v-if="signinStatus">
                        <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                            :popper="{ placement: 'bottom-start' }">
                            <UAvatar :src="userInfo?.avatar" />
                            <template #account="{ item }">
                                <div class="text-left">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('loggedInAs') }}</p>
                                    <p class="truncate font-medium text-gray-900 dark:text-gray-100">
                                        UID: {{ item.label }}
                                    </p>
                                </div>
                            </template>
                            <template #item="{ item }">
                                <span class="truncate">{{ item.label }}</span>
                                <UIcon :name="item.icon"
                                    class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                            </template>
                        </UDropdown>
                    </template>
                    <template v-else>
                        <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                            :popper="{ placement: 'bottom-start' }">
                            <UButton role="button"
                                class="btn text-white btn-sm bg-primary hover:bg-primary/90 dark:bg-primary/80">
                                {{ $t('signIn') }}
                            </UButton>
                            <template #recommend>
                                <div class="text-left">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('recommendSignup') }}</p>
                                </div>
                            </template>
                            <template #item="{ item }">
                                <span class="truncate">{{ item.label }}</span>
                                <UIcon :name="item.icon"
                                    class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                            </template>
                        </UDropdown>
                    </template>
                </div>
            </nav>
        </header>
        <slot />
    </div>
</template>