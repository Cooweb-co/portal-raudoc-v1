<script setup>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { toast } from "vue3-toastify";
import ValidateLabel from "@/utils/ValidateLabel.vue";
import Editor from "@tinymce/tinymce-vue";
import { ref, reactive, watch, defineProps, computed } from "vue";
import axios from "axios";
import { FileTextIcon } from "@zhuowenli/vue-feather-icons";

import { state } from "@/state/modules/auth";
import { MESSAGE_REQUIRED } from "@/constants/rules.ts";
import { transformTimeStampToDate } from "@/helpers/transformDate";
import setIdRole from "@/helpers/setIdRole";

const props = defineProps(["loading", "data"]);
const files = ref([]);
const dropzone = ref(false);
const answered = ref(false);
const showInputCompany = ref(false);
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

const v$ = useVuelidate(rules, form);

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

const preview = async () => {
    console.log(form);
    const result = await v$.value.$validate();
    if (result) {
        return;
    } else {
        console.warn("Llena los campos");
        return;
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
        const user = JSON.parse(state.currentUserInfo);
        console.log(currentValue);
        console.log(user);
        form.name = currentValue.fullName || "";
        form.email = currentValue.email || "";
        form.address = currentValue.address || "";
        // form.city = currentValue.fullName || "";
        form.subject = "Res - " + currentValue.subject || "Res - ";
        form.senderName = user.name || "";
        form.position = setIdRole(user.idRole);
        if(currentValue.personType.toUpperCase() == "JURÍDICA") showInputCompany.value = true;
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
                            :disabled="answered ? true : false"
                            class="w-sm"
                            @click="uploadFile"
                            >Generar Radicado</BButton
                        >
                        <BButton
                            type="submit"
                            :variant="answered ? 'secondary' : 'primary'"
                            :disabled="answered ? true : false"
                            class="w-sm ms-2"
                            @click="preview"
                            >Vista previa</BButton
                        >
                        <BButton
                            type="button"
                            class="w-sm mx-2"
                            variant="success"
                            v-if="answered"
                            @click="sendFile"
                        >
                            Enviar al peticionario
                            <i
                                class="ri-send-plane-fill align-bottom ms-1 align-bottom"
                            ></i>
                        </BButton>
                    </div>
                    <span class="h-100 text-center"
                        >#{{
                            !props.data.numberOutClaim
                                ? documentNumber
                                : props.data.numberOutClaim
                        }}</span
                    >
                </div>
                <BCard no-body class="mt-3" v-if="!answered">
                    <BCardHeader>
                        <h6>Generador de documentos</h6>
                    </BCardHeader>
                    <BCardBody>
                        <BRow class="mb-3">
                            <BCol lg="8">
                                <BCol lg="12">
                                    <label
                                        for="subject"
                                        class="form-label fw-bold"
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
                                <BCol lg="12" class="mt-3">
                                    <Editor
                                        api-key="ji1qaja7dyxcn3yt3piim2mby69mwiyra2yv5z6oheq8yweu"
                                        v-model="form.body"
                                        :init="{
                                            plugins:
                                                'lists link image table code help wordcount',
                                            language: 'es'
                                        }"
                                    />
                                </BCol>
                            </BCol>
                            <BCol lg="4">
                                <BCol lg="12" class="mb-3">
                                    <label for="name" class="form-label fw-bold"
                                        >Destinatario
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
                                    <ValidateLabel
                                        v-bind="{ v$ }"
                                        attribute="name"
                                    />
                                </BCol>

                                <BCol lg="12" class="mb-3">
                                    <label
                                        for="email"
                                        class="form-label fw-bold"
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

                                <BCol lg="12" class="mb-3" v-if="showInputCompany">
                                    <label
                                        for="company"
                                        class="form-label fw-bold"
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

                                <BCol lg="12" class="mb-3">
                                    <label
                                        for="address"
                                        class="form-label fw-bold"
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

                                <BCol lg="12" class="mb-3">
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

                                <BCol lg="12" class="mb-3">
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

                                <BCol lg="12" class="mb-3">
                                    <label
                                        for="position"
                                        class="form-label fw-bold"
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
                            </BCol>
                        </BRow>
                    </BCardBody>
                </BCard>
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
