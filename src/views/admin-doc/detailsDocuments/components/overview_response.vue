<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import Multiselect from "@vueform/multiselect";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "@vueform/multiselect/themes/default.css";

export default {
    data() {
        return {
            editor: ClassicEditor,
            value3: "",
            id: "",
            data: "",
        };
    },
    components: {
        ckeditor: CKEditor.component,
        Multiselect,
    },
};
</script>
<template>
    <BTab title="Respuesta" class="fw-semibold pt-2">
        <template #title>
            <i class="las la-check-circle align-middle me-1"></i>
            Respuesta al Ciudadano
        </template>

        <BCardBody>
            <!-- <div class="mb-3 mb-lg-0">
                            <label for="choices-priority-input" class="form-label">Prioridad</label>

                            <Multiselect v-model="value2" :close-on-select="true" :searchable="true" :create-option="true"
                                :options="[
                                { value: 'Alta', label: 'Alta' },
                                { value: 'Media', label: 'Media' },
                                { value: 'Baja', label: 'Baja' },
                                ]" />
                            </div> -->

            <div class="row">
                <div class="mb-3 col-4">
                    <label for="choices-privacy-status-input" class="form-label"
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

                        <BButton
                            type="button"
                            :disabled="isDisabledAI"
                            :loading="loadingBtnAI"
                            variant="danger"
                            :loadingFill="false"
                            loadingText="Aplicando IA "
                            class="w-sm me-1"
                        >
                            Enviar al peticionario
                            <i
                                class="ri-send-plane-fill align-bottom ms-1 align-bottom"
                            ></i>
                        </BButton>
                        <!-- <BButton type="submit" variant="primary" class="w-sm me-1"> Borrador </BButton> -->
                        <BButton type="submit" variant="success" class="w-sm"
                            >Generar Radicado</BButton
                        >
                    </div>
                </div>
            </div>

            <div class="ckeditor-classic">
                <ckeditor v-model="editorData" :editor="editor"></ckeditor>
            </div>
        </BCardBody>
    </BTab>
</template>
