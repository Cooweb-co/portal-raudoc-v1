<script>
import {
  ref,
  watch,
  getCurrentInstance,
  onUnmounted,
  computed,
  onMounted,
} from "vue";
import Multiselect from "@vueform/multiselect";
import dayjs from "dayjs";
import "@vueform/multiselect/themes/default.css";
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
import Modal from "../modals/Modal.vue";

import {
  createClaimID,
  onListenClaimData,
} from "../../services/docservice/doc.service";
import axios from "axios";

export default {
  setup() {
    const instance = getCurrentInstance();
    const storage = getFirebaseBackend().storage;
    const files = ref([]);
    const dropzoneFile = ref("");
    const loadingBtnAI = ref(false);
    const documentID = ref(null);
    const companyID = ref("BAQVERDE");
    const year = ref(new Date().getFullYear());
    const claimData = ref(null);
    const mode = ref("Entry");
    const saveLoading = ref(false);
    const submitLoading = ref(false);
    const qrModal = ref(false);
    let unsubscribe;
    let idProccessAI;
    const loadingAI = ref(false);
    const newDate = ref(dayjs().format("DD/MM/YYYY HH:mm"));
    const trds = ref([]);
    const series = ref([]);
    const subseries = ref([]);
    const isDocs = ref([]);
    const radicate = ref("");
    const peopleList = ref([]);

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://us-central1-raudoc-gestion-agil.cloudfunctions.net/TDRS_LIST_V1",
      headers: {
        company: "BAQVERDE",
      },
    };

    // objeto de configuracion para el servicio de obtencion de usuarios por area
    let configGetPeople = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://us-central1-raudoc-gestion-agil.cloudfunctions.net/USERS_LIST_V1",
      headers: {
        company: "BAQVERDE",
      },
    };

    // controlador de variables para el formulario de radicacion
    const form = ref({
      area: "",
      date: newDate.value,
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
      assignedTo: "",
      subject: "",
      description: "",
    });
    // reglas de validacion
    const rules = {
      area: { required: MESSAGE_REQUIRED },
      date: { required: MESSAGE_REQUIRED },
      inputMethod: { required: MESSAGE_REQUIRED },
      serie: { required: MESSAGE_REQUIRED },
      subSerie: { required: MESSAGE_REQUIRED },
      documentType: { required: MESSAGE_REQUIRED },
      untilDate: {},
      folios: { required: MESSAGE_REQUIRED },
      externalFiling: {},
      personType: { required: MESSAGE_REQUIRED },
      idType: { required: MESSAGE_REQUIRED },
      idNumber: { required: MESSAGE_REQUIRED },
      contactPhone: { required: MESSAGE_REQUIRED },
      names: { required: MESSAGE_REQUIRED },
      lastNames: { required: MESSAGE_REQUIRED },
      email: { required: MESSAGE_REQUIRED, MESSAGE_EMAIL },
      address: { required: MESSAGE_REQUIRED },
      assignedTo: { required: MESSAGE_REQUIRED },
      subject: { required: MESSAGE_REQUIRED },
      description: { required: MESSAGE_REQUIRED },
    };

    const v$ = useVuelidate(rules, form.value);

    const startListening = () => {
      idProccessAI = toast("Analizando documento con IA...", {
        isLoading: true,
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: false,
      });

      unsubscribe = onListenClaimData(
        documentID.value,
        companyID.value,
        (data) => {
          claimData.value = data;
          if (data.status == "DRAFT" && data.summary == null) {
            loadingAI.value = true;
            setTimeout(() => {
              toast.update(idProccessAI, {
                render: "Extrayendo información relevante...",
                type: toast.TYPE.INFO,
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
            loadingAI.value = false;
          }

          if (data.status == "ERROR") {
            toast.update(idProccessAI, {
              render:
                "Complete la información de asunto y resumen manualmente. Documento no valido para este proceso.",
              type: toast.TYPE.WARNING,
              isLoading: false,
              autoClose: 1000,
            });
            loadingAI.value = false;
          }

          instance.proxy.subject = data.subject ? data.subject : "";
          instance.proxy.editorData = data.summary ? data.summary : "";
          form.value.subject = data.subject ? data.subject : "";
          form.value.description = data.summary ? data.summary : "";
        }
      );
      return unsubscribe;
    };

    const drop = (e) => {
      dropzoneFile.value = e.dataTransfer.files[0];
      files.value.push(dropzoneFile.value);
    };

    const selectedFile = async () => {
      dropzoneFile.value = document.getElementById("formFile").files[0];
      files.value.push(dropzoneFile.value);
      const file = dropzoneFile.value;
      // console.log("file::::", file);
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

    // obtener listado de usuarios activos por areas
    async function getPeople() {
      var auxPeople = [];
      axios
        .request(configGetPeople)
        .then((response) => {
          response.data.forEach((element) => {
            auxPeople.push({
              label: element.name,
              value: element.name,
              area: element.area,
              role: element.rol,
            });
          });
          peopleList.value = auxPeople;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // obtener listado trds
    async function getTrds() {
      await axios
        .request(config)
        .then((response) => {
          console.log(response);
          response.data.forEach((element) => {
            trds.value.push({
              label: element.name,
              value: element.name,
              series: element.series,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // computadas para la dependencia de los campos
    // manejador del input de serie
    // eslint-disable-next-line vue/return-in-computed-property
    const auxSerie = computed(() => {
      const aux = [];
      if (form.value.area) {
        trds.value.forEach((i) => {
          if (i.label == form.value.area) {
            i.series.forEach((j) => {
              aux.push({
                label: j.name,
                value: j.name,
                subseries: j.subseries,
              });
            });
          }
          series.value = aux;
          console.log(series.value);
        });
      }
    });

    // manejador del input de subserie
    // eslint-disable-next-line vue/return-in-computed-property
    const auxSubSerie = computed(() => {
      if (form.value.serie) {
        series.value.forEach((i) => {
          if (i.label == form.value.serie) {
            subseries.value = [];
            i.subseries.forEach((j) => {
              subseries.value.push({
                label: j.name,
                value: j.name,
                documents: j.docs,
              });
            });
          }
        });
        console.log(subseries.value);
      }
    });

    // manejador del inpur de tipologia documental
    // eslint-disable-next-line vue/return-in-computed-property
    const auxDocTypes = computed(() => {
      if (form.value.subSerie) {
        subseries.value.forEach((i) => {
          if (i.label == form.value.subSerie) {
            isDocs.value = [];
            i.documents.forEach((j) => {
              isDocs.value.push({
                label: j.name,
                value: j.name,
                days: j.days,
              });
            });
          }
        });
      }
    });

    //obtener dias segun tipologia documental
    const getDocDays = computed(() => {
      return isDocs.value.filter((el) => el.value == form.value.documentType ? el.days : 0)
    })

    function clearSelectInput() {
      if (form.value.area) {
        form.value.serie = "";
        form.value.subSerie = "";
        form.value.documentType = "";
      }
    }

    function clearInputSubSerie() {
      form.value.subSerie = "";
    }

    function clearInputDocType() {
      form.value.documentType = "";
    }

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe;
      }
    });

    onMounted(() => {
      getPeople();
    });

    watch(
      () => [...files.value],
      (currentValue) => {
        return currentValue;
      }
    );

    return {
      dropzoneFile,
      files,
      loadingBtnAI,
      documentID,
      claimData,
      form,
      v$,
      mode,
      saveLoading,
      submitLoading,
      qrModal,
      loadingAI,
      newDate,
      trds,
      series,
      subseries,
      auxSerie,
      auxSubSerie,
      auxDocTypes,
      isDocs,
      radicate,
      peopleList,
      getDocDays,
      clearSelectInput,
      getTrds,
      drop,
      selectedFile,
      getPeople,
      clearInputSubSerie,
      clearInputDocType,
    };
  },
  data() {
    return {
      value: ["C#", "HTML", "CSS"],
      content: "<h1>Some initial content</h1>",
      isDisabledAI: false,
      isDisabledCreate: false,
      loadingBtnCreate: false,
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
        altFormat: "d/m/Y H:i",
        altInput: true,
        dateFormat: "d/m/Y H:i",
      },
      showRadicationButton: false,
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
      this.identificationType = this.claimData.applicant.identificationType;
      this.gender = this.claimData.applicant.gender;
      this.countryOfResidence = this.claimData.applicant.countryOfResidence;
      this.cityOfResidence = this.claimData.applicant.cityOfResidence;
      this.deadline = this.claimData.deadline;
    },

    async handleSaveChanges() {
      try {
        const config = {
          headers: {
            company: "BAQVERDE",
            "Content-Type": "application/json", // Puedes ajustar el tipo de contenido según sea necesario
          },
        };

        const body = {
          area: this.form.area,
          serie: this.form.serie,
          subSerie: this.form.subSerie,
          days: this.getDocDays[0]?.days,
          documentaryTypologyEntry: this.form.documentType,
          entryDate: this.form.date,
          expirationDate: dayjs(this.form.untilDate),
          folios: parseInt(this.form.folios),
          assignedTo: this.form.assignedTo,
          observations: "prueba",
          externalRadicate: this.form.externalFiling,
          inputMethod: this.form.inputMethod,
          petitionerInformation: {
            personType: this.form.personType,
            identificationType: this.form.idType,
            identificationNumber: this.form.idNumber,
            firstNames: this.form.names,
            lastNames: this.form.lastNames,
            address: this.form.address,
            phoneNumber: this.form.contactPhone,
            email: this.form.email,
          },
        };
        const response = await axios.post(
          `https://us-central1-raudoc-gestion-agil.cloudfunctions.net/CLAIM_SAVE_INFORMATION_V1?claimId=${this.documentID}`,
          body,
          config
        );
        if (response.data.message) {
          this.saveLoading = false;
          this.showRadicationButton = true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async handleSubmitDocument() {
      try {
        this.submitLoading = true;
        const config = {
          headers: {
            company: "BAQVERDE",
            "Content-Type": "application/json", // Puedes ajustar el tipo de contenido según sea necesario
          },
        };

        const body = {
          typeRadicate: this.mode,
        };

        const response = await axios.post(
          `https://us-central1-raudoc-gestion-agil.cloudfunctions.net/CLAIM_GENERATE_RADICATE_V1?claimId=${this.documentID}`,
          body,
          config
        );

        if (response) {
          this.submitLoading = false;
          toast.success("Radicado emitido exitosamente!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
          this.radicate = response.data;
          this.qrModal = true;
        }
      } catch (error) {
        this.submitLoading = false;
        console.log(error);
      }
    },

    async handleSaveInfo() {
      try {
        this.v$.$touch();
        if (this.v$.$invalid) {
          return;
        } else {
          this.saveLoading = true;
          await this.handleSaveChanges();
        }
      } catch (error) {
        this.saveLoading = false;
        console.log(error);
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.isDisabledAI = false;
    }, 1000);
    this.getTrds();
  },
  computed: {
    user() {
      return this.$store.state.auth.currentUser;
    },
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
    flatPickr,
    ValidateLabel,
    Modal,
  },
};
</script>

<template>
  <!-- Modal -->
  <Modal
    v-if="qrModal"
    title=""
    size="small"
    :hideIconClose="true"
    @close="qrModal = false"
  >
    <template #content>
      <div
        class="d-flex flex-column justify-content-center align-items-center gap-3"
      >
        <div>
          <h4 class="text-success fw-bold fs-4">{{ radicate?.idRadicate }}</h4>
        </div>
        <div class="pb-4">
          <a-qrcode
            error-level="H"
            :value="'http://portal.raudoc.com/r/BAQVERDE/' + documentID"
            icon=""
          />
        </div>
      </div>
    </template>
  </Modal>

  <!-- page tempalte-->
  <Layout>
    <PageHeader
      :title="`RADICAR DOCUMENTO`"
      subTitle="Crear"
      pageTitle="Proyectos"
    />

    <!-- page header ( buttons ) -->
    <BRow>
      <div class="col-6 col-sm-6">
        <a-radio-group v-model:value="mode" :style="{ marginBottom: '' }">
          <a-radio-button value="Entry">Entrada</a-radio-button>
          <a-radio-button value="Out">Salida</a-radio-button>
        </a-radio-group>
        <div>{{ auxSerie }}</div>
        <div>{{ auxSubSerie }}</div>
        <div>{{ auxDocTypes }}</div>
      </div>
      <div class="text-end mb-4 col-6 col-sm-6">
        <BButton
          v-if="!showRadicationButton"
          type="submit"
          variant="success"
          class="w-sm"
          @click="handleSaveInfo"
          :disabled="saveLoading"
        >
          <div class="button-content">
            <span
              v-if="saveLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span>Guardar Cambios</span>
          </div>
        </BButton>
        <BButton
          v-else
          type="submit"
          variant="danger"
          class="w-sm"
          @click="handleSubmitDocument"
          :disabled="submitLoading"
        >
          <div class="button-content">
            <span
              v-if="submitLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span>Radicar Documento</span>
          </div>
        </BButton>
      </div>
    </BRow>

    <!-- columns of page data ( document section ) - ( form section ) -->
    <BRow>
      <!-- Document section column -->
      <BCol lg="4" md="12" sm="12">
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
                >Asuntoss</label
              >
              <BSpinner
                v-if="loadingAI"
                class="float-end"
                small
                v-b-tooltip.hover.top
                title="Extrayendo asunto con IA"
                type="grow"
              />

              <input
                type="text"
                v-model="form.subject"
                class="form-control"
                id="project-title-input"
                placeholder="Ingrese asunto del radicado"
              />
              <ValidateLabel v-bind="{ v$ }" attribute="subject" />
            </div>

            <BCard no-body> </BCard>

            <div class="mb-3">
              <label class="form-label fw-bold">Resumen de radicado</label>
              <BSpinner
                v-if="loadingAI"
                class="float-end"
                small
                v-b-tooltip.hover.top
                title="Extrayendo resumen con IA"
                type="grow"
              />
              <!-- <ckeditor v-model="editorData" :editor="editor"></ckeditor> -->
              <textarea
                class="form-control"
                v-model="form.description"
                style="min-height: 255px"
              ></textarea>
              <ValidateLabel v-bind="{ v$ }" attribute="description" />
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Form section column -->
      <BCol lg="8" md="12" sm="12">
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
                  :options="trds"
                  @change="clearSelectInput"
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
                    { value: 'Página web', label: 'Página web' },
                    {
                      value: 'Presencial',
                      label: 'Presencial',
                    },
                    {
                      value: 'Mensajería Certificada',
                      label: 'Mensajería Certificada',
                    },
                    {
                      value: 'Correo Electrónico',
                      label: 'Correo Electrónico',
                    },
                    {
                      value: 'WhatsApp',
                      label: 'WhatsApp',
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
                  :options="series"
                  @change="clearInputSubSerie"
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
                  :options="subseries"
                  @change="clearInputDocType"
                />
                <ValidateLabel v-bind="{ v$ }" attribute="subSerie" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label
                  for="choices-privacy-status-input"
                  class="form-label fw-bold"
                  >Tipología Documental</label
                >
                <pre>{{ form.documentType }}</pre>
                <Multiselect
                  v-model="form.documentType"
                  :required="true"
                  :close-on-select="true"
                  :searchable="true"
                  :create-option="true"
                  placeholder="Seleccione"
                  :options="isDocs"
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
                <label for="username" class="form-label fw-bold"
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

                <ValidateLabel v-bind="{ v$ }" attribute="folios" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label for="username" class="form-label fw-bold"
                  >Radicado Externo</label
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
              </BCol>
              <BCol lg="6" class="mb-3">
                <label for="username" class="form-label fw-bold">
                  Asignado a <span class="text-danger">*</span></label
                >
                <Multiselect
                  v-model="form.assignedTo"
                  :required="true"
                  :close-on-select="true"
                  :create-option="true"
                  :searchable="true"
                  placeholder="Seleccione"
                  :options="peopleList"
                />
                <ValidateLabel v-bind="{ v$ }" attribute="assignedTo" />
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
                  >Tipo de persona</label
                >
                <Multiselect
                  v-model="form.personType"
                  :required="true"
                  :close-on-select="true"
                  :searchable="true"
                  :create-option="true"
                  placeholder="Seleccione"
                  :options="[
                    { value: 'Natural', label: 'Natural' },
                    {
                      value: 'Jurídica',
                      label: 'Jurídica',
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
                    { value: 'Cédula', label: 'Cédula' },
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
                  ]"
                />
                <ValidateLabel v-bind="{ v$ }" attribute="idType" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label for="username" class="form-label fw-bold"
                  >Número de documento
                  <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.idNumber"
                  id="username"
                  placeholder="Ingrese numero de documento"
                />

                <ValidateLabel v-bind="{ v$ }" attribute="idNumber" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label for="username" class="form-label fw-bold"
                  >Teléfono de contacto
                  <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.contactPhone"
                  placeholder="Ingrese telefono de contacto"
                />
                <ValidateLabel v-bind="{ v$ }" attribute="contactPhone" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label for="username" class="form-label fw-bold"
                  >Nombres <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.names"
                  id="username"
                  placeholder="Ingrese nombres"
                />

                <ValidateLabel v-bind="{ v$ }" attribute="names" />
              </BCol>
              <BCol lg="3" class="mb-3">
                <label for="username" class="form-label fw-bold"
                  >Apellidos <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.lastNames"
                  placeholder="Ingrese apellidos"
                />

                <ValidateLabel v-bind="{ v$ }" attribute="lastNames" />
              </BCol>
              <BCol lg="6" class="mb-3">
                <label for="username" class="form-label fw-bold"
                  >Correo electrónico
                  <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.email"
                  id="username"
                  placeholder="Ingrese email"
                />

                <ValidateLabel v-bind="{ v$ }" attribute="email" />
              </BCol>
              <BCol lg="12" class="mb-3">
                <label for="username" class="form-label fw-bold"
                  >Dirección <span class="text-danger fw-bold">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="form.address"
                  id="username"
                  placeholder="Ingrese una dirección"
                />

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

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
