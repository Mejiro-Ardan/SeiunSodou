<script setup lang="ts">
import Navigation from '@/components/navigation/index.vue';
import { NBackTop, darkTheme, useOsTheme, NConfigProvider } from 'naive-ui';

const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))

</script>
<template>
  <NConfigProvider :theme="theme">
    <Navigation>
      <NuxtPage />
    </Navigation>
    <UNotifications />
    <NBackTop :right="100" />
    <NuxtLoadingIndicator />
  </NConfigProvider>
</template>