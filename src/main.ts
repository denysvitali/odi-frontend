import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import {aliases, mdi} from "vuetify/iconsets/mdi";
import {createVuetify} from 'vuetify';
import {md3} from "vuetify/blueprints";
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import './assets/main.css'
import type {Settings} from "@/types/settings";

const app = createApp(App)

const vuetify = createVuetify({
    blueprint: md3,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    },
    theme: {
        defaultTheme: 'system',
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#1976D2',
                    secondary: '#424242',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                },
            },
            dark: {
                dark: true,
                colors: {
                    primary: '#2196F3',
                    secondary: '#424242',
                    accent: '#FF4081',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                },
            },
        },
        options: {
            customProperties: true,
            variations: false,
        },
    },
    components,
    directives,
});

declare global {
    interface Window {
        _settings: Settings;
    }
}

// Load settings
const loadSettings = async() => {
    window._settings = await (await fetch('/settings.json')).json();
};

app.use(createPinia())
app.use(router)
app.use(vuetify)

loadSettings().then(() => {
    app.mount('#app')
});
