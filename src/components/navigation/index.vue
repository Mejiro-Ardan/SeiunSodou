<script setup>
import { ref } from 'vue';
import NavigationRight from '@/components/navigation/NavigationRight.vue';
import NavigationTop from '@/components/navigation/NavigationTop.vue';

import { useRoute } from 'vue-router';

const route = useRoute();

const isMainPage = ref(route.path === '/');

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