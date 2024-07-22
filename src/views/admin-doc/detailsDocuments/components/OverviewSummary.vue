<script setup>
import { computed, defineProps, ref, onMounted } from "vue";
import OverviewSummaryElement from "./OverviewSummaryElement.vue";
import { MESSAGE_REQUIRED } from "../../../../constants/rules.ts";
import setVariantStateInfo from "@/helpers/setVariantStateInfo.js";
import { useVuelidate } from "@vuelidate/core";
import { setTracking } from "@/helpers/tracking";
import { useRouter } from "vue-router";
import ValidateLabel from "@/utils/ValidateLabel.vue";
import Multiselect from "@vueform/multiselect";
import InputFile from "@/components/InputFile.vue";
import { toast } from "vue3-toastify";
import { state } from "@/state/modules/auth";
import axios from "axios";
// import setVariantPriorityInfo from "@/helpers/setVariantPriorityInfo.js";

const router = useRouter();

const user = JSON.parse(state.currentUserInfo);
const props = defineProps({
    data: Object,
    filesEntry: Array,
    loading: Boolean,
    numberClaim: String,
    showPrivateClaim: Boolean,
});

const setVariantState = computed(() => {
    return setVariantStateInfo(props.data.status);
});

const transferedModal = ref(false);
const company = ref("BAQVERDE");
const files = ref([]);

const form = ref({
    // notes: '',
    area: "",
    destiny: "",
    comments: "",
});

const trds = ref([]);
const peopleList = ref([]);
const isLoading = ref(false);

const rules = {
    area: { required: MESSAGE_REQUIRED },
    comments: {},
    destiny: { required: MESSAGE_REQUIRED },
    // notes: {}
};

const v$ = useVuelidate(rules, form);

