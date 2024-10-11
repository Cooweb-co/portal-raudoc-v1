<script setup>
import { defineProps, computed, ref, onMounted } from "vue";
import { transformCreatedAtToDate } from "@/helpers/transformDate";
import { openDocument } from "@/services/docservice/doc.service";

const isPhoneScreen = ref(false);
const urlFilesTracking = ref({});

const props = defineProps({
    createdAt: Object,
    name: String,
    content: {
        type: [String, Array],
        required: true,
    },
    action: String,
    position: String,
    claimId: String,
});

onMounted(() => {
    window.addEventListener("resize", () => {
        isPhoneScreen.value = window.innerWidth < 400;
    });

    if (Array.isArray(props.content)) {
        props.content.forEach(async (item) => {
            if (item?.name === 'Archivos' && item?.value !== null) {
                const year = transformCreatedAtToDate(props.createdAt, "YYYY") || new Date().getFullYear();
                const path = `/Companies/BAQVERDE/${year}/Claims/${props.claimId}`;
                const urls = await Promise.all(item.value.map(async (file) => {
                    const url = await openDocument(file.name, path);
                    return { name: file.name, url };
                }));
                urlFilesTracking.value = urls.reduce((acc, curr) => {
                    acc[curr.name] = curr.url;
                    return acc;
                }, {});
            }
        });
    }
});

const actionIcon = computed(() => {
    const action = props.action.toLowerCase();
    const icons = {
        respondido: "ri-check-line",
        enviado: "ri-mail-line",
        aprobado: "ri-thumb-up-line",
        elaborado: "ri-attachment-2",
        devolución: "ri-file-close-line",
        transferido: "ri-send-plane-2-line",
        asignado: "ri-user-line",
        iniciado: "ri-run-line",
        "en gestión": "ri-time-line",
        default: "ri-stack-line",
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
                <div :class="`flex-shrink-0 ${isPhoneScreen ? 'd-none' : ''}`">
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
                            <div v-if="item?.name === 'Archivos'">
                                <div v-if="item.value.length > 0">
                                    <p class="col-12">
                                        {{ item?.name }}
                                    </p>
                                    <ul>
                                        <li
                                            v-for="file in item?.value"
                                            :key="file.name"
                                        >
                                            <a
                                                :href="urlFilesTracking[file.name]"
                                                target="_blank"
                                                >{{ file.name }}</a
                                            >
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div v-else>
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
                    </div>
                    <span class="text-muted fs-14 fw-normal" v-else>{{
                        content
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
