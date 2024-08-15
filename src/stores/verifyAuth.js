import { defineStore } from 'pinia';

import { useRuntimeConfig } from '#app';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        Status: null,
    }),
    actions: {
        async setToken(token) {
            this.token = token;
            localStorage.setItem('token', token);
            await this.verify();
        },
        clearToken() {
            this.token = null;
            this.Status = null;
            localStorage.removeItem('token');
        },
        async verify() {
            const runtimeConfig = useRuntimeConfig();
            const Api_Endpoint = runtimeConfig.public.Api_Endpoint;
            
            if (!this.token) {
                this.Status = { code: "403", message: "token_invalid", status: "failed" };
                localStorage.removeItem('token');
                return this.Status;
            }
            try {
                const response = await fetch(`${Api_Endpoint}/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                const data = await response.json();
                if (data.code === "200") {
                    this.Status = { code: "200", message: "login_success", uid: data.uid, tokenCreated: data.tokenCreated, token: this.token, status: "success" };
                } else if (data.code === "403") {
                    this.Status = { code: "403", message: "token_expired", status: "failed" };
                    localStorage.removeItem('token');
                }
            } catch (error) {
                this.Status = { code: "500", message: "server_error", status: "failed" };
            }
            return this.Status;
        },
        async initializeToken() {
            const token = localStorage.getItem('token');
            if (token) {
                this.token = token;
                await this.verify();
            }
        }
    }
});