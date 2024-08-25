<script setup>
const appConfig = useAppConfig();
const toast = useToast();
const t = useI18n();

const NavigationTopConfig = appConfig.NavigationTopConfig;

const items = [
    [{
        label: 'ben@example.com',
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
                localStorage.removeItem('token');
                await navigateTo('/auth/signin')
            } catch (error) {
                toast.add({ title: t('signout_failed'), color: "red" })
                console.error('Signout_failed:', error);
            }
        }
    }]
]
</script>

<template>
    <div class="flex flex-col w-full min-h-screen">
        <header class="flex items-center h-16 px-4 border-b bg-white md:px-6">
            <nav class="flex w-full items-center gap-6 text-lg font-medium md:gap-5 md:text-sm">
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
                        <NuxtLink :to="item.path" :class="{
                            'font-bold': $route.path === item.path,
                            'text-muted-foreground': $route.path !== item.path
                        }" class="text-base btn">
                            {{ $t(item.name) }}
                        </NuxtLink>
                    </template>
                </div>

                <!-- User Dropdown -->
                <div class="flex items-center gap-4">
                    <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                        :popper="{ placement: 'bottom-start' }">
                        <UAvatar src="https://api-space.tnxg.top/avatar?s=qq" />
                        <template #account="{ item }">
                            <div class="text-left">
                                <p class="text-sm text-gray-500">Signed in as</p>
                                <p class="truncate font-medium text-gray-900">
                                    {{ item.label }}
                                </p>
                            </div>
                        </template>
                        <template #item="{ item }">
                            <span class="truncate">{{ item.label }}</span>
                            <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 ms-auto" />
                        </template>
                    </UDropdown>
                </div>
            </nav>
        </header>
        <slot />
    </div>
</template>
