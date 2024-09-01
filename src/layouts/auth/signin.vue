<script setup>
import { ref, onMounted, watch } from 'vue';
import sha256 from 'crypto-js/sha256';
import { useAuthStore } from '@/stores/verifyAuth';

const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isSubmitting = ref(false);

const emailInput = ref(null);
const passwordInput = ref(null);

const handleLogin = async () => {
    if (!email.value) {
        passwordInput.value.focus();
        return;
    }

    if (!password.value) {
        toast.add({ title: t('email_password_required'), color: "red" });
        return;
    }

    isSubmitting.value = true;

    try {
        const response = await fetch(`/api/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                password: sha256(password.value).toString(),
            }),
        });

        const data = await response.json();

        if (data.code != 200) {
            toast.add({ title: t(data.message), color: "red" });
        } else {
            toast.add({ title: t(data.message) });
            authStore.setToken(data.token);
        }
    } catch (error) {
        toast.add({ title: error.toString(), color: "red" });
    } finally {
        isSubmitting.value = false;
    }
};

await authStore.initializeToken();
if (authStore.Status && authStore.Status.code === '200') {
    await navigateTo('/auth/');
}

watch(() => authStore.Status, async (newStatus) => {
    if (newStatus && newStatus.code === '200') {
        await navigateTo('/auth/');
    }
});
</script>

<template>
    <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div class="flex items-center justify-center py-12">
            <div class="mx-auto w-[350px] space-y-6">
                <div class="space-y-2 text-center">
                    <h1 class="text-3xl font-bold">{{ $t('welcome') }}</h1>
                    <p class="text-muted-foreground">{{ $t('enterCredentials') }}</p>
                </div>
                <div class="space-y-4">
                    <div class="space-y-2">
                        <label class="input input-bordered flex items-center gap-2">
                            <Icon name="material-symbols:mail-outline" />
                            <input type="text" class="grow border-none focus:ring-0" v-model="email"
                                :placeholder="$t('emailPlaceholder')" @keyup.enter="passwordInput.focus()" ref="emailInput" />
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="input input-bordered flex items-center gap-2">
                            <Icon name="material-symbols:password" />
                            <input type="password" class="grow border-none focus:ring-0" v-model="password"
                                :placeholder="$t('passwordPlaceholder')" @keyup.enter="handleLogin" ref="passwordInput" />
                        </label>
                        <NuxtLink class="ml-auto inline-block text-sm underline" to="/auth/reset">
                            {{ $t('forgotPassword') }}
                        </NuxtLink>
                    </div>
                    <button
                        class="inline-flex text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                        type="button" @click="handleLogin" :disabled="isSubmitting">
                        <span v-if="isSubmitting" class="loading loading-spinner items-center justify-center"></span>
                        <p v-if="!isSubmitting">{{ $t('signIn') }}</p>
                    </button>
                </div>
                <div class="mt-4 text-center text-sm">
                    {{ $t('noAccount') }}{{ " " }}
                    <NuxtLink class="underline" to="/auth/signup">
                        {{ $t('signUp') }}
                    </NuxtLink>
                </div>
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