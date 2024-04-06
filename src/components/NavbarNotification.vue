<script setup>
import simplebar from "simplebar-vue";
import { defineProps, defineEmits, watch, ref } from "vue";

const props = defineProps({
    notification: {
        type: Object,
        required: true,
    },
});

const checkbox = ref(false);

const emit = defineEmits(["setSelectNotifications", "deselectNotifications"]);

watch(checkbox, (newCheckbox) => {
    if (newCheckbox) emit("setSelectNotifications", props.notification.id);
    else emit("deselectNotifications", props.notification.id);
});

</script>
<template>
    <simplebar data-simplebar style="max-height: 300px" class="pe-2">
        <div
            class="text-reset notification-item d-block dropdown-item position-relative"
        >
            <div class="d-flex">
                <div class="avatar-xs me-3 flex-shrink-0">
                    <span
                        class="avatar-title bg-info-subtle text-info rounded-circle fs-16"
                    >
                        <i class="bx bx-badge-check"></i>
                    </span>
                </div>
                <div class="flex-grow-1">
                    <BLink
                        :href="`/gestion-documental/radicado/${notification.id}`"
                        class="stretched-link"
                    >
                        <h6 class="mt-0 mb-2 lh-base">
                            Un nuevo <b>radicado</b> te fue asignado con el
                            número:
                            <span class="text-secondary">{{
                                notification.numberClaim
                            }}</span
                            >!
                        </h6>
                    </BLink>
                    <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                        <span
                            ><i class="mdi mdi-clock-outline"></i> Just 30 sec
                            ago</span
                        >
                    </p>
                </div>
                <div class="px-2 fs-15">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="checkbox"
                    />
                </div>
            </div>
        </div>

        <!-- <div class="my-3 text-center">
            <BButton type="button" variant="soft-success">
                View All Notifications
                <i class="ri-arrow-right-line align-middle"></i>
            </BButton>
        </div> -->
    </simplebar>
</template>
