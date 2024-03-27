<script>
import OverviewMain from "@/views/admin-doc/detailsDocuments/components/OverviewMain.vue";
import ModalOTPVerification from "./detailsDocuments/components/ModalOTPVerification.vue";
import { defineComponent } from "vue";
export default defineComponent({
    name: 'OverviewWithoutSign',
    data() {
        return {
            showModal: true,
        };
    },
    components: {
        OverviewMain,
        ModalOTPVerification,
    },
    methods: {
        handleShowModal(newValue) {
            this.showModal = newValue
        },
    },
});
</script>
<template>
    <main :class="showModal ? '' : 'p-4'">
        <ModalOTPVerification v-if="showModal" @handleShowModal="handleShowModal"/>
        <OverviewMain v-else />
    </main>
</template>
