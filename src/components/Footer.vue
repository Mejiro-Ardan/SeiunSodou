<template>
    <footer class="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
        <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <div class="sm:flex sm:items-center sm:justify-between">
                <div class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                    <NuxtImg src="https://cdn.moefan.top/images/050fe041134042b25e3e660317daa2ad.png" class="h-8"
                        alt="SeiunSodou Logo" />
                    <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        {{ $t('Sitename') }}</span>
                </div>
                <ul
                    class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                    <li>
                        <a href="#" class="hover:underline me-4 md:me-6">{{ $t('About') }}</a>
                    </li>
                    <li>
                        <a href="#" class="hover:underline me-4 md:me-6">{{ $t('PrivacyPolicy') }}</a>
                    </li>
                    <li>
                        <a href="#" class="hover:underline me-4 md:me-6">{{ $t('Licensing') }}</a>
                    </li>
                    <li>
                        <a href="#" class="hover:underline">{{ $t('Contact') }}</a>
                    </li>
                </ul>
            </div>
            <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
                © {{ new Date().getFullYear() }} <a class="text-text-primary hover:underline">{{
                    $t('Sitename') }}</a>. {{ $t('AllRightsReserved') }}
            </span>
        </div>
    </footer>
</template>