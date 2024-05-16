<script setup>
import {
  SendIcon,
  AwardIcon,
  ClockIcon,
  CornerDownRightIcon,
} from "@zhuowenli/vue-feather-icons";
import { ref, onMounted } from "vue";
import { state } from "@/state/modules/auth";
import axios from "axios";

const user = ref(JSON.parse(state.currentUserInfo));
const loading = ref(false);

const projectsWidgets = ref();

onMounted(async () => {
    try {
        loading.value = true;
        const url =
            `${process.env.VUE_APP_CF_BASE_URL}/GET_COUNT_CLAIMS_BY_USER`;
        const config = {
            params: {
                uid: user.value.uid,
            },
            headers: {
                company: "BAQVERDE",
                "Content-Type": "application/json",
            },
        };
       
        const dataForCard = await axios.post(url, {}, config);
        if (dataForCard.data.length > 0) {
            loading.value = false;
            projectsWidgets.value = dataForCard.data;
        } else {
            loading.value = false;
            projectsWidgets.value = [
                {
                    value: "Peticiones Recibidas",
                    count: 0,
                },
                {
                    value: "Peticiones Respondidas",
                    count: 0,
                },
                {
                    value: "Peticiones por responder",
                    count: 0,
                },
                {
                    value: "Documentos Procesados",
                    count: 0,
                },
            ];
        }
    } catch (error) {
        console.error(error);
        loading.value = false;
        projectsWidgets.value = [
            {
                value: "Peticiones Recibidas",
                count: 0,
            },
            {
                value: "Peticiones Respondidas",
                count: 0,
            },
            {
                value: "Peticiones por responder",
                count: 0,
            },
            {
                value: "Documentos Procesados",
                count: 0,
            },
        ];
    }
});
</script>

<template>
  <pre>{{ props }}</pre>
  <BRow v-if="loading">
    <BCol no-body class="card-animate">
      <a-skeleton :paragraph="{ rows: 2 }" active avatar />
    </BCol>
    <BCol no-body class="card-animate">
      <a-skeleton :paragraph="{ rows: 2 }" active avatar />
    </BCol>
    <BCol no-body class="card-animate">
      <a-skeleton :paragraph="{ rows: 2 }" active avatar />
    </BCol>
    <BCol no-body class="card-animate">
      <a-skeleton :paragraph="{ rows: 2 }" active avatar />
    </BCol>
  </BRow>

  <div id="container">
    <BCard v-for="(item, index) of projectsWidgets" :key="index" id="element" class="w-25 h-75">
      <BCardBody class="p-1">
        <div class="d-flex align-items-center">
          <div class="avatar-sm flex-shrink-0">
            <span
              class="avatar-title rounded-2 fs-2"
              :class="{
                'bg-primary-subtle text-primary':
                  item.value.toUpperCase() === 'primary' ||
                  'DOCUMENTOS PROCESADOS',
                'bg-warning-subtle text-warning':
                  item.value.toUpperCase() === 'PETICIONES POR RESPONDER',
                'bg-info-subtle text-info': item.value.toUpperCase() === 'info',
              }"
            >
              <template
                v-if="item.value.toUpperCase() == 'PETICIONES RESPONDIDAS'"
              >
                <SendIcon size="24" class="text-primary"></SendIcon>
              </template>

              <template
                v-if="item.value.toUpperCase() == 'PETICIONES RECIBIDAS'"
              >
                <CornerDownRightIcon
                  size="24"
                  class="text-primary"
                ></CornerDownRightIcon>
              </template>

              <template
                v-if="item.value.toUpperCase() == 'PETICIONES POR RESPONDER'"
              >
                <ClockIcon size="24" class="text-primary"></ClockIcon>
              </template>

              <template
                v-if="item.value.toUpperCase() == 'DOCUMENTOS PROCESADOS'"
              >
                <AwardIcon size="24" class="text-primary"></AwardIcon>
              </template>
            </span>
          </div>
          <div class="flex-grow-1 overflow-hidden ms-3">
            <p class="text-uppercase fw-medium text-muted text-truncate mb-3">
              {{ item.value }}
            </p>
            <div class="d-flex align-items-center mb-3">
              <h4 class="fs-4 flex-grow-1 mb-0">
                <span class="counter-value">{{ item.count }}</span>
              </h4>
            </div>
          </div>
        </div>
      </BCardBody>
    </BCard>
  </div>
</template>

<style>
#container {
  display: grid;
  align-items: center;
  grid-auto-rows: auto;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  overflow-x: auto;
  padding-left: 0;
  padding-right: 2em;
  margin-right: 2em;
  margin-left: 1em;
}

#element {
  background-color: white;
  min-width: 300px;
}
</style>
