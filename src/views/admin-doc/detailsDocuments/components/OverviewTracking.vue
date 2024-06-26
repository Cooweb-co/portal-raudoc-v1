<script setup>
import { defineProps } from "vue";
import Timeline from "./Timelime.vue";
defineProps({
    data: Object,
    loading: Boolean,
    numberClaim: String,
    showPrivateClaim: Boolean,
});

</script>
<template>
    <BTab title="Historial" class="fw-semibold pt-2">
        <a-skeleton v-if="loading" :paragraph="{ rows: 5 }" />
        <Timeline
            v-else
            :numberClaim="numberClaim"
            :showPrivateClaim="showPrivateClaim"
            :data="data"
        />
    </BTab>
</template>
