<script setup>
import OverviewSummaryElement from "./OverviewSummaryElement.vue";
import { computed, defineProps, ref, onMounted } from "vue";
import Multiselect from "@vueform/multiselect";
import ValidateLabel from "@/utils/ValidateLabel.vue";
import { MESSAGE_REQUIRED } from "../../../../constants/rules.ts";
import setVariantStateInfo from "@/helpers/setVariantStateInfo.js";
import { useVuelidate } from "@vuelidate/core";
import Swal from "sweetalert2";
// import setVariantPriorityInfo from "@/helpers/setVariantPriorityInfo.js";
import axios from 'axios'

const props = defineProps({
    data: Object,
    files: Array,
    loading: Boolean,
    numberClaim: String,
});

const setVariantState = computed(() => {
    return setVariantStateInfo(props.data.status);
});

const transferedModal = ref(false)

const form = ref({
    notes: '',
    area: '',
    destiny: '',
    comments: ''
})

const trds = ref([])
const peopleList = ref([])
const isLoading = ref(false)

const rules = {
    area: { required: MESSAGE_REQUIRED },
    comments: {},
    destiny: { required: MESSAGE_REQUIRED },
    notes: {}
};

const v$ = useVuelidate(rules, form);

// obtener listado trds
async function getTrds() {

    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/TDRS_LIST_V1`,
        headers: {
            company: "BAQVERDE",
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

// Obtener el id del area seleccionada
const getAreaId = computed(() => {
    console.log(form.value);
    return trds.value.find((el) => el.value === form.value.area)?.id;
});

const showTransferedModal = () => {
    transferedModal.value = true
}

const sendDestiny = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
        return;
    }

    try {
        isLoading.value = true
        const body = {
            ...form,
            company: "BAQVERDE",
            claimId: props.data.id
        }
        await axios.post('https://us-central1-raudoc-gestion-agil-dev.cloudfunctions.net/us-central1/claim/assign-radicate', body)

        Swal.fire({
            position: "top-right",
            icon: "success",
            title: "Transferencia realizada exitosamente!",
            showConfirmButton: false,
            timer: 2000,
        });


    } catch (error) {
        console.log(error);
    } finally {
        transferedModal.value = false
        isLoading.value = false
    }
}

async function clearSelectInput() {

    if (form.value.area) {
        form.value.destiny = "";
    }

    console.log(props.data.id);

    await getPeople();
}

onMounted(async () => {
    getTrds(),
        console.log();
})

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
                                <li v-for="item in data.legalBasis" :key="item" class="text-muted">
                                    {{ item }}
                                </li>
                            </ol>
                            <p v-else class="text-muted">No se encontraron fundamentos legales</p>
                            <h6 class="fw-semibold text-uppercase mb-3">
                                Información adicional:
                            </h6>
                            <ul v-if="data?.additionalInformation?.length > 0">
                                <li v-for="information in data.additionalInformation" :key="information"
                                    class="text-muted">
                                    {{ information }}
                                </li>
                            </ul>
                            <p v-else class="text-muted mb-3">No hay información adicional</p>

                            <h6 class="fw-semibold text-uppercase mb-3">
                                Información de contacto
                            </h6>
                            <ul>
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
                                            <p class="mb-2 text-uppercase fw-medium">
                                                Fecha de Creación:
                                            </p>
                                            <h5 class="fs-15 mb-0">
                                                {{ data.entryDate }}
                                            </h5>
                                        </div>
                                    </BCol>
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p class="mb-2 text-uppercase fw-medium">
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
                                            <p class="mb-2 text-uppercase fw-medium">
                                                Estatus :
                                            </p>
                                            <BBadge tag="div" :variant="setVariantState">{{ data.status }}</BBadge>
                                        </div>
                                    </BCol>
                                </BRow>
                            </div>

                            <div class="pt-3 border-top border-top-dashed mt-4">
                                <h6 class="mb-3 fw-semibold text-uppercase">
                                    Adjuntos
                                </h6>
                                <BRow class="g-3" v-show="files">
                                    <OverviewSummaryElement v-for="file in files" :key="file.name" :id="data.id"
                                        :file="file" />
                                </BRow>
                                <h6 class="mb-3 fw-semibold text-uppercase" v-show="!files">
                                    No se adjuntaron archivos
                                </h6>
                            </div>
                        </div>
                    </BCardBody>
                </BCard>

            </BCol>

            <BCol xl="3" lg="4">
                <a-skeleton v-if="loading" :paragraph="{ rows: 6 }" active />
                <BCard no-body v-else>
                    <BCardHeader
                        style="display: flex; align-items: center; justify-content: space-between; flex-direction: row">
                        <div>
                            <h5 class="card-title mb-0">Detalle de Radicación</h5>
                        </div>
                        <div>
                            <BButton variant="success" class="w-sm" @click="showTransferedModal">
                                <div class="button-content">
                                    <span class="iconify" data-icon="feather:file-plus"></span>
                                    <span>Transferir</span>
                                </div>
                            </BButton>
                        </div>
                    </BCardHeader>
                    <BCardBody>
                        <div class="table-responsive table-card">
                            <table class="table table-borderless align-middle mb-0">
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
                                        <td class="fw-medium">Asignado a:</td>
                                        <td>
                                            <!-- <div class="avatar-group">
                                                <BLink
                                                    href="javascript:void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="Erica Kernan"
                                                >
                                                    <img
                                                        src="@/assets/images/users/avatar-4.jpg"
                                                        alt=""
                                                        class="rounded-circle avatar-xs"
                                                    />
                                                </BLink>
                                                <BLink
                                                    href="javascript:void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="Alexis Clarke"
                                                >
                                                    <img
                                                        src="@/assets/images/users/avatar-10.jpg"
                                                        alt=""
                                                        class="rounded-circle avatar-xs"
                                                    />
                                                </BLink>
                                                <BLink
                                                    href="javascript:void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="James Price"
                                                >
                                                    <img
                                                        src="@/assets/images/users/avatar-3.jpg"
                                                        alt=""
                                                        class="rounded-circle avatar-xs"
                                                    />
                                                </BLink>
                                                <BLink
                                                    href="javascript: void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="Add Members"
                                                >
                                                    <div class="avatar-xs">
                                                        <div
                                                            class="avatar-title fs-16 rounded-circle bg-light border-dashed border text-primary"
                                                        >
                                                            +
                                                        </div>
                                                    </div>
                                                </BLink>
                                            </div> -->
                                            {{ data.assignedTo }}
                                        </td>
                                    </tr>

                                    <!-- <tr>
                                        <td class="fw-medium">Prioridad</td>
                                        <td>
                                            <BBadge
                                                :variant="
                                                    data?.priority?.toLowerCase() ==
                                                    'alta'
                                                        ? 'danger'
                                                        : data?.priority?.toLowerCase() ==
                                                              'media' ||
                                                          data?.priority?.toLowerCase() ==
                                                              'no definido'
                                                        ? 'warning'
                                                        : 'info'
                                                "
                                                >{{ data.priority }}</BBadge
                                            >
                                        </td>
                                    </tr> -->
                                    <tr>
                                        <td class="fw-medium">
                                            Fecha de Creación
                                        </td>
                                        <td>{{ data.entryDate }}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-medium">Fecha limite</td>
                                        <td>{{ data.expirationDate }}</td>
                                    </tr>
                                    <!-- <tr>
                                        <td class="fw-medium">
                                            Última actualización
                                        </td>
                                        <td>hace 14 min</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-medium">Etiqueta</td>
                                        <td class="hstack text-wrap gap-1">
                                            <BBadge
                                                variant="secondary-subtle"
                                                class="bg-secondary-subtle text-secondary"
                                                >Quema</BBadge
                                            >
                                            <BBadge
                                                variant="secondary-subtle"
                                                class="bg-secondary-subtle text-secondary"
                                                >Denuencia</BBadge
                                            >
                                            <BBadge
                                                variant="secondary-subtle"
                                                class="bg-secondary-subtle text-secondary"
                                                >Comparendo</BBadge
                                            >
                                        </td>
                                    </tr> -->
                                </tbody>
                            </table>
                        </div>
                    </BCardBody>
                </BCard>
                <a-skeleton v-if="loading" :paragraph="{ rows: 3 }" active />
                <BCard no-body v-else>
                    <BCardHeader class="align-items-center d-flex border-bottom-dashed">
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
    <BModal v-model="transferedModal" size="lg" id="showModal" title-class="exampleModalLabel" hide-header hide-footer
        class="v-modal-custom" centered no-close-on-backdrop>

        <div class="header-modal">
            <i class="ri-close-line close-icon" @click="() => transferedModal = false" style="font-size: 23px;"></i>
        </div>

        <div class="body-modal px-2">
            <div class="notes">
                <label><strong>Anotaciones</strong></label>
                <p class="text-muted">Registre las acciones tomadas durante su gestión </p>
                <textarea class="form-control" v-model="v$.notes.$model"
                    style="min-height: 120px; width: 100%;"></textarea>
            </div>
            <BRow class="p-0" style="width: 100%;">
                <BCol lg="6" class="mb-3 pl-0">
                    <label for="choices-privacy-status-input" class="form-label fw-bold">Área</label>
                    <Multiselect v-model="v$.area.$model" :required="true" :close-on-select="true" :searchable="true"
                        :create-option="true" placeholder="Seleccione" :options="trds" @select="clearSelectInput" />

                    <ValidateLabel v-bind="{ v$ }" attribute="area" />
                </BCol>
                <BCol lg="6" class="mb-3 pr-0">
                    <label for="choices-privacy-status-input" class="form-label fw-bold">Seleccione el
                        destinario</label>
                    <Multiselect v-model="v$.destiny.$model" :required="true" :close-on-select="true" :searchable="true"
                        :create-option="true" placeholder="Seleccione" :options="peopleList" />

                    <ValidateLabel v-bind="{ v$ }" attribute="destiny" />
                </BCol>
            </BRow>
            <div class="comments">
                <label> <strong>Comentarios de transferencia</strong> </label>
                <p class="text-muted">Escriba una nota con las indicaciones o comentarios que desea hacer al destinario
                    de la transferencia </p>
                <textarea class="form-control" v-model="v$.comments.$model" style="min-height: 120px"></textarea>
            </div>
        </div>
        <div class="footer-modal p-2 mt-5">
            <button type="button" class="btn btn-secondary" @click="() => transferedModal = false">Cerrar</button>
            <button v-if="isLoading" class="btn btn-primary" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Entregando...
            </button>
            <button v-else type="button" class="btn btn-primary" @click="sendDestiny">Entregar</button>
        </div>
    </BModal>
</template>

<style scoped>
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
