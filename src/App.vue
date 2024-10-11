<template>
    <router-view> </router-view>
</template>

<script setup>
import axios from "axios";
import { onMounted } from "vue";
import { getMessaging, onMessage } from "firebase/messaging";

onMounted(() => {
    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/TDRS_LIST_V1`,
        headers: {
            company: "BAQVERDE",
        },
    };

    axios
        .request(config)
        .then((response) => {
            sessionStorage.setItem("tdrs", JSON.stringify(response.data));
        })
        .catch((error) => {
            console.error(error);
        });
    
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then((registration) => {
            console.info('Service Worker register: ', registration.scope);
            }).catch((err) => {
            console.error('Error al registrar el Service Worker:', err);
        });
}
});

const messaging = getMessaging();
onMessage(messaging, (payload) => {
  console.log('Mensaje recibido en primer plano:', payload);
  // Aquí puedes mostrar una notificación o actualizar la UI
});
</script>

<style>
*::-webkit-scrollbar {
    width: 6px; /* width of the entire scrollbar */
    height: 6px; /* width of the entire scrollbar */
}

*::-webkit-scrollbar-track {
    background: transparent; /* color of the tracking area */
}

*::-webkit-scrollbar-thumb {
    background-color: #e5e5e9; /* color of the scroll thumb */
    border-radius: 20px; /* roundness of the scroll thumb */
}

body::-webkit-scrollbar-thumb {
    background-color: rgba(
        var(--vz-primary-rgb),
        1
    ); /* color of the scroll thumb */
    border-radius: 20px; /* roundness of the scroll thumb */
}
</style>