// obtener listado trds
async function getTrds() {
    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/TDRS_LIST_V1`,
        headers: {
            company: company.value,
        },
    };

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

const emitFiles = (inputFiles) => {
    files.value = [];
    inputFiles.forEach((file) => {
        files.value.push(file);
    });
};

const canTransfer = computed(() => {
    if (
        props.data?.numberOutClaim ||
        props.data?.status == "Respondido"
    )
        return false;
    return true;
});

// obtener listado de usuarios activos por areas
async function getPeople() {
    const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/GET_USERS_BY_AREA_ID?areaId=${getAreaId.value}`,
        headers: {
            company: company.value,
        },
    };
    var auxPeople = [];
    axios
        .request(config)
        .then((response) => {
            response.data.forEach((element) => {
                auxPeople.push({
                    label: element.name,
                    value: element.uid,
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

function fiiterPeopleForId(uid) {
    return peopleList.value.filter((elemento) => elemento.uid === uid);
}

// Obtener el id del area seleccionada
const getAreaId = computed(() => {
    return trds.value.find((el) => el.value === form.value.area)?.id;
});

const showTransferedModal = () => {
    transferedModal.value = true;
};

const sendDestiny = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
        return;
    }
    const newNameFiles = [];
    try {
        isLoading.value = true;
        const body = {
            ...form.value,
            notes: form.value.comments,
            destiny: form.value.destiny,
            company: company.value,
            claimId: props.data.id,
        };
        await axios.post(
            `${process.env.VUE_APP_CF_BASE_URL}/claim/assign-radicate`,
            body
        );
        if (files.value.length > 0) {
            const formFileData = new FormData();
            files.value.forEach((file) => {
                formFileData.append("file", file);
            });
            const configFiles = {
                method: "post",
                maxBodyLength: Infinity,
                url: `${process.env.VUE_APP_CF_BASE_URL}/claim/radicate-transfer`,
                headers: {
                    company: company.value,
                    "Content-Type": "multipart/form-data",
                },
                params: {
                    claimId: props?.data?.id,
                },
                data: formFileData,
            };
            const resFiles = await axios.request(configFiles);
            const filesTracking = resFiles.data.newNamesFile;
            await filesTracking.forEach(async (file) => {
                newNameFiles.push({
                    name: file.newFilename,
                });
            });
        }
        await setTracking(
            props.data?.id,
            company.value,
            user.name,
            [
                { name: "Area antigua", value: props.data?.area },
                {
                    name: "Asignado a",
                    value: fiiterPeopleForId(form.value.destiny)[0]?.label,
                },
                { name: "Nueva area", value: form.value.area },
                { name: "Comentarios", value: form.value.comments },
                {
                    name: "Archivos",
                    value: newNameFiles,
                },
            ],
            "Transferido",
            true
        );
        toast("Transferencia realizada exitosamente!", {
            type: "success",
            autoClose: 3000,
            closeButton: true,
            closeOnClick: true,
        });

        setTimeout(() => router.push({ name: "list-claim" }), 4000);
    } catch (error) {
        console.error(error);
    } finally {
        transferedModal.value = false;
        isLoading.value = false;
    }
};

async function clearSelectInput() {
    if (form.value.area) {
        form.value.destiny = "";
    }

    await getPeople();
}

onMounted(async () => {
    getTrds(), console.log();
});
</script>

<template>
    <BTab title="Resumen" active class="fw-semibold pt-2">
        <BRow>
            <BCol xl="9" lg="8">
                <a-skeleton v-if="loading" :paragraph="{ rows: 5 }" active />
                <BCard no-body v-else>
                    <BCardBody>
                        <div class="text-muted">
                            <h6 class="fw-semibold text-uppercase mb-3">
                                Resumen
                            </h6>
                            <p class="text-muted">{{ data.summary }}</p>
                            <h6 class="fw-semibold text-uppercase mb-3">
                                Fundamentos legales:
                            </h6>
                            <ol v-if="data?.legalBasis?.length > 0">
                                <li
                                    v-for="item in data.legalBasis"
                                    :key="item"
                                    class="text-muted"
                                >
                                    {{ item }}
                                </li>
                            </ol>
                            <p v-else class="text-muted">
                                No se encontraron fundamentos legales
                            </p>
                            <h6 class="fw-semibold text-uppercase mb-3">
                                Información adicional:
                            </h6>
                            <ul v-if="data?.additionalInformation?.length > 0">
                                <li
                                    v-for="information in data.additionalInformation"
                                    :key="information"
                                    class="text-muted"
                                >
                                    {{ information }}
                                </li>
                            </ul>
                            <p v-else class="text-muted mb-3">
                                No hay información adicional
                            </p>

                            <h6 class="fw-semibold text-uppercase mb-3">
                                Información de contacto
                            </h6>
                            <ul>
                                <li v-if="data.personType === 'Jurídica'">
                                    <strong>Nombre de la empresa:</strong>
                                    {{ data.companyName }}
                                </li>
                                <li>
                                    <strong>Nombre del denunciante:</strong>
                                    {{ data.fullName }}
                                </li>
                                <li>
                                    <strong>Dirección:</strong>
                                    {{ data.address }}
                                </li>
                                <li>
                                    <strong>Teléfono:</strong>
                                    {{ data.phoneNumber }}
                                </li>
                                <li>
                                    <strong>Correo electrónico:</strong>
                                    {{ data.email }}
                                </li>
                            </ul>

                            <div class="pt-3 border-top border-top-dashed mt-4">
                                <BRow gy-3>
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                Fecha de Creación:
                                            </p>
                                            <h5 class="fs-15 mb-0">
                                                {{ data.entryDate }}
                                            </h5>
                                        </div>
                                    </BCol>
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                Fecha limite:
                                            </p>
                                            <h5 class="fs-15 mb-0">
                                                {{ data.expirationDate }}
                                            </h5>
                                        </div>
                                    </BCol>
                                    <!-- <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                Prioridad :
                                            </p>
                                            <BBadge
                                                tag="div"
                                                :variant="setVariantPriority"
                                                >{{ data.priority }}</BBadge
                                            >
                                        </div>
                                    </BCol> -->
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                Estatus :
                                            </p>
                                            <BBadge
                                                tag="div"
                                                :variant="setVariantState"
                                                >{{ data.status }}</BBadge
                                            >
                                        </div>
                                    </BCol>
                                </BRow>
                            </div>

                            <div class="pt-3 border-top border-top-dashed mt-4">
                                <h6 class="mb-3 fw-semibold text-uppercase">
                                    Adjuntos
                                </h6>
                                <BRow class="g-3" v-show="filesEntry">
                                    <OverviewSummaryElement
                                        v-for="file in filesEntry"
                                        :key="file.name"
                                        :id="data.id"
                                        :file="file"
                                    />
                                </BRow>
                                <h6
                                    class="mb-3 fw-semibold text-uppercase"
                                    v-show="!filesEntry"
                                >
                                    No se adjuntaron archivos
                                </h6>
                            </div>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>

            <BCol xl="3" lg="4">
                <div v-if="showPrivateClaim">
                    <a-skeleton
                        v-if="loading"
                        :paragraph="{ rows: 6 }"
                        active
                    />
                    <BCard no-body v-else>
                        <BCardHeader
                            style="
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                flex-direction: row;
                            "
                        >
                            <div>
                                <h5 class="card-title mb-0">
                                    Detalle de Radicación
                                </h5>
                            </div>
                            <div v-if="canTransfer">
                                <BButton
                                    variant="success"
                                    class="w-sm"
                                    @click="showTransferedModal"
                                >
                                    <div class="button-content">
                                        <span
                                            class="iconify"
                                            data-icon="feather:file-plus"
                                        ></span>
                                        <span>Transferir</span>
                                    </div>
                                </BButton>
                            </div>
                        </BCardHeader>
                        <BCardBody>
                            <div class="table-responsive table-card">
                                <table
                                    class="table table-borderless align-middle mb-0"
                                >
                                    <tbody>
                                        <tr>
                                            <td class="fw-medium">
                                                Número de Radicación
                                            </td>
                                            <td>{{ numberClaim }}</td>
                                        </tr>
                                        <tr>
                                            <td class="fw-medium">Area</td>
                                            <td>{{ data.area }}</td>
                                        </tr>
                                        <tr>
                                            <td class="fw-medium">
                                                Método de entrada
                                            </td>
                                            <td>{{ data.inputMethod }}</td>
                                        </tr>
                                        <tr>
                                            <td class="fw-medium">Serie</td>
                                            <td>{{ data.serie }}</td>
                                        </tr>
                                        <tr>
                                            <td class="fw-medium">Subserie</td>
                                            <td>{{ data.subSerie }}</td>
                                        </tr>
                                        <tr>
                                            <td class="fw-medium">
                                                Radicado Externo
                                            </td>
                                            <td>{{ data.externalRadicate }}</td>
                                        </tr>
                                        <tr>
                                            <td class="fw-medium">
                                                Asignado a:
                                            </td>
                                            <td>
                                                {{ data.assignedTo }}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="fw-medium">
                                                Fecha de Creación
                                            </td>
                                            <td>{{ data.entryDate }}</td>
                                        </tr>
                                        <tr>
                                            <td class="fw-medium">
                                                Fecha limite
                                            </td>
                                            <td>{{ data.expirationDate }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </BCardBody>
                    </BCard>
                </div>
                <a-skeleton v-if="loading" :paragraph="{ rows: 3 }" active />
                <BCard no-body v-else>
                    <BCardHeader
                        class="align-items-center d-flex border-bottom-dashed"
                    >
                        <BCardTitle class="mb-0 flex-grow-1">
                            <h5>Detalles del destinatario</h5>
                        </BCardTitle>
                    </BCardHeader>

                    <BCardBody>
                        <table class="table table-borderless align-middle mb-0">
                            <tbody>
                                <tr>
                                    <td class="fw-medium">
                                        Tipo de Peticionario
                                    </td>
                                    <td>{{ data.personType }}</td>
                                </tr>
                                <tr>
                                    <td class="fw-medium">
                                        Tipo de Identificación
                                    </td>
                                    <td>{{ data.identificationType }}</td>
                                </tr>
                                <tr>
                                    <td class="fw-medium">
                                        Número de Identificación
                                    </td>
                                    <td>{{ data.identificationNumber }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </BTab>

    <!-- Modal -->
    <BModal
        v-model="transferedModal"
        size="lg"
        id="showModal"
        title-class="exampleModalLabel"
        hide-header
        hide-footer
        class="v-modal-custom"
        centered
        no-close-on-backdrop
    >
        <div class="header-modal">
            <i
                class="ri-close-line close-icon"
                @click="() => (transferedModal = false)"
                style="font-size: 23px"
            ></i>
        </div>

        <div class="body-modal px-2">
            <BRow class="p-0" style="width: 100%">
                <BCol lg="6" class="mb-3 pl-0">
                    <label
                        for="choices-privacy-status-input"
                        class="form-label fw-bold"
                        >Área</label
                    >
                    <Multiselect
                        v-model="v$.area.$model"
                        :required="true"
                        :close-on-select="true"
                        :searchable="true"
                        :create-option="true"
                        placeholder="Seleccione"
                        :options="trds"
                        @select="clearSelectInput"
                    />

                    <ValidateLabel v-bind="{ v$ }" attribute="area" />
                </BCol>
                <BCol lg="6" class="mb-3 pr-0">
                    <label
                        for="choices-privacy-status-input"
                        class="form-label fw-bold"
                        >Seleccione el destinatario</label
                    >
                    <Multiselect
                        v-model="v$.destiny.$model"
                        :required="true"
                        :close-on-select="true"
                        :searchable="true"
                        :create-option="true"
                        placeholder="Seleccione"
                        :options="peopleList"
                    />

                    <ValidateLabel v-bind="{ v$ }" attribute="destiny" />
                </BCol>
            </BRow>
            <div class="comments">
                <label> <strong>Comentarios de transferencia</strong> </label>
                <p class="text-muted">
                    Escriba las acciones realizadas durante su gestión y/o
                    aquellos comentarios que desea realizar al destinatario de
                    la transferencia
                </p>
                <textarea
                    class="form-control"
                    v-model="v$.comments.$model"
                    style="min-height: 120px"
                ></textarea>
                <InputFile @emitFiles="emitFiles" title="AGREGA ARCHIVO PARA TRANSFERIR AL USUARIO (OPCIONAL)" />
            </div>
        </div>
        <div class="footer-modal p-2 mt-5">
            <button
                type="button"
                class="btn btn-secondary"
                @click="() => (transferedModal = false)"
            >
                Cerrar
            </button>
            <button
                v-if="isLoading"
                class="btn btn-primary"
                type="button"
                disabled
            >
                <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                ></span>
                Entregando...
            </button>
            <button
                v-else
                type="button"
                class="btn btn-primary"
                @click="sendDestiny"
            >
                Entregar
            </button>
        </div>
    </BModal>
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

.close-icon:hover {
    cursor: pointer;
}

.header-modal {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row;
    width: 100%;
}

.body-modal {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    width: 100%;
    gap: 25px;
}

.notes {
    width: 100%;
}

.comments {
    width: 100%;
}

.footer-modal {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
}
</style>
