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
        console.error(error);
    }
});
</script>

<template>
    <BRow v-if="loading">
        <BCol>
            <a-skeleton :paragraph="{ rows: 2 }" active avatar />
        </BCol>
        <BCol>
            <a-skeleton :paragraph="{ rows: 2 }" active avatar />
        </BCol>
        <BCol>
            <a-skeleton :paragraph="{ rows: 2 }" active avatar />
        </BCol>
        <BCol>
            <a-skeleton :paragraph="{ rows: 2 }" active avatar />
        </BCol>
    </BRow>
    <BRow v-else>
        <ClaimsCounterElement :cardsData="cardsData" />
    </BRow>
</template>
