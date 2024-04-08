<script setup>
import {
    getDocument,
    getDocumentFilesUploads,
} from "@/services/docservice/doc.service";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import OverviewSummary from "./OverviewSummary.vue";
import OverviewDocuments from "./OverviewDocuments.vue";
import OverviewResponse from "./OverviewResponse.vue";

import transformDate from "@/helpers/transformDate";
import setVariantStateInfo from "@/helpers/setVariantStateInfo";
// import setVariantPriorityInfo from "@/helpers/setVariantPriorityInfo";
import setState from "@/helpers/setState";

const data = ref({});
const id = ref("");
const company = ref("");
const filesEntry = ref([]);
const filesOut = ref([]);
const entryDate = ref("");
const expirationDate = ref("");
const numberClaim = ref("");
const loading = ref(false);
const numberOutClaimExist = ref(false);
const router = useRoute();

onMounted(async () => {
    try {
        id.value = router.params.documentID;
        company.value = router.params.company || "BAQVERDE";

        loading.value = true;
        const docData = await getDocument(company.value, id.value);
        console.log(docData);
        console.log(docData.expirationDate);
        if (docData?.createdAt && docData?.createdAt.seconds) {
            const formattedDate = transformDate(docData?.createdAt.seconds); // Formatear fecha
            entryDate.value = formattedDate; // Guardar la fecha formateada
        }

        if (docData?.expirationDate && docData?.expirationDate.seconds) {
            const formattedDate = transformDate(docData?.expirationDate.seconds); // Formatear fecha
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
        };
        numberOutClaimExist.value =
            data.value.numberOutClaim == "No definido" ? false : true;
        numberClaim.value =
            data.value.numberEntryClaim ||
            data.value.numberOutClaim ||
            "No definido";
        await getDocumentFilesUploads("BAQVERDE", id.value).then((data) => {
            if (Array.isArray(data)) {
                filesOut.value = data.filter(
                    (element) => element.typeRadicate == "OUT"
                );
                filesEntry.value = data.filter(
                    (element) => element.typeRadicate != "OUT"
                );
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

const setVariantState = computed(() => {
    return setVariantStateInfo(data.value.status);
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
                                        <!-- <BCol md="auto">
                                            <div class="avatar-md">
                                                <div class="avatar-title bg-white rounded-circle">
                                                    <img src="@/assets/images/brands/slack.png" alt="" class="avatar-xs">
                                                </div>
                                            </div>
                                        </BCol> -->
                                        <BCol md>
                                            <a-skeleton v-if="loading" :paragraph="{ rows: 1 }" active />

                                            <div v-else>
                                                <h4 class="fw-bold">
                                                    {{ numberClaim }}
                                                    -
                                                    {{ data.subject }}
                                                </h4>
                                                <div class="hstack gap-3 flex-wrap">
                                                    <div>
                                                        <i class="ri-building-line align-bottom me-1"></i>
                                                        {{ data.area }}
                                                    </div>
                                                    <div class="vr"></div>
                                                    <div>
                                                        Fecha de creación :
                                                        <span class="fw-medium">{{
                                                data.entryDate
                                            }}</span>
                                                    </div>
                                                    <div class="vr"></div>
                                                    <div>
                                                        Fecha limite :
                                                        <span class="fw-medium">{{
                                                    data.expirationDate
                                                }}</span>
                                                    </div>
                                                    <div class="vr"></div>
                                                    <BBadge pill :variant="setVariantState
                                                ">{{
                                                data.status
                                            }}</BBadge>
                                                    <!-- <BBadge
                                                        pill
                                                        :variant="setVariantPriority"
                                                        >{{
                                                            data.priority
                                                        }}</BBadge
                                                    > -->
                                                </div>
                                            </div>
                                        </BCol>
                                    </BRow>
                                </BCol>
                                <BCol md="auto">
                                    <!-- <div class="hstack gap-1 flex-wrap">
                                        <button
                                            type="button"
                                            class="btn py-0 fs-16 favourite-btn active"
                                        >
                                            <i
                                                class="ri-star-fill"
                                                @click="toggleFavourite"
                                            ></i>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn py-0 fs-16 text-body"
                                        >
                                            <i class="ri-share-line"></i>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn py-0 fs-16 text-body"
                                        >
                                            <i class="ri-flag-line"></i>
                                        </button>
                                    </div> -->
                                </BCol>
                            </BRow>
                        </BCardBody>
                    </div>
                </BCard>
            </BCol>
        </BRow>

        <BRow>
            <BCol lg="12">
                <BTabs variant="link" nav-class="nav-tabs-custom border-bottom-0">
                    <!-- Resumen -->
                    <OverviewSummary :data="data" :files="filesEntry" :numberClaim="numberClaim" :loading="loading" />

                    <BTab title="Documentos" class="fw-semibold pt-2" v-if="isClaimOut()">
                        <OverviewDocuments :data="data" :files="filesEntry" :loading="loading"
                            :title="'Documentos de salida'" :typeOfPerson="'Nombre del Empleado'" />
                    </BTab>
                    <BTab title="Documentos" class="fw-semibold pt-2" v-else>
                        <OverviewDocuments :data="data" :files="filesEntry" :loading="loading"
                            :title="'Documentos de entrada'" :typeOfPerson="'Nombre del cliente'" />
                        <OverviewDocuments :data="data" :files="filesOut" :loading="loading"
                            :title="'Documentos de salida'" :typeOfPerson="'Nombre del Empleado'" />

                    </BTab>
                    <OverviewResponse :loading="loading" :numberOutClaimExist="numberOutClaimExist.value" :data="data"
                        v-if="!numberClaim.startsWith('BV-')" />
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
