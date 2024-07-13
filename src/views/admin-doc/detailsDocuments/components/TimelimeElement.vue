<script setup>
import { defineProps, computed, ref, onMounted } from "vue";
import { transformCreatedAtToDate } from "@/helpers/transformDate";

const phoneScreen = ref(false);
const props = defineProps({
    createdAt: Object,
    name: String,
    content: {
        type: [String, Array],
        required: true, // si es requerido, puedes quitar esta línea si no lo es
    },
    action: String,
    position: String,
});

onMounted(() => {
    window.addEventListener("resize", () => {
        phoneScreen.value = window.innerWidth < 400;
    });
});

const actionIcon = computed(() => {
    const action = props.action.toLowerCase();
    const icons = {
        "respondido": "ri-check-line",
        "enviado": "ri-mail-line",
        "aprobado": "ri-thumb-up-line",
        "elaborado": "ri-attachment-2",
        "devolución": "ri-file-close-line",
        "transferido": "ri-send-plane-2-line",
        "asignado": "ri-user-line",
        "iniciado": "ri-run-line",
        "en gestión": "ri-time-line",
        "default": "ri-stack-line"
    };
    return icons[action] || icons.default;
});

const date = computed(() => {
    return transformCreatedAtToDate(props.createdAt, "D MMMM YYYY - h:mm a");
});
</script>
<template>
    <div :class="'timeline-item ' + position">
        <div class="d-flex align-items-center justify-content-center">
            <i :class="'icon ' + actionIcon"></i>
        </div>
        <div class="date">
            <b>{{ action }}</b>
            <p>{{ date }}</p>
        </div>
        <div class="content shadow-none">
            <div class="d-flex">
                <div :class="`flex-shrink-0 ${phoneScreen ? 'd-none' : ''}`">
                    <img
                        src="@/assets/images/users/user-dummy-img.jpg"
                        alt=""
                        class="avatar-sm rounded bg-info"
                    />
                </div>
                <div class="flex-grow-1 ms-3">
                    <h5 class="fs-15 fw-bold">
                        {{ name }}
                        <small class="text-muted fs-13 fw-normal">{{
                            createdAt ? "- " + date : ""
                        }}</small>
                    </h5>
                    <div v-if="Array.isArray(content)">
                        <div
                            class="row"
                            v-for="(item, index) in content"
                            :key="index"
                        >
                            <p class="col-sm-5 col-12">
                                {{ item?.name }}
                            </p>
                            <p
                                class="col-sm-6 col-12 text-muted d-flex align-items-center"
                            >
                                {{ item?.value }}
                            </p>
                        </div>
                    </div>
                    <span class="text-muted fs-14 fw-normal" v-else>{{
                        content
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
