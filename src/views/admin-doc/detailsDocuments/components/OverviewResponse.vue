<script setup>
// import CKEditor from "@ckeditor/ckeditor5-vue";
// import Multiselect from "@vueform/multiselect";
// import "@vueform/multiselect/themes/default.css";

// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import useVuelidate from "@vuelidate/core";
import { toast } from "vue3-toastify";
import { ref, watch, defineProps } from "vue";
import axios from "axios";

const props = defineProps(["loading", "numberOutClaimExist", "data"]);
const files = ref([]);
const dropzoneFile = ref("");
const answered = ref(false);
const documentNumber = ref("Número de radicado");

const selectedFile = async () => {
    dropzoneFile.value = document.getElementById("formFile").files[0];
    files.value.push(dropzoneFile.value);
    // const file = dropzoneFile.value;
    // console.log("file::::", file);
};

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

        const headers = {
            company: "BAQVERDE",
            "Content-Type": "multipart/form-data",
        };

        const params = {
            claimId: props.data.id,
        };

        const bodyFormData = new FormData();
        for (const file of files.value) {
            bodyFormData.append("files", file);
        }

        const res = await axios.post(
            `https://us-central1-raudoc-gestion-agil.cloudfunctions.net/CLAIM_GENERATE_RADICATE_OUT`,
            bodyFormData,
            {
                headers,
                params,
            }
        );
        answered.value = true;
        documentNumber.value = res.data.idRadicate;
        console.log(res.data)
        toast.update(idLoadFile, {
            render: "Archivo cargado con éxito",
            type: "success",
            isLoading: false,
            autoClose: 3000,
        });
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

const deleteRecord = (ele) => {
    ele.target.parentElement.parentElement.parentElement.remove();
};

watch(
    () => [...files.value],
    (currentValue) => {
        return currentValue;
    }
);
watch(
    () => props.numberOutClaimExist,
    (currentValue) => {
        if (currentValue == true) return (answered.value = true);
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

        <main v-else>
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
                            :variant="answered ? 'secondary':'success'"
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
                                <div class="mb-3">
                                    <label
                                        for="formFile"
                                        class="form-label fw-6 text-muted"
                                        >Agregue archivos aquí</label
                                    >
                                    <input
                                        class="form-control"
                                        type="file"
                                        id="formFile"
                                        @change="selectedFile"
                                    />
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
                                                    @click="deleteRecord"
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
                                Ya se envío una Respuesta
                            </h3>
                        </BoCardBody>
                    </BCard>
                </div>
            </section>
        </main>
    </BTab>
</template>
