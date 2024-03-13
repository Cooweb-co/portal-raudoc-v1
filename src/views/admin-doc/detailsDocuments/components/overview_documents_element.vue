<script>
import transform_date from "@/helpers/transform_date";
import { EyeOutlined } from "@ant-design/icons-vue";
import { openDocument } from "@/services/docservice/doc.service";

export default {
    props: {
        file: Object,
        id: String
    },
    data() {
        return {
            name: this.file.name || "-",
            extension: this.file.name.split(".").pop().toUpperCase() || "-",
            fullNameClient: this.file.summary.applicant.fullName || "-",
            startProccessAt: transform_date(this.file.startProccessAt.seconds),
        };
    },
    components: {
        EyeOutlined,
    },
    methods: {
        goToDocument() {
            const year = this.file.startProccessAt.toDate().getFullYear();
            const path = `/Companies/BAQVERDE/${year}/Claims/${this.id}`;
            openDocument(this.file.name, path);
        },
    },
};
</script>
<template>
    <tr>
        <td>
            <div class="d-flex align-items-center">
                <div class="avatar-sm">
                    <div
                        class="avatar-title bg-light text-primary rounded fs-24"
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
                <BButton variant="info" size="sm" class="btn-icon" @click="goToDocument">
                    <EyeOutlined />
                </BButton>
            </div>
        </td>
    </tr>
</template>
