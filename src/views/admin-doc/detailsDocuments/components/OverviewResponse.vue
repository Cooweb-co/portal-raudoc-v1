<script setup>
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { toast } from "vue3-toastify";
// import ValidateLabel from "@/utils/ValidateLabel.vue";
import { ref, reactive, watch, defineProps, computed } from "vue";
import axios from "axios";
import { FileTextIcon, Trash2Icon } from "@zhuowenli/vue-feather-icons";
import { Editor } from "@camilo__lp/custom-editor-vue3";

import { state } from "@/state/modules/auth";
import { getUserRoleByName } from "@/services/docservice/doc.service";
import { transformTimeStampToDate } from "@/helpers/transformDate";
import { setTracking } from "@/helpers/tracking";
import setIdRole from "@/helpers/setIdRole";
import capitalizedText from "@/helpers/capitalizedText";

const editorSettings = {
    placeholder: "Escribe acá la respuesta para el ciudadano.",
};

const user = JSON.parse(state.currentUserInfo);
const props = defineProps(["loading", "data"]);
const files = ref([]);
const dropzone = ref(false);
const answered = ref(false);
const loadingFile = ref(false);
const loadingSendFile = ref(false);
const loadingPreview = ref(false);
const showInputCompany = ref(false);
const secondAddressee = ref(false);
const documentNumber = ref("Número de radicado");
const maxSize = 10000000;
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
        "DD [de] MMMM [de] YYYY"
    );
    return formatDate;
};

const form = reactive({
    entryDate: getDate(),
    name: "",
    copyName: "",
    typeOfDocument: "",
    numberOfDocument: "",
    email: "",
    // company: "", //Opcional
    address: "",
    city: "",
    subject: "",
    body: "",
    senderName: "",
    position: "",
    senderArea: "",
    senderCompany: company,
});

const rules = {
    entryDate: { required },
    name: { required },
    copyName: {},
    typeOfDocument: { required },
    numberOfDocument: { required },
    // company: {}, //Opcional
    email: { required, email },
    address: { required },
    city: { required },
    subject: { required },
    body: { required },
    senderName: { required },
    position: { required },
    senderArea: { required },
    senderCompany: { required },
};

const v$ = useVuelidate(rules, form);

const uploadFile = async () => {
    try {
        if (answered.value) {
            toast.error("Ya el radicado fue generado", {
                autoClose: 1000,
            });
            return;
        }
        // else if (files.value.length <= 0) {
        //     toast.error("No has subido ningún archivo", {
        //         autoClose: 1000,
        //     });
        //     return;
        // }
        loadingFile.value = true;
        // Upload first file for add it QR
        const pdfBlob = await createPDF();
        if (pdfBlob) {
            const pdfFile = new File(
                [pdfBlob],
                `radicado-respuesta-${
                    props?.data?.numberEntryClaim || new Date().toISOString()
                }.pdf`,
                {
                    type: "application/pdf",
                }
            );
            files.value = [pdfFile, ...files.value];
        }
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
            `${process.env.VUE_APP_URLPAGE}/r/${company}/${
                pathname[pathname.length - 1]
            }`
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
        await setTracking(
            props.data?.id,
            company,
            form.senderName,
            [
                { name: "Area", value: form.senderArea },
                { name: "Cargo", value: form.position },
                { name: "Comentarios", value: "Documento respondido exitosamente" },
            ],
            "Respondido",
            true
        );
        await setTracking(
            props.data?.id,
            company,
            "Sistema",
            "Documento respondido exitosamente",
            "Enviado",
            false
        );
        toast("Archivo cargado con éxito", {
            type: "success",
            closeButton: true,
            closeOnClick: true,
        });
        loadingFile.value = false;
        // setTimeout(() => location.reload(), 4000);
    } catch (error) {
        console.error("Error al subir el archivo:", error);
        toast("Problemas al cargar el archivo", {
            type: "error",
            closeButton: true,
            closeOnClick: true,
        });
    }
};

