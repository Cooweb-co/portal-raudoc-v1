<script setup>
// import CKEditor from "@ckeditor/ckeditor5-vue";
// import Multiselect from "@vueform/multiselect";
// import "@vueform/multiselect/themes/default.css";

// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import useVuelidate from "@vuelidate/core";
import { toast } from "vue3-toastify";
import { ref, watch, defineProps, computed } from "vue";
import axios from "axios";
import { FileTextIcon } from "@zhuowenli/vue-feather-icons";
import { transformTimeStampToDate } from "@/helpers/transformDate";
// import { message } from "ant-design-vue";

const props = defineProps(["loading", "data"]);
const files = ref([]);
const dropzone = ref(false);
const answered = ref(false);
const documentNumber = ref("Número de radicado");
const maxSize = 10000000;
const domain = window.location.origin;
const company = "BAQVERDE";
const pathname = window.location.pathname.split("/");
const selectedFile = async () => {
    const newFiles = document.getElementById("formFile").files;
    for (let i = 0; i < newFiles.length; i++) {
        if (newFiles[i].size > maxSize) {
            toast.error("El archivo supera los 10 mb", {
                autoClose: 3000,
            });
        } else {
            files.value = [...files.value, newFiles[i]];
        }
    }
};

const classDropZone = computed(() => {
    const styles =
        "mt-4 w-100 d-flex flex-column justify-content-center align-items-center drop-area mb-5";
    if (!dropzone.value) return styles + " border-secondary text-secondary";
    return styles + " border-primary text-primary";
});


