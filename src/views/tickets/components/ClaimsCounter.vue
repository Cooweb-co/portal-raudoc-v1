
<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import ClaimsCounterElement from "./ClaimsCounterElement.vue"

const cardsData = ref([]);
onMounted(async () => {
    try {
        // this.loading = true;
        const headers = {
            company: "BAQVERDE",
            "Content-Type": "application/json",
        };
        await axios
            .get(
                "https://us-central1-raudoc-gestion-agil.cloudfunctions.net/GET_COUNT_CLAIMS",
                { headers }
            )
            .then((response) => {
                cardsData.value = response.data;
                console.log(response)
            });
    } catch (error) {
        console.log(error);
    }
});
</script>

<template>
    <BRow>
          <ClaimsCounterElement :cardsData="cardsData"/>
    </BRow>
</template>
