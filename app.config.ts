export const appConfig = {
    SiteConfig: {
        title: '星雲草堂SeiunSodou',
        description: '私たちの物語を再描く',
        SiteURL: 'https://moefan.top',
        Language: 'zh-CN',
    },
    NavigationTopConfig: {
        sections: [
            {
                name: 'home',
                icon: 'mdi:home',
                path: '/'
            },
            {
                name: 'write',
                icon: 'jam:write',
                path: '/write'
            },
        ],
        copyright: {
            StartDate: 2024,
            text: '© {{date}} 星雲草堂SeiunSodou.'
        }
    },
};

export default {
    ui: {
        notifications: {
            // Show toasts at the top right of the screen
            position: 'top-0 bottom-[unset]'
        }
    },
    appConfig
};