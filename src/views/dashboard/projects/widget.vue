<script setup>
import {
    SendIcon,
    AwardIcon,
    ClockIcon,
    CornerDownRightIcon,
} from "@zhuowenli/vue-feather-icons";
import { ref, onMounted } from "vue";
import { state } from "@/state/modules/auth";
import { getInfoUser } from "@/services/docservice/doc.service";
import axios from "axios";

const user = ref(state.currentUser);
const loading = ref(false);

console.log(user.value);
const projectsWidgets = ref();

onMounted(async () => {
    try {
        loading.value = true;
        const resInfoUser = await getInfoUser("BAQVERDE", user.value.email);
        const url =
            "https://us-central1-raudoc-gestion-agil.cloudfunctions.net/GET_COUNT_CLAIMS_BY_USER";
        const config = {
            params: {
                uid: resInfoUser.uid,
            },
            headers: {
                company: "BAQVERDE",
                "Content-Type": "application/json",
            },
        };
        const body = {
            role: resInfoUser.rol,
            areaId: resInfoUser.areaId,
        };
        const dataForCard = await axios.post(url, body, config);
        projectsWidgets.value = dataForCard.data;
        loading.value = false;
    } catch (error) {
        console.error(error);
    }
});
</script>

<template>
    <a-skeleton v-if="loading" :paragraph="{ rows: 5 }" active />
    <BCol xl="4" v-for="(item, index) of projectsWidgets" :key="index" v-else>
        <BCard no-body class="card-animate">
            <BCardBody>
                <div class="d-flex align-items-center">
                    <div class="avatar-sm flex-shrink-0">
                        <span
                            class="avatar-title rounded-2 fs-2"
                            :class="{
                                'bg-primary-subtle text-primary':
                                    item.value.toUpperCase() === 'primary' ||
                                    'DOCUMENTOS PROCESADOS',
                                'bg-warning-subtle text-warning':
                                    item.value.toUpperCase() ===
                                    'PETICIONES POR RESPONDER',
                                'bg-info-subtle text-info':
                                    item.value.toUpperCase() === 'info',
                            }"
                        >
                            <template
                                v-if="
                                    item.value.toUpperCase() ==
                                    'PETICIONES RESPONDIDAS'
                                "
                            >
                                <SendIcon
                                    size="24"
                                    class="text-primary"
                                ></SendIcon>
                            </template>

                            <template
                                v-if="
                                    item.value.toUpperCase() ==
                                    'PETICIONES RECIBIDAS'
                                "
                            >
                                <CornerDownRightIcon
                                    size="24"
                                    class="text-primary"
                                ></CornerDownRightIcon>
                            </template>

                            <template
                                v-if="
                                    item.value.toUpperCase() ==
                                    'PETICIONES POR RESPONDER'
                                "
                            >
                                <ClockIcon
                                    size="24"
                                    class="text-primary"
                                ></ClockIcon>
                            </template>

                            <template
                                v-if="
                                    item.value.toUpperCase() ==
                                    'DOCUMENTOS PROCESADOS'
                                "
                            >
                                <AwardIcon
                                    size="24"
                                    class="text-primary"
                                ></AwardIcon>
                            </template>
                        </span>
                    </div>
                    <div class="flex-grow-1 overflow-hidden ms-3">
                        <p
                            class="text-uppercase fw-medium text-muted text-truncate mb-3"
                        >
                            {{ item.value }}
                        </p>
                        <div class="d-flex align-items-center mb-3">
                            <h4 class="fs-4 flex-grow-1 mb-0">
                                <span class="counter-value">{{
                                    item.count
                                }}</span>
                            </h4>
                        </div>
                    </div>
                </div>
                <!-- <div class="d-flex align-items-center">
          <div class="avatar-sm flex-shrink-0">
            <span class="avatar-title rounded-2 fs-2" :class="{
              'bg-primary-subtle text-primary': item.feaIconClass === 'primary',
            }">
              <template v-if="item.feaIcon == 'briefcase'">
                <BriefcaseIcon size="24" class="text-primary"></BriefcaseIcon>
              </template>

              <template v-if="item.feaIcon == 'award'">
                <AwardIcon size="24" ></AwardIcon>
              </template>

              <template v-if="item.feaIcon == 'clock'">
                <ClockIcon size="24" ></ClockIcon>
              </template>
            </span>
          </div>
          <div class="flex-grow-1 overflow-hidden ms-3">
            <p class="text-uppercase fw-medium text-muted text-truncate mb-3">
              {{ item.label }}
            </p>
            <div class="d-flex align-items-center mb-3">
              <h4 class="fs-4 flex-grow-1 mb-0">
                <span class="counter-value">{{
                  item.counter
                }}</span>
              </h4>
              <span :class="{ 'badge bg-danger-subtle text-danger fs-12': item.icon == 'ri-arrow-down-s-line', 'badge bg-success-subtle text-success fs-12': item.icon == 'ri-arrow-up-s-line' }"><i :class="`${item.icon} fs-13 align-middle me-1`"></i>{{ item.percentage }}</span>
            </div>
            <p class="text-muted text-truncate mb-0">{{ item.caption }}</p>
          </div>
        </div> -->
            </BCardBody>
        </BCard>
    </BCol>
</template>
