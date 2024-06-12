<script setup>
import { computed, ref } from "vue";
import { defineProps } from "vue";
import { FileTextIcon, Trash2Icon } from "@zhuowenli/vue-feather-icons";
import { watch } from "vue";

const props = defineProps({
    data: Object,
    filesArchive: Array,
    loading: Boolean,
    expedienteId: String,
});
console.log(props.data);
const dropzone = ref(false);
const files = ref([]);
const classDropZone = computed(() => {
    const styles =
        "mt-4 w-100 d-flex flex-column justify-content-center align-items-center drop-area mb-5";
    if (!dropzone.value) return styles + " border-secondary text-secondary";
    return styles + " border-primary text-primary";
});
const onDragOver = () => {
    dropzone.value = true;
};

const onDragEnter = () => {
    dropzone.value = true;
};

const onDragLeave = () => {
    dropzone.value = false;
};

const selectedFile = async () => {
    const newFiles = document.getElementById("formFile").files;
    for (let i = 0; i < newFiles.length; i++) {
        files.value = [...files.value, newFiles[i]];
    }
};

const onFileDrop = (event) => {
    event.preventDefault();
    const newFiles = event.dataTransfer.files;
    dropzone.value = false;
    for (let i = 0; i < newFiles.length; i++) {
        files.value = [...files.value, newFiles[i]];
    }
    console.log(files.value);
};

watch(
    () => [...files.value],
    (currentValue) => {
        // uploadDocument();
        console.log(currentValue);
        return currentValue;
    }
);
</script>

<template>
    <BTab title="Resumen" active class="fw-semibold pt-2">
        <BRow>
            <BCol xl="9" lg="8">
                <a-skeleton v-if="loading" :paragraph="{ rows: 5 }" active />
                <BCard no-body v-else>
                    <BCardBody>
                        <div class="text-muted">
                            <h6 class="fw-semibold text-uppercase mb-3">
                                Resumen
                            </h6>
                            <p class="text-muted">
                                {{ data?.summary?.summary || "No definido" }}
                            </p>

                            <div class="pt-3 border-top border-top-dashed mt-4">
                                <BRow gy-3>
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                FECHA DE CREACIÓN:
                                            </p>
                                            <h5 class="fs-15 mb-0">
                                                12/06/2024
                                            </h5>
                                        </div>
                                    </BCol>
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                CREADOR POR:
                                            </p>
                                            <h5 class="fs-15 mb-0">
                                                Comercial
                                            </h5>
                                        </div>
                                    </BCol>
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                TIPO DE EXPEDIENTE:
                                            </p>
                                            <BBadge tag="div" variant="primary"
                                                >Nuevo</BBadge
                                            >
                                        </div>
                                    </BCol>
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                ESTADO:
                                            </p>
                                            <BBadge tag="div" variant="danger"
                                                >En revisión</BBadge
                                            >
                                        </div>
                                    </BCol>
                                </BRow>
                            </div>
                        </div>
                    </BCardBody>
                </BCard>

                <BCard no-body>
                    <BCardHeader>
                        <h5 class="card-title mb-0">SUBIR NUEVO ARCHIVO</h5>
                    </BCardHeader>
                    <BCardBody>
                        <div
                            @dragover.prevent="onDragOver"
                            @dragenter.prevent="onDragEnter"
                            @dragleave.prevent="onDragLeave"
                            @drop="onFileDrop"
                            class="w-100 h-100"
                        >
                            <div>
                                <div :class="classDropZone">
                                    <p>
                                        <FileTextIcon size="28" />
                                    </p>
                                    <span>
                                        Arrastra el archivo para subirlo</span
                                    >
                                    <input
                                        type="file"
                                        name="formFile"
                                        id="formFile"
                                        multiple
                                        class="input-file"
                                        @change="selectedFile"
                                    />
                                    <label
                                        for="formFile"
                                        class="link-primary label-formFile"
                                        >o Clic acá para selecciona un
                                        archivo</label
                                    >
                                </div>
                                <div class="vstack gap-2">
                                    <div
                                        class="border rounded"
                                        v-for="(file, index) of files"
                                        :key="index"
                                    >
                                        <div
                                            class="d-flex align-items-center p-2"
                                            v-if="file"
                                        >
                                            <div class="flex-grow-1">
                                                <div class="pt-1">
                                                    <h5
                                                        class="fs-14 mb-1"
                                                        data-dz-name=""
                                                    >
                                                        {{ file.name }}
                                                    </h5>
                                                    <p
                                                        class="fs-13 text-muted mb-0"
                                                        data-dz-size=""
                                                    >
                                                        <strong>{{
                                                            file.size / 1024
                                                        }}</strong>
                                                        KB
                                                    </p>
                                                    <strong
                                                        class="error text-danger"
                                                        data-dz-errormessage=""
                                                    ></strong>
                                                </div>
                                            </div>
                                            <div class="flex-shrink-0 ms-3">
                                                <BButton
                                                    variant="danger"
                                                    size="sm"
                                                    data-dz-remove=""
                                                    @click="
                                                        deleteRecord(file.name)
                                                    "
                                                >
                                                    <Trash2Icon />
                                                </BButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
            <a-skeleton v-if="loading" :paragraph="{ rows: 6 }" active />
            <BCol xl="3" lg="4" v-else>
                <BCard no-body>
                    <BCardHeader>
                        <h5 class="card-title mb-0">TAGS</h5>
                    </BCardHeader>
                    <BCardBody>
                        <div class="d-flex flex-wrap gap-1">
                            <span
                                v-for="(tag, index) in data?.summary?.tags"
                                :key="index"
                                class="bg-body-tertiary rounded p-1 m-1"
                                >{{ tag }}</span
                            >
                        </div>
                    </BCardBody>
                </BCard>

                <BCard no-body>
                    <BCardHeader>
                        <h5 class="card-title mb-0">Equipo</h5>
                    </BCardHeader>
                    <BCardBody>
                        <div class="table-responsive table-card">
                            <table
                                class="table table-borderless align-middle mb-0"
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="avatar-group">
                                                <BLink
                                                    href="javascript:void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="Erica Kernan"
                                                >
                                                    <img
                                                        src="@/assets/images/users/avatar-4.jpg"
                                                        alt=""
                                                        class="rounded-circle avatar-xs"
                                                    />
                                                </BLink>
                                                <BLink
                                                    href="javascript:void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="Alexis Clarke"
                                                >
                                                    <img
                                                        src="@/assets/images/users/avatar-10.jpg"
                                                        alt=""
                                                        class="rounded-circle avatar-xs"
                                                    />
                                                </BLink>
                                                <BLink
                                                    href="javascript:void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="James Price"
                                                >
                                                    <img
                                                        src="@/assets/images/users/avatar-3.jpg"
                                                        alt=""
                                                        class="rounded-circle avatar-xs"
                                                    />
                                                </BLink>
                                                <BLink
                                                    href="javascript: void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="Add Members"
                                                >
                                                    <div class="avatar-xs">
                                                        <div
                                                            class="avatar-title fs-16 rounded-circle bg-light border-dashed border text-primary"
                                                        >
                                                            +
                                                        </div>
                                                    </div>
                                                </BLink>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </BTab>
</template>

<style scoped>
.drop-area {
    height: 20vh;
    border: 2.5px dotted;
    border-radius: 10px;
}

.input-file {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.label-formFile:hover {
    cursor: pointer;
}

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

@media (max-width: 1000px) {
    .row-container-form {
        height: 100% !important;
    }
}
</style>
