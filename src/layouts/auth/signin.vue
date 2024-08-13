<script setup>
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
                            <input type="text" class="grow border-none focus:ring-0"
                                :placeholder="$t('emailPlaceholder')" />
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="input input-bordered flex items-center gap-2">
                            <Icon name="material-symbols:password" />
                            <input type="password" class="grow border-none focus:ring-0" value="password"
                                :placeholder="$t('passwordPlaceholder')" />
                        </label>
                        <a class="ml-auto inline-block text-sm underline" href="#">
                            {{ $t('forgotPassword') }}
                        </a>
                    </div>

                    <button
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                        type="submit">
                        {{ $t('signIn') }}
                    </button>
                    <!-- <button
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                        Login with Google
                    </button> -->
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