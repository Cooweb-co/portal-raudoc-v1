<script>
import { ref, watch, getCurrentInstance, onUnmounted } from "vue";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DropZone from "@/components/widgets/dropZone";
import useVuelidate from "@vuelidate/core";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { toast } from "vue3-toastify";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { getFirebaseBackend } from "../../authUtils.js";
import { uploadBytes, ref as storageRef } from "firebase/storage";
import {
    createClaimID,
    onListenClaimData,
} from "../../helpers/docservice/doc.service";
import axios from "axios";

export default {
    setup() {
        const instance = getCurrentInstance();
        const files = ref([]);
        const dropzoneFile = ref("");
        const loadingBtnAI = ref(false);
        const documentID = ref(null);
        const companyID = ref("BAQVERDE");
        const year = ref(new Date().getFullYear());
        const claimData = ref(null);
        let unsubscribe;
        let idProccessAI;

        const startListening = () => {
            idProccessAI = toast("Analizando documento con IA...", {
                isLoading: true,
                hideProgressBar: true,
                closeButton: false,
                closeOnClick: false,
            });

            console.log("startListening");

            unsubscribe = onListenClaimData(
                documentID.value,
                companyID.value,
                (data) => {
                    console.log("onListenClaimData >>", data);
                    claimData.value = data;
                    if (data.status == "DRAFT" && data.summary == null) {
                        setTimeout(() => {
                            toast.update(idProccessAI, {
                                render: "Extrayendo información relevante...",
                                type: toast.TYPE.INFO,
                                // delay: 3000,
                                // isLoading: true,
                            });
                        }, 3000);
                    }
                    if (data.summary) {
                        toast.update(idProccessAI, {
                            render: "Resumen realizado con exito!",
                            type: toast.TYPE.SUCCESS,
                            isLoading: false,
                            autoClose: 3000,
                        });
                    }

                    instance.proxy.subject = data.subject ? data.subject : "";
                    instance.proxy.editorData = data.summary
                        ? data.summary
                        : "";
                }
            );
            console.log("unsubscribe::", unsubscribe);
            return unsubscribe;
        };

        onUnmounted(() => {
            if (unsubscribe) {
                unsubscribe();
            }
        });

        const drop = (e) => {
            dropzoneFile.value = e.dataTransfer.files[0];
            files.value.push(dropzoneFile.value);
        };

        const storage = getFirebaseBackend().storage;

        const selectedFile = async () => {
            dropzoneFile.value =
                document.querySelector(".dropzoneFile").files[0];
            files.value.push(dropzoneFile.value);
            const file = dropzoneFile.value;
            console.log("file::::", file);
            try {
                if (!documentID.value) {
                    await instance.proxy.handleCreateClaimID();

                    toast.success("Radicado en borrador creado!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                }
                const uniqueFileName = Date.now() + ".pdf";
                const folder = `Companies/${companyID.value}/${year.value}/Claims/${documentID.value}`;
                const storagePath = `${folder}/${uniqueFileName}`;
                const fileRef = storageRef(storage, storagePath);
                const idLoadFile = toast("Cargando archivo..", {
                    isLoading: true,
                    hideProgressBar: true,
                    closeButton: false,
                    closeOnClick: false,
                });
                const uploadResult = await uploadBytes(fileRef, file);
                console.log(
                    "Archivo subido con éxito:",
                    uploadResult.metadata.fullPath
                );
                toast.update(idLoadFile, {
                    render: "Archivo cargado con éxito",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });

                // idProccessAI = toast("Analizando documento con AI...", {
                //   type: "info",
                //   isLoading: true,
                //   hideProgressBar: true,
                // });

                startListening();
            } catch (error) {
                console.error("Error al subir el archivo:", error);
            }
        };

        watch(
            () => [...files.value],
            (currentValue) => {
                return currentValue;
            }
        );

        return {
            dropzoneFile,
            files,
            drop,
            selectedFile,
            v$: useVuelidate(),
            loadingBtnAI,
            documentID,
            claimData,
        };
    },
    data() {
        return {
            value: ["C#", "HTML", "CSS"],
            editor: ClassicEditor,
            editorData: "",
            content: "<h1>Some initial content</h1>",
            isDisabledAI: false,
            isDisabledCreate: false,
            loadingBtnCreate: false,
            subject: "",
            identificationType: "",
            gender: "",
            countryOfResidence: "",
            cityOfResidence: "",
            typeOfApplicant: "",
            priority: "",
            status: "",
            deadline: "",
            rangeDateconfig: {
                wrap: true,
                altFormat: "M j, Y",
                altInput: true,
                dateFormat: "d M, Y",
            },
        };
    },
    methods: {
        async handleCreateClaimID() {
            try {
                const user = this.$store.state.auth.currentUser;
                const userID = user.uid;
                const id = await createClaimID(userID);
                this.documentID = id;
            } catch (error) {
                console.log(error);
            }
        },
        deleteRecord(ele) {
            ele.target.parentElement.parentElement.parentElement.remove();
        },
        fillFieldWithAI() {
            console.log(this.claimData.applicant.address);
            this.identificationType =
                this.claimData.applicant.identificationType;
            this.gender = this.claimData.applicant.gender;
            this.countryOfResidence =
                this.claimData.applicant.countryOfResidence;
            this.cityOfResidence = this.claimData.applicant.cityOfResidence;
            this.deadline = this.claimData.deadline;
        },
        async handleSubmitChange() {
            let camposFaltantes = [];
            if (!this.subject) camposFaltantes.push("Asunto");
            if (!this.identificationType)
                camposFaltantes.push("Tipo de Documento");
            if (!this.editorData) camposFaltantes.push("Resumen");
            if (!this.gender) camposFaltantes.push("Género");
            if (!this.countryOfResidence)
                camposFaltantes.push("País de Residencia");
            if (!this.cityOfResidence)
                camposFaltantes.push("Ciudad de Residencia");
            if (!this.typeOfApplicant) camposFaltantes.push("Tipo de Solicitud");
            if (!this.priority) camposFaltantes.push("Prioridad");
            if (!this.status) camposFaltantes.push("Estado");
            if (!this.deadline) camposFaltantes.push("Fecha límite")
            if (camposFaltantes.length > 0) {
                toast.error(
                    `Todos los campos son requeridos. Faltan: ${camposFaltantes.join(
                        ", "
                    )}`,
                    {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    }
                );
                return;
            }
            console.log("La fecha límite es: "+ this.deadline);
            // Aquí continúa la lógica para manejar el envío de datos cuando todos los campos están llenos
            const dataToSend = {
                identification: this.documentID || null,
                assignedTo: this.claimData.assignedTo || null,
                state: this.status || "ABIERTO",
                priority: this.priority || "BAJA",
                summary: this.editorData || null,
                subject: this.subject || null,
                destinationEntity: this.claimData.destinationEntity || null,
                applicant: {
                    fullName: this.claimData.applicant.fullName || null,
                    identification:
                        this.claimData.applicant.identification || null,
                    identificationType: this.identificationType || null,
                    address: this.claimData.applicant.address || null,
                    sex: this.gender || null,
                    countryOfResidence: this.countryOfResidence || null,
                    cityOfResidence: this.cityOfResidence || null,
                },
                deadline: this.deadline || null,
                typeDocumentClaim: this.typeOfApplicant || null,
                claims: this.claimData.claims || null,
                summaryMarkdown: this.claimData.summaryMarkdown || null,
                updatedAt: new Date(),
            };
            if (!this.documentID) {
                console.error("documentID es nulo o indefinido.");
                toast.error("Error: documentID es requerido.", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                return;
            }

            const dataToSendJSON = JSON.stringify(dataToSend, null, 2);
            const url = `https://us-central1-raudoc-gestion-agil.cloudfunctions.net/CLAIM_UPDATE_BY_ID_V1?claimId=${this.documentID}`;

            try {
                const response = await axios.post(url, dataToSendJSON, {
                    headers: {
                        "Content-Type": "application/json",
                        company: "BAQVERDE",
                    },
                });
                console.log(response);
                toast.success("Documento cargado y añadido correctamente!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                this.$router.push('/apps/tickets-list');
            } catch (error) {
                console.error(error);
                toast.error("Error al guardar cambios", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            }
        },
    },
    mounted() {
        setTimeout(() => {
            this.isDisabledAI = false;
        }, 1000);
    },
    computed: {
        user() {
            return this.$store.state.auth.currentUser;
        },
    },
    components: {
        DropZone,
        Layout,
        PageHeader,
        ckeditor: CKEditor.component,
        Multiselect,
        flatPickr,
    },
};
</script>

<template>
    <Layout>
        <PageHeader
            :title="`Radicación: #${documentID ? documentID : 'Nueva'}`"
            subTitle="Crear"
            pageTitle="Proyectos"
        />
        <BRow>
            <BCol lg="8">
                <!-- {{ claimData }} -->

                <BRow v-if="documentID">
                    <div class="text-end mb-4">
                        <BButton
                            type="button"
                            :disabled="isDisabledAI"
                            v-if="documentID"
                            :loading="loadingBtnAI"
                            variant="info"
                            :loadingFill="false"
                            loadingText="Aplicando IA "
                            class="w-sm me-1 float-start"
                            @click="fillFieldWithAI"
                            >Aplicar IA
                            <i class="ri-magic-fill ms-1 align-bottom"></i>
                        </BButton>
                        <!-- <BButton type="submit" variant="primary" class="w-sm me-1"> Borrador </BButton> -->
                        <BButton
                            type="submit"
                            v-if="documentID"
                            variant="success"
                            class="w-sm"
                            @click="handleSubmitChange"
                            >Guardar Cambios</BButton
                        >
                    </div>
                </BRow>

                <BCard no-body>
                    <BCardHeader>
                        <h5 class="card-title mb-0">
                            Agrega archivo para radicar
                        </h5>
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
                                                borrar
                                            </BButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BCardBody>
                    <BCardBody>
                        <div class="mb-3">
                            <label class="form-label" for="project-title-input"
                                >Asunto</label
                            >
                            <input
                                type="text"
                                v-model="subject"
                                class="form-control"
                                id="project-title-input"
                                placeholder="Ingrese asunto del radicado"
                            />
                        </div>

                        <BCard no-body> </BCard>

                        <div class="mb-3">
                            <label class="form-label"
                                >Resumen de radicado</label
                            >
                            <ckeditor
                                v-model="editorData"
                                :editor="editor"
                            ></ckeditor>
                        </div>

                        <BRow>
                            <BCol lg="4">
                                <div class="mb-3 mb-lg-0">
                                    <label
                                        for="choices-priority-input"
                                        class="form-label"
                                        >Prioridad</label
                                    >

                                    <Multiselect
                                        v-model="priority"
                                        :close-on-select="true"
                                        :searchable="true"
                                        :create-option="true"
                                        :options="[
                                            { value: 'Alta', label: 'Alta' },
                                            { value: 'Media', label: 'Media' },
                                            { value: 'Baja', label: 'Baja' },
                                        ]"
                                    />
                                </div>
                            </BCol>
                            <BCol lg="4">
                                <div class="mb-3 mb-lg-0">
                                    <label
                                        for="choices-status-input"
                                        class="form-label"
                                        >Estado</label
                                    >

                                    <Multiselect
                                        v-model="status"
                                        :close-on-select="true"
                                        :searchable="true"
                                        :create-option="true"
                                        :options="[
                                            {
                                                value: 'Inprogress',
                                                label: 'En curso',
                                            },
                                            {
                                                value: 'Completed',
                                                label: 'Completado',
                                            },
                                        ]"
                                    />
                                </div>
                            </BCol>
                            <BCol lg="4">
                                <div>
                                    <label
                                        for="datepicker-deadline-input"
                                        class="form-label"
                                        >Fecha límite</label
                                    >

                                    <flat-pickr
                                        v-model="deadline"
                                        :config="rangeDateconfig"
                                        class="form-control flatpickr-input"
                                    ></flat-pickr>
                                </div>
                            </BCol>
                        </BRow>
                    </BCardBody>
                </BCard>
            </BCol>
            <BCol lg="4">
                <BCard no-body>
                    <BCardHeader>
                        <h5 class="card-title mb-0">Datos del Solicitante</h5>
                    </BCardHeader>
                    <BCardBody>
                        <div class="mb-3">
                            <label
                                for="choices-privacy-status-input"
                                class="form-label"
                                >Tipo de Solicitante</label
                            >
                            <Multiselect
                                v-model="typeOfApplicant"
                                :required="true"
                                :close-on-select="true"
                                :searchable="true"
                                :create-option="true"
                                :options="[
                                    { value: 'Aporedado', label: 'Aporedado' },
                                    {
                                        value: 'Nino, nina, adolescente',
                                        label: 'Nino, Nina, Adolescente',
                                    },
                                    {
                                        value: 'persona judirica',
                                        label: 'Persona Judirica',
                                    },
                                    {
                                        value: 'persona natural',
                                        label: 'Persona Natural',
                                    },
                                ]"
                            />
                        </div>

                        <div class="mb-3">
                            <label
                                for="choices-privacy-status-input"
                                class="form-label"
                                >Tipo de Documento</label
                            >
                            <Multiselect
                                v-model="identificationType"
                                :required="true"
                                :close-on-select="true"
                                :searchable="true"
                                :create-option="true"
                                :options="[
                                    { value: 'CC', label: 'C.C' },
                                    { value: 'CE', label: 'C.E' },
                                    {
                                        value: 'carnet Dplomatico CD',
                                        label: 'Carnet Diplomatico CD',
                                    },
                                    { value: 'NIT', label: 'NIT' },
                                    {
                                        value: 'Psaporte PA',
                                        label: 'Pasaporte PA',
                                    },
                                    {
                                        value: 'Permiso Especial de PMCA',
                                        label: 'Permiso Especial de PMCA',
                                    },
                                    {
                                        value: 'Permiso de Proteccion',
                                        label: 'Permiso de Proteccion',
                                    },
                                    {
                                        value: 'Temporal - PPT',
                                        label: 'Temporal - PPT',
                                    },
                                    {
                                        value: 'Salvoconducto-SC',
                                        label: 'Salvoconducto-SC',
                                    },
                                    { value: 'T.I', label: 'T.I' },
                                ]"
                            />
                        </div>

                        <div class="mb-3">
                            <label
                                for="choices-privacy-status-input"
                                class="form-label"
                                >sexo</label
                            >
                            <Multiselect
                                v-model="gender"
                                :required="true"
                                :close-on-select="true"
                                :searchable="true"
                                :create-option="true"
                                :options="[
                                    { value: 'M', label: 'Masculino' },
                                    { value: 'F', label: 'Femenino' },
                                    { value: 'otro', label: 'Otro' },
                                ]"
                            />
                        </div>

                        <div class="mb-3">
                            <label
                                for="choices-privacy-status-input"
                                class="form-label"
                                >Pais de Recidencia</label
                            >
                            <Multiselect
                                v-model="countryOfResidence"
                                :required="true"
                                :close-on-select="true"
                                :searchable="true"
                                :create-option="true"
                                :options="[
                                    { value: 'CO', label: 'Colombia' },
                                    { value: 'US', label: 'Estados Unidos' },
                                    { value: 'MX', label: 'México' },
                                    { value: 'ES', label: 'España' },
                                    { alue: 'AR', label: 'Argentina' },
                                    { value: 'BR', label: 'Brasil' },
                                    { value: 'CL', label: 'Chile' },
                                    { value: 'PE', label: 'Per' },
                                    { value: 'EC', label: 'Ecuador' },
                                    { value: 'GT', label: 'Guatemala' },
                                    { value: 'CU', label: 'Cuba' },
                                    { value: 'BO', label: 'Bolivia' },
                                    {
                                        value: 'DO',
                                        label: 'República Dominicana',
                                    },
                                    { value: 'HD', label: 'Honduras' },
                                ]"
                            />
                        </div>
                        <div>
                            <label
                                for="choices-privacy-status-input"
                                class="form-label"
                                >Cuidad de Recidencia</label
                            >
                            <Multiselect
                                v-model="cityOfResidence"
                                :required="true"
                                :close-on-select="true"
                                :searchable="true"
                                :create-option="true"
                                :options="[
                                    { value: 'smr', label: 'Santa Marta' },
                                    { value: 'PER', label: 'Pereira' },
                                    { value: 'BGA', label: 'Bucaramanga' },
                                    { value: 'CUC', label: 'Cucuta' },
                                    { value: 'IBG', label: 'Ibague' },
                                    { value: 'arm', label: 'Amenai' },
                                    { value: 'PT', label: 'Pasto' },
                                    { value: 'POP', label: 'Popayan' },
                                    { value: 'Soledad', label: 'Soledad' },
                                ]"
                            />
                        </div>
                    </BCardBody>
                </BCard>

                <BCard no-body>
                    <BCardHeader>
                        <h5 class="card-title mb-0">Etiquetas</h5>
                    </BCardHeader>
                    <BCardBody>
                        <div class="mb-3">
                            <label
                                for="choices-categories-input"
                                class="form-label"
                                >Categorías</label
                            >
                            <Multiselect
                                v-model="value4"
                                :required="true"
                                :close-on-select="true"
                                :searchable="true"
                                :create-option="true"
                                :options="[
                                    { value: 'Diseño', label: 'Diseño' },
                                    {
                                        value: 'Desarrollo',
                                        label: 'Desarrollo',
                                    },
                                ]"
                            />
                        </div>
                    </BCardBody>
                </BCard>

                <BCard no-body>
                    <BCardHeader>
                        <h5 class="card-title mb-0">Miembros</h5>
                    </BCardHeader>
                    <BCardBody>
                        <div class="mb-3">
                            <label for="choices-lead-input" class="form-label"
                                >Jefe de equipo</label
                            >
                            <Multiselect
                                v-model="value5"
                                :required="true"
                                :close-on-select="true"
                                :searchable="true"
                                :create-option="true"
                                :options="[
                                    {
                                        value: 'Brent Gonzalez',
                                        label: 'Brent Gonzalez',
                                    },
                                    {
                                        value: 'Darline Williams',
                                        label: 'Darline Williams',
                                    },
                                    {
                                        value: 'Sylvia Wright',
                                        label: 'Sylvia Wright',
                                    },
                                    {
                                        value: 'Ellen Smith',
                                        label: 'Ellen Smith',
                                    },
                                    {
                                        value: 'Jeffrey Salazar',
                                        label: 'Jeffrey Salazar',
                                    },
                                    {
                                        value: 'Mark Williams',
                                        label: 'Mark Williams',
                                    },
                                ]"
                            />
                        </div>

                        <div>
                            <label class="form-label"
                                >Miembros del equipo</label
                            >
                            <div class="avatar-group">
                                <BLink
                                    href="javascript: void(0);"
                                    class="avatar-group-item"
                                    v-b-tooltip.hover
                                    title="Brent Gonzalez"
                                >
                                    <div class="avatar-xs">
                                        <img
                                            src="@/assets/images/users/avatar-3.jpg"
                                            alt=""
                                            class="rounded-circle img-fluid"
                                        />
                                    </div>
                                </BLink>
                                <BLink
                                    href="javascript: void(0);"
                                    class="avatar-group-item"
                                    v-b-tooltip.hover
                                    title="Sylvia Wright"
                                >
                                    <div class="avatar-xs">
                                        <div
                                            class="avatar-title rounded-circle bg-primary"
                                        >
                                            S
                                        </div>
                                    </div>
                                </BLink>
                                <BLink
                                    href="javascript: void(0);"
                                    class="avatar-group-item"
                                    v-b-tooltip.hover
                                    title="Ellen Smith"
                                >
                                    <div class="avatar-xs">
                                        <img
                                            src="@/assets/images/users/avatar-4.jpg"
                                            alt=""
                                            class="rounded-circle img-fluid"
                                        />
                                    </div>
                                </BLink>
                                <BLink
                                    href="javascript: void(0);"
                                    class="avatar-group-item"
                                    v-b-tooltip.hover
                                    title="Add Members"
                                >
                                    <div
                                        class="avatar-xs"
                                        data-bs-toggle="modal"
                                        data-bs-target="#inviteMembersModal"
                                    >
                                        <div
                                            class="avatar-title fs-16 rounded-circle bg-light border-dashed border text-primary"
                                        >
                                            +
                                        </div>
                                    </div>
                                </BLink>
                            </div>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>
<style>
.footer {
    display: none !important;
}
</style>
