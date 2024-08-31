<script setup>
import { ref, computed } from 'vue';
import sha256 from 'crypto-js/sha256';

const { t } = useI18n();
const toast = useToast();

const email = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const captchaCode = ref(Array(6).fill('')); // 初始化为6个空字符串

const emailTouched = ref(false);
const newPasswordTouched = ref(false);
const confirmNewPasswordTouched = ref(false);
const sendCaptchaStatus = ref(false);
const isSubmitting = ref(false);

const passwordsMatch = computed(() => newPassword.value === confirmNewPassword.value);
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const isPasswordValid = computed(() => {
    const passwordValue = newPassword.value;
    const hasNumber = /\d/.test(passwordValue);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
    const hasLetter = /[a-zA-Z]/.test(passwordValue);
    const validLength = passwordValue.length >= 8;
    const validCharTypes = [hasNumber, hasSpecialChar, hasLetter].filter(Boolean).length >= 2;
    return validLength && validCharTypes;
});
const isCaptchaComplete = computed(() => captchaCode.value.every(code => code.length > 0));

const focusNextInput = (el, prevId, nextId) => {
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

const sendCaptcha = async () => {
    sendCaptchaStatus.value = true;
    try {
        const response = await fetch('/api/auth/send_mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.value, type: 'reset' }),
        });
        const data = await response.json();
        if (data.code !== 200) {
            toast.add({ title: t(data.message), color: "red" });
            sendCaptchaStatus.value = false;
        } else {
            toast.add({ title: t(data.message) });
            sendCaptchaStatus.value = false;
        }
    } catch (error) {
        toast.add({ title: error.toString(), color: "red" });
        sendCaptchaStatus.value = false;
    }
};

const handleSubmit = async () => {
    const formData = {
        email: email.value,
        newPassword: sha256(newPassword.value).toString(),
        code: captchaCode.value.join(''),
        type: 'reset',
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
        if (data.code !== 200) {
            toast.add({ title: t(data.message), color: "red" });
        } else {
            toast.add({ title: t(data.message) });
            toast.add({ title: t('redirecting_to_signin') });
            await navigateTo('/auth/signin');
        }
    } catch (error) {
        toast.add({ title: error.toString(), color: "red" });
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    document.querySelectorAll('[data-focus-input-init]').forEach(function (element) {
        element.addEventListener('keyup', function () {
            const prevId = this.getAttribute('data-focus-input-prev');
            const nextId = this.getAttribute('data-focus-input-next');
            focusNextInput(this, prevId, nextId);
        });
    });
});
</script>

<template>
    <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div class="flex items-center justify-center py-12">
            <div class="mx-auto w-[350px] space-y-6">
                <div class="space-y-2 text-center">
                    <h1 class="text-3xl font-bold">{{ $t('resetPassword') }}</h1>
                    <p class="text-muted-foreground">{{ $t('resetDescription') }}</p>
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
                    <!-- 新密码输入 -->
                    <div class="space-y-2">
                        <label class="input input-bordered flex items-center gap-2"
                            :class="{ 'border-red-500': newPasswordTouched && !isPasswordValid }">
                            <Icon name="material-symbols:password" />
                            <input type="password" v-model="newPassword" class="grow border-none focus:ring-0"
                                :placeholder="$t('newPasswordPlaceholder')" />
                        </label>
                        <p v-if="newPasswordTouched && !isPasswordValid" class="text-red-500 text-sm">
                            {{ $t('invalidPassword') }}
                        </p>
                    </div>
                    <!-- 确认新密码输入 -->
                    <div class="space-y-2">
                        <label class="input input-bordered flex items-center gap-2"
                            :class="{ 'border-red-500': confirmNewPasswordTouched && !passwordsMatch }">
                            <Icon name="material-symbols:password" />
                            <input type="password" v-model="confirmNewPassword" class="grow border-none focus:ring-0"
                                :placeholder="$t('confirmNewPasswordPlaceholder')" />
                        </label>
                        <p v-if="confirmNewPasswordTouched && !passwordsMatch" class="text-red-500 text-sm">
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
                                <button @click.prevent="sendCaptcha" :disabled="sendCaptchaStatus"
                                    class="relative px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
                                    <span v-if="sendCaptchaStatus"
                                        class="loading loading-spinner items-center justify-center"></span>
                                    {{ sendCaptchaStatus ? $t('sendingCaptcha') : $t('sendCaptcha') }}
                                </button>
                            </div>
                        </form>
                    </div>
                    <!-- 提交按钮 -->
                    <button @click.prevent="handleSubmit"
                        :disabled="!isEmailValid || !isPasswordValid || !passwordsMatch || !emailTouched || !newPasswordTouched || !confirmNewPasswordTouched || !isCaptchaComplete || isSubmitting"
                        class="inline-flex text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                        type="submit">
                        <span v-if="isSubmitting" class="loading loading-spinner items-center justify-center"></span>
                        <p v-if="!isSubmitting">{{ $t('resetPassword') }}</p>
                    </button>
                </div>
                <!-- 提示返回登录 -->
                <div class="mt-4 text-center text-sm">
                    {{ $t('rememberPassword') }}{{ " " }}
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
