<template>
    <router-view> </router-view>
</template>

<script setup>
import axios from "axios";
import { onMounted } from "vue";

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
