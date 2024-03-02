import { defineStore } from 'pinia'
export const useThemeStore = defineStore('theme', {
    state: () => ({
        theme: localStorage.getItem('theme') || 'system',
        mode: localStorage.getItem('mode') || 'light',
    }),
    actions: {
        async loadTheme() {
            this.theme = localStorage.getItem("theme") || 'system';
            this.mode = localStorage.getItem("mode") || 'light';
        },
        setTheme(theme) {
            this.theme = theme;
            localStorage.setItem('theme',theme);

            const root = document.documentElement;
            root.classList.remove('dark','light');
            if (theme === 'dark') {
                root.classList.add('dark');
                localStorage.setItem("mode",'dark');
            } else if (theme === 'light') {
                root.classList.add('light');
                localStorage.setItem("mode",'light');
            } else if (theme === 'system') {
              const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)").matches ;
              if (darkThemeMq) {
                root.classList.add('dark');
                localStorage.setItem("mode",'dark');
              } else {
                root.classList.add('light');
                localStorage.setItem("mode",'light');
              }

            }
            this.mode = localStorage.getItem("mode");
        }
    }
})