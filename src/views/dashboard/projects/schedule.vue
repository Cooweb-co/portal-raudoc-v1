<script>
import flatPickr from "vue-flatpickr-component";
import axios from "axios";
import { defineComponent, onMounted, ref } from "vue";
import moment from "moment";
import { useRouter } from "vue-router";
import setState from "../../../helpers/setState";

export default defineComponent({
    name: "",
    setup() {
        const router = useRouter();

        const user = ref(JSON.parse(sessionStorage.getItem("authUserInfo")));
        const claims = ref([]);
        const originalClaims = ref([]);
        const date = ref(null);

        async function getRecords() {
            try {
                const recordsConfig = {
                    headers: {
                        company: "BAQVERDE",
                        "Content-Type": "application/json", // Puedes ajustar el tipo de contenido según sea necesario
                    },
                };

                const records = await axios.post(
                    `https://us-central1-raudoc-gestion-agil.cloudfunctions.net/GET_LATEST_CLAIM_BY_ROLE_USER?uid=${user.value?.uid}`,
                    {},
                    recordsConfig
                );
                for (let i = 0; i < records.data.claims?.length; i++) {
                    records.data.claims[i].expirationDate = moment(
                        records.data.claims[i].expirationDate._seconds * 1000
                    ).format("DD/MM/YYYY");
                }
                claims.value = records.data.claims;
                originalClaims.value = records.data.claims;
            } catch (error) {
                claims.value = [];
                originalClaims.value = [];
                console.log(error);
                return error;
            }
        }

        function goToClaims(claim) {
            router.replace(`/gestion-documental/radicado/${claim?.claimId}`);
        }

        onMounted(() => {
            getRecords();
        });

        const onChangeDate = () => {
            if (date.value !== null) {
                claims.value = originalClaims.value;
                claims.value = claims.value.filter(
                    (claim) => claim.expirationDate == date.value
                );
            }
        };

        const clearFilter = () => {
            date.value = null;
            claims.value = originalClaims.value;
        };

        return {
            date,
            config: {
                inline: true,
                dateFormat: "d/m/Y",
            },
            claims,
            getRecords,
            moment,
            goToClaims,
            onChangeDate,
            clearFilter,
            setState
        };
    },
    components: {
        flatPickr,
    },
});
</script>

<template>
    <BCard no-body class="mt-2 card-config">
        <BCardHeader class="border-0">
            <BCardTitle class="mb-0">Calendario de pendientes</BCardTitle>
        </BCardHeader>
        <BCardBody class="pt-0">
            <div class="upcoming-scheduled">
                <flat-pickr
                    v-model="date"
                    :config="config"
                    @on-change="onChangeDate"
                ></flat-pickr>
            </div>

            <div class="d-flex justify-content-between align-items-center">
                <h6 class="text-uppercase fw-semibold mt-4 mb-3 text-muted">
                    PRÓXIMAS A VENCER:
                </h6>
                <b-button variant="danger" size="sm" @click="clearFilter"
                    >Limpiar filtro</b-button
                >
            </div>
            <div class="in-term-list" v-if="claims.length > 0">
                <div
                    v-for="(item, idx) in claims"
                    :key="idx"
                    class="mini-stats-wid d-flex align-items-center mt-3 item-list"
                    @click="goToClaims(item)"
                >
                    <div class="flex-shrink-0 avatar-sm">
                        <span
                            class="mini-stat-icon avatar-title rounded-circle text-primary bg-primary-subtle fs-4"
                        >
                            {{ idx + 1 }}
                        </span>
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <h6 class="mb-1">{{ item?.subject ?? " - " }}</h6>
                        <div
                            style="
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                gap: 10px;
                            "
                        >
                            <p class="text-muted mb-0">
                                {{ item?.documentaryTypologyEntry ?? " - " }}
                            </p>
                        </div>
                    </div>
                    <div class="flex-shrink-0">
                        <p class="text-muted mb-0">
                            {{ item?.expirationDate }}
                        </p>
                    </div>
                </div>
              </div>
              <span class="text-muted w-100 text-center d-block" v-else>No se encontraron peticiones</span>

            <div class="mt-3 text-center">
                <BLink
                    href="/gestion-documental/lista-radicados"
                    class="text-muted text-decoration-underline"
                    >Ver todos los pendientes</BLink
                >
            </div>
        </BCardBody>
    </BCard>
</template>

<style lang="scss" scoped>
.card-config {
    max-height: 667px !important;
}

.in-term-list {
    max-height: 240px;
    overflow-y: auto;
}

.item-list {
    cursor: pointer;
}
</style>
