import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import AOS from 'aos';
import 'aos/dist/aos.css';
import i18n from './i18n';
import store from "./state/store";
import Antd from 'ant-design-vue';

import BootstrapVueNext from 'bootstrap-vue-next';
import vClickOutside from "click-outside-vue3";
import VueApexCharts from "vue3-apexcharts";
import { vMaska } from "maska"

import VueFeather from 'vue-feather';
import VCalendar from 'v-calendar';

//Vue simple acl
import acl from './acl'

// Use plugin with optional defaults

import 'v-calendar/style.css';
import '@/assets/scss/config/minimal/app.scss';
import '@/assets/scss/mermaid.min.css';
import 'ant-design-vue/dist/reset.css';
import 'bootstrap/dist/js/bootstrap.bundle'

import Vue3Toasity from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// import { Button } from 'ant-design-vue';
// import 'ant-design-vue/dist/reset.css';


// FakeBackend authentication
// import { configureFakeBackend } from './services/fake-backend';
// configureFakeBackend();


// Firebase authentication
import { initFirebaseBackend } from './authUtils';

const firebaseConfig = {
    apiKey: process.env.VUE_APP_APIKEY,
    authDomain: process.env.VUE_APP_AUTHDOMAIN,
    databaseURL: process.env.VUE_APP_VUE_APP_DATABASEURL,
    projectId: process.env.VUE_APP_PROJECTId,
    storageBucket: process.env.VUE_APP_STORAGEBUCKET,
    messagingSenderId: process.env.VUE_APP_MEASUREMENTID
};

initFirebaseBackend(firebaseConfig);



AOS.init({
    easing: 'fade-up',
    duration: 1000
});

const app = createApp(App)

app.use(  Vue3Toasity,
    {
      autoClose: 3000,
      // ...
    } )

    app.use(store)
    .use(acl)
    .use(router)
    .use(VueApexCharts)
    .use(BootstrapVueNext)
    .component(VueFeather.type, VueFeather)
    .directive("maska", vMaska)
    .use(i18n)
    .use(Antd)
    .use(VCalendar, {})
    .use(vClickOutside).mount('#app');