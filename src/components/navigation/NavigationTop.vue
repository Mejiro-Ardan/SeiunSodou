<script setup>
import { SidebarConfig } from '@/config';

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
        click: () => {
            console.log('Sign out')
        }
    }]
]

</script>
<template>
    <div class="flex flex-col w-full min-h-screen">
        <header class="flex bg-white items-center h-16 px-4 border-b shrink-0 md:px-6">
            <nav
                class="flex-col hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
                <div class="flex items-center h-16 w-auto">
                    <div class="mask mask-squircle w-12 h-12 overflow-hidden">
                        <img src="https://cdn.moefan.top/images/050fe041134042b25e3e660317daa2ad.png" loading="lazy"
                            alt="logo" class="w-full h-full object-cover" />
                    </div>
                </div>
                <template v-for="item in SidebarConfig.sections" :key="index">
                    <NuxtLink role="button" :to="item.path"
                        :class="{ 'font-bold': $route.path === item.path, 'text-muted-foreground': $route.path !== item.path }"
                        class="text-base btn">
                        {{ $t(item.name) }}
                    </NuxtLink>
                </template>
                <div class="flex items-center ml-auto gap-4 md:gap-2 lg:gap-4">
                    <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                        :popper="{ placement: 'bottom-start' }">
                        <UAvatar src="https://api-space.tnxg.top/avatar?s=qq" />
                        <template #account="{ item }">
                            <div class="text-left">
                                <p>
                                    Signed in as
                                </p>
                                <p class="truncate font-medium text-gray-900 dark:text-white">
                                    {{ item.label }}
                                </p>
                            </div>
                        </template>
                        <template #item="{ item }">
                            <span class="truncate">{{ item.label }}</span>
                            <UIcon :name="item.icon"
                                class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                        </template>
                    </UDropdown>
                </div>
            </nav>
        </header>
        <slot />
    </div>
</template>