import { defineStore } from 'pinia';

export const useCaptchaStore = defineStore('captcha', {
    state: () => ({
        isCaptchaSent: false,
        countdown: 0,
        lastSentTime: null,
    }),
    actions: {
        startCountdown() {
            this.isCaptchaSent = true;
            this.countdown = 60; // 60秒倒计时
            this.lastSentTime = Date.now();
            localStorage.setItem('lastSentTime', this.lastSentTime);

            const intervalId = setInterval(() => {
                const elapsed = Math.floor((Date.now() - this.lastSentTime) / 1000);
                this.countdown = Math.max(60 - elapsed, 0);
                localStorage.setItem('countdown', this.countdown);

                if (this.countdown === 0) {
                    clearInterval(intervalId);
                    this.isCaptchaSent = false;
                    localStorage.removeItem('lastSentTime');
                    localStorage.removeItem('countdown');
                }
            }, 1000);
        },
        initializeCountdown() {
            const storedLastSentTime = localStorage.getItem('lastSentTime');

            if (storedLastSentTime) {
                this.lastSentTime = parseInt(storedLastSentTime, 10);
                const elapsed = Math.floor((Date.now() - this.lastSentTime) / 1000);

                if (elapsed < 60) {
                    this.isCaptchaSent = true;
                    this.countdown = 60 - elapsed;

                    const intervalId = setInterval(() => {
                        const newElapsed = Math.floor((Date.now() - this.lastSentTime) / 1000);
                        this.countdown = Math.max(60 - newElapsed, 0);
                        localStorage.setItem('countdown', this.countdown);

                        if (this.countdown === 0) {
                            clearInterval(intervalId);
                            this.isCaptchaSent = false;
                            localStorage.removeItem('lastSentTime');
                            localStorage.removeItem('countdown');
                        }
                    }, 1000);
                } else {
                    localStorage.removeItem('lastSentTime');
                    localStorage.removeItem('countdown');
                }
            }
        },
    },
});