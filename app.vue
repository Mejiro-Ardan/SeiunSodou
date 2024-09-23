<script setup>
import Navigation from '@/components/navigation/index.vue';
import { NBackTop, darkTheme, useOsTheme } from 'naive-ui';

const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))

</script>
<template>
  <Navigation>
    <NuxtPage />
  </Navigation>
  <UNotifications />
  <NBackTop :right="100" :theme="theme" />
  <NuxtLoadingIndicator />
</template>