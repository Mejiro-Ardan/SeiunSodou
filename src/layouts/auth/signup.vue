<script setup>
import { onMounted } from 'vue';
import { useCaptchaStore } from '@/stores/captchaStore';

const captchaStore = useCaptchaStore();
const toast = useToast();

// Simple function to automatically focus on the next input
function focusNextInput(el, prevId, nextId) {
    if (el.value.length === 0) {
        if (prevId) {
            document.getElementById(prevId).focus();
        }
    } else {
        if (nextId) {
            document.getElementById(nextId).focus();
        }
    }
}

// Initialize focus behavior for verification code inputs
onMounted(() => {
    captchaStore.initializeCountdown();

    document.querySelectorAll('[data-focus-input-init]').forEach(function (element) {
        element.addEventListener('keyup', function () {
            const prevId = this.getAttribute('data-focus-input-prev');
            const nextId = this.getAttribute('data-focus-input-next');
            focusNextInput(this, prevId, nextId);
        });
    });
});

const sendCaptcha = () => {
    if (captchaStore.isCaptchaSent) {
        toast.add({ title: '验证码已发送，请稍等片刻再试。' });
        return;
    }

    // 发送验证码逻辑
    toast.add({ title: '验证码已发送，请查收邮件。' });
    captchaStore.startCountdown(); // 开始倒计时
};
</script>

<template>
    <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div class="flex items-center justify-center py-12">
            <div class="mx-auto w-[350px] space-y-6">
                <div class="space-y-2 text-center">
                    <h1 class="text-3xl font-bold">{{ $t('createAccount') }}</h1>
                    <p class="text-muted-foreground">{{ $t('joinDescription') }}</p>
                </div>
                <div class="space-y-4">
                    <!-- Form Fields -->
                    <div class="space-y-2">
                        <label class="input flex items-center gap-2">
                            <Icon name="material-symbols:mail-outline" />
                            <input type="text" class="grow border-none focus:ring-0"
                                :placeholder="$t('emailPlaceholder')" />
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="input flex items-center gap-2">
                            <Icon name="material-symbols:password" />
                            <input type="password" class="grow border-none focus:ring-0"
                                :placeholder="$t('passwordPlaceholder')" />
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="input flex items-center gap-2">
                            <Icon name="material-symbols:password" />
                            <input type="password" class="grow border-none focus:ring-0"
                                :placeholder="$t('confirmPasswordPlaceholder')" />
                        </label>
                    </div>

                    <!-- Captcha Input and Button -->
                    <div class="space-y-2">
                        <form class="max-w-sm mx-auto">
                            <p id="helper-text-explanation" class="mb-2 text-sm text-gray-500 text-center">{{
                                $t('captchaPlaceholder') }}</p>
                            <div class="flex mb-2 space-x-2 rtl:space-x-reverse justify-center">
                                <div v-for="index in 6" :key="index">
                                    <input type="text" :id="'code-' + index"
                                        :data-focus-input-prev="'code-' + (index - 1)"
                                        :data-focus-input-next="'code-' + (index + 1)" maxlength="1"
                                        class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                        data-focus-input-init required />
                                </div>
                            </div>
                            <div class="flex justify-center">
                                <button @click.prevent="sendCaptcha"
                                    :class="captchaStore.isCaptchaSent ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 transition-colors'"
                                    class="px-4 py-2 rounded-md">
                                    {{ captchaStore.isCaptchaSent ? $t('captchaSent') + ' (' + captchaStore.countdown +
                                    's)' : $t('sendCaptcha') }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Sign Up Button -->
                    <button
                        class="inline-flex text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                        type="submit">
                        {{ $t('signUp') }}
                    </button>
                </div>

                <!-- Already have an account -->
                <div class="mt-4 text-center text-sm">
                    {{ $t('alreadyHaveAccount') }}{{ " " }}
                    <NuxtLink class="underline" to="/auth/signin">
                        {{ $t('signIn') }}
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Right Side (Optional) -->
        <div class="hidden bg-muted lg:block">
            <div class="flex h-full flex-col items-center justify-center gap-6 px-4 md:px-6">
                <div class="grid gap-4 text-center">
                    <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl">{{ $t('trustedBy') }}</h2>
                    <p
                        class="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {{ $t('description') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
