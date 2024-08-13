<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import NavigationRight from '@/components/navigation/NavigationRight.vue';
import NavigationTop from '@/components/navigation/NavigationTop.vue';

const route = useRoute();

const isMainPage = ref(route.path === '/');

watch(route, (newRoute) => {
    isMainPage.value = newRoute.path === '/';
});

</script>

<template>
    <NavigationTop>
        <template v-if="isMainPage">
            <NavigationRight>
                <slot />
            </NavigationRight>
        </template>
        <template v-else>
            <slot />
        </template>
    </NavigationTop>
</template>