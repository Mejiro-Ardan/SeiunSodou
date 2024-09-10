<script setup>
import { useAuthStore } from '@/stores/verifyAuth';

import Footer from '@/components/Footer.vue'
import WriteNavigationRight from '@/components/navigation/WriteNavigationRight.vue';
import WritePanel from '@/components/WritePanel.vue'

const authStore = useAuthStore();

await authStore.initializeToken();

if (authStore.Status && authStore.Status.code !== '200') {
  await navigateTo('/auth/');
}

watch(() => authStore.Status, async (newStatus) => {
  if (newStatus && newStatus.code !== '200') {
    await navigateTo('/auth/');
  }
});

</script>

<template>
  <WriteNavigationRight>
    <WritePanel />
    <Footer />
  </WriteNavigationRight>
</template>
