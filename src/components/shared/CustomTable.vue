<script>
import { defineComponent, computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDate } from "../../composables/useDate";
import flatPickr from "vue-flatpickr-component";
import JsonExcel from "vue-json-excel3";

export default defineComponent({
  name: "CustomTable",
  components: {
    flatPickr,
    JsonExcel,
  },
  props: {
    rows: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    loadingCreate: {
      type: Boolean,
      required: false,
      default: false,
    },
    loadingReport: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasCustomChildren: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasSelection: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasReport: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasEditableColumns: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectionOptions: {
      type: Object,
      required: false,
      default: () => {},
    },
    remote: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["select-rows", "update"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { getDate, getDateCycle } = useDate();

    const searchInput = ref();
    const filterData = ref();

    const rowsData = computed(() => props.rows);
    const columnsData = computed(() =>
      props.columns
        ?.filter((e) => !e.hidden)
        .map((e) => {
          if (e.searchable) {
            return {
              ...e,
              filterByNull: false,
              customFilterDropdown: true,
              onFilter: e.filterFunction
                ? e.filterFunction
                : (value, record) => {
                    if (value == null) return record[e.key] == null;
                    if (record[e.key])
                      return record[e.key]
                        .toString()
                        .toLowerCase()
                        .includes(value.toString().toLowerCase());
                  },
            };
          } else if (e.filters) {
            return {
              ...e,
              onFilter: e.filterFunction
                ? e.filterFunction
                : (value, record) => {
                    return value.includes(record[e.key]);
                  },
            };
          } else if (e.filterByDate) {
            return {
              ...e,
              customFilterDropdown: true,
              onFilter: e.filterFunction
                ? e.filterFunction
                : (value, record) => {
                    if (value == null) return record[e.key] == null;
                    const timestamp = getDate(record[e.key]);
                    if (!value) return true;
                    return (
                      timestamp >= getDateCycle(value.start, "start") &&
                      timestamp <= getDateCycle(value.end, "end")
                    );
                  },
            };
          } else {
            return e;
          }
        })
    );

    const downloadData = computed(
      () =>
        props.rows.map((item) =>
          props.columns.reduce((newItem, { title, key }) => {
            newItem[title] = item[key];
            return newItem;
          }, {})
        ) || []
    );

    const rowSelection = ref({
      hideSelectAll: true,
      onChange: (selectedRowKeys, selectedRows) => {
        emit("select-rows", selectedRows);
      },
      onSelectAll: (selected, selectedRows) => {
        emit("select-rows", selectedRows);
      },
      ...props.selectionOptions,
    });

    const setFilterToNull = (column, value) => {
      if (column.filterByDate) {
        if (value) return [null];
        column.filterByNull = false;
        return { start: "", end: "" };
      }

      if (column.searchable) {
        if (value) return [null];
        column.filterByNull = false;
        return [];
      }
    };

    function setFilters(filters, currentDataSource) {
      filterData.value = {
        ...filters,
        status: Array.isArray(filters.status) ? filters.status.flat() : [],
        data: currentDataSource,
      };
    }

    function changeData(column) {
      if (column.filters)
        setTimeout(() => emit("update", filterData.value), 200);
    }

    return {
      t,
      emit,
      props,
      rowsData,
      columnsData,
      searchInput,
      rowSelection,
      filterData,
      setFilterToNull,
      setFilters,
      changeData,
      getDate,
      downloadData,
    };
  },
});
</script>

<template>
  <div v-if="props.loading">
    <slot name="buttons"></slot>
    <json-excel
      v-if="props.hasReport"
      :data="downloadData"
      :name="'Reporte_' + new Date().toLocaleDateString()"
      class="float-end mb-3"
    >
      <BButton variant="primary">
        Descargar Reporte en Excel
        <i class="bi bi-file-earmark-excel"></i>
      </BButton>
    </json-excel>
  </div>

  <div>
    <a-table
      :data-source="rowsData"
      :columns="columnsData"
      :loading="loading"
      :scroll="{ x: 1500 }"
      :row-selection="props.hasSelection ? rowSelection : null"
      :pagination="{
        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total}`,
      }"
      :locale="{ emptyText: '-' }"
      @change="
        (pagination, filters, sorter, { currentDataSource }) =>
          setFilters(filters, currentDataSource)
      "
    >
      <template
        #customFilterDropdown="{ selectedKeys, confirm, clearFilters, column }"
      >
        <div>
          <div class="px-2 pt-3">
            <a-input
              v-if="column.searchable"
              ref="searchInput"
              :value="selectedKeys[0]"
              :placeholder="`Buscar ${column.dataIndex}`"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="
                (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
              "
              @pressEnter="
                () => {
                  confirm();
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
                }
              "
            />
            <template v-else-if="column.filterByDate">
              <flat-pickr
                v-model="selectedKeys[0]"
                :config="{
                  dateFormat: 'd M, Y',
                  mode: 'range',
                }"
                class="form-control border-light flatpickr-input"
                @change="
                  (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
                "
              />
              <input
                v-model="column.filterByNull"
                type="checkbox"
                class="mr-2"
                @change="
                  (evt) =>
                    setSelectedKeys(setFilterToNull(column, evt.target.checked))
                "
              />
              <label>Filtar por vacío</label>
            </template>
          </div>

          <hr class="my-2" />

          <div
            class="px-1 pb-2 is-flex is-justify-content-space-between is-align-items-center"
          >
            <button
              class="ant-btn ant-btn-link ant-btn-sm"
              @click="
                () => {
                  clearFilters();
                  setFilterToNull(column, false);
                  props.remote && changeData(column);
                  confirm();
                }
              "
            >
              Resetear
            </button>
            <button
              class="ant-btn ant-btn-primary ant-btn-sm"
              @click="
                () => {
                  props.remote && changeData(column);
                  confirm();
                }
              "
            >
              OK
            </button>
          </div>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <slot name="body" :column="column" :record="record">
          <div v-if="column.filterByDate">
            {{ getDate(record[column.key]) || "No Date" }}
          </div>
          <div v-else class="cut-text">{{ record[column.key] || "-" }}</div>
        </slot>
      </template>
      <template v-if="props.hasCustomChildren" #expandedRowRender="{ record }">
        <slot name="expanded" :inner-record="record"></slot>
      </template>
    </a-table>
  </div>
</template>

<style lang="scss" scoped>
hr {
  height: 2px;
  width: 100%;
}
</style>
