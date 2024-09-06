<script setup>
import Navigation from '@/components/navigation/index.vue'
import { NBackTop } from 'naive-ui'
</script>
<template>
  <Navigation>
    <NuxtPage />
  </Navigation>
  <UNotifications />
  <NBackTop :right="100" />
  <NuxtLoadingIndicator />
</template>