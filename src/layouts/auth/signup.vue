<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import sha256 from 'crypto-js/sha256';
import { useCaptchaStore } from '@/stores/captchaStore';
import { useAuthStore } from '@/stores/verifyAuth';

const { t } = useI18n();
const authStore = useAuthStore();

const captchaStore = useCaptchaStore();
const toast = useToast();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const captchaCode = ref(Array(6).fill(''));
const emailTouched = ref(false);
const passwordTouched = ref(false);
const confirmPasswordTouched = ref(false);
const isAgreementAccepted = ref(false);
const sendCaptchaStatus = ref(false);
const isSubmitting = ref(false);

const passwordsMatch = computed(() => password.value === confirmPassword.value);
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const isPasswordValid = computed(() => {
    const passwordValue = password.value;
    const hasNumber = /\d/.test(passwordValue);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
    const hasLetter = /[a-zA-Z]/.test(passwordValue);
    const validLength = passwordValue.length >= 8;
    const validCharTypes = [hasNumber, hasSpecialChar, hasLetter].filter(Boolean).length >= 2;
    return validLength && validCharTypes;
});
const isCaptchaComplete = computed(() => captchaCode.value.every(code => code.length > 0));

watch([email, password, confirmPassword], () => {
    if (email.value) emailTouched.value = true;
    if (password.value) passwordTouched.value = true;
    if (confirmPassword.value) confirmPasswordTouched.value = true;
});

watch(() => authStore.Status, async (newStatus) => {
    if (newStatus && newStatus.code === '200') {
        await navigateTo('/auth/');
    }
});
const focusNextInput = (el, prevId, nextId) => {
    if (el.value.length === 1) {
        // 当输入长度为1时，才进行焦点移动，防止粘贴多个字符时立即跳转
        if (nextId) {
            document.getElementById(nextId).focus();
        }
    } else if (el.value.length === 0 && prevId) {
        // 如果当前输入框被清空，则回到上一个输入框
        document.getElementById(prevId).focus();
    } else if (el.value.length > 1) {
        // 如果是复制粘贴了多个字符，分配到各个输入框中
        const chars = el.value.split('');
        el.value = chars[0]; // 保留第一个字符
        for (let i = 1; i < chars.length; i++) {
            const nextEl = document.getElementById(nextId);
            if (nextEl) {
                nextEl.value = chars[i];
                nextId = nextEl.getAttribute('data-focus-input-next');
            } else {
                break;
            }
        }
        // 聚焦到最后一个被填入字符的输入框
        if (nextId) {
            document.getElementById(nextId).focus();
        }
    }
};

await authStore.initializeToken();
if (authStore.Status && authStore.Status.code === '200') {
    await navigateTo('/auth/');
}

onMounted(async () => {

    captchaStore.initializeCountdown();

    document.querySelectorAll('[data-focus-input-init]').forEach(function (element) {
        element.addEventListener('keyup', function () {
            const prevId = this.getAttribute('data-focus-input-prev');
            const nextId = this.getAttribute('data-focus-input-next');
            focusNextInput(this, prevId, nextId);
        });
    });
});

const sendCaptcha = async () => {
    sendCaptchaStatus.value = true
    if (captchaStore.isCaptchaSent) {
        toast.add({ title: t('captchaSent') });
        return;
    }
    try {
        const response = await fetch('/api/auth/send_mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.value, type: 'signup' })
        });
        const data = await response.json();
        if (data.code != 200) {
            if (data.message == 'wait_before_resend') {
                toast.add({ title: t(data.message).replace('[wait_time]', String(data.wait_time)), color: "red", icon: "material-symbols:error-outline" })
                sendCaptchaStatus.value = false
            } else {
                toast.add({ title: t(data.message), color: "red", icon: "material-symbols:error-outline" })
                sendCaptchaStatus.value = false
            }
        } else {
            toast.add({ title: t(data.message) })
            sendCaptchaStatus.value = false
        }
    } catch (error) {
        toast.add({ title: error, color: "red", icon: "material-symbols:error-outline" })
        sendCaptchaStatus.value = false
    }
};

