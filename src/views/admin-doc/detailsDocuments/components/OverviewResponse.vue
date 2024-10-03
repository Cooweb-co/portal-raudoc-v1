<script setup>
  import { required, email } from "@vuelidate/validators";
  import { useVuelidate } from "@vuelidate/core";
  import Multiselect from "@vueform/multiselect";
  import "@vueform/multiselect/themes/default.css";
  import { toast } from "vue3-toastify";
  import InputFile from "@/components/InputFile.vue";
  import { ref, reactive, watch, defineProps, computed } from "vue";
  import { Editor } from "@camilo__lp/custom-editor-vue3";
  import axios from "axios";

  import { getUserRoleByName } from "@/services/docservice/doc.service";
  import { transformDate } from "@/helpers/transformDate";
  import { setTracking } from "@/helpers/tracking";
  import capitalizedText from "@/helpers/capitalizedText";
  import setIdRole from "@/helpers/setIdRole";
  import { state } from "@/state/modules/auth";

  const editorSettings = {
    placeholder: "Escribe acá la respuesta para el ciudadano.",
  };

  const user = JSON.parse(state.currentUserInfo);
  const props = defineProps(["loading", "data"]);
  const responseFilesList = ref([]);
  const isAnswered = ref(false);
  const isLoadingFile = ref(false);
  const isLoadingSendFile = ref(false);
  const isLoadingPreview = ref(false);
  const isLoadingSave = ref(false);
  const hasShowInputCompany = ref(false);
  const hasSecondAddressee = ref(false);
  const claimNumber = ref("Número de radicado");
  const company = "BAQVERDE";
  const trds = ref([]);
  const peopleListSender = ref([]);
  const peopleListReview = ref([]);

  const emitFiles = (inputFiles) => {
    responseFilesList.value = [];
    inputFiles.forEach((file) => {
      responseFilesList.value.push(file);
    });
  };

  const showToast = (message, type) => {
    toast(message, {
      type: type,
      autoClose: 3000,
      closeButton: true,
      closeOnClick: true,
    });
  };

  const getDate = () => {
    // Get the current date and time in seconds
    const seconds = Math.floor(new Date().getTime() / 1000);

    const formatDate = transformDate(seconds, "DD [de] MMMM [de] YYYY");
    return formatDate;
  };

  const form = reactive({
    entryDate: getDate(),
    name: "",
    copyName: "",
    documentType: "",
    documentNumber: "",
    email: "",
    companyName: "",
    address: "",
    city: "",
    subject: "",
    body: "",
    senderName: "",
    position: "",
    senderArea: "",
    senderCompany: company,
    review_area: "",
    review_name: "",
    review_occupation: "",
  });

  const rules = {
    entryDate: { required },
    name: { required },
    copyName: {},
    documentType: { required },
    documentNumber: { required },
    companyName: props?.data?.personType === "Jurídica" ? { required } : {},
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

  const fileUploadService = async (files, isFileWithQR = 1) => {
    // Upload files to the service
    const FilesUploadHeader = {
      company: "BAQVERDE",
      "Content-Type": "multipart/form-data",
    };

    const FilesUploadParams = {
      claimId: props.data.id,
      isFileWithQR,
    };

    const formDataUploadFiles = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => formDataUploadFiles.append("files", file));
    } else {
      formDataUploadFiles.append("files", files);
    }

    try {
      const configGenerateRadicateOut = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/claim/radicate-out`,
        headers: FilesUploadHeader,
        params: FilesUploadParams,
        data: formDataUploadFiles,
      };
      const resGenerateRadicateOut = await axios.request(
        configGenerateRadicateOut
      );
      return resGenerateRadicateOut;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  };

  const fileUpload = async () => {
    try {
      if (isAnswered.value) {
        showToast("Ya el radicado fue generado", "error");
        return;
      } else if (responseFilesList.value.length <= 0) {
        v$.value.$touch();
        if (v$.value.$invalid) {
          showToast(
            "No has subido ningún archivo o no has completado el formulario",
            "error"
          );
          return;
        }
      }

      isLoadingFile.value = true;

      // Upload pdf to add the QR
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
        responseFilesList.value = [pdfFile, ...responseFilesList.value];
      }

      // Upload files of response
      const resGenerateRadicateOut = await fileUploadService(
        responseFilesList.value[0],
        1
      );

      if (responseFilesList.value.length > 1) {
        const filesUpload = responseFilesList.value.slice(1);
        await fileUploadService(filesUpload, 0);
      }

      isAnswered.value = true;
      const { idRadicate } = resGenerateRadicateOut.data.idRadicate;
      claimNumber.value = idRadicate;

      const trackingData = [
        { name: "Area", value: form.senderArea },
        { name: "Cargo", value: form.position },
        { name: "Comentarios", value: "Documento respondido exitosamente" },
      ];

      // Set private tracking
      await setTracking(
        props.data?.id,
        company,
        form.senderName,
        trackingData,
        "Respondido",
        true
      );

      // Set public tracking
      await setTracking(
        props.data?.id,
        company,
        "Sistema",
        "Documento respondido exitosamente",
        "Respondido",
        false
      );

      showToast("Archivo cargado con éxito", "success");
      setTimeout(() => location.reload(), 4000);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      showToast("Problemas al cargar el archivo", "error");
    } finally {
      isLoadingFile.value = false;
    }
  };

  //Service to send the file to the user
  const sendFile = async () => {
    isLoadingSendFile.value = true;
    try {
      const dataSendFile = JSON.stringify({
        email: props.data?.email,
        numberEntryClaim: props.data?.numberEntryClaim,
      });

      const configSendFile = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/sendEmailResponseClaim`,
        headers: {
          "Content-Type": "application/json",
        },
        data: dataSendFile,
      };

      axios.request(configSendFile);
      showToast("Correo enviado correctamente", "success");

      const trackingData = [
        { name: "Destinatario", value: form.senderName },
        { name: "Método de envío", value: "correo electrónico" },
        { name: "Correo", value: props.data.email },
        { name: "Comentario", value: "El documento fue enviado" },
      ];
      // Set private tracking
      await setTracking(
        props.data?.id,
        company,
        user.name,
        trackingData,
        "Enviado",
        true
      );
      // Set public tracking
      await setTracking(
        props.data?.id,
        company,
        "Sistema",
        "Documento enviado, revise su correo electrónico",
        "Enviado",
        false
      );
    } catch (error) {
      showToast("Error al enviar el correo", "error");
      console.error(error);
    } finally {
      isLoadingSendFile.value = false;
    }
  };

  //Function to create the pdf
  const createPDF = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
      return null;
    }

    const dataCreatePDF = JSON.stringify({
      entryDate: form.entryDate,
      name: form.name,
      copyName: form.copyName,
      companyName: form.companyName || null,
      documentType: form.documentType,
      documentNumber: form.documentNumber,
      email: form.email,
      address: form.address,
      city: form.city,
      subject: form.subject,
      body: form.body,
      senderName: form.senderName,
      position: form.position,
      senderArea: form.senderArea,
      senderCompany: form.senderCompany,
      senderDesignation: form.position,
      projectorName: user.name,
      projectorDesignation: user.idRole,
      reviewerName: form.review_name,
      reviewerDesignation: form.review_occupation,
      reviewerArea: form.review_area
    });

    const configCreatePDF = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.VUE_APP_CF_BASE_URL}/doc/create-response`,
      headers: {
        Accept: "/",
        "Content-Type": "application/json",
      },
      responseType: "blob",
      data: dataCreatePDF,
    };

    try {
      const response = await axios.request(configCreatePDF);
      return response.data;
    } catch (error) {
      showToast("Hubo un error al crear el PDF", "error");
      console.error(error);
    }
  };

  // Function to view the created pdf
  const seeResponseClaim = async () => {
    isLoadingPreview.value = true;
    try {
      const response = await createPDF();
      const pdfBlob = response;
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    } catch (error) {
      console.error(error);
    } finally {
      isLoadingPreview.value = false;
    }
  };

  // Function to save content of form to create PDF
  const saveResponseForm = async () => {
    isLoadingSave.value = true;
    try {
      v$.value.$touch();
      if (v$.value.$invalid) {
        showToast(
          "Llena todos los campos del formulario para poder guardarlo",
          "error"
        );
        return;
      }
      const petitionSaveData = JSON.stringify(form);
      const petitionSaveConfig = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/claim/citizen-response/${props.data.id}`,
        headers: {
          company: "BAQVERDE",
          "Content-Type": "application/json",
        },
        data: petitionSaveData,
      };

      await axios.request(petitionSaveConfig);
      showToast("¡Respuesta guardada exitosamente!", "success");
    } catch (error) {
      showToast("¡Hubo un error al guardar!", "error");
      console.error(error);
    } finally {
      isLoadingSave.value = false;
    }
  };

  // Function to break down the address and the city
  const decomposeAddress = (address) => {
    const addressSplit = address.split(",");
    return {
      address: addressSplit[0]?.trim(),
      city: addressSplit[1]?.trim() + ", " + addressSplit[2]?.trim(),
    };
  };

  // Function to get address and city for separately
  const getAddressAndCity = (address) => {
    const decomposed = decomposeAddress(address);
    return {
      address: decomposed?.address || "",
      city: decomposed?.city || "",
    };
  };

  // obtener listado trds
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.VUE_APP_CF_BASE_URL}/TDRS_LIST_V1`,
    headers: {
      company: "BAQVERDE",
    },
  };

  async function getTrds() {
    trds.value = [];

    await axios
      .request(config)
      .then((response) => {
        response.data.forEach((element) => {
          trds.value.push({
            label: element.name,
            value: element.name,
            series: element.series,
            id: element.id,
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getTrds();

  const loadingSenderName = ref(false);

  // obtener listado de usuarios activos por area Remitente
  async function getPeopleSender() {
    loadingSenderName.value = true;
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.VUE_APP_CF_BASE_URL}/GET_USERS_BY_AREA_ID?areaId=${getAreaIdSender.value}`,
      headers: {
        company: "BAQVERDE",
      },
    };
    var auxPeople = [];
    await axios
      .request(config)
      .then((response) => {
        response.data.forEach((element) => {
          auxPeople.push({
            label: element.name,
            value: element.name,
            area: element.area,
            role: element.role,
            uid: element.uid,
          });
        });
        peopleListSender.value = auxPeople;
        loadingSenderName.value = false;
      })
      .catch((error) => {
        loadingSenderName.value = false;
        console.error(error);
      });
  }

  //obtener id de area para formulario de Remitente
  const getAreaIdSender = computed(() => {
    return trds.value.find((el) => el.value === form.senderArea.toLocaleUpperCase())?.id;
  });

  // Function to getPeopleSender()
  async function clearSelectInputSender() {
    await getPeopleSender();
  }

  const loadingReviewerName = ref(false);

  //obtener id de area para formulario de Revision
  const getAreaIdReview = computed(() => {
    return trds.value.find((el) => el.value === form.review_area)?.id;
  });

  // obtener listado de usuarios activos por area Revisión
  async function getPeopleReview() {
    loadingReviewerName.value = true;
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.VUE_APP_CF_BASE_URL}/GET_USERS_BY_AREA_ID?areaId=${getAreaIdReview.value}`,
      headers: {
        company: "BAQVERDE",
      },
    };
    var auxPeople = [];
    axios
      .request(config)
      .then((response) => {
        response.data.forEach((element) => {
          auxPeople.push({
            label: element.name,
            value: element.name,
            area: element.area,
            role: element.role,
            uid: element.uid,
          });
        });
        peopleListReview.value = auxPeople;
        loadingReviewerName.value = false;
      })
      .catch((error) => {
        loadingReviewerName.value = false;
        console.error(error);
      });
  }

  // Function to getPeopleReview()
  async function clearSelectInputReview() {
    await getPeopleReview();
  }

  watch(
    () => props.data,
    async (currentValue) => {
      const formValue = currentValue?.citizenResponse || currentValue;
      const idRole = await getUserRoleByName(company, props.data?.assignedTo);

      if (
        currentValue.numberOutClaim ||
        currentValue.status === "No requiere respuesta"
      ) {
        isAnswered.value = true;
        return;
      }

      Object.assign(form, {
        position: formValue.position || setIdRole(idRole),
        address:
          formValue.address || getAddressAndCity(currentValue.address).address,
        city: formValue.city || getAddressAndCity(currentValue.address).city,
        senderName:
          formValue.senderName ||
          capitalizedText(currentValue.assignedTo) ||
          "",
        senderArea:
          formValue.senderArea || capitalizedText(currentValue.area) || "",
        body: formValue.body || "",
        subject: formValue.subject ? `Res - ${formValue.subject}` : "Res - ",
        documentType:
          formValue.documentType || formValue.identificationType || "",
        documentNumber:
          formValue.documentNumber || formValue.identificationNumber || "",
        name: formValue.name || formValue.fullName || "",
        email: formValue.email || "",
        companyName: formValue.companyName || "",
      });

      if (formValue.personType?.toUpperCase() === "JURÍDICA") {
        hasShowInputCompany.value = true;
      }
    }
  );

  const remName = computed(() => form.senderName)
  const remArea = computed(() => form.senderArea)

  watch(remName, (newValue) => {
    if (newValue == '' && remArea.value != '') {
      clearSelectInputSender()
    }
  })

  watch( remArea, (newValue) => {
    if (newValue == '') {
      form.senderName = ''
    }
  } )

</script>

<template>
  <BTab title="Respuesta" class="fw-semibold pt-2">
    <template #title>
      <i class="las la-check-circle align-middle me-1"></i>
      Respuesta al Ciudadano
    </template>
    <a-skeleton v-if="loading" :paragraph="{ rows: 5 }" active />

    <main v-else class="w-100 h-100">
      <section>
        <div
          class="d-flex justify-content-between w-100 mt-2 flex-column-reverse flex-sm-row"
        >
          <div class="grid align-items-center gx-2 mt-2 mt-sm-0">
            <BButton
              type="submit"
              :variant="isAnswered ? 'secondary' : 'danger'"
              :disabled="isAnswered || isLoadingFile"
              class="w-sm"
              @click="fileUpload"
              ><div class="button-content">
                <span>Generar respuesta</span>
                <span
                  v-if="isLoadingFile"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span></div
            ></BButton>
            <BButton
              type="button"
              class="w-sm ma-2 ms-2"
              variant="success"
              v-if="isAnswered"
              @click="sendFile"
              :disabled="isLoadingSendFile"
            >
              <div class="button-content">
                <span>Enviar al peticionario</span>
                <span
                  v-if="isLoadingSendFile"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <i
                  class="ri-send-plane-fill align-bottom align-bottom"
                  v-else
                ></i>
              </div>
            </BButton>
            <a-tooltip>
              <template #title>Guardar respuesta</template>
              <BButton
                v-if="!isAnswered"
                type="button"
                variant="info"
                size="sm"
                class="w-auto h-100 ms-2 d-inline-flex align-items-center justify-content-center"
                @click="saveResponseForm"
              >
                <span
                  v-if="isLoadingSave"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <i class="ri-save-2-fill fs-5" v-else></i>
                <!-- <EyeIcon size="22" /> -->
              </BButton>
            </a-tooltip>

            <a-tooltip>
              <template #title>Previsualizar respuesta</template>
              <BButton
                v-if="!isAnswered"
                type="button"
                variant="info"
                size="sm"
                class="w-auto h-100 mx-2 d-inline-flex align-items-center justify-content-center"
                @click="seeResponseClaim"
              >
                <span
                  v-if="isLoadingPreview"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>

                <i class="ri-eye-fill fs-5" v-else></i>
                <!-- <EyeIcon size="22" /> -->
              </BButton>
            </a-tooltip>
          </div>
          <div class="mh-100 d-inline-flex align-items-center">
            <span class="text-center"
              >#{{
                !props.data.numberOutClaim
                  ? claimNumber
                  : props.data.numberOutClaim
              }}</span
            >
          </div>
        </div>

        <BCard no-body class="mt-3" v-if="!isAnswered">
          <BCardHeader>
            <h6>Generador de documentos</h6>
          </BCardHeader>
          <BCardBody>
            <BRow class="mb-3" style="min-height: 600px">
              <BCol lg="8" class="row-container-form">
                <BCol lg="12">
                  <label for="subject" class="form-label fw-bold"
                    >Asunto <span class="text-danger fw-bold">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    :required="true"
                    v-model="form.subject"
                    id="subject"
                    placeholder="Ingrese el asunto"
                  />
                  <span v-if="v$.$errors.subject" class="text-danger">
                    <span v-if="v$.subject.required.$invalid"
                      >Este campo es obligatorio</span
                    >
                  </span>
                </BCol>
                <BCol lg="12" class="mt-3 h-100">
                  <div class="ck-content w-full h-100">
                    <span v-if="v$.$invalid" class="text-danger">
                      <span v-if="v$.body.required.$invalid"
                        >Escribe el cuerpo del documento</span
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
                <BCol
                  lg="12"
                  class="mb-3"
                  v-if="data.personType === 'Jurídica'"
                >
                  <label for="name" class="form-label fw-bold"
                    >Nombre de la empresa del destinatario
                    <span class="text-danger fw-bold">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="form.companyName"
                    id="companyName"
                    :required="true"
                    placeholder="Ingrese el nombre de la empresa del destinatario"
                  />
                </BCol>

                <BCol class="mt-4" lg="12" md="12" sm="12">
                  <div class="accordion" id="accordionResponse">
                    <!-- información principal -->
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="_headingMain">
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#_collapseMain"
                          aria-expanded="true"
                          aria-controls="_collapseMain"
                        >
                          INFORMACIÓN PRINCIPAL
                        </button>
                      </h2>
                      <div
                        id="_collapseMain"
                        class="accordion-collapse collapse show"
                        aria-labelledby="_headingMain"
                        data-bs-parent="#accordionResponse"
                      >
                        <div class="accordion-body">
                          <BCol lg="12">
                            <label for="name" class="form-label fw-bold"
                              >Destinatario
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <input
                              type="text"
                              class="form-control"
                              v-model="form.name"
                              id="name"
                              :required="true"
                              placeholder="Ingrese el nombre del destinatario"
                            />
                            <span v-if="v$.$invalid" class="text-danger">
                              <span v-if="v$.name.required.$invalid"
                                >Este campo es obligatorio</span
                              >
                            </span>
                            <div class="fs-15 mt-2">
                              <label for="" class="pe-2 fw-bold text-muted"
                                >Agregar otros destinatarios</label
                              >
                              <input
                                v-model="hasSecondAddressee"
                                class="form-check-input"
                                type="checkbox"
                              />
                            </div>
                          </BCol>

                          <BCol lg="12" class="mb-3" v-if="hasSecondAddressee">
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
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <Multiselect
                              v-model="form.documentType"
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
                            <span v-if="v$.$invalid" class="text-danger">
                              <span v-if="v$.documentType.required.$invalid"
                                >Este campo es obligatorio</span
                              >
                            </span>
                          </BCol>

                          <BCol lg="12" class="mb-3">
                            <label for="name" class="form-label fw-bold"
                              >Número de documento
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <input
                              type="text"
                              class="form-control"
                              v-model="form.documentNumber"
                              id="name"
                              :required="true"
                              placeholder="Ingrese el número del documento del destinatario"
                            />
                            <span v-if="v$.$invalid" class="text-danger">
                              <span v-if="v$.documentNumber.required.$invalid"
                                >Este campo es obligatorio</span
                              >
                            </span>
                          </BCol>

                          <BCol lg="12" class="mb-3">
                            <label for="email" class="form-label fw-bold"
                              >Email
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <input
                              type="text"
                              class="form-control"
                              v-model="form.email"
                              id="email"
                              :required="true"
                              placeholder="Ingrese el correo del destinatario"
                            />
                            <span v-if="v$.$invalid" class="text-danger">
                              <span v-if="v$.email.required.$invalid"
                                >Este campo es obligatorio</span
                              >
                              <span v-if="v$.email.email.$invalid"
                                >El email no es válido</span
                              >
                            </span>
                          </BCol>

                          <BCol lg="12" class="mb-3">
                            <label for="address" class="form-label fw-bold"
                              >Dirección
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <input
                              type="text"
                              class="form-control"
                              v-model="form.address"
                              id="address"
                              :required="true"
                              placeholder="Ingrese la dirección del destinatario"
                            />
                            <span v-if="v$.$invalid" class="text-danger">
                              <span v-if="v$.address.required.$invalid"
                                >Este campo es obligatorio</span
                              >
                            </span>
                          </BCol>

                          <BCol lg="12" class="mb-3">
                            <label for="city" class="form-label fw-bold"
                              >Ciudad
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <input
                              type="text"
                              class="form-control"
                              v-model="form.city"
                              id="city"
                              :required="true"
                              placeholder="Ingrese la ciudad del destinatario"
                            />
                            <span v-if="v$.$invalid" class="text-danger">
                              <span v-if="v$.city.required.$invalid"
                                >Este campo es obligatorio</span
                              >
                            </span>
                          </BCol>
                        </div>
                      </div>
                    </div>

                    <!-- información remitente -->
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="_headingSender">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#_collapseSender"
                          aria-expanded="false"
                          aria-controls="_collapseSender"
                        >
                          INFORMACIÓN DE REMITENTE
                        </button>
                      </h2>
                      <div
                        id="_collapseSender"
                        class="accordion-collapse collapse"
                        aria-labelledby="_headingSender"
                        data-bs-parent="#accordionResponse"
                      >
                        <div class="accordion-body">
                          <!-- sender area -->
                          <BCol
                            lg="12"
                            class="mb-3"
                            v-if="form.senderArea != ''"
                          >
                            <label for="name" class="form-label fw-bold"
                              >Area del remitente
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <input
                              type="text"
                              class="form-control"
                              v-model="form.senderArea"
                              id="name"
                              :required="true"
                              placeholder="Ingrese el area del remitente"
                            />
                            <span v-if="v$.$invalid" class="text-danger">
                              <span v-if="v$.senderArea.required.$invalid"
                                >Este campo es obligatorio</span
                              >
                            </span>
                          </BCol>
                          <BCol lg="12" class="mb-3" v-else>
                            <label for="name" class="form-label fw-bold"
                              >Área
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <Multiselect
                              v-model="form.senderArea"
                              :required="true"
                              :close-on-select="true"
                              :searchable="true"
                              :create-option="true"
                              placeholder="Seleccione"
                              :options="trds"
                              @select="clearSelectInputSender"
                              :disabled="radicated"
                            />
                          </BCol>

                          <!-- sender name -->
                          <BCol
                            lg="12"
                            class="mb-3"
                            v-if="form.senderName != ''"
                          >
                            <label for="senderName" class="form-label fw-bold"
                              >Nombre del remitente
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <input
                              type="text"
                              class="form-control"
                              v-model="form.senderName"
                              id="senderName"
                              :required="true"
                              placeholder="Ingrese el nombre del remitente"
                            />
                            <span v-if="v$.$invalid" class="text-danger">
                              <span v-if="v$.senderName.required.$invalid"
                                >Este campo es obligatorio</span
                              >
                            </span>
                          </BCol>
                          <BCol lg="12" class="mt-3 mb-3" v-else>
                            <label for="name" class="form-label fw-bold"
                              >Nombre del remitente
                              <span class="text-danger fw-bold">*</span>
                              <BSpinner
                                v-if="loadingSenderName"
                                class="float-end"
                                small
                                v-b-tooltip.hover.top
                                title="Extrayendo asunto con IA"
                                type="grow"
                              />
                            </label>
                            <Multiselect
                              :required="true"
                              v-model="form.senderName"
                              :close-on-select="true"
                              :searchable="true"
                              :create-option="true"
                              :options="peopleListSender"
                              @focus="clearSelectInputSender"
                              placeholder="Seleccione"
                            />
                          </BCol>

                          <!-- sender position -->
                          <BCol lg="12" class="mb-3">
                            <label for="position" class="form-label fw-bold"
                              >Cargo del remitente
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <input
                              type="text"
                              class="form-control"
                              v-model="form.position"
                              id="position"
                              :required="true"
                              placeholder="Ingrese el cargo del remitente"
                            />
                            <span v-if="v$.$invalid" class="text-danger">
                              <span v-if="v$.position.required.$invalid"
                                >Este campo es obligatorio</span
                              >
                            </span>
                          </BCol>
                        </div>
                      </div>
                    </div>

                    <!-- información revisión -->
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="_headingReview">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#_collapseReview"
                          aria-expanded="false"
                          aria-controls="_collapseReview"
                        >
                          INFORMACIÓN DE REVISIÓN
                        </button>
                      </h2>
                      <div
                        id="_collapseReview"
                        class="accordion-collapse collapse"
                        aria-labelledby="_headingReview"
                        data-bs-parent="#accordionResponse"
                      >
                        <div class="accordion-body">
                          <BCol lg="12">
                            <label for="name" class="form-label fw-bold"
                              >Área
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <Multiselect
                              v-model="form.review_area"
                              :required="true"
                              :close-on-select="true"
                              :searchable="true"
                              :create-option="true"
                              placeholder="Seleccione"
                              :options="trds"
                              @select="clearSelectInputReview"
                              :disabled="radicated"
                            />
                          </BCol>
                          <BCol lg="12" class="mt-3">
                            <label for="name" class="form-label fw-bold"
                              >Nombre de quien revisa
                              <span class="text-danger fw-bold">*</span>
                              <BSpinner
                                v-if="loadingReviewerName"
                                class="float-end"
                                small
                                v-b-tooltip.hover.top
                                title="Extrayendo asunto con IA"
                                type="grow"
                              />
                            </label>
                            <Multiselect
                              :required="true"
                              v-model="form.review_name"
                              :close-on-select="true"
                              :searchable="true"
                              :create-option="true"
                              :options="peopleListReview"
                              placeholder="Seleccione"
                            />
                          </BCol>
                          <BCol lg="12" class="mt-3">
                            <label for="name" class="form-label fw-bold"
                              >Cargo
                              <span class="text-danger fw-bold">*</span></label
                            >
                            <input
                              type="text"
                              class="form-control"
                              id="name"
                              :required="true"
                              placeholder="Ingrese el cargo del remitente"
                              v-model="form.review_occupation"
                            />
                          </BCol>
                        </div>
                      </div>
                    </div>
                  </div>
                </BCol>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>

        <div class="relative">
          <BCard no-body class="mt-3">
            <BCardBody v-if="!isAnswered">
              <InputFile
                @emitFiles="emitFiles"
                title="AGREGA ARCHIVO PARA RESPONDER AL CIUDADANO"
              />
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
