<script setup>
// import CKEditor from "@ckeditor/ckeditor5-vue";
// import Multiselect from "@vueform/multiselect";
// import "@vueform/multiselect/themes/default.css";

// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { toast } from "vue3-toastify";
// import ValidateLabel from "@/utils/ValidateLabel.vue";
import { MESSAGE_REQUIRED } from "@/constants/rules.ts";

import { ref, reactive, watch, defineProps, computed } from "vue";
import axios from "axios";

import { FileTextIcon } from "@zhuowenli/vue-feather-icons";
import { transformTimeStampToDate } from "@/helpers/transformDate";

const props = defineProps(["loading", "data"]);
const files = ref([]);
const dropzone = ref(false);
const answered = ref(false);
const loadingFile = ref(false);
const loadingSendFile = ref(false);
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

const getDate = () => {
    // Obtener la fecha y hora actual
    // Get the current date and time
    const currentDate = new Date();

    // Convert the current date to milliseconds since January 1, 1970
    const milliseconds = currentDate.getTime();

    // Convert milliseconds to seconds and nanoseconds
    const seconds = Math.floor(milliseconds / 1000); // Convert milliseconds to seconds
    const nanoseconds = (milliseconds % 1000) * 1000000; // Convert remaining milliseconds to nanoseconds

    // Create the timestamp object
    const timestamp = { seconds: seconds, nanoseconds: nanoseconds };
    const formatDate = transformTimeStampToDate(
        timestamp,
        "DD/MM/YYYY HH:mm:ss"
    );
    return formatDate;
};

const form = reactive({
    entryDate: getDate(),
    name: "",
    company: "", //Opcional
    email: "",
    address: "",
    city: "",
    subject: "",
    body: "",
    senderName: "",
    position: "",
    senderCompany: company,
});

const rules = {
    entryDate: { required: MESSAGE_REQUIRED },
    name: { required },
    company: {}, //Opcional
    email: { required, email },
    address: { required },
    city: { required },
    subject: { required },
    body: { required },
    senderName: { required },
    position: { required },
    senderCompany: { required },
};

// eslint-disable-next-line no-unused-vars
const v$ = useVuelidate(rules, form);

const uploadFile = async () => {
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
        loadingFile.value = true;
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
        toast("Archivo cargado con éxito", {
            type: "success",
            closeButton: true,
            closeOnClick: true,
        });
        loadingFile.value = false;
        setTimeout(() => location.reload(), 4000);
    } catch (error) {
        console.error("Error al subir el archivo:", error);
        toast("Problemas al cargar el archivo", {
            type: "error",
            closeButton: true,
            closeOnClick: true,
        });
    }
};


const sendFile = () => {
    try {
        loadingSendFile.value = true;
        setTimeout(() => {
            loadingSendFile.value = false;
            toast("Archivo enviado correctamente", {
                closeButton: true,
                type: "success",
                closeOnClick: true,
            });
        }, 5000);
    } catch (error) {
        toast("Error al enviar el archivo", {
                closeButton: true,
                type: "error",
                closeOnClick: true,
            });
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
            <section>
                <div
                    class="d-flex justify-content-between align-items-start align-items-sm-center w-100 mt-2 flex-column-reverse flex-sm-row"
                >
                    <div class="grid gx-2 mt-2 mt-sm-0">
                        <BButton
                            type="submit"
                            :variant="answered ? 'secondary' : 'danger'"
                            :disabled="answered ? true : false || loadingFile"
                            class="w-sm"
                            @click="uploadFile"
                            ><div class="button-content">
                                <span>Generar respuesta</span>
                                <span
                                    v-if="loadingFile"
                                    class="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span></div
                        ></BButton>
                        <BButton
                            type="button"
                            class="w-sm mx-2"
                            variant="success"
                            v-if="answered"
                            @click="sendFile"
                            :disabled="loadingSendFile"
                        >
                            <div class="button-content">
                                <span>Enviar al peticionario</span>
                                <span
                                    v-if="loadingSendFile"
                                    class="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                <i
                                    class="ri-send-plane-fill align-bottom ms-1 align-bottom"
                                    v-else
                                ></i>
                            </div>
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
                <!-- <BCard no-body class="mt-3">
                    <BCardHeader>
                        <h6>Generador de documentos</h6>
                    </BCardHeader>
                    <BCardBody>
                        <BRow class="mb-3">
                            <BCol lg="6" class="mb-3">
                                <label for="name" class="form-label fw-bold"
                                    >Nombre
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.name"
                                    id="name"
                                    :required="true"
                                    placeholder="Ingrese el nombre del destinatario"
                                />
                                <ValidateLabel v-bind="{ v$ }" attribute="name" />
                            </BCol>

                            <BCol lg="6" class="mb-3">
                                <label for="email" class="form-label fw-bold"
                                    >Email
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.email"
                                    id="email"
                                    :required="true"
                                    placeholder="Ingrese el correo del destinatario"
                                />
                            </BCol>

                            <BCol lg="3" class="mb-3">
                                <label for="company" class="form-label fw-bold"
                                    >Compañía
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.company"
                                    id="company"
                                    :required="true"
                                    placeholder="Ingrese la compañía del destinatario"
                                />
                            </BCol>

                            <BCol lg="3" class="mb-3">
                                <label for="address" class="form-label fw-bold"
                                    >Dirección
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.address"
                                    id="address"
                                    :required="true"
                                    placeholder="Ingrese la dirección del destinatario"
                                />
                            </BCol>

                            <BCol lg="3" class="mb-3">
                                <label for="city" class="form-label fw-bold"
                                    >Ciudad
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.city"
                                    id="city"
                                    :required="true"
                                    placeholder="Ingrese la ciudad del destinatario"
                                />
                            </BCol>

                            <BCol lg="3" class="mb-3">
                                <label
                                    for="senderName"
                                    class="form-label fw-bold"
                                    >Nombre del remitente
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.senderName"
                                    id="senderName"
                                    :required="true"
                                    placeholder="Ingrese el nombre del remitente"
                                />
                            </BCol>

                            <BCol lg="4" class="mb-3">
                                <label for="position" class="form-label fw-bold"
                                    >Cargo del remitente
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.position"
                                    id="position"
                                    :required="true"
                                    placeholder="Ingrese el cargo del remitente"
                                />
                            </BCol>

                            <BCol lg="8" class="mb-3">
                                <label for="subject" class="form-label fw-bold"
                                    >Asunto
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    :required="true"
                                    v-model="form.subject"
                                    id="subject"
                                    placeholder="Ingrese el asunto"
                                />
                            </BCol>

                            <BCol lg="12" class="mb-3">
                                <label for="body" class="form-label fw-bold"
                                    >Contenido del correo
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <textarea
                                    type="text"
                                    class="form-control w-100"
                                    v-model="form.body"
                                    id="body"
                                    :required="true"
                                    placeholder="Ingrese el contenido del correo"
                                />
                            </BCol>
                        </BRow>
                    </BCardBody>
                </BCard> -->
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

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
</style>
