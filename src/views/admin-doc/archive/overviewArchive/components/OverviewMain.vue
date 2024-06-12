<script setup>
import {
    getDocument,
    getDocumentFilesUploads,
    getArchivesFilesUploads,
    getProcessedFolderDocument,
} from "@/services/docservice/doc.service";
import { ref, onMounted, defineProps } from "vue";
import { useRoute } from "vue-router";
import OverviewSummary from "./OverviewSummary.vue";
import OverviewDocuments from "./OverviewDocuments.vue";
import OverviewTracking from "./OverviewTracking.vue";

import { transformDate } from "@/helpers/transformDate";
// import setVariantPriorityInfo from "@/helpers/setVariantPriorityInfo";
import setState from "@/helpers/setState";

const data = ref({});
const dataArchive = ref({});
const id = ref("");
const company = ref("");
const filesEntry = ref([]);
const filesArchive = ref([]);
const filesOut = ref([]);
const entryDate = ref("");
const expirationDate = ref("");
const numberClaim = ref("");
const loading = ref(false);
const router = useRoute();

const expedienteId = router.params.archiveID;

const props = defineProps({
    showPrivateClaim: {
        type: Boolean,
        required: true,
    },
});

console.log(props);

onMounted(async () => {
    try {
        id.value = router.params.documentID;
        company.value = router.params.company || "BAQVERDE";

        loading.value = true;
        const docData = await getDocument(company.value, id.value);
        if (docData?.createdAt && docData?.createdAt.seconds) {
            const formattedDate = transformDate(docData?.createdAt.seconds); // Formatear fecha
            entryDate.value = formattedDate; // Guardar la fecha formateada
        }

        if (docData?.expirationDate && docData?.expirationDate.seconds) {
            const formattedDate = transformDate(
                docData?.expirationDate.seconds
            ); // Formatear fecha
            expirationDate.value = formattedDate; // Guardar la fecha formateada
        }
        data.value = {
            id: id.value,
            numberEntryClaim: docData?.numberEntryClaim,
            area: docData?.area || "No definido",
            documentaryTypologyEntry:
                docData?.documentaryTypologyEntry || "No definido",
            subject: docData?.subject || "No definido",
            entryDate: entryDate.value || "No definido",
            status: setState(docData?.status) || "No definido",
            expirationDate: expirationDate.value || "No definido",
            priority: docData?.priority || "No definido",
            serie: docData?.serie || "No definido",
            subSerie: docData?.subSerie || "No definido",
            externalRadicate: docData?.externalRadicate || "No definido",
            numberOutClaim: docData?.numberOutClaim,
            assignedTo: docData?.assignedTo || "No definido",
            folios: docData?.folios || "No definido",
            observations: docData?.observations || "No definido",
            inputMethod: docData?.inputMethod || "No definido",
            summary:
                docData?.summary?.replace("<p>", "").replace("</p>", "") ||
                "No definido",
            personType:
                docData?.petitionerInformation?.personType || "No definido",
            identificationNumber:
                docData?.petitionerInformation?.identificationNumber ||
                "No definido",
            identificationType:
                docData?.petitionerInformation?.identificationType ||
                "No definido",
            fullName:
                docData?.petitionerInformation?.firstNames +
                    " " +
                    docData?.petitionerInformation?.lastNames || "No definido",
            email: docData?.petitionerInformation?.email || "No definido",
            phoneNumber:
                docData?.petitionerInformation?.phoneNumber || "No definido",
            address: docData?.petitionerInformation?.address || "No definido",
            additionalInformation: docData?.additionalInformation || [],
            legalBasis: docData?.legalBasis || [],
            rawEntryDate: docData?.createdAt,
        };
        numberClaim.value =
            data.value.numberEntryClaim ||
            data.value.numberOutClaim ||
            "No definido";
        await getDocumentFilesUploads("BAQVERDE", id.value).then((data) => {
            if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    const file = data[i];
                    if (file?.name?.includes("-out"))
                        filesOut.value = [...filesOut.value, file];
                    else filesEntry.value = [...filesEntry.value, file];
                }
            } else {
                filesOut.value = [];
                filesEntry.value = [];
            }
        });
    } catch (error) {
        console.error("Error viste de documentos: ", error);
    } finally {
        loading.value = false;
    }
});

