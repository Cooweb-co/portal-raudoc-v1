<script setup>
import { defineProps } from "vue";
import Timeline from "./Timelime.vue";
const props = defineProps({
    data: Object,
    loading: Boolean,
    numberClaim: String,
});
console.log(props);
</script>
<template>
    <BTab title="Historial" class="fw-semibold pt-2">
      <a-skeleton v-if="loading" :paragraph="{ rows: 5 }" />
      <Timeline :numberClaim="numberClaim" v-else />
    </BTab>
</template>