const uploadFile = async () => {
    let idLoadFile;
    try {
        if (answered.value) {
            toast.error("Ya el radicado fue generado", {
                autoClose: 1000,
            });
            return;
        } else if (files.value.length <= 0) {
            toast.error("No has subido ningún archivo", {
                autoClose: 1000,
            });
            return;
        }

        idLoadFile = toast("Cargando archivo..", {
            isLoading: true,
            hideProgressBar: true,
            closeButton: false,
            closeOnClick: false,
        });

        // Upload first file for add it QR

        const date = transformTimeStampToDate(
            props?.data?.rawEntryDate,
            "DD/MM/YYYY HH:mm:ss"
        );
        const headersAddQR = {
            "Content-Type": "multipart/form-data",
        };

        const bodyFormDataAddQR = new FormData();
        bodyFormDataAddQR.append(
            "url",
            `${domain}/r/${company}/${pathname[pathname.length - 1]}`
        );

        bodyFormDataAddQR.append("codeRadicate", props?.data?.numberEntryClaim);
        bodyFormDataAddQR.append("dateRadicate", date);
        bodyFormDataAddQR.append(
            "file",
            files.value[0],
            files.value[0]?.name || "pdfWithQR.pdf"
        );

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${process.env.VUE_APP_CF_BASE_URL}/ADD_QR_IN_PDF`,
            headers: headersAddQR,
            data: bodyFormDataAddQR,
            responseType: "blob",
        };

        const blob = (await axios.request(config))?.data;
        const file = new File(
            [new Blob([blob], { type: "application/pdf" })],
            files.value[0]?.name || "pdfWithQR.pdf",
            {
                type: "application/pdf",
            }
        );

        files.value[0] = file;

        // Upload files for response

        const headersGenerateRadicateOut = {
            company: "BAQVERDE",
            "Content-Type": "multipart/form-data",
        };

        const paramsGenerateRadicateOut = {
            claimId: props.data.id,
        };

        const bodyFormDataGenerateRadicateOut = new FormData();
        for (const file of files.value) {
            bodyFormDataGenerateRadicateOut.append("files", file);
        }

        const resGenerateRadicateOut = await axios.post(
            `${process.env.VUE_APP_CF_BASE_URL}/CLAIM_GENERATE_RADICATE_OUT`,
            bodyFormDataGenerateRadicateOut,
            {
                headers: headersGenerateRadicateOut,
                params: paramsGenerateRadicateOut,
            }
        );
        answered.value = true;
        documentNumber.value = resGenerateRadicateOut.data.idRadicate;
        toast.update(idLoadFile, {
            render: "Archivo cargado con éxito",
            type: "success",
            isLoading: false,
            autoClose: 3000,
        });
        setTimeout(() => location.reload(), 4000);
    } catch (error) {
        console.error("Error al subir el archivo:", error);
        toast.update(idLoadFile, {
            render: "Problemas al cargar el archivo",
            type: "error",
            isLoading: false,
            autoClose: 3000,
        });
    }
};

const sendFile = () => {
    try {
        const idLoadFile = toast("Enviando archivo..", {
            isLoading: true,
            hideProgressBar: true,
            closeButton: false,
            closeOnClick: false,
        });
        setTimeout(() => {
            toast.update(idLoadFile, {
                render: "Archivo enviado con éxito",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        }, 5000);
    } catch (error) {
        console.error(error);
    }
};

const deleteRecord = (name) => {
    files.value = files.value.filter((file) => name != file.name);
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
    event.preventDefault();
    const newFiles = event.dataTransfer.files;
    dropzone.value = false;
    for (let i = 0; i < newFiles.length; i++) {
        if (newFiles[i].size > maxSize) {
            toast.error("El archivo supera los 10 mb", {
                autoClose: 3000,
            });
        } else {
            files.value = [...files.value, newFiles[i]];
        }
    }
};

watch(
    () => props.data,
    (currentValue) => {
        if (
            currentValue.numberOutClaim ||
            currentValue.status == "No requiere respuesta"
        )
            return (answered.value = true);
        return;
    }
);
</script>

<template>
    <BTab title="Respuesta" class="fw-semibold pt-2">
        <template #title>
            <i class="las la-check-circle align-middle me-1"></i>
            Respuesta al Ciudadano
        </template>
        <a-skeleton v-if="loading" :paragraph="{ rows: 5 }" active />

        <main
            v-else
            @dragover.prevent="onDragOver"
            @dragenter.prevent="onDragEnter"
            @dragleave.prevent="onDragLeave"
            @drop="onFileDrop"
            class="w-100 h-100"
        >
            <!-- <BCardBody>
                <div class="mb-3 mb-lg-0">
                            <label for="choices-priority-input" class="form-label">Prioridad</label>

                            <Multiselect v-model="value2" :close-on-select="true" :searchable="true" :create-option="true"
                                :options="[
                                { value: 'Alta', label: 'Alta' },
                                { value: 'Media', label: 'Media' },
                                { value: 'Baja', label: 'Baja' },
                                ]" />
                            </div> 

                <div class="row">
                    <div class="mb-3 col-4">
                        <label
                            for="choices-privacy-status-input"
                            class="form-label"
                            >Plantillas de Respuestas</label
                        >
                        <Multiselect
                            v-model="value3"
                            :close-on-select="true"
                            :searchable="true"
                            :create-option="true"
                            :options="[
                                {
                                    value: 'derecho-peticion',
                                    label: 'Respuesta de Derecho de Petición ',
                                },
                                {
                                    value: 'certificaiones',
                                    label: 'Certificaciones',
                                },
                                {
                                    value: 'cobro-coactivo',
                                    label: 'Cobro Coactivo',
                                },
                            ]"
                        />
                    </div>
                    <div class="col-8">
                        <div class="text-end mb-2 pt-4">
                            <BButton
                                type="button"
                                :disabled="isDisabledAI"
                                :loading="loadingBtnAI"
                                variant="info"
                                :loadingFill="false"
                                loadingText="Aplicando IA "
                                class="w-sm me-1"
                            >
                                Previsualizar
                                <i
                                    class="ri-eye-fill align-bottom ms-1 align-bottom"
                                ></i>
                            </BButton>

                            -->
            <!-- <div
                v-if="answered"
                class="d-flex justify-content-center align-items-center"
            >
                <h1 class="text-lg">Ya se respondió el radicado</h1>
            </div> -->
            <section>
                <div
                    class="d-flex justify-content-between align-items-center w-100"
                >
                    <div class="grid gx-2">
                        <BButton
                            type="submit"
                            :variant="answered ? 'secondary' : 'success'"
                            :disabled="answered ? true : false"
                            class="w-sm"
                            @click="uploadFile"
                            >Generar Radicado</BButton
                        >
                        <BButton
                            type="button"
                            class="w-sm mx-2"
                            variant="primary"
                            v-if="answered"
                            @click="sendFile"
                        >
                            Enviar al peticionario
                            <i
                                class="ri-send-plane-fill align-bottom ms-1 align-bottom"
                            ></i>
                        </BButton>
                        <!-- <BButton type="submit" variant="primary" class="w-sm me-1">
                Borrador
            </BButton>-->
                    </div>
                    <span class="h-100 text-center"
                        >#{{
                            !props.data.numberOutClaim
                                ? documentNumber
                                : props.data.numberOutClaim
                        }}</span
                    >
                </div>
                <!--
                        </div>
                    </div>
                </div>

                <div class="ckeditor-classic">
                    <ckeditor v-model="editorData" :editor="editor"></ckeditor>
                </div>
            </BCardBody> -->
                <div class="relative">
                    <BCard no-body class="mt-3">
                        <BCardHeader>
                            <h5
                                class="card-title mb-0 text-muted fw-light fst-italic"
                            >
                                AGREGA ARCHIVO PARA RESPONDER AL CIUDADANO
                            </h5>
                        </BCardHeader>
                        <BCardBody v-if="!answered">
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
                                                    borrar
                                                </BButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BCardBody>
                        <BoCardBody v-else>
                            <h3
                                class="w-100 d-flex justify-content-center align-items-center text-lg py-2"
                            >
                                Radicado Generado
                            </h3>
                        </BoCardBody>
                    </BCard>
                </div>
            </section>
        </main>
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
</style>
