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
        defaultTheme: 'dark',
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
    let response;
    if (window.location.hostname === 'odi.denv.it') {
        // Mock on GitHub pages
        response = await fetch('/settings-mock.json');
    } else {
        response = await fetch('/settings.json');
    }
    window._settings = await response.json();
};

app.use(createPinia())
app.use(router)
app.use(vuetify)

loadSettings().then(() => {
    app.mount('#app')
});
