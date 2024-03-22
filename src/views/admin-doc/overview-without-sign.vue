<script>
import overviewMain from "@/views/admin-doc/detailsDocuments/components/overview_main.vue";
import modal_OTP_verification from "./detailsDocuments/components/modal_OTP_verification.vue";
// console.log(this.email)
export default {
    data() {
        return {
            showModal: false,
        };
    },
    components: {
        overviewMain,
        modal_OTP_verification,
    },
    methods: {
        handleShowModal(newValue) {
            this.showModal = newValue
        },
    },
};
</script>
<template>
    <main :class="showModal ? '' : 'p-4'">
        <modal_OTP_verification v-if="showModal" @handleShowModal="handleShowModal"/>
        <overviewMain v-else />
    </main>
</template>