const handleSubmit = async () => {
    // 获取表单数据
    const formData = {
        email: email.value,
        password: sha256(password.value).toString(),
        code: captchaCode.value.join(''),
        type: 'signup',
    };

    isSubmitting.value = true;

    try {
        const response = await fetch('/api/auth/verify_mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.code != 200) {
            toast.add({ title: t(data.message), color: "red", icon: "material-symbols:error-outline" })
        } else {
            toast.add({ title: t(data.message) })
            toast.add({ title: t('redirecting_to_login') })
            await navigateTo('/auth/signin');
        }
    } catch (error) {
        toast.add({ title: error, color: "red", icon: "material-symbols:error-outline" })
    } finally {
        isSubmitting.value = false;
    }
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
                    <!-- 邮箱输入 -->
                    <div class="space-y-2">
                        <label class="input input-bordered flex items-center gap-2"
                            :class="{ 'border-red-500': emailTouched && !isEmailValid }">
                            <Icon name="material-symbols:mail-outline" />
                            <input type="text" v-model="email" class="grow border-none focus:ring-0"
                                :placeholder="$t('emailPlaceholder')" />
                        </label>
                        <p v-if="emailTouched && !isEmailValid" class="text-red-500 text-sm">
                            {{ $t('invalidEmail') }}
                        </p>
                    </div>
                    <!-- 密码输入 -->
                    <div class="space-y-2">
                        <label class="input input-bordered flex items-center gap-2"
                            :class="{ 'border-red-500': passwordTouched && !isPasswordValid }">
                            <Icon name="material-symbols:password" />
                            <input type="password" v-model="password" class="grow border-none focus:ring-0"
                                :placeholder="$t('passwordPlaceholder')" />
                        </label>
                        <p v-if="passwordTouched && !isPasswordValid" class="text-red-500 text-sm">
                            {{ $t('invalidPassword') }}
                        </p>
                    </div>
                    <!-- 确认密码输入 -->
                    <div class="space-y-2">
                        <label class="input input-bordered flex items-center gap-2"
                            :class="{ 'border-red-500': confirmPasswordTouched && !passwordsMatch }">
                            <Icon name="material-symbols:password" />
                            <input type="password" v-model="confirmPassword" class="grow border-none focus:ring-0"
                                :placeholder="$t('confirmPasswordPlaceholder')" />
                        </label>
                        <p v-if="confirmPasswordTouched && !passwordsMatch" class="text-red-500 text-sm">
                            {{ $t('passwordsDoNotMatch') }}
                        </p>
                    </div>
                    <!-- 验证码输入 -->
                    <div v-show="isEmailValid" class="space-y-2">
                        <form class="max-w-sm mx-auto">
                            <p id="helper-text-explanation" class="mb-2 text-sm text-gray-500 text-center">
                                {{ $t('captchaPlaceholder') }}</p>
                            <div class="flex mb-2 space-x-2 rtl:space-x-reverse justify-center">
                                <div v-for="(code, index) in captchaCode" :key="index">
                                    <label :for="'code-' + index" class="sr-only">{{ index }} code</label>
                                    <input type="text" v-model="captchaCode[index]" :id="'code-' + index"
                                        :data-focus-input-prev="'code-' + (index - 1)"
                                        :data-focus-input-next="'code-' + (index + 1)" maxlength="1"
                                        class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                        data-focus-input-init required />
                                </div>
                            </div>
                            <div class="flex justify-center">
                                <button @click.prevent="sendCaptcha" :disabled="captchaStore.isCaptchaSent"
                                    class="relative px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
                                    <span v-if="sendCaptchaStatus"
                                        class="loading loading-spinner items-center justify-center"></span>
                                    {{ captchaStore.isCaptchaSent ? $t('captchaSent') + ' (' +
                                        captchaStore.countdown + 's)' : $t('sendCaptcha') }}
                                </button>
                            </div>
                        </form>
                    </div>
                    <!-- 用户协议复选框 -->
                    <div class="flex items-center">
                        <input id="link-checkbox" type="checkbox" v-model="isAgreementAccepted"
                            class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                        <label for="link-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                            $t('agreeToTerms') }}
                            <NuxtLink class="underline" to="/terms">
                                {{ $t('termsAndConditions') }}
                            </NuxtLink>
                        </label>
                    </div>
                    <!-- 提交按钮 -->
                    <button @click.prevent="handleSubmit"
                        :disabled="!isEmailValid || !isPasswordValid || !passwordsMatch || !emailTouched || !passwordTouched || !confirmPasswordTouched || !isCaptchaComplete || !isAgreementAccepted || isSubmitting"
                        class="inline-flex text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                        type="submit">
                        <span v-if="isSubmitting" class="loading loading-spinner items-center justify-center"></span>
                        <p v-if="!isSubmitting">{{ $t('signUp') }}</p>
                    </button>
                </div>
                <!-- 已有账号提示 -->
                <div class="mt-4 text-center text-sm">
                    {{ $t('alreadyHaveAccount') }}{{ " " }}
                    <NuxtLink class="underline" to="/auth/signin">
                        {{ $t('signIn') }}
                    </NuxtLink>
                </div>
            </div>
        </div>
        <!-- 右侧背景 -->
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
