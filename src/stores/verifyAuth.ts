import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#imports';

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: null,
        Status: null,
        userInfo: null,
    }),
    actions: {
        async setToken(token: string) {
            this.token = token;
            const tokenCookie = useCookie('token');
            tokenCookie.value = token;
            await this.verify();
        },
        clearToken() {
            this.token = null;
            this.Status = null;
            this.userInfo = null;
            const tokenCookie = useCookie('token');
            const userInfoCookie = useCookie('userInfoCache');
            tokenCookie.value = null;
            userInfoCookie.value = null;
        },
        async verify(): Promise<Status | null> {
            const RuntimeConfig = useRuntimeConfig();
            try {
                const data: any = await $fetch('/api/status/verify_auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    baseURL: RuntimeConfig.public.baseURL
                });
                if (data.code === "200") {
                    this.Status = { code: "200", message: "login_success", uid: data.uid, tokenCreated: data.tokenCreated, status: "success" };
                } else if (data.code === "403") {
                    this.Status = { code: "403", message: "token_expired", status: "failed" };
                    const tokenCookie = useCookie('token');
                    tokenCookie.value = null;
                }
            } catch (error) {
                this.Status = { code: "500", message: "server_error", status: "failed", error: `${error}` };
            }
            return this.Status;
        },
        async initializeToken(): Promise<Status | null> {
            const tokenCookie = useCookie('token');
            const token = tokenCookie.value;
            if (token) {
                this.token = token;
                return await this.verify();
            } else {
                this.Status = { code: "403", message: "token_invalid", status: "failed" };
                return this.Status;
            }
        },
        async get_userinfo(): Promise<UserInfo | null> {
            const RuntimeConfig = useRuntimeConfig();
            const tokenCookie = useCookie('token');
            const token = tokenCookie.value;

            if (token) {
                this.token = token;
                const tokenStatus = await this.verify();

                if (tokenStatus?.code == "200") {
                    const userInfoCookie = useCookie('userInfoCache');
                    const cachedUserInfo = userInfoCookie.value;

                    if (cachedUserInfo) {
                        this.userInfo = JSON.parse(cachedUserInfo);
                    }

                    try {
                        const data = await $fetch<UserInfo>('/api/auth/userinfo', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.token}`
                            },
                            baseURL: RuntimeConfig.public.baseURL
                        });
                        if (data) {
                            this.userInfo = data;
                            userInfoCookie.value = JSON.stringify(data);
                            return data;
                        } else {
                            this.Status = { code: "404", message: "user_not_found", status: "failed" };
                        }
                    } catch (error) {
                        this.Status = { code: "500", message: "server_error", status: "failed" };
                    }
                }
            }
            return null;
        }
    }
});
