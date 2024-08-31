import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        Status: null,
        userInfo: null,
    }),
    actions: {
        async setToken(token) {
            this.token = token;
            Cookies.set('token', token); // 不设置 expires 选项
            await this.verify();
        },
        clearToken() {
            this.token = null;
            this.Status = null;
            this.userInfo = null;
            Cookies.remove('token');
            Cookies.remove('userInfoCache');
        },
        async verify() {
            if (!this.token) {
                this.Status = { code: "403", message: "token_invalid", status: "failed" };
                Cookies.remove('token');
                return this.Status;
            }
            try {
                const response = await fetch(`/api/status/verify_auth`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                const data = await response.json();
                if (data.code === "200") {
                    this.Status = { code: "200", message: "login_success", uid: data.uid, tokenCreated: data.tokenCreated, status: "success" };
                } else if (data.code === "403") {
                    this.Status = { code: "403", message: "token_expired", status: "failed" };
                    Cookies.remove('token');
                }
            } catch (error) {
                this.Status = { code: "500", message: "server_error", status: "failed" };
            }
            return this.Status;
        },
        async initializeToken() {
            const token = Cookies.get('token');
            if (token) {
                this.token = token;
                await this.verify();
            }
        },
        async get_userinfo() {
            const token = Cookies.get('token');
            if (token) {
                this.token = token;
                const tokenStatus = await this.verify();
                if (tokenStatus.code == "200") {
                    const cachedUserInfo = Cookies.get('userInfoCache');
                    if (cachedUserInfo) {
                        this.userInfo = JSON.parse(cachedUserInfo);
                    }
                    try {
                        const response = await fetch(`/api/auth/userinfo`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.token}`
                            }
                        });
                        const data = await response.json();
                        if (response.ok) {
                            this.userInfo = data;
                            Cookies.set('userInfoCache', JSON.stringify(data)); // 不设置 expires 选项
                            return data;
                        } else {
                            this.Status = { code: response.status, message: data.message, status: "failed" };
                        }
                    } catch (error) {
                        this.Status = { code: "500", message: "server_error", status: "failed" };
                    }
                }
            }
        }
    }
});