const sendFile = async () => {
    try {
        loadingSendFile.value = true;
        const data = JSON.stringify({
            email: props.data?.email,
            numberEntryClaim: props.data?.numberEntryClaim,
        });

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${process.env.VUE_APP_CF_BASE_URL}/sendEmailResponseClaim`,
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };

        axios.request(config);
        loadingSendFile.value = false;
        toast("Correo enviado correctamente", {
            closeButton: true,
            type: "success",
            closeOnClick: true,
        });

        await setTracking(
            props.data?.id,
            company,
            user.name,
            [
                { name: "Destinatario", value: form.senderName },
                { name: "Método de envío", value: "correo electrónico" },
                { name: "Correo", value: props.data.email },
                { name: "Comentario", value: "El documento fue enviado" },
            ],
            "Enviado",
            true
        );
        await setTracking(
            props.data?.id,
            company,
            "Sistema",
            "Documento enviado, revise su correo electrónico",
            "Enviado",
            false
        );
    } catch (error) {
        loadingSendFile.value = false;
        toast("Error al enviar el correo", {
            closeButton: true,
            type: "error",
            closeOnClick: true,
        });
        console.error(error);
    }
};

const createPDF = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
        return;
    }
    const data = JSON.stringify({
        entryDate: form.entryDate,
        name: form.name,
        copyName: form.copyName,
        typeOfDocument: form.typeOfDocument,
        numberOfDocument: form.numberOfDocument,
        email: form.email,
        address: form.address,
        city: form.city,
        subject: form.subject,
        body: form.body,
        senderName: form.senderName,
        position: form.position,
        senderArea: form.senderArea,
        senderCompany: form.senderCompany,
    });
    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/doc/create-response`,
        headers: {
            Accept: "/",
            "Content-Type": "application/json",
        },
        responseType: "blob",
        data: data,
    };
    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

const seeResponseClaim = async () => {
    try {
        loadingPreview.value = true;
        const response = await createPDF();
        const pdfBlob = response;
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);
        loadingPreview.value = false;
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

const decomposeAddress = (address) => {
    const addressSplit = address.split(",");
    return {
        address: addressSplit[0]?.trim(),
        city: addressSplit[1]?.trim() + ", " + addressSplit[2]?.trim(),
    };
};

watch(
    () => props.data,
    async (currentValue) => {
        const idRole = await getUserRoleByName(company, props.data?.assignedTo);
        form.name = currentValue.fullName || "";
        form.typeOfDocument = currentValue.identificationType || "";
        form.numberOfDocument = currentValue.identificationNumber || "";
        form.email = currentValue.email || "";
        form.address = decomposeAddress(currentValue.address)?.address || "";
        form.city = decomposeAddress(currentValue.address)?.city || "";
        form.subject = "Res - " + currentValue.subject || "Res - ";
        form.senderName = capitalizedText(currentValue.assignedTo) || "";
        form.position = setIdRole(idRole);
        form.senderArea = capitalizedText(currentValue.area) || "";
        if (currentValue.personType.toUpperCase() == "JURÍDICA")
            showInputCompany.value = true;
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
                        <a-tooltip>
                            <template #title>Previsualizar respuesta</template>
                            <BButton
                                v-if="!answered"
                                type="button"
                                variant="info"
                                class="w-auto mx-2 d-inline-flex align-items-center justify-content-center"
                                @click="seeResponseClaim"
                            >
                                <span
                                    v-if="loadingPreview"
                                    class="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                <img
                                    v-else
                                    src="@/assets/images/svg/overviewDocuments/eye.svg"
                                    alt="Eye"
                                />
                                <!-- <EyeIcon size="22" /> -->
                            </BButton>
                        </a-tooltip>
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
                            <BCol lg="8" class="row-container-form">
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
                                    <span
                                        v-if="v$.$errors.subject"
                                        class="text-danger"
                                    >
                                        <span
                                            v-if="v$.subject.required.$invalid"
                                            >Este campo es obligatorio</span
                                        >
                                    </span>
                                </BCol>
                                <BCol lg="12" class="mt-3 h-100">
                                    <div class="ck-content w-full h-100">
                                        <span
                                            v-if="v$.$invalid"
                                            class="text-danger"
                                        >
                                            <span
                                                v-if="v$.body.required.$invalid"
                                                >Escribe el cuerpo del
                                                documento</span
                                            >
                                        </span>
                                        <ckeditor
                                            :editor="Editor"
                                            v-model="form.body"
                                            :config="editorSettings"
                                            class="w-100 h-100"
                                        ></ckeditor>
                                    </div>
                                </BCol>
                            </BCol>
                            <BCol lg="4">
                                <BCol lg="12">
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
                                    <span
                                        v-if="v$.$invalid"
                                        class="text-danger"
                                    >
                                        <span v-if="v$.name.required.$invalid"
                                            >Este campo es obligatorio</span
                                        >
                                    </span>
                                    <div class="fs-15 mt-2">
                                        <label
                                            for=""
                                            class="pe-2 fw-bold text-muted"
                                            >Agregar otros destinatarios</label
                                        >
                                        <input
                                            v-model="secondAddressee"
                                            class="form-check-input"
                                            type="checkbox"
                                        />
                                    </div>
                                </BCol>

                                <BCol
                                    lg="12"
                                    class="mb-3"
                                    v-if="secondAddressee"
                                >
                                    <label for="name" class="form-label fw-bold"
                                        >Nombres de los otros destinatarios
                                    </label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="form.copyName"
                                        id="name"
                                        :required="true"
                                        placeholder="Ingrese los nombres separados por comas"
                                    />
                                </BCol>

                                <BCol lg="12" class="mb-3">
                                    <label for="name" class="form-label fw-bold"
                                        >Tipo de documento
                                        <span class="text-danger fw-bold"
                                            >*</span
                                        ></label
                                    >
                                    <Multiselect
                                        v-model="form.typeOfDocument"
                                        :required="true"
                                        :close-on-select="true"
                                        :searchable="true"
                                        :create-option="true"
                                        placeholder="Seleccione"
                                        :disabled="radicated"
                                        :options="[
                                            {
                                                value: 'Cédula',
                                                label: 'Cédula',
                                            },
                                            {
                                                value: 'TI',
                                                label: 'TI',
                                            },
                                            {
                                                value: 'Pasaporte',
                                                label: 'Pasaporte',
                                            },
                                            {
                                                value: 'Cédula extranjería',
                                                label: 'Cédula extranjería',
                                            },
                                            {
                                                value: 'NIT',
                                                label: 'NIT',
                                            },
                                        ]"
                                    />
                                    <span
                                        v-if="v$.$invalid"
                                        class="text-danger"
                                    >
                                        <span
                                            v-if="
                                                v$.typeOfDocument.required
                                                    .$invalid
                                            "
                                            >Este campo es obligatorio</span
                                        >
                                    </span>
                                </BCol>

                                <BCol lg="12" class="mb-3">
                                    <label for="name" class="form-label fw-bold"
                                        >Número de documento
                                        <span class="text-danger fw-bold"
                                            >*</span
                                        ></label
                                    >
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="form.numberOfDocument"
                                        id="name"
                                        :required="true"
                                        placeholder="Ingrese el número del documento del destinatario"
                                    />
                                    <span
                                        v-if="v$.$invalid"
                                        class="text-danger"
                                    >
                                        <span
                                            v-if="
                                                v$.numberOfDocument.required
                                                    .$invalid
                                            "
                                            >Este campo es obligatorio</span
                                        >
                                    </span>
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
                                    <span
                                        v-if="v$.$invalid"
                                        class="text-danger"
                                    >
                                        <span v-if="v$.email.required.$invalid"
                                            >Este campo es obligatorio</span
                                        >
                                        <span v-if="v$.email.email.$invalid"
                                            >El email no es válido</span
                                        >
                                    </span>
                                </BCol>

                                <!-- <BCol
                                    lg="12"
                                    class="mb-3"
                                    v-if="showInputCompany"
                                >
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
                                </BCol> -->

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
                                    <span
                                        v-if="v$.$invalid"
                                        class="text-danger"
                                    >
                                        <span
                                            v-if="v$.address.required.$invalid"
                                            >Este campo es obligatorio</span
                                        >
                                    </span>
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
                                    <span
                                        v-if="v$.$invalid"
                                        class="text-danger"
                                    >
                                        <span v-if="v$.city.required.$invalid"
                                            >Este campo es obligatorio</span
                                        >
                                    </span>
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
                                    <span
                                        v-if="v$.$invalid"
                                        class="text-danger"
                                    >
                                        <span
                                            v-if="
                                                v$.senderName.required.$invalid
                                            "
                                            >Este campo es obligatorio</span
                                        >
                                    </span>
                                </BCol>

                                <BCol lg="12" class="mb-3">
                                    <label for="name" class="form-label fw-bold"
                                        >Area del remitente
                                        <span class="text-danger fw-bold"
                                            >*</span
                                        ></label
                                    >
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="form.senderArea"
                                        id="name"
                                        :required="true"
                                        placeholder="Ingrese el area del remitente"
                                    />
                                    <span
                                        v-if="v$.$invalid"
                                        class="text-danger"
                                    >
                                        <span
                                            v-if="
                                                v$.senderArea.required.$invalid
                                            "
                                            >Este campo es obligatorio</span
                                        >
                                    </span>
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
                                    <span
                                        v-if="v$.$invalid"
                                        class="text-danger"
                                    >
                                        <span
                                            v-if="v$.position.required.$invalid"
                                            >Este campo es obligatorio</span
                                        >
                                    </span>
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
                                                    <Trash2Icon />
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

@media (max-width: 1000px) {
    .row-container-form {
        height: 100% !important;
    }
}
</style>
<style>
.ck-editor__editable {
    /* min-height: 100% !important; */
    margin-bottom: 1em;
}

.ck-editor,
.ck-reset,
.ck-content,
.ck-editor__main {
    height: 100% !important;
}

.ck-editor__editable {
    height: 79.3% !important;
}
.ck-powered-by {
    display: none !important;
}
</style>
