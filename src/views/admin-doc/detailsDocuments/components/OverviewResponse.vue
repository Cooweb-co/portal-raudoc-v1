<script>
// import CKEditor from "@ckeditor/ckeditor5-vue";
// import Multiselect from "@vueform/multiselect";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import useVuelidate from "@vuelidate/core";
import DropZone from "@/components/widgets/dropZone";

import "@vueform/multiselect/themes/default.css";

import { ref, watch, defineComponent } from "vue";

export default defineComponent({
    name: 'OverviewResponse',
    setup() {
        let files = ref([]);
        let dropzoneFile = ref("");
        const drop = (e) => {
            dropzoneFile.value = e.dataTransfer.files[0];
            files.value.push(dropzoneFile.value);
        };
        const selectedFile = () => {
            dropzoneFile.value =
                document.querySelector(".dropzoneFile").files[0];
            files.value.push(dropzoneFile.value);
        };
        watch(
            () => [...files.value],
            (currentValue) => {
                return currentValue;
            }
        );
        return { dropzoneFile, files, drop, selectedFile, v$: useVuelidate() };
    },
    data() {
        return {
            editor: ClassicEditor,
            value3: "",
            id: "",
            data: "",
            editorData: "",
        };
    },
    components: {
        // ckeditor: CKEditor.component,
        // Multiselect,
        DropZone,
    },
    props: {
        loading: Boolean,
    },
});
</script>

<template>
    <BTab title="Respuesta" class="fw-semibold pt-2">
        <template #title>
            <i class="las la-check-circle align-middle me-1"></i>
            Respuesta al Ciudadano
        </template>
        <a-skeleton v-if="loading" :paragraph="{ rows: 5 }" active />

        <div v-else>
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
            <BButton
                type="button"
                :disabled="isDisabledAI"
                :loading="loadingBtnAI"
                variant="primary"
                :loadingFill="false"
                loadingText="Aplicando IA "
                class="w-sm me-1"
            >
                Enviar al peticionario
                <i
                    class="ri-send-plane-fill align-bottom ms-1 align-bottom"
                ></i>
            </BButton>
            <!-- <BButton type="submit" variant="primary" class="w-sm me-1">
                Borrador
            </BButton>
            <BButton type="submit" variant="success" class="w-sm"
                >Generar Radicado</BButton
            > -->
            <!--
                        </div>
                    </div>
                </div>

                <div class="ckeditor-classic">
                    <ckeditor v-model="editorData" :editor="editor"></ckeditor>
                </div>
            </BCardBody> -->
            <BCard no-body class="mt-3">
                <BCardHeader>
                    <h5 class="card-title mb-0">Agrega archivo para radicar</h5>
                </BCardHeader>
                <BCardBody>
                    <div>
                        <p class="text-muted">Agregue archivos aquí.</p>

                        <DropZone
                            @drop.prevent="drop"
                            @change="selectedFile"
                            class="mb-2"
                        />
                        <div class="vstack gap-2">
                            <div
                                class="border rounded"
                                v-for="(file, index) of files"
                                :key="index"
                            >
                                <div class="d-flex align-items-center p-2">
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
                                            Borrar
                                        </BButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BCardBody>
            </BCard>
        </div>
    </BTab>
</template>
