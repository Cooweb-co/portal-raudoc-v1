<script>
import { ref, watch, getCurrentInstance, onUnmounted } from "vue";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
// import DropZone from "@/components/widgets/dropZone";
import useVuelidate from "@vuelidate/core";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { toast } from "vue3-toastify";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { getFirebaseBackend } from "../../authUtils.js";
import { uploadBytes, ref as storageRef } from "firebase/storage";
import ValidateLabel from "../../utils/ValidateLabel.vue";
import { MESSAGE_REQUIRED, MESSAGE_EMAIL } from "../../constants/rules.ts";

import {
  createClaimID,
  onListenClaimData,
} from "../../services/docservice/doc.service";
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
    const mode = ref('entrada')
    let unsubscribe;
    let idProccessAI;

    const form = ref({
      area: "",
      date: "",
      inputMethod: "",
      serie: "",
      subSerie: "",
      documentType: "",
      untilDate: "",
      folios: "",
      externalFiling: "",
      personType: "",
      idType: "",
      idNumber: "",
      contactPhone: "",
      names: "",
      lastNames: "",
      email: "",
      address: "",
    });

    const rules = {
      area: { required: MESSAGE_REQUIRED },
      date: { required: MESSAGE_REQUIRED },
      inputMethod: { required: MESSAGE_REQUIRED },
      serie: { required: MESSAGE_REQUIRED },
      subSerie: { required: MESSAGE_REQUIRED },
      documentType: { required: MESSAGE_REQUIRED },
      untilDate: { required: MESSAGE_REQUIRED },
      folios: { required: MESSAGE_REQUIRED },
      externalFiling: { required: MESSAGE_REQUIRED },
      personType: { required: MESSAGE_REQUIRED },
      idType: { required: MESSAGE_REQUIRED },
      idNumber: { required: MESSAGE_REQUIRED },
      contactPhone: { required: MESSAGE_REQUIRED },
      names: { required: MESSAGE_REQUIRED },
      lastNames: { required: MESSAGE_REQUIRED },
      email: { required: MESSAGE_REQUIRED, MESSAGE_EMAIL },
      address: { required: MESSAGE_REQUIRED },
    };

    const v$ = useVuelidate(rules, form.value);

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
          instance.proxy.editorData = data.summary ? data.summary : "";
        }
      );
      console.log("unsubscribe::", unsubscribe);
      return unsubscribe;
    };

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe;
      }
    });

    const drop = (e) => {
      dropzoneFile.value = e.dataTransfer.files[0];
      files.value.push(dropzoneFile.value);
    };

    const storage = getFirebaseBackend().storage;

    const selectedFile = async () => {
      dropzoneFile.value = document.getElementById("formFile").files[0];
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
      loadingBtnAI,
      documentID,
      claimData,
      form,
      v$,
      mode
    };
  },
  data() {
    return {
      value: ["C#", "HTML", "CSS"],
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
      this.identificationType = this.claimData.applicant.identificationType;
      this.gender = this.claimData.applicant.gender;
      this.countryOfResidence = this.claimData.applicant.countryOfResidence;
      this.cityOfResidence = this.claimData.applicant.cityOfResidence;
      this.deadline = this.claimData.deadline;
    },
    async handleSubmitChange() {
      // let camposFaltantes = [];
      // if (!this.subject) camposFaltantes.push("Asunto");
      // if (!this.identificationType) camposFaltantes.push("Tipo de Documento");
      // if (!this.editorData) camposFaltantes.push("Resumen");
      // if (!this.gender) camposFaltantes.push("Género");
      // if (!this.countryOfResidence) camposFaltantes.push("País de Residencia");
      // if (!this.cityOfResidence) camposFaltantes.push("Ciudad de Residencia");
      // if (!this.typeOfApplicant) camposFaltantes.push("Tipo de Solicitud");
      // if (!this.priority) camposFaltantes.push("Prioridad");
      // if (!this.status) camposFaltantes.push("Estado");
      // if (!this.deadline) camposFaltantes.push("Fecha límite");
      // if (camposFaltantes.length > 0) {
      //   toast.error(
      //     `Todos los campos son requeridos. Faltan: ${camposFaltantes.join(
      //       ", "
      //     )}`,
      //     {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 3000,
      //     }
      //   );
      //   return;
      // }
      console.log("La fecha límite es: " + this.deadline);
      // Aquí continúa la lógica para manejar el envío de datos cuando todos los campos están llenos
      const dataToSend = {
        id: this.documentID || null,
        assignedTo: this.claimData.assignedTo || null,
        state: this.status || "ABIERTO",
        priority: this.priority || "BAJA",
        summary: this.editorData || null,
        subject: this.subject || null,
        destinationEntity: this.claimData.destinationEntity || null,
        applicant: {
          fullName: this.claimData.applicant.fullName || null,
          id: this.claimData.applicant.identification || null,
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
        this.$router.push("/apps/tickets-list");
      } catch (error) {
        console.error(error);
        toast.error("Error al guardar cambios", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    },
    async handleSaveInfo() {
      try {
        this.v$.$touch();

        if (!this.v$.$invalid) {
          return;
        } else {
          console.log(this.form);
          await this.handleSubmitChange();
        }
      } catch (error) {
        console.log(error);
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
    // DropZone,
    Layout,
    PageHeader,
    Multiselect,
    flatPickr,
    ValidateLabel,
  },
};
</script>

<template>
  <Layout>
    <PageHeader
      :title="`RADICAR DOCUMENTO`"
      subTitle="Crear"
      pageTitle="Proyectos"
    />
    <BRow>
      <div class="col-6 col-sm-6">
        <a-radio-group v-model:value="mode" :style="{ marginBottom: '' }">
          <a-radio-button value="entrada">Entrada</a-radio-button>
          <a-radio-button value="salida">Salida</a-radio-button>
        </a-radio-group>
      </div>
      <div class="text-end mb-4 col-6 col-sm-6">
        <BButton
          type="submit"
          variant="success"
          class="w-sm"
          @click="handleSaveInfo"
        >
          Guardar Cambios</BButton
        >
      </div>
    </BRow>
    <BRow>
      <BCol lg="4">
        <!-- {{ claimData }} -->
        <BCard no-body>
          <BCardHeader>
            <h5 class="card-title mb-0 text-muted fw-light fst-italic">
              AGREGA ARCHIVO PARA RADICAR
            </h5>
          </BCardHeader>
          <BCardBody>
            <div>
              <div class="mb-3">
                <label for="formFile" class="form-label fw-6 text-muted"
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
                  <div class="d-flex align-items-center p-2">
                    <div class="flex-grow-1">
                      <div class="pt-1">
                        <h5 class="fs-14 mb-1" data-dz-name="">
                          {{ file.name }}
                        </h5>
                        <p class="fs-13 text-muted mb-0" data-dz-size="">
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
        </BCard>
        <BCard no-body>
          <BCardBody>
            <div class="mb-3">
              <label class="form-label fw-bold" for="project-title-input"
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
              <label class="form-label fw-bold">Resumen de radicado</label>
              <!-- <ckeditor v-model="editorData" :editor="editor"></ckeditor> -->
              <textarea
                class="form-control"
                v-model="editorData"
                style="min-height: 255px"
              ></textarea>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol lg="8">
        <BCard no-body>
          <BCardHeader>
            <h5 class="card-title mb-0 text-muted fw-light fst-italic">
              INFORMACIÓN DEL DOCUMENTO
            </h5>
          </BCardHeader>
          <BCardBody>
            <BRow>
              <BCol lg="6" class="mb-3">
                <label
                  for="choices-privacy-status-input"
                  class="form-label fw-bold"
                  >Área</label
                >
                <Multiselect
                  v-model="form.area"
                  :required="true"
                  :close-on-select="true"
                  :searchable="true"
                  :create-option="true"
                  placeholder="Seleccione"
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
                <ValidateLabel v-bind="{ v$ }" attribute="area" />
              </BCol>
              <BCol lg="3">
                <label
                  for="datepicker-deadline-input"
                  class="form-label fw-bold"
                  >Fecha</label
                >
                <flat-pickr
                  v-model="form.date"
                  :config="rangeDateconfig"
                  class="form-control flatpickr-input"
                ></flat-pickr>
                <ValidateLabel v-bind="{ v$ }" attribute="date" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label
                  for="choices-privacy-status-input"
                  class="form-label fw-bold"
                  >Método de entrada</label
                >
                <Multiselect
                  v-model="form.inputMethod"
                  :required="true"
                  :close-on-select="true"
                  :searchable="true"
                  :create-option="true"
                  placeholder="Seleccione"
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
                <ValidateLabel v-bind="{ v$ }" attribute="inputMethod" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label
                  for="choices-privacy-status-input"
                  class="form-label fw-bold"
                  >Serie</label
                >
                <Multiselect
                  v-model="form.serie"
                  :required="true"
                  :close-on-select="true"
                  :searchable="true"
                  :create-option="true"
                  placeholder="Seleccione"
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
                <ValidateLabel v-bind="{ v$ }" attribute="serie" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label
                  for="choices-privacy-status-input"
                  class="form-label fw-bold"
                  >Subserie</label
                >
                <Multiselect
                  v-model="form.subSerie"
                  :required="true"
                  :close-on-select="true"
                  :searchable="true"
                  :create-option="true"
                  placeholder="Seleccione"
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
                <ValidateLabel v-bind="{ v$ }" attribute="subSerie" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label
                  for="choices-privacy-status-input"
                  class="form-label fw-bold"
                  >Tipología Documental</label
                >
                <Multiselect
                  v-model="form.documentType"
                  :required="true"
                  :close-on-select="true"
                  :searchable="true"
                  :create-option="true"
                  placeholder="Seleccione"
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
                <ValidateLabel v-bind="{ v$ }" attribute="documentType" />
              </BCol>
              <BCol lg="3">
                <label
                  for="datepicker-deadline-input"
                  class="form-label fw-bold"
                  >Fecha límite</label
                >

                <flat-pickr
                  v-model="form.untilDate"
                  :config="rangeDateconfig"
                  class="form-control flatpickr-input"
                ></flat-pickr>
                <ValidateLabel v-bind="{ v$ }" attribute="untilDate" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label for="username" class="form-label"
                  >Folios <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.folios"
                  :class="{
                    'is-invalid': submitted && v$.user.username.$error,
                  }"
                  id="folios"
                  placeholder="Ingrese folios"
                />
                <div
                  v-if="submitted && v$.user.username.$error"
                  class="invalid-feedback"
                >
                  <span v-if="v$.user.username.required.$message">{{
                    v$.user.username.required.$message
                  }}</span>
                </div>
                <ValidateLabel v-bind="{ v$ }" attribute="folios" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label for="username" class="form-label fw-bold"
                  >Radicado Externo <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.externalFiling"
                  :class="{
                    'is-invalid': submitted && v$.user.username.$error,
                  }"
                  id="RadicadoExterno"
                  placeholder="# Radicado externo"
                />
                <div
                  v-if="submitted && v$.user.username.$error"
                  class="invalid-feedback"
                >
                  <span v-if="v$.user.username.required.$message">{{
                    v$.user.username.required.$message
                  }}</span>
                </div>
                <ValidateLabel v-bind="{ v$ }" attribute="externalFiling" />
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
        <BCard no-body>
          <BCardHeader>
            <h5 class="card-title mb-0 text-muted fw-light fst-italic">
              INFORMACIÓN DEL PETICIONARIO
            </h5>
          </BCardHeader>
          <BCardBody>
            <BRow>
              <BCol lg="3" class="mb-3">
                <label
                  for="choices-privacy-status-input"
                  class="form-label fw-bold"
                  >Tipo de personal</label
                >
                <Multiselect
                  v-model="form.personType"
                  :required="true"
                  :close-on-select="true"
                  :searchable="true"
                  :create-option="true"
                  placeholder="Seleccione"
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
                <ValidateLabel v-bind="{ v$ }" attribute="personType" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label
                  for="choices-privacy-status-input"
                  class="form-label fw-bold"
                  >Tipo de documento</label
                >
                <Multiselect
                  v-model="form.idType"
                  :required="true"
                  :close-on-select="true"
                  :searchable="true"
                  :create-option="true"
                  placeholder="Seleccione"
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
                <ValidateLabel v-bind="{ v$ }" attribute="idType" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label for="username" class="form-label"
                  >Número de documento
                  <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.idNumber"
                  :class="{
                    'is-invalid': submitted && v$.user.username.$error,
                  }"
                  id="username"
                  placeholder="Ingrese numero de documento"
                />
                <div
                  v-if="submitted && v$.user.username.$error"
                  class="invalid-feedback"
                >
                  <span v-if="v$.user.username.required.$message">{{
                    v$.user.username.required.$message
                  }}</span>
                </div>
                <ValidateLabel v-bind="{ v$ }" attribute="idNumber" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label for="username" class="form-label"
                  >Teléfono de contacto
                  <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.contactPhone"
                  :class="{
                    'is-invalid': submitted && v$.user.username.$error,
                  }"
                  id="username"
                  placeholder="Ingrese telefono de contacto"
                />
                <div
                  v-if="submitted && v$.user.username.$error"
                  class="invalid-feedback"
                >
                  <span v-if="v$.user.username.required.$message">{{
                    v$.user.username.required.$message
                  }}</span>
                </div>
                <ValidateLabel v-bind="{ v$ }" attribute="contactPhone" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label for="username" class="form-label"
                  >Nombres <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.names"
                  :class="{
                    'is-invalid': submitted && v$.user.username.$error,
                  }"
                  id="username"
                  placeholder="Ingrese nombres"
                />
                <div
                  v-if="submitted && v$.user.username.$error"
                  class="invalid-feedback"
                >
                  <span v-if="v$.user.username.required.$message">{{
                    v$.user.username.required.$message
                  }}</span>
                </div>
                <ValidateLabel v-bind="{ v$ }" attribute="names" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label for="username" class="form-label"
                  >Apellidos <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.lastNames"
                  :class="{
                    'is-invalid': submitted && v$.user.username.$error,
                  }"
                  id="username"
                  placeholder="Ingrese apellidos"
                />
                <div
                  v-if="submitted && v$.user.username.$error"
                  class="invalid-feedback"
                >
                  <span v-if="v$.user.username.required.$message">{{
                    v$.user.username.required.$message
                  }}</span>
                </div>
                <ValidateLabel v-bind="{ v$ }" attribute="lastNames" />
              </BCol>
              <BCol lg="6" class="mb-3">
                <label for="username" class="form-label"
                  >Correo electrónico
                  <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.email"
                  :class="{
                    'is-invalid': submitted && v$.user.username.$error,
                  }"
                  id="username"
                  placeholder="Ingrese email"
                />
                <div
                  v-if="submitted && v$.user.username.$error"
                  class="invalid-feedback"
                >
                  <span v-if="v$.user.username.required.$message">{{
                    v$.user.username.required.$message
                  }}</span>
                </div>
                <ValidateLabel v-bind="{ v$ }" attribute="email" />
              </BCol>
              <BCol lg="12" class="mb-3">
                <label for="username" class="form-label"
                  >Dirección <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.address"
                  :class="{
                    'is-invalid': submitted && v$.user.username.$error,
                  }"
                  id="username"
                  placeholder="Ingrese una dirección"
                />
                <div
                  v-if="submitted && v$.user.username.$error"
                  class="invalid-feedback"
                >
                  <span v-if="v$.user.username.required.$message">{{
                    v$.user.username.required.$message
                  }}</span>
                </div>
                <ValidateLabel v-bind="{ v$ }" attribute="address" />
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<style lang="scss" scoped>
.section {
  border: 1px solid;
}

.is-danger {
  color: red;
}
</style>
