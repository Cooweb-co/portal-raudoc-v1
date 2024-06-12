<script setup>
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
        </td>
        <td class="col-type">{{ extension }}</td>
        <td class="col-date">12/06/2024</td>
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
</template>

<style scoped>
:deep(#components-a-tooltip-demo-placement) .ant-btn {
    width: 70px;
    text-align: center;
    padding: 0;
    margin-right: 8px;
    margin-bottom: 8px;
}

@media (max-width: 810px) {
    .col-type, .col-date {
        display: none;
    }
}
</style>