onMounted(async () => {
    loading.value = true;
    try {
        const docData = await getProcessedFolderDocument(expedienteId);
        dataArchive.value = docData;
        const files = await getArchivesFilesUploads(expedienteId);
        filesArchive.value = files;
        loading.value = false;
    } catch (error) {
        console.error("Error al obtener el documento:", error);
        loading.value = false;
    }
});

const isClaimOut = () => {
    return numberClaim.value.startsWith("BV-") ? true : false;
};

// const setVariantPriority = computed(() => {
//     return setVariantPriorityInfo(data.value.status);
// });

// const toggleFavourite = (ele) => {
//             ele.target.closest(".favourite-btn").classList.toggle("active");
// }
</script>

<template>
    <div>
        <BRow>
            <BCol lg="12">
                <BCard no-body class="mt-n4 mx-n4 border-0">
                    <div class="bg-primary-subtle">
                        <BCardBody class="pb-0 px-4">
                            <BRow class="mb-3">
                                <BCol md>
                                    <BRow class="align-items-center g-3">
                                        <BCol md>
                                            <a-skeleton
                                                v-if="loading"
                                                :paragraph="{ rows: 1 }"
                                                active
                                            />

                                            <div v-else>
                                                <h4 class="fw-bold">
                                                    Expediente-demo-{{
                                                        expedienteId
                                                    }}
                                                </h4>
                                                <div
                                                    class="hstack gap-3 flex-wrap"
                                                >
                                                    <div>
                                                        <i
                                                            class="ri-building-line align-bottom me-1"
                                                        ></i>
                                                        Comercial
                                                    </div>
                                                    <div class="vr"></div>
                                                    <div>
                                                        Fecha de creación :
                                                        <span class="fw-medium"
                                                            >12/06/2024</span
                                                        >
                                                    </div>
                                                    <div class="vr"></div>
                                                    <div class="vr"></div>
                                                    <BBadge
                                                        pill
                                                        variant="primary"
                                                        >Nuevo</BBadge
                                                    >
                                                </div>
                                            </div>
                                        </BCol>
                                    </BRow>
                                </BCol>
                                <BCol md="auto"> </BCol>
                            </BRow>
                        </BCardBody>
                    </div>
                </BCard>
            </BCol>
        </BRow>

        <BRow>
            <BCol lg="12">
                <BTabs
                    variant="link"
                    nav-class="nav-tabs-custom border-bottom-0"
                >
                    <!-- Resumen -->
                    <OverviewSummary
                        :data="dataArchive"
                        :files="filesArchive"
                        :expedienteId="expedienteId"
                        :loading="loading"
                    />

                    <BTab
                        title="Documentos"
                        class="fw-semibold pt-2"
                        v-if="isClaimOut()"
                    >
                        <OverviewDocuments
                            :data="data"
                            :files="filesEntry"
                            :loading="loading"
                            :title="'Documentos de salida'"
                        />
                    </BTab>
                    <BTab title="Documentos" class="fw-semibold pt-2" v-else>
                        <OverviewDocuments
                            :data="data"
                            :files="filesArchive"
                            :loading="loading"
                            :title="'Archivos del expediente'"
                        />
                    </BTab>
                    <OverviewTracking
                        :data="data"
                        :loading="loading"
                        :numberClaim="numberClaim"
                        :showPrivateClaim="showPrivateClaim"
                    />
                </BTabs>
            </BCol>
        </BRow>
    </div>
</template>

<style scoped>
.spinner-container {
    width: auto;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 58%;
    transform: translate(-58%, -50%);
}
</style>
