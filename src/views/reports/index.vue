<script setup>
import { ref, watch, computed } from "vue";
import { useReport } from "../../composables/useReport";
import { toast } from "vue3-toastify";
import Layout from "../../layouts/main.vue";
import PageHeader from "../../components/page-header.vue";
import flatPickr from "vue-flatpickr-component";
import JsonExcel from "vue-json-excel3";
import { setStatusColor } from "../../utils/colors";

const rows = ref([]);
const date = ref();
const reportType = ref();
const isLoading = ref(false);
const { getReport, columns } = useReport(reportType);

const downloadData = computed(
  () =>
    rows.value.map((item) =>
      columns.value.reduce((newItem, { title, key }) => {
        newItem[title] = item[key];
        return newItem;
      }, {})
    ) || []
);

async function consultData() {
  try {
    isLoading.value = true;
    if (!(date.value && reportType.value))
      throw "Debe completar todos los campos!";
    const [startDate, endDate] = date.value.split("to");

    rows.value = await getReport(startDate.trim(), endDate.trim());
  } catch (error) {
    toast(error, {
      type: "error",
      position: "top-right",
    });
  } finally {
    isLoading.value = false;
  }
}

function setStatusLabel(status) {
  if (status == "IN_TERM") return "Por Vencer";
  if (status == "ANSWERED") return "Contestado";
  if (status == "DRAFT") return "Borrador";
  if (status == "NO_RESPONSE") return "Sin Respuesta";
}

watch(reportType, () => {
  rows.value = [];
});
</script>

<template>
  <Layout>
    <PageHeader title="Reportes" />

    <BRow class="g-4 mb-4">
      <BCol sm="auto">
        <div class="d-md-flex gap-2">
          <div style="width: 300px">
            <flat-pickr
              v-model="date"
              :config="{
                dateFormat: 'Y-m-d',
                mode: 'range',
              }"
              class="form-control border-light flatpickr-input"
            >
            </flat-pickr>
          </div>
          <div class="w-md">
            <select
              v-model="reportType"
              class="form-select"
              data-choices
              data-choices-search-false
            >
              <option value="entry" selected>Entradas</option>
              <option value="departure">Salidas</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
          <div class="w-md">
            <BLink class="btn btn-primary" @click="consultData">
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
              />
              <template v-else>
                <i class="ri-search-line align-bottom me-1"></i> Consultar
              </template>
            </BLink>
          </div>
        </div>
      </BCol>
      <BCol sm>
        <div class="d-md-flex justify-content-sm-end gap-2">
          <json-excel
            :data="downloadData"
            :name="'Reporte_Radicados_' + new Date().toLocaleDateString()"
            class="float-end mb-3"
          >
            <BButton variant="primary">
              Descargar Reporte en Excel
              <i class="bi bi-file-earmark-excel"></i>
            </BButton>
          </json-excel>
        </div>
      </BCol>
    </BRow>
    <BRow>
      <a-empty v-if="!rows.length" />
      <a-table
        v-else
        :dataSource="rows"
        :columns="columns"
        :loading="isLoading"
        :scroll="{ x: 1500 }"
        :locale="{ emptyText: '-' }"
        sticky
      >
        <template #bodyCell="{ text, column }">
          <div style="text-transform: capitalize">
            <span
              v-if="column.key === 'status'"
              class="badge"
              :class="[setStatusColor(text)]"
              >{{ setStatusLabel(text) }}</span
            >
            <span v-else-if="column.key === 'radicateDate'">{{
              text.split(" ")[0]
            }}</span>
            <span v-else> {{ text }}</span>
          </div>
        </template>
      </a-table>
    </BRow>
  </Layout>
</template>
