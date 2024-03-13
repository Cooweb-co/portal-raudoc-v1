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
            name: this.file?.name || "-",
            extension: this.file?.name.split(".").pop().toUpperCase() || "-",
            fullNameClient: this.file?.summary?.applicant?.fullName || "-",
            startProccessAt: transform_date(this.file?.startProccessAt?.seconds),
        };
    },
    methods: {
        goToDocument() {
            const year = this.file.startProccessAt.toDate().getFullYear();
            const path = `/Companies/BAQVERDE/${year}/Claims/${this.id}`;
            openDocument(this.file.name, path);
        },
    },
    components: {
        EyeOutlined,
    },
};
</script>

<template>
    <BCol xxl="4" lg="6">
        <div class="border rounded border-dashed p-2">
            <div class="d-flex align-items-center">
                <div class="flex-shrink-0 me-3">
                    <div class="avatar-sm">
                        <div
                            class="avatar-title bg-light text-primary rounded fs-24"
                        >
                            <i class="ri-folder-zip-line"></i>
                        </div>
                    </div>
                </div>
                <div class="flex-grow-1 overflow-hidden">
                    <h5 class="fs-13 mb-1">
                        <BLink
                            href="#"
                            class="text-body text-truncate d-block"
                            >{{ file.name }}</BLink
                        >
                    </h5>
                    <!-- <div>2.2MB</div> -->
                </div>
                <div class="flex-shrink-0 ms-2">
                    <div class="d-flex gap-1">
                            <div class="d-flex justify-content-center">
                                <BButton
                                    variant="info"
                                    size="sm"
                                    class="btn-icon"
                                    @click="goToDocument"
                                >
                                    <EyeOutlined />
                                </BButton>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </BCol>
</template>
