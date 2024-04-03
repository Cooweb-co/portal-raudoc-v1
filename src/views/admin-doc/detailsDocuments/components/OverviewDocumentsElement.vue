<script setup>
import transformDate from "@/helpers/transformDate";
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
const startProccessAt = ref(transformDate(props.file?.startProccessAt?.seconds));

const goToDocument = () => {
    const year = props.file.startProccessAt.toDate().getFullYear();
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
                        :class="`avatar-title bg-light ${'text-' + typeDocument} rounded fs-24`"
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
        <td>{{ extension }}</td>
        <td>{{ fullNameClient }}</td>
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
</template>
