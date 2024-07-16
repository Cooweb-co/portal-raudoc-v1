<script setup>
import {
    getDocument,
    getDocumentFilesUploads,
} from "@/services/docservice/doc.service";
import { ref, onMounted, computed, defineProps } from "vue";
import OverviewDocuments from "./OverviewDocuments.vue";
import OverviewResponse from "./OverviewResponse.vue";
import OverviewTracking from "./OverviewTracking.vue";
import OverviewSummary from "./OverviewSummary.vue";
import { useRoute } from "vue-router";

import { transformDate } from "@/helpers/transformDate";
import filterFilesClaim from "@/helpers/filterFilesClaim";
import setVariantStateInfo from "@/helpers/setVariantStateInfo";
// import setVariantPriorityInfo from "@/helpers/setVariantPriorityInfo";
import setState from "@/helpers/setState";

const data = ref({});
const id = ref("");
const company = ref("");
const filesFiltered = ref([]);
const entryDate = ref("");
const expirationDate = ref("");
const numberClaim = ref("");
const loading = ref(false);
const router = useRoute();

const props = defineProps({
    showPrivateClaim: {
        type: Boolean,
        required: true,
    },
});

const setVariantState = computed(() => {
    return setVariantStateInfo(data.value.status);
});

const claimData = computed(() => {
    return Object.entries(data.value).reduce((acc, [key, value]) => {
        acc[key] = value || "No definido";
        return acc;
    }, {});
});

const isClaimOut = () => {
    return numberClaim.value.startsWith("BV-") ? true : false;
};

onMounted(async () => {
    try {
        id.value = router.params.documentID;
        company.value = router.params.company || "BAQVERDE";

        loading.value = true;
        const docData = await getDocument(company.value, id.value);
        if (!docData) return;

        if (docData.createdAt?.seconds) {
            entryDate.value = transformDate(docData.createdAt.seconds); // Formatear fecha
        }

        if (docData.expirationDate?.seconds) {
            expirationDate.value = transformDate(
                docData.expirationDate.seconds
            );
        }

        const { firstNames, lastNames, companyName, personType, identificationNumber, identificationType, email, phoneNumber, address } = docData?.petitionerInformation || {};

        data.value = {
            ...docData,
            entryDate: entryDate.value,
            expirationDate: expirationDate.value,
            summary: docData.summary?.replace("<p>", "").replace("</p>", ""),
            status: setState(docData?.status),
            additionalInformation: docData?.additionalInformation || [],
            legalBasis: docData?.legalBasis || [],
            fullName: `${firstNames} ${lastNames}`,
            companyName,
            personType,
            identificationNumber,
            identificationType,
            email,
            phoneNumber,
            address,
        };

        numberClaim.value =
            data.value.numberEntryClaim ||
            data.value.numberOutClaim ||
            "No definido";
        const files = await getDocumentFilesUploads("BAQVERDE", id.value);
        if (files.length > 0) {
            filesFiltered.value = await filterFilesClaim(files, ["out", "trans"]);
        } else {
            filesFiltered.value = [];
        }
    } catch (error) {
        console.error("Error viste de documentos: ", error);
    } finally {
        loading.value = false;
    }
});
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
                                                    {{ numberClaim }}
                                                    -
                                                    {{ claimData.subject }}
                                                </h4>
                                                <div
                                                    class="hstack gap-3 flex-wrap"
                                                >
                                                    <div>
                                                        <i
                                                            class="ri-building-line align-bottom me-1"
                                                        ></i>
                                                        {{ claimData.area }}
                                                    </div>
                                                    <div class="vr"></div>
                                                    <div>
                                                        Fecha de creación :
                                                        <span
                                                            class="fw-medium"
                                                            >{{
                                                                claimData.entryDate
                                                            }}</span
                                                        >
                                                    </div>
                                                    <div class="vr"></div>
                                                    <div>
                                                        Fecha limite :
                                                        <span
                                                            class="fw-medium"
                                                            >{{
                                                                claimData.expirationDate
                                                            }}</span
                                                        >
                                                    </div>
                                                    <div class="vr"></div>
                                                    <BBadge
                                                        pill
                                                        :variant="
                                                            setVariantState
                                                        "
                                                        >{{
                                                            claimData.status
                                                        }}</BBadge
                                                    >
                                                </div>
                                            </div>
                                        </BCol>
                                    </BRow>
                                </BCol>
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
                        :data="claimData"
                        :filesEntry="filesFiltered['entry']"
                        :numberClaim="numberClaim"
                        :loading="loading"
                        :showPrivateClaim="showPrivateClaim"
                    />

                    <BTab
                        title="Documentos"
                        class="fw-semibold pt-2"
                        v-if="isClaimOut()"
                    >
                        <OverviewDocuments
                            :data="claimData"
                            :files="filesFiltered['entry']"
                            :loading="loading"
                            :title="'Documentos de salida'"
                        />
                    </BTab>
                    <BTab title="Documentos" class="fw-semibold pt-2" v-else>
                        <OverviewDocuments
                            :data="claimData"
                            :files="filesFiltered['entry']"
                            :loading="loading"
                            :title="'Documentos de entrada'"
                        />
                        <OverviewDocuments
                            :data="claimData"
                            :files="filesFiltered['out']"
                            :loading="loading"
                            :title="'Documentos de salida'"
                        />
                        <OverviewDocuments
                            :data="claimData"
                            :files="filesFiltered['trans']"
                            :loading="loading"
                            :title="'Documentos de transferencia'"
                        />
                    </BTab>
                    <OverviewResponse
                        :loading="loading"
                        :data="claimData"
                        v-if="
                            !numberClaim.startsWith('BV-') &&
                            props.showPrivateClaim
                        "
                    />
                    <OverviewTracking
                        :data="claimData"
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
