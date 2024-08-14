import { defineStore } from 'pinia';
import { Api_Endpoint } from '@/config';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        sessionStatus: null,
    }),
    actions: {
        async setToken(token) {
            this.token = token;
            localStorage.setItem('token', token);
            await this.verifySession();
        },
        clearToken() {
            this.token = null;
            this.sessionStatus = null;
            localStorage.removeItem('token');
        },
        async verifySession() {
            if (!this.token) {
                this.sessionStatus = { code: "403", message: "token_invalid", status: "failed" };
                localStorage.removeItem('token');
                return this.sessionStatus;
            }

            try {
                const response = await fetch(`${Api_Endpoint}/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: this.token })
                });

                const data = await response.json();

                if (data.code === "200") {
                    this.sessionStatus = { code: "200", message: "login_success", uid: data.uid, tokenCreated: data.tokenCreated, token: this.token, status: "success" };
                } else if (data.code === "403") {
                    this.sessionStatus = { code: "403", message: "token_expired", status: "failed" };
                    localStorage.removeItem('token');
                }
            } catch (error) {
                this.sessionStatus = { code: "500", message: "server_error", status: "failed" };
            }

            return this.sessionStatus;
        },
        async initializeToken() {
            const token = localStorage.getItem('token');
            if (token) {
                this.token = token;
                await this.verifySession();
            }
        }
    }
});