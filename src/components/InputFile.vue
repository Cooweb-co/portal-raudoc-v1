<script setup>
import { computed, ref, defineEmits } from "vue";
import { FileTextIcon, Trash2Icon } from "@zhuowenli/vue-feather-icons";
import { toast } from "vue3-toastify";
// import setVariantPriorityInfo from "@/helpers/setVariantPriorityInfo.js";

const dropzone = ref(false);
const maxSize = 10000000;
const filesInput = ref([]);
const fileInputRef = ref(null); // Referencia al input de archivos

const emit = defineEmits(['emitFiles']);

const emitFiles = () => {
  emit('emitFiles', filesInput.value);
};

const saveFiles = (files) => {
  for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSize) {
            toast.error("El archivo supera los 10 mb", {
                autoClose: 3000,
            });
        } else {
            filesInput.value = [...filesInput.value, files[i]];
            emitFiles();
        }
    }
};

const onFileChange = async () => {
    const newFiles = fileInputRef.value.files; // Usar la referencia aquí
    saveFiles(newFiles);
};

const deleteRecord = (name) => {
    filesInput.value = filesInput.value.filter((file) => name != file.name);
    emitFiles();
};

const onDragOver = () => {
    dropzone.value = true;
};

const onDragEnter = () => {
    dropzone.value = true;
};

const onDragLeave = () => {
    dropzone.value = false;
};

const onFileDrop = (event) => {
    const newFiles = event.dataTransfer.files;
    dropzone.value = false;
    saveFiles(newFiles);
};

const classDropZone = computed(() => {
    const styles =
        "mt-4 w-100 d-flex flex-column justify-content-center align-items-center drop-area mb-5";
    if (!dropzone.value) return styles + " border-secondary text-secondary";
    return styles + " border-primary text-primary";
});

const nameFile = computed(() => {
    const randomNumber = Math.floor(Math.random() * 900) + 1000;
    return `formFile${randomNumber}`;
});
</script>

<template>
    <BCard
        no-body
        class="mt-3"
        @dragover.prevent="onDragOver"
        @dragenter.prevent="onDragEnter"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onFileDrop"
    >
        <BCardHeader>
            <h5 class="card-title mb-0 text-muted fw-light fst-italic">
                AGREGA ARCHIVO PARA TRANSFERIR AL USUARIO (OPCIONAL)
            </h5>
        </BCardHeader>
        <BCardBody>
            <form>
                <div :class="classDropZone">
                    <p>
                        <FileTextIcon size="28" />
                    </p>
                    <span> Arrastra el archivo para subirlo</span>
                    <input
                        type="file"
                        :id="nameFile"
                        :name="nameFile"
                        multiple
                        class="input-file"
                        ref="fileInputRef"
                        @change="onFileChange"
                    />
                    <label :for="nameFile" class="link-primary label-formFile"
                        >o Clic acá para selecciona un archivo</label
                    >
                </div>
                <div class="vstack gap-2">
                    <div
                        class="border rounded"
                        v-for="(file, index) of filesInput"
                        :key="index"
                    >
                        <div class="d-flex align-items-center p-2" v-if="file">
                            <div class="flex-grow-1">
                                <div class="pt-1">
                                    <h5 class="fs-14 mb-1" data-dz-name="">
                                        {{ file.name }}
                                    </h5>
                                    <p
                                        class="fs-13 text-muted mb-0"
                                        data-dz-size=""
                                    >
                                        <strong>{{ file.size / 1024 }}</strong>
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
                                    @click="deleteRecord(file.name)"
                                >
                                    <Trash2Icon />
                                </BButton>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </BCardBody>
    </BCard>
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
</style>
