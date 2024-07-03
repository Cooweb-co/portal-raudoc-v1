<script>
import {
    ref,
    watch,
    getCurrentInstance,
    // onUnmounted,
    computed,
    reactive,
    // onMounted,
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
import { setTracking } from "@/helpers/tracking";
import Modal from "../modals/Modal.vue";
import moment from "moment";
import store from "@/state/store";
import {
    FileTextIcon,
    // AlertOctagonIcon,
    Trash2Icon,
    CpuIcon,
} from "@zhuowenli/vue-feather-icons";

// import {
//   onSnapshot,
//   collection,
// } from "firebase/firestore";

//google places api imports
import { Loader } from "@googlemaps/js-api-loader";

import {
    createClaimID,
    onListenClaimData,
    getDocStatus,
    // deleteDocument,
    deleteDocumentByName,
    updateClaimSummary,
} from "../../services/docservice/doc.service";
import axios from "axios";

export default {
    setup() {
        const instance = getCurrentInstance();
        const storage = getFirebaseBackend().storage;
        const files = ref([]);
        const filesToUpload = ref([]);
        const uploadedFiles = ref([]);
        const readDocument = ref(false);
        const dropzoneFile = ref("");
        const loadingBtnAI = ref(false);
        const canUseAI = ref(true);
        const documentID = ref(null);
        const documentAI = ref(null);
        const companyID = ref("BAQVERDE");
        const urlSticker = ref(null);
        const year = ref(new Date().getFullYear());
        const claimData = ref(null);
        const mode = ref("Entry");
        const saveLoading = ref(false);
        const submitLoading = ref(false);
        const qrModal = ref(false);
        let unsubscribe;
        let idProccessAI;
        const isListeningEnabled = ref(true);
        const loadingAI = ref(false);
        const newDate = ref(dayjs().format("DD/MM/YYYY HH:mm"));
        const trds = ref([]);
        const series = ref([]);
        const subseries = ref([]);
        const isDocs = ref([]);
        const radicate = ref("");
        const peopleList = ref([]);
        const timerAI = ref([]);
        const timerExtractingInformationAI = ref(null);
        const dropzone = ref(false);
        const manual_address = ref(false);
        const radicated = ref(false);
        const urlPage = ref(process.env.VUE_APP_URLPAGE);
        const manual_address_info = ref(["", "", "", "", "", "", "", "", ""]);
        const address_info = ref([
            "" /* Dirección */,
            "" /* Departamento */,
            "" /* Ciudad */,
        ]);
        const finalAddress = ref("");
        const showcompanyNameForm = ref(false);
        const addressOptions = ref([
            { label: "Calle", value: "CL. " },
            { label: "Carrera", value: "CRA. " },
            { label: "Autopista", value: "AU. " },
            { label: "Avenida", value: "AV. " },
            { label: "Transversal", value: "TV. " },
            { label: "Diagonal", value: "DG. " },
            { label: "Vía", value: "VI. " },
        ]);

        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${process.env.VUE_APP_CF_BASE_URL}/TDRS_LIST_V1`,
            headers: {
                company: "BAQVERDE",
            },
        };

        // controlador de variables para el formulario de radicacion
        const form = reactive({
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
            companyName: "",
            lastNames: "",
            email: "",
            address: "",
            assignedTo: "",
            subject: "",
            description: "",
            observations: "",
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
            companyName: showcompanyNameForm.value && {
                required: MESSAGE_REQUIRED,
            },
            lastNames: { required: MESSAGE_REQUIRED },
            email: { required: MESSAGE_REQUIRED, MESSAGE_EMAIL },
            address: { required: MESSAGE_REQUIRED },
            assignedTo: { required: MESSAGE_REQUIRED },
            subject: { required: MESSAGE_REQUIRED },
            description: { required: MESSAGE_REQUIRED },
            city: {},
        };

        const v$ = useVuelidate(rules, form);

        const startListening = () => {
            if (!isListeningEnabled.value) {
                return;
            }
            try {
                idProccessAI = toast("Analizando documento con IA...", {
                    isLoading: true,
                    hideProgressBar: true,
                    closeButton: false,
                    closeOnClick: false,
                });
                unsubscribe = onListenClaimData(
                    documentAI.value.claimID,
                    companyID.value,
                    async (data) => {
                        await getDocStatus(
                            companyID.value,
                            documentAI.value.claimID
                        );
                        claimData.value = data;
                        if (data.status == "DRAFT" && data.summary == null) {
                            loadingAI.value = true;
                            timerAI.value = setTimeout(() => {
                                toast.update(idProccessAI, {
                                    render: "Complete la información de asunto y resumen manualmente. Documento no válido para este proceso.",
                                    type: toast.TYPE.WARNING,
                                    isLoading: false,
                                    autoClose: 7000,
                                });
                                loadingAI.value = false;
                            }, 60000);
                            timerExtractingInformationAI.value = setTimeout(
                                () => {
                                    toast.update(idProccessAI, {
                                        render: "Extrayendo información relevante...",
                                        type: toast.TYPE.INFO,
                                    });
                                },
                                3000
                            );
                        }
                        if (
                            data.summary &&
                            isListeningEnabled.value &&
                            canUseAI.value
                        ) {
                            canUseAI.value = false;
                            toast.update(idProccessAI, {
                                render: "Resumen realizado con exito!",
                                type: toast.TYPE.SUCCESS,
                                isLoading: false,
                                autoClose: 3000,
                            });
                            loadingAI.value = false;
                            clearTimeout(timerAI.value);
                            timerAI.value = 0;
                            instance.proxy.subject = data.subject
                                ? data.subject
                                : "";
                            instance.proxy.editorData = data.summary
                                ? data.summary
                                : "";
                            form.subject = data.subject ? data.subject : "";
                            form.description = data.summary ? data.summary : "";
                            if (data?.personInformation) {
                                form.personType = data?.personInformation
                                    .personType
                                    ? data?.personInformation.personType
                                    : "";
                                form.idType = data?.personInformation
                                    .identificationType
                                    ? data?.personInformation.identificationType
                                    : "";
                                form.idNumber = data?.personInformation.idNumber
                                    ? data?.personInformation.idNumber
                                    : "";
                                form.names = data?.personInformation.name
                                    ? data?.personInformation.name
                                    : "";
                                form.lastNames = data?.personInformation
                                    .lastName
                                    ? data?.personInformation.lastName
                                    : "";
                                form.email = data?.personInformation.email
                                    ? data?.personInformation.email
                                    : "";
                                address_info.value[0] = data?.personInformation
                                    .address
                                    ? data?.personInformation.address
                                    : "";
                                address_info.value[1] = data?.personInformation
                                    .department
                                    ? data?.personInformation.department
                                    : "";
                                address_info.value[2] = data?.personInformation
                                    .city
                                    ? data?.personInformation.city
                                    : "";
                                form.phoneNumber = data?.personInformation
                                    .phoneNumber
                                    ? data?.personInformation.phoneNumber
                                    : "";
                                getAddress();
                                form.companyName = data?.personInformation
                                    .companyName
                                    ? data?.personInformation.companyName
                                    : "";
                            }
                        }
                    }
                );
                return unsubscribe;
            } catch (error) {
                console.error("error: ", error);
            }
        };

        const stopListening = () => {
            if (unsubscribe) {
                clearTimeout(timerExtractingInformationAI.value);
                toast.update(idProccessAI, {
                    render: "Se ha detenido el proceso de extracción de información",
                    type: toast.TYPE.WARNING,
                    isLoading: false,
                    autoClose: 3000,
                });
                loadingAI.value = false;
                isListeningEnabled.value = false;
                canUseAI.value = true;
                unsubscribe = null;
                form.subject = "";
                form.description = "";
            } else {
                console.warn("No hay suscripción activa para desuscribirse.");
            }
        };

        // Select files and drag and drop
        const selectedFile = () => {
            const newFiles = document.getElementById("formFile").files;
            for (let i = 0; i < newFiles.length; i++) {
                files.value.push(newFiles[i]);
                filesToUpload.value.push(newFiles[i]);
            }
        };

        const uploadDocument = async () => {
            canUseAI.value = true;
            for (let i = 0; i < filesToUpload.value.length; i++) {
                const file = filesToUpload.value[i];
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
                    const idLoadFile = toast(
                        `Cargando el archivo ${file.name}...`,
                        {
                            isLoading: true,
                            hideProgressBar: true,
                            closeButton: false,
                            closeOnClick: false,
                        }
                    );
                    await uploadBytes(fileRef, file);
                    toast.update(idLoadFile, {
                        render: `Archivo cargado con éxito ${file.name}`,
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    });
                    uploadedFiles.value.push({
                        companyID: companyID.value,
                        name: file.name,
                        uniqueFileName: uniqueFileName,
                        claimID: documentID.value,
                        year: year.value,
                    });
                    if (!readDocument.value) {
                        readDocument.value = true;
                        documentAI.value = {
                            companyID: companyID.value,
                            name: file.name,
                            uniqueFileName: uniqueFileName,
                            claimID: documentID.value,
                            year: year.value,
                        };
                        startListening();
                    }
                } catch (error) {
                    console.error("Error al subir el archivo:", error);
                }
            }
            filesToUpload.value = [];
        };

        const classDropZone = computed(() => {
            const styles =
                "w-100 d-flex flex-column justify-content-center align-items-center drop-area m-1";
            if (!dropzone.value) return styles + "border-0 text-secondary";
            return styles + " border-primary text-primary";
        });

        const getAddressManual = computed(() => {
            const direction = `${
                manual_address_info.value[0] ? manual_address_info.value[0] : ""
            } ${
                manual_address_info.value[1] ? manual_address_info.value[1] : ""
            }${
                manual_address_info.value[2] ? manual_address_info.value[2] : ""
            } ${
                manual_address_info.value[3]
                    ? "#" + manual_address_info.value[3]
                    : ""
            }${
                manual_address_info.value[4] ? manual_address_info.value[4] : ""
            } ${
                manual_address_info.value[5]
                    ? "- " + manual_address_info.value[5]
                    : ""
            }${
                manual_address_info.value[6] ? manual_address_info.value[6] : ""
            }${
                manual_address_info.value[7]
                    ? ", " + manual_address_info.value[7]
                    : ""
            } ${
                manual_address_info.value[8]
                    ? "- " + manual_address_info.value[8]
                    : ""
            }`;
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            form.address = direction;
            return direction;
        });

        const getAddress = () => {
            const direction = `${
                address_info.value[0] ? address_info.value[0].trim() : ""
            }${
                address_info.value[1] ? ", " + address_info.value[1].trim() : ""
            }${
                address_info.value[2] ? ", " + address_info.value[2].trim() : ""
            }`;
            form.address = direction;
            form.city = address_info.value[3]
                ? address_info.value[3].trim()
                : "";
            return direction;
        };

        const deleteRecord = async (name) => {
            files.value = files.value.filter((file) => name != file.name);

            filesToUpload.value = filesToUpload.value.filter(
                (file) => name != file.name
            );
            await processUploadedFiles(name);
            await changeDocumentAI(uploadedFiles.value[0]?.name);
        };

        const changeDocumentAI = async (name) => {
            uploadedFiles.value.forEach(async (file) => {
                if (file.name == name) {
                    loadingAI.value = true;
                    const res = await updateClaimSummary(
                        companyID.value,
                        documentID.value,
                        file?.uniqueFileName
                    );
                    if (!res) {
                        loadingAI.value = false;
                        form.subject = "";
                        form.description = "";
                        toast.error("Este documento no cuenta con un resumen", {
                            duration: 3000,
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 3000,
                        });
                        return;
                    }
                    documentAI.value = file;
                    isListeningEnabled.value = true;
                    canUseAI.value = true;
                    startListening();
                }
                return;
            });
        };

        const processUploadedFiles = async (name) => {
            const updatedFiles = [];
            for (let i = 0; i < uploadedFiles.value.length; i++) {
                const file = uploadedFiles.value[i];

                if (name === file.name) {
                    if (documentAI.value.name === name) stopListening();
                    const res = await deleteDocumentByName(
                        file.companyID,
                        file.claimID,
                        file.uniqueFileName,
                        file.year
                    );
                    if (res) {
                        toast.success("Archivo eliminado exitosamente!", {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 3000,
                        });
                    } else {
                        toast.error("No se pudo eliminar el archivo!", {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 3000,
                        });
                    }
                } else {
                    updatedFiles.push(file);
                }
            }

            uploadedFiles.value = updatedFiles; // Actualiza uploadedFiles con los archivos no eliminados
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
            dropzone.value = false;
            files.value = [...files.value, ...event.dataTransfer.files];
            filesToUpload.value = [
                ...filesToUpload.value,
                ...event.dataTransfer.files,
            ];
        };

        // obtener listado trds
        async function getTrds() {
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

        // obtener listado de usuarios activos por areas
        async function getPeople() {
            const config = {
                method: "get",
                maxBodyLength: Infinity,
                url: `${process.env.VUE_APP_CF_BASE_URL}/GET_USERS_BY_AREA_ID?areaId=${getAreaId.value}`,
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
                    peopleList.value = auxPeople;
                })
                .catch((error) => {
                    console.error(error);
                });
        }

        //obtener dias segun tipologia documental
        const getDocDays = computed(() => {
            return isDocs.value.filter((el) =>
                el.label == form.documentType ? el : 0
            );
        });

        //obtener uid de persona asignada
        const getAssignedUid = computed(() => {
            return peopleList.value.filter((el) =>
                el.value == form.assignedTo ? el?.uid : ""
            );
        });

        //obtener dias segun tipologia documental
        const getAreaId = computed(() => {
            return trds.value.find((el) => el.value === form.area)?.id;
        });

        const stateDoc = computed(() => store.state.createDocState.stateDoc);

        // computadas para la dependencia de los campos
        // manejador del input de serie

        const showDeadLine = computed(() => {
            if (form.documentType?.toLocaleLowerCase() == "demanda") {
                return true;
            }
            return false;
        });

        // eslint-disable-next-line vue/return-in-computed-property
        const auxSerie = computed(() => {
            const aux = [];
            if (form.area) {
                trds.value.forEach((i) => {
                    if (i.label == form.area) {
                        i.series.forEach((j) => {
                            aux.push({
                                label: j.name,
                                value: j.name,
                                subseries: j.subseries,
                            });
                        });
                    }
                    series.value = aux;
                });
            }
        });

        // manejador del input de subserie
        // eslint-disable-next-line vue/return-in-computed-property
        const auxSubSerie = computed(() => {
            if (form.serie) {
                series.value.forEach((i) => {
                    if (i.label == form.serie) {
                        subseries.value = [];
                        if (i.subseries.length === 0) {
                            subseries.value.push({
                                label: "Esta serie no tiene subseries disponibles",
                                value: "Esta serie no tiene subseries disponibles",
                                documents: [
                                    {
                                        name: "Esta subserie no tiene tipologías disponibles",
                                        days: 0,
                                    },
                                ],
                            });
                            return;
                        }
                        i.subseries.forEach((j) => {
                            subseries.value.push({
                                label: j.name,
                                value: j.name,
                                documents: j.docs,
                            });
                        });
                    }
                });
            }
        });

        // manejador del inpur de tipologia documental
        // eslint-disable-next-line vue/return-in-computed-property
        const auxDocTypes = computed(() => {
            if (form.subSerie) {
                subseries.value.forEach((i) => {
                    if (form.subSerie == i.label) {
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

        async function clearSelectInput() {
            if (form.area) {
                form.serie = "";
                form.subSerie = "";
                form.documentType = "";
                form.assignedTo = "";
            }
            await getPeople();
        }

        // const userInfo = JSON.parse(sessionStorage.getItem("authUserInfo"));

        // onMounted(() => {
        //   const totalName = userInfo.name.split(" ");

        //   form.email = userInfo.email;
        //   form.names = totalName[0];
        //   form.lastNames = totalName[1] + " " + totalName[2];
        // });

        watch(
            () => [...files.value],
            (currentValue) => {
                uploadDocument();
                return currentValue;
            }
        );

        watch(stateDoc, (newValue) => {
            if (newValue.status == "ERROR") {
                toast.update(idProccessAI, {
                    render: "Complete la información de asunto y resumen manualmente. Documento no válido para este proceso.",
                    type: toast.TYPE.WARNING,
                    isLoading: false,
                    autoClose: 7000,
                });
                loadingAI.value = false;
                clearTimeout(timerAI.value);
                timerAI.value = 0;
            }
        });

        watch(form, (newValueForm) => {
            if (newValueForm.area == null) {
                form.serie = "";
                form.subSerie = "";
                form.documentType = "";
                form.assignedTo = "";
            } else if (newValueForm.serie == null) {
                form.subSerie = "";
                form.documentType = "";
                form.assignedTo = "";
            } else if (newValueForm.subSerie == null) {
                form.documentType = "";
                form.assignedTo = "";
            } else if (newValueForm.documentType == null) {
                form.assignedTo = "";
            }

            if (newValueForm.personType === "Jurídica") {
                showcompanyNameForm.value = true;
            } else showcompanyNameForm.value = false;
        });

        function concatAddress() {
            finalAddress.value =
                manual_address_info.value[0] +
                manual_address_info.value[1] +
                manual_address_info.value[2] +
                " #" +
                manual_address_info.value[3] +
                manual_address_info.value[4] +
                " - " +
                manual_address_info.value[5] +
                manual_address_info.value[6] +
                ", " +
                manual_address_info.value[7] +
                ", " +
                manual_address_info.value[8];
        }

        return {
            dropzoneFile,
            files,
            loadingBtnAI,
            documentID,
            companyID,
            getAddress,
            urlSticker,
            urlPage,
            address_info,
            claimData,
            form,
            v$,
            mode,
            radicated,
            saveLoading,
            submitLoading,
            addressOptions,
            changeDocumentAI,
            showcompanyNameForm,
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
            getAssignedUid,
            getDocDays,
            getAreaId,
            manual_address,
            classDropZone,
            showDeadLine,
            moment,
            manual_address_info,
            finalAddress,
            clearSelectInput,
            getTrds,
            deleteRecord,
            onDragOver,
            onDragEnter,
            onDragLeave,
            selectedFile,
            onFileDrop,
            getPeople,
            concatAddress,
            getAddressManual,
            canUseAI,
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
                altFormat: "d/m/Y",
                altInput: true,
                dateFormat: "d/m/Y",
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
                console.error(error);
            }
        },
        async handleSaveChanges() {
            this.canUseAI = false;
            try {
                const url = `${process.env.VUE_APP_CF_BASE_URL}/CLAIM_SAVE_INFORMATION_V1?claimId=${this.documentID}`;
                const config = {
                    headers: {
                        company: this.companyID,
                        "Content-Type": "application/json", // Puedes ajustar el tipo de contenido según sea necesario
                    },
                };

                const body = {
                    subject: this.form.subject,
                    summary: this.form.description,
                    area: this.form.area,
                    areaId: this.getAreaId,
                    serie: this.form.serie,
                    subSerie: this.form.subSerie,
                    days: this.getDocDays[0]?.days ?? null,
                    documentaryTypologyEntry: this.form.documentType,
                    entryDate: this.form.date,
                    endDate: !this.form.untilDate ? null : this.form.untilDate,
                    assignedToUid: this.getAssignedUid[0]?.uid,
                    city: this.form.city ?? "",
                    folios: parseInt(this.form.folios),
                    assignedTo: this.form.assignedTo,
                    observations: this.form.observations,
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
                        companyName: this.form.companyName || "",
                    },
                };
                const response = await axios.post(url, body, config);
                if (response.data.message) {
                    this.saveLoading = false;
                    this.showRadicationButton = true;
                }
            } catch (error) {
                this.saveLoading = false;
                this.showRadicationButton = false;
                console.error(error);
            }
        },

        async handleSubmitDocument() {
            try {
                console.log(this.form.idType);
                this.submitLoading = true;
                this.handleSaveChanges();
                const config = {
                    headers: {
                        company: this.companyID,
                        "Content-Type": "application/json", // Puedes ajustar el tipo de contenido según sea necesario
                    },
                };

                const body = {
                    typeRadicate: this.mode,
                };

                const response = await axios.post(
                    `${process.env.VUE_APP_CF_BASE_URL}/CLAIM_GENERATE_RADICATE_V1?claimId=${this.documentID}`,
                    body,
                    config
                );

                if (response) {
                    this.generateSticker();
                    const textTrackingStart = `Ha iniciado el proceso al siguiente documento ${this.radicate?.idRadicate}, en el transcurso de los días se ira actualizando el estado del documento.`;
                    await setTracking(
                        this.documentID,
                        this.companyID,
                        "Sistema",
                        textTrackingStart,
                        "Iniciado",
                        true
                    );
                    await setTracking(
                        this.documentID,
                        this.companyID,
                        "Sistema",
                        textTrackingStart,
                        "Iniciado",
                        false
                    );
                    await setTracking(
                        this.documentID,
                        this.companyID,
                        this.userInfo.name,
                        [
                            {
                                name: "Asignado",
                                value: this.form.assignedTo,
                            },
                            { name: "Area", value: this.form.area },
                            {
                                name: "Comentarios",
                                value: `Se asigna el radicado a ${this.form.assignedTo}`,
                            },
                        ],
                        "Asignado",
                        true
                    );
                    await setTracking(
                        this.documentID,
                        this.companyID,
                        "Sistema",
                        "Tramite asignado al funcionario.",
                        "Asignado",
                        false
                    );
                    this.submitLoading = false;
                    this.radicate = response.data;
                    this.qrModal = true;
                    this.radicated = true;
                    toast.success("Radicado emitido exitosamente!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                this.submitLoading = false;
                console.error(error);
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
                console.error(error);
            }
        },

        async generateSticker() {
            let data = JSON.stringify({
                company: this.companyID,
                uid: this.documentID,
            });

            let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `${process.env.VUE_APP_CF_BASE_URL}/doc/create-qr`,
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: "arraybuffer",
                data: data,
            };

            axios
                .request(config)
                .then((response) => {
                    const res = response.data;
                    const blob = new Blob([res], { type: "application/pdf" });
                    const url = window.URL.createObjectURL(blob);
                    this.urlSticker = url;
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        closeModal() {
            this.qrModal = false;
        },

        newClaim() {
            location.reload();
        },

        showSticker() {
            window.open(this.urlSticker, "_blank");
        },
    },
    async mounted() {
        setTimeout(() => {
            this.isDisabledAI = false;
        }, 1000);
        this.getTrds();

        const loader = new Loader({
            apiKey: "AIzaSyAELgR27D_WqfANHM3LBXeammM-lCvqhBU",
            version: "weekly",
        });
        const Places = await loader.importLibrary("places");

        //YOU ARE HERE !!!!!!!!!!!!!!

        // the center, defaultbounds are not necessary but are best practices to limit/focus search results
        const center = { lat: 34.082298, lng: -82.284777 };
        // Create a bounding box with sides ~10km away from the center point
        const defaultBounds = {
            north: center.lat + 0.1,
            south: center.lat - 0.1,
            east: center.lng + 0.1,
            west: center.lng - 0.1,
        };

        //this const will be the first arg for the new instance of the Places API

        const input = document.getElementById("place"); //binds to our input element

        //this object will be our second arg for the new instance of the Places API
        const options = {
            bounds: defaultBounds, //optional
            types: ["establishment"], //optioanl
            componentRestrictions: { country: "co" }, //limiter for the places api search
            fields: ["address_components", "geometry", "icon", "name"], //allows the api to accept these inputs and return similar ones
            strictBounds: false, //optional
        };

        // per the Google docs create the new instance of the import above. I named it Places.
        const autocomplete = new Places.Autocomplete(input, options);

        //add the place_changed listener to display results when inputs change
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace(); //this callback is inherent you will see it if you logged autocomplete
            this.form.address =
                place.name +
                ", " +
                place.address_components[1].long_name +
                " #" +
                place.address_components[0].long_name;
            this.form.city = place.address_components[4].long_name;
        });
    },
    computed: {
        user() {
            return this.$store.state.auth.currentUser;
        },
        userInfo() {
            return JSON.parse(this.$store.state.auth.currentUserInfo);
        },
    },

    components: {
        Layout,
        PageHeader,
        Multiselect,
        flatPickr,
        ValidateLabel,
        Modal,
        FileTextIcon,
        // AlertOctagonIcon,
        Trash2Icon,
        CpuIcon,
    },
};
</script>

<template>
    <!-- Modal -->
    <Modal
        v-if="qrModal"
        title=""
        size="medium"
        :hideIconClose="true"
        :no-scroll="true"
        @close="closeModal"
    >
        <template #title>
            <BCol lg="8" class="mx-4">
                <picture
                    class="w-100 row d-flex justify-content-start align-items-center mt-2"
                >
                    <img
                        src="/BAQVERDE.png"
                        alt="BAQVERDE"
                        style="width: 25%"
                        class="col-4"
                    />
                    <img
                        src="@/assets/images/logo-dark.png"
                        alt="RAUDOC"
                        style="width: 35%"
                        class="col-8"
                    />
                </picture>
            </BCol>
        </template>
        <template #content>
            <BRow class="mx-4">
                <BCol
                    class="d-flex flex-column justify-content-center align-items-center gap-3"
                    lg="4"
                    md="12"
                    sm="12"
                >
                    <div>
                        <a-qrcode
                            error-level="H"
                            :size="200"
                            :value="`${urlPage}/r/BAQVERDE/${documentID}`"
                            icon=""
                        /></div
                ></BCol>
                <BCol
                    lg="8"
                    md="12"
                    sm="12"
                    class="ps-4 d-flex align-items-center"
                >
                    <BRow
                        class="w-100 d-flex flex-column justify-content-start align-items-center gap-1 mx-2"
                    >
                        <span
                            ><b>Radicado:</b>
                            <b class="text-success">{{
                                " " + radicate?.idRadicate
                            }}</b></span
                        >
                        <span><b>Fecha Rad:</b> {{ form.date }}</span>
                        <span><b>Destino:</b> {{ form.area }}</span>
                        <span
                            ><b>Rem/Des:</b>
                            {{ form.names + " " + form.lastNames }}</span
                        >
                        <span class="text-truncate inline-block"
                            ><b>Asunto:</b> {{ form.subject }}</span
                        >
                        <span><b>No. Folios:</b> {{ form.folios }}</span>
                    </BRow>
                </BCol>
            </BRow>
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
                <a-radio-group
                    v-model:value="mode"
                    :style="{ marginBottom: '' }"
                >
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
                    v-else-if="!radicated && showRadicationButton"
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
                <BButton
                    v-if="radicated"
                    type="submit"
                    variant="success"
                    class="w-sm me-2"
                    @click="showSticker"
                >
                    <span>Ver Sticker</span>
                </BButton>
                <BButton
                    v-if="radicated"
                    type="submit"
                    variant="info"
                    class="w-sm"
                    @click="newClaim"
                >
                    <span>Nuevo radicado</span>
                </BButton>
            </div>
        </BRow>

        <!-- columns of page data ( document section ) - ( form section ) -->
        <BRow>
            <!-- Document section column -->
            <BCol
                lg="4"
                md="12"
                sm="12"
                @dragover.prevent="onDragOver"
                @dragenter.prevent="onDragEnter"
                @dragleave.prevent="onDragLeave"
                @drop="onFileDrop"
            >
                <!-- {{ claimData }} -->
                <BCard no-body>
                    <BCardHeader>
                        <h5
                            class="card-title mb-0 text-muted fw-light fst-italic"
                        >
                            AGREGA ARCHIVO PARA RADICAR
                        </h5>
                    </BCardHeader>
                    <BCardBody v-if="!answered">
                        <div>
                            <div :class="classDropZone">
                                <p>
                                    <FileTextIcon size="28" />
                                </p>
                                <span> Arrastra el archivo para subirlo</span>
                                <input
                                    type="file"
                                    name="formFile"
                                    id="formFile"
                                    multiple
                                    class="input-file"
                                    @change="selectedFile"
                                    :disabled="radicated"
                                />
                                <label
                                    for="formFile"
                                    class="link-primary label-formFile"
                                    >o Clic acá para selecciona un
                                    archivo</label
                                >
                            </div>
                            <div
                                class="vstack gap-2 mt-2"
                                v-if="files.length > 0"
                            >
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
                                        <div class="flex-shrink-0 ms-3 gap-1">
                                            <a-tooltip>
                                                <template #title
                                                    >Aplicar resumen</template
                                                >
                                                <BButton
                                                    variant="info"
                                                    size="sm"
                                                    class="me-1"
                                                    data-dz-remove=""
                                                    @click="
                                                        changeDocumentAI(
                                                            file.name
                                                        )
                                                    "
                                                >
                                                    <CpuIcon />
                                                </BButton>
                                            </a-tooltip>
                                            <a-tooltip>
                                                <template #title
                                                    >Borrar documento</template
                                                >
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
                                            </a-tooltip>
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
                <BCard no-body>
                    <BCardBody class="h-100">
                        <div class="mb-3">
                            <label
                                class="form-label fw-bold"
                                for="project-title-input"
                                >Asuntos</label
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
                                :disabled="loadingAI || radicated"
                            />
                            <ValidateLabel
                                v-bind="{ v$ }"
                                attribute="subject"
                            />
                        </div>

                        <BCard no-body> </BCard>

                        <div class="mb-3">
                            <label class="form-label fw-bold"
                                >Resumen de radicado</label
                            >
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
                                :disabled="loadingAI || radicated"
                                style="min-height: 255px"
                            ></textarea>
                            <ValidateLabel
                                v-bind="{ v$ }"
                                attribute="description"
                            />
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Form section column -->
            <BCol lg="8" md="12" sm="12">
                <BCard no-body>
                    <BCardHeader>
                        <h5
                            class="card-title mb-0 text-muted fw-light fst-italic"
                        >
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
                                    @select="clearSelectInput"
                                    :disabled="radicated"
                                />

                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="area"
                                />
                            </BCol>
                            <BCol lg="3">
                                <label
                                    for="datepicker-deadline-input"
                                    class="form-label fw-bold"
                                    >Fecha</label
                                >
                                <input
                                    v-model="form.date"
                                    :config="rangeDateconfig"
                                    class="form-control"
                                    style="cursor: no-drop !important"
                                    disabled
                                />
                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="date"
                                    style="cursor: no-drop !important"
                                />
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
                                    :disabled="radicated"
                                    :close-on-select="true"
                                    :searchable="true"
                                    :create-option="true"
                                    placeholder="Seleccione"
                                    :options="[
                                        {
                                            value: 'Página web',
                                            label: 'Página web',
                                        },
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
                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="inputMethod"
                                />
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
                                    :disabled="radicated"
                                />
                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="serie"
                                />
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
                                    :disabled="radicated"
                                />
                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="subSerie"
                                />
                            </BCol>
                            <BCol lg="3" class="mb-3">
                                <label
                                    for="choices-privacy-status-input"
                                    class="form-label fw-bold col-11 text-truncate"
                                    >Tipología Documental</label
                                >
                                <Multiselect
                                    v-model="form.documentType"
                                    :required="true"
                                    :close-on-select="true"
                                    :searchable="true"
                                    :create-option="true"
                                    placeholder="Seleccione"
                                    :options="isDocs"
                                    :disabled="radicated"
                                />
                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="documentType"
                                />
                            </BCol>
                            <BCol lg="3" v-if="showDeadLine">
                                <label
                                    for="datepicker-deadline-input"
                                    class="form-label fw-bold"
                                    >Fecha límite</label
                                >
                                <flat-pickr
                                    v-model="form.untilDate"
                                    :config="rangeDateconfig"
                                    class="form-control flatpickr-input"
                                    :disabled="radicated"
                                ></flat-pickr>
                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="untilDate"
                                />
                            </BCol>
                            <BCol lg="3" class="mb-3">
                                <label for="username" class="form-label fw-bold"
                                    >Folios
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.folios"
                                    :class="{
                                        'is-invalid':
                                            submitted &&
                                            v$.user.username.$error,
                                    }"
                                    id="folios"
                                    placeholder="Ingrese folios"
                                    :disabled="radicated"
                                />

                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="folios"
                                />
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
                                        'is-invalid':
                                            submitted &&
                                            v$.user.username.$error,
                                    }"
                                    id="RadicadoExterno"
                                    placeholder="# Radicado externo"
                                    :disabled="radicated"
                                />
                            </BCol>
                            <BCol lg="6" class="mb-3">
                                <label
                                    for="username"
                                    class="form-label fw-bold"
                                >
                                    Asignado a
                                    <span class="text-danger">*</span></label
                                >
                                <Multiselect
                                    v-model="form.assignedTo"
                                    :required="true"
                                    :close-on-select="true"
                                    :create-option="true"
                                    :searchable="true"
                                    placeholder="Seleccione"
                                    :options="peopleList"
                                    :disabled="radicated"
                                />
                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="assignedTo"
                                />
                            </BCol>
                        </BRow>
                    </BCardBody>
                </BCard>
                <BCard no-body>
                    <BCardHeader
                        class="d-flex justify-content-start align-items-center"
                    >
                        <h5
                            class="card-title mb-0 text-muted fw-light fst-italic"
                        >
                            INFORMACIÓN DEL PETICIONARIO
                        </h5>
                        <BSpinner
                            v-if="loadingAI"
                            class="float-end ms-3"
                            small
                            v-b-tooltip.hover.top
                            title="Extrayendo información de peticionario con IA"
                            type="grow"
                        />
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
                                    :disabled="radicated || loadingAI"
                                    :options="[
                                        { value: 'Natural', label: 'Natural' },
                                        {
                                            value: 'Jurídica',
                                            label: 'Jurídica',
                                        },
                                    ]"
                                />
                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="personType"
                                />
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
                                    :disabled="radicated || loadingAI"
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
                                        {
                                            value: 'NIT',
                                            label: 'NIT',
                                        },
                                    ]"
                                />
                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="idType"
                                />
                            </BCol>
                            <BCol lg="3" class="mb-3">
                                <label for="username" class="form-label fw-bold"
                                    >Nº de documento
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.idNumber"
                                    id="username"
                                    :disabled="radicated || loadingAI"
                                    placeholder="Ingrese numero de documento"
                                />

                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="idNumber"
                                />
                            </BCol>
                            <BCol lg="3" class="mb-3">
                                <label
                                    for="phoneNumber"
                                    class="form-label fw-bold"
                                    >Tel. de contacto
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.contactPhone"
                                    :disabled="radicated || loadingAI"
                                    placeholder="Ingrese telefono de contacto"
                                    autocomplete="tel"
                                />
                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="contactPhone"
                                />
                            </BCol>
                            <BCol
                                lg="6"
                                class="mb-3"
                                v-if="showcompanyNameForm"
                            >
                                <label
                                    for="companyName"
                                    class="form-label fw-bold"
                                    >Nombre de la compañía
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.companyName"
                                    :disabled="radicated || loadingAI"
                                    placeholder="Ingrese el nombre de la compañía"
                                />
                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="companyName"
                                />
                            </BCol>
                            <BCol
                                :lg="showcompanyNameForm ? '6' : '3'"
                                class="mb-3"
                            >
                                <label for="username" class="form-label fw-bold"
                                    >Nombres
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.names"
                                    id="username"
                                    :disabled="radicated || loadingAI"
                                    placeholder="Ingrese nombres"
                                    autocomplete="name"
                                />

                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="names"
                                />
                            </BCol>
                            <BCol
                                :lg="showcompanyNameForm ? '6' : '3'"
                                class="mb-3"
                            >
                                <label
                                    for="lastNames"
                                    class="form-label fw-bold"
                                    >Apellidos
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.lastNames"
                                    :disabled="radicated || loadingAI"
                                    placeholder="Ingrese apellidos"
                                    autocomplete="family-name"
                                />

                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="lastNames"
                                />
                            </BCol>
                            <BCol lg="6" class="mb-3">
                                <label for="email" class="form-label fw-bold"
                                    >Correo electrónico
                                    <span class="text-danger fw-bold"
                                        >*</span
                                    ></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="form.email"
                                    id="email"
                                    :disabled="radicated || loadingAI"
                                    placeholder="Ingrese email"
                                    autocomplete="email"
                                />

                                <ValidateLabel
                                    v-bind="{ v$ }"
                                    attribute="email"
                                />
                            </BCol>
                            <BCol lg="12" class="mb-3">
                                <div class="label-checkbox">
                                    <label
                                        for="address"
                                        class="form-label fw-bold"
                                        >Dirección
                                        <span class="text-danger fw-bold"
                                            >*</span
                                        ></label
                                    >
                                    <div class="fs-15">
                                        <label
                                            for=""
                                            class="px-2 fw-bold text-muted"
                                            >Agregar dirección manual</label
                                        >
                                        <input
                                            v-model="manual_address"
                                            class="form-check-input"
                                            type="checkbox"
                                            :disabled="radicated || loadingAI"
                                        />
                                    </div>
                                </div>
                                <div
                                    class="col-sm-12 col-md-2"
                                    style="width: 100%"
                                >
                                    <ValidateLabel
                                        v-bind="{ v$ }"
                                        attribute="address"
                                        style="width: 100%"
                                    />
                                </div>

                                <div v-if="!manual_address">
                                    <BRow>
                                        <BCol lg="6" class="mb-3">
                                            <input
                                                v-model="address_info[0]"
                                                id="place"
                                                class="form-control"
                                                type="text"
                                                :disabled="
                                                    radicated || loadingAI
                                                "
                                                placeholder="Ingrese la dirección"
                                                @input="getAddress()"
                                            />
                                        </BCol>
                                        <BCol lg="3" class="mb-3">
                                            <input
                                                v-model="address_info[1]"
                                                id="place"
                                                class="form-control"
                                                type="text"
                                                :disabled="
                                                    radicated || loadingAI
                                                "
                                                placeholder="Ingrese el departamento"
                                                autocomplete="address-level1"
                                                @input="getAddress()"
                                            />
                                        </BCol>
                                        <BCol lg="3" class="mb-3">
                                            <input
                                                v-model="address_info[2]"
                                                id="place"
                                                class="form-control"
                                                type="text"
                                                :disabled="
                                                    radicated || loadingAI
                                                "
                                                placeholder="Ingrese la ciudad"
                                                autocomplete="address-level2"
                                                @input="getAddress()"
                                            />
                                        </BCol>
                                    </BRow>
                                </div>

                                <div
                                    v-else
                                    class="row row-cols-1 row-cols-md-6 gx-1 gy-3 py-2"
                                >
                                    <div class="col-sm-12 col-md-3">
                                        <Multiselect
                                            v-model="manual_address_info[0]"
                                            :close-on-select="true"
                                            :searchable="true"
                                            :disabled="radicated || loadingAI"
                                            placeholder="Seleccione"
                                            :options="addressOptions"
                                            @input="concatAddress()"
                                        />
                                    </div>
                                    <div class="col">
                                        <input
                                            v-model="manual_address_info[1]"
                                            class="form-control"
                                            type="text"
                                            :disabled="radicated || loadingAI"
                                            placeholder="Número"
                                            @input="concatAddress()"
                                        />
                                    </div>
                                    <div class="col">
                                        <input
                                            v-model="manual_address_info[2]"
                                            class="form-control"
                                            type="text"
                                            :disabled="radicated || loadingAI"
                                            placeholder="Letra"
                                            @input="concatAddress()"
                                        />
                                    </div>
                                    <div
                                        class="col"
                                        style="
                                            width: 30px !important;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            height: 40px;
                                        "
                                    >
                                        <span> # </span>
                                    </div>

                                    <div class="col">
                                        <input
                                            v-model="manual_address_info[3]"
                                            class="form-control"
                                            type="text"
                                            :disabled="radicated || loadingAI"
                                            placeholder="Número"
                                            @input="concatAddress()"
                                        />
                                    </div>
                                    <div class="col">
                                        <input
                                            v-model="manual_address_info[4]"
                                            class="form-control"
                                            type="text"
                                            :disabled="radicated || loadingAI"
                                            placeholder="Letra"
                                            @input="concatAddress()"
                                        />
                                    </div>
                                    <div
                                        class="col"
                                        style="
                                            width: 30px !important;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            height: 40px;
                                        "
                                    >
                                        <span> - </span>
                                    </div>
                                    <div class="col">
                                        <input
                                            v-model="manual_address_info[5]"
                                            class="form-control"
                                            :disabled="radicated || loadingAI"
                                            type="text"
                                            placeholder="Número"
                                            @input="concatAddress()"
                                        />
                                    </div>
                                    <div class="col-sm-12 col-md-2">
                                        <input
                                            v-model="manual_address_info[6]"
                                            class="form-control"
                                            :disabled="radicated || loadingAI"
                                            type="text"
                                            placeholder="Complemento"
                                            @input="concatAddress()"
                                        />
                                    </div>
                                    <div class="col-sm-12 col-md-3">
                                        <input
                                            v-model="manual_address_info[7]"
                                            class="form-control"
                                            :disabled="radicated || loadingAI"
                                            type="text"
                                            placeholder="Ciudad"
                                            @input="concatAddress()"
                                            autocomplete="address-level2"
                                        />
                                    </div>
                                    <div class="col-sm-12 col-md-3">
                                        <input
                                            v-model="manual_address_info[8]"
                                            class="form-control"
                                            type="text"
                                            :disabled="radicated || loadingAI"
                                            placeholder="Departamento"
                                            @input="concatAddress()"
                                            autocomplete="address-level1"
                                        />
                                    </div>
                                </div>
                            </BCol>
                            <BCol lg="12" class="mb-3 fs-15">
                                <span
                                    v-if="manual_address"
                                    :class="{
                                        'is-invalid':
                                            submitted &&
                                            v$.user.username.$error,
                                        'preview-manual-address':
                                            manual_address_info[0],
                                    }"
                                    >{{ getAddressManual }}</span
                                >
                            </BCol>
                        </BRow>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

<style lang="scss" scoped>
.preview-manual-address {
    font-size: 0.8rem;
    background: light-dark(
        rgb(232, 240, 254),
        rgba(70, 90, 126, 0.4)
    ) !important;
    padding: 0.5rem;
    border-radius: 0.5rem;
}
.manual-address-inputs-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 25px;
}

.label-checkbox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

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

@media (width: 414px) {
    .manual-address-inputs-box {
        flex-direction: column;
    }
}

.multiselect.is-disabled,
.form-control:disabled {
    background-color: #e9ebec !important;
    cursor: not-allowed !important;
}
</style>
