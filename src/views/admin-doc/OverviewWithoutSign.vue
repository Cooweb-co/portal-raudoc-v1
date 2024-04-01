<script setup>
import OverviewMain from "@/views/admin-doc/detailsDocuments/components/OverviewMain.vue";
import ModalOTPVerification from "./detailsDocuments/components/ModalOTPVerification.vue";
import { ref } from "vue";
const showModal = ref(true);
const handleShowModal = (newValue) => {
    showModal.value = newValue;
};
</script>
<template>
    <main :class="showModal ? '' : 'p-4'">
        <ModalOTPVerification
            v-if="showModal"
            @handleShowModal="handleShowModal"
        />
        <OverviewMain v-else />
    </main>
</template>
