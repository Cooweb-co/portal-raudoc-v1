<script setup>
import {transformDate} from "@/helpers/transformDate";
import { EyeOutlined } from "@ant-design/icons-vue";
import { openDocument } from "@/services/docservice/doc.service";
import { ref, defineProps } from "vue";

const props = defineProps({
    file: Object,
    id: String,
    typeDocument: String,
});

const name = ref(props.file?.name || "-");
const extension = ref(props.file?.name.split(".").pop().toUpperCase() || "-");
const fullNameClient = ref(props.file?.summary?.applicant?.fullName || "-");
const startProccessAt = ref(
    transformDate(
        props.file?.startProccessAt?.seconds || props.file?.createdAt?.seconds
    )
);
const placement = ref("right");
const summary = ref(props.file?.summary?.summary || "No definido");
const legalBasis = ref(props.file?.summary?.legalBasis || false);
const additionalInformation = ref(props.file?.summary?.additionalInformation || false);


const open = ref(false);

const showDrawer = () => {
    open.value = true;
};
const onClose = () => {
    open.value = false;
};

const goToDocument = () => {
    const year =
        props.file?.startProccessAt?.toDate().getFullYear() ||
        props.file?.createdAt?.toDate().getFullYear();
    const path = `/Companies/BAQVERDE/${year}/Claims/${props.id}`;
    openDocument(props.file.name, path);
};
</script>

<template>
    <tr>
        <td>
            <a-tooltip>
                <template #title>
                    <a-button
                        type="link"
                        @click="showDrawer"
                        style="color: #eee"
                        >Ver resumen</a-button
                    >
                </template>
                <div class="d-flex align-items-center">
                    <div class="avatar-sm">
                        <div
                            :class="`avatar-title bg-light ${
                                'text-' + typeDocument
                            } rounded fs-24`"
                        >
                            <i class="ri-folder-zip-line"></i>
                        </div>
                    </div>
                    <div class="ms-3 flex-grow-1">
                        <h5 class="fs-14 mb-0">
                            <BLink href="javascript:void(0)" class="text-body">
                                {{ name }}
                            </BLink>
                        </h5>
                    </div>
                </div>
            </a-tooltip>
        </td>
        <td>{{ extension }}</td>
        <td>
            <a-tooltip>
                <template #title> prompt text </template>
                {{ fullNameClient }}
            </a-tooltip>
        </td>
        <td>{{ startProccessAt }}</td>
        <td class="">
            <div class="d-flex justify-content-center">
                <BButton
                    :variant="typeDocument"
                    size="sm"
                    class="btn-icon"
                    @click="goToDocument"
                >
                    <EyeOutlined />
                </BButton>
            </div>
        </td>
    </tr>
    <a-drawer
        :width="500"
        :title="file?.summary?.subject || 'No definido'"
        :placement="placement"
        :open="open"
        @close="onClose"
        style="z-index: 100000 !important;"
    >
        <h5>Resumen</h5>
        <p class="text-muted">{{ summary }}</p>
        <h5 class="mt-2">Fundamentos legales:</h5>
        <ol v-if="legalBasis.length > 0">
            <li v-for="item in legalBasis" :key="item" class="text-muted">
                {{ item }}
            </li>
        </ol>
        <span v-else class="text-muted">No se encontraron fundamentos legales</span>
        <h5 class="mt-2">Información adicional:</h5>
        <ul v-if="additionalInformation.length > 0">
            <li
                v-for="item in additionalInformation"
                :key="item"
                class="text-muted"
            >
                {{ item }}
            </li>
        </ul>
        <span v-else class="text-muted">No hay información adicional</span>
    </a-drawer>
</template>

<style scoped>
:deep(#components-a-tooltip-demo-placement) .ant-btn {
    width: 70px;
    text-align: center;
    padding: 0;
    margin-right: 8px;
    margin-bottom: 8px;
}
</style>
