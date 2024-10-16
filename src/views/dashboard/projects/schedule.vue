<script>
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

      async function getRecords() {
        try {
          const recordsConfig = {
            headers: {
              company: "BAQVERDE",
              "Content-Type": "application/json", // Puedes ajustar el tipo de contenido según sea necesario
            },
          };

          const records = await axios.post(
            `${process.env.VUE_APP_CF_BASE_URL}/GET_LATEST_CLAIM_BY_ROLE_USER?uid=${user.value?.uid}`,
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
          console.error(error);
          return error;
        }
      }

      function goToClaims(claim) {
        router.replace(`/gestion-documental/radicado/${claim?.claimId}`);
      }

      const clearFilter = () => {
        claims.value = originalClaims.value;
      };

      onMounted(() => {
        getRecords();
      });
      return {
        claims,
        getRecords,
        moment,
        goToClaims,
        clearFilter,
        setState,
      };
    },
  });
</script>

<template>
  <BCard no-body class="mt-2 card-config">
    <BCardHeader class="border-0">
      <BCardTitle class="mb-0 col">Próximas a vencer </BCardTitle>
    </BCardHeader>

    <BCardBody class="pt-0">
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

      <span class="text-muted w-100 text-center d-block pt-3" v-else
        >No se encontraron registros...</span
      >

      <div class="mt-3 text-center">
        <BLink
          href="/gestion-documental/lista-radicados"
          class="text-muted text-decoration-underline"
          >Ver todos los pendientes</BLink
        >
      </div>
    </BCardBody>
  </BCard>
  <BCard no-body class="mt-2 card-config">
    <BCardHeader class="border-0">
      <BCardTitle class="mb-0 col">Vencidas</BCardTitle>
    </BCardHeader>

    <BCardBody class="pt-0">
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

      <span class="text-muted w-100 text-center d-block pt-3" v-else
        >No se encontraron registros...</span
      >

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

  .active {
    background-color: #e0f7ff !important;
    border-color: #e0f7ff !important;
  }
</style>
