<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import ClaimsCounterElement from "./ClaimsCounterElement.vue";

const cardsData = ref(undefined);
const loading = ref(false);
onMounted(async () => {
    try {
        loading.value = true;
        const headers = {
            company: "BAQVERDE",
            "Content-Type": "application/json",
        };
        const res = await axios.get(
            "https://us-central1-raudoc-gestion-agil.cloudfunctions.net/GET_COUNT_CLAIMS",
            { headers }
        );
        cardsData.value = res.data;
        loading.value = false;
    } catch (error) {
        console.log(error);
    }
});
</script>

<template>
    <BRow>
        <a-skeleton v-if="loading" :paragraph="{ rows: 5 }" active />
        <ClaimsCounterElement :cardsData="cardsData" v-else/>
    </BRow>
</template>
