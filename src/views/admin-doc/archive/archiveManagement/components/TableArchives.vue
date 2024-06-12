<script setup>
import { SearchOutlined, EyeOutlined } from "@ant-design/icons-vue";
// import CalendarFilter from "./CalendarFilter.vue";
import { ref, reactive, computed, onMounted } from "vue";
import { getProcessedFolderDocuments } from "../../../../../services/docservice/doc.service";
// import axios from "axios";
// import { transformDate } from "@/helpers/transformDate";
// import setState from "@/helpers/setState";

// const dataSource = reactive([]);
const state = reactive({
    searchText: "",
    searchedColumn: "",
});
const searchInput = ref();
const filteredInfo = ref(null);
const sortedInfo = ref(null);
const loading = ref(false);

const handleTableChange = (pag, filters, sorter) => {
    filteredInfo.value = filters;
    sortedInfo.value = sorter;
};

const columns = computed(() => {
    return [
        {
            title: "Visualizar",
            dataIndex: "action",
            key: "action",
            width: "10%",
            className: "text-center",
        },
        {
            title: "Id del Expediente",
            dataIndex: "id",
            key: "id",
            width: "20%",
            customFilterDropdown: true,
            onFilter: (value, record) =>
                record.id
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => {
                        searchInput.value.focus();
                    }, 100);
                }
            },
        },
        {
            title: "Nombre del expediente",
            dataIndex: "name",
            key: "name",
            width: "20%",
            className: "text-center",
        },
        {
            title: "Creado por",
            dataIndex: "createdBy",
            key: "createdBy",
            width: "20%",
            className: "text-center",
        },{
            title: "Fecha de creación",
            dataIndex: "dateCreated",
            key: "dateCreated",
            width: "20%",
            className: "text-center",
        },
    ];
});

// const convertToTimestamp = (createdAt) => {
//     const seconds = createdAt?._seconds * 1000;
//     const nanoseconds = createdAt?._nanoseconds / 1000000;

//     return seconds + nanoseconds;
// };

//Filtro de búsqueda

const dataSource = ref(null);

onMounted(async () => {
    loading.value = true;
    const data = await getProcessedFolderDocuments();
    dataSource.value = data;
    loading.value = false;
});

const handleChange = (selectedKeys, dataIndex) => {
    state.searchText = selectedKeys[0];
    state.searchedColumn = dataIndex;
};
const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    handleChange(selectedKeys, dataIndex);
};
const handleReset = (clearFilters) => {
    clearFilters({ confirm: true });
    state.searchText = "";
};
</script>

<template>
    <!-- <div>
        <CalendarFilter
            @filterDate="filterDateReceived"
            :clearFilterDate="clearFilterDate"
        />
    </div> -->
    <div>
        <a-table
            :dataSource="dataSource"
            :columns="columns"
            :loading="loading"
            @change="handleTableChange"
            sticky
        >
            <template
                #customFilterDropdown="{
                    setSelectedKeys,
                    selectedKeys,
                    confirm,
                    clearFilters,
                    column,
                }"
            >
                <div style="padding: 8px">
                    <a-input
                        ref="searchInput"
                        :placeholder="`Search ${column.dataIndex}`"
                        :value="selectedKeys[0]"
                        style="width: 188px; margin-bottom: 8px; display: block"
                        @change="
                            (e) =>
                                setSelectedKeys(
                                    e.target.value ? [e.target.value] : []
                                )
                        "
                        @pressEnter="
                            handleSearch(
                                selectedKeys,
                                confirm,
                                column.dataIndex
                            )
                        "
                    />
                    <a-button
                        type="primary"
                        size="small"
                        style="width: 90px; margin-right: 8px"
                        @click="
                            handleSearch(
                                selectedKeys,
                                confirm,
                                column.dataIndex
                            )
                        "
                    >
                        <template #icon><SearchOutlined /></template>
                        Search
                    </a-button>
                    <a-button
                        size="small"
                        style="width: 90px"
                        @click="handleReset(clearFilters)"
                    >
                        Reset
                    </a-button>
                </div>
            </template>

            <template #customFilterIcon="{ filtered }">
                <search-outlined
                    :style="{ color: filtered ? '#108ee9' : undefined }"
                />
            </template>

            <template #bodyCell="{ text, record, column }">
                <!-- Search -->

                <span
                    v-if="
                        state.searchText &&
                        state.searchedColumn === column.dataIndex &&
                        column.dataIndex === 'id'
                    "
                >
                    <template
                        v-for="(fragment, i) in text
                            ?.toString()
                            ?.split(
                                new RegExp(
                                    `(?<=${state.searchText})|(?=${state.searchText})`,
                                    'i'
                                )
                            )"
                    >
                        <mark
                            v-if="
                                fragment.toLowerCase() ===
                                state.searchText.toLowerCase()
                            "
                            :key="i"
                            class="fw-medium link-success highlight-numberEntryClaim"
                        >
                            {{ fragment }}
                        </mark>
                        <template v-else>
                            <a
                                :key="i"
                                class="fw-medium link-primary"
                                :href="`/gestion-documental/radicado/${record.id}`"
                            >
                                {{ fragment }}</a
                            ></template
                        >
                    </template>
                </span>

                <span
                    v-else-if="
                        state.searchText &&
                        state.searchedColumn === column.dataIndex
                    "
                >
                    <template
                        v-for="(fragment, i) in text
                            ?.toString()
                            ?.split(
                                new RegExp(
                                    `(?<=${state.searchText})|(?=${state.searchText})`,
                                    'i'
                                )
                            )"
                    >
                        <mark
                            v-if="
                                fragment.toLowerCase() ===
                                state.searchText.toLowerCase()
                            "
                            :key="i"
                            class="highlight"
                        >
                            {{ fragment }}
                        </mark>
                        <template v-else>{{ fragment }}</template>
                    </template>
                </span>

                <!-- Columns -->

                <template v-if="column.dataIndex === 'action'">
                    <div
                        class="d-flex justify-content-center align-items-center"
                    >
                        <a
                            class="fw-medium link-primary text-center actionButtonTableRadicates"
                            :href="`/expediente/${text}`"
                        >
                            <EyeOutlined />
                        </a>
                    </div>
                </template>

                <template
                    v-if="column.dataIndex == 'id' && !state.searchText"
                >
                    <a
                        class="fw-medium link-primary"
                        :href="`/expediente/${record.id}`"
                    >
                        {{ text }}
                    </a>
                </template>
            </template>
        </a-table>
    </div>
</template>

<style scoped>
.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}

.highlight-numberEntryClaim {
    background-color: rgb(214, 214, 214);
    padding: 0px;
    color: RGBA(var(--vz-primary-rgb), var(--vz-link-opacity, 1)) !important;
}

.highlight-numberOutClaim {
    background-color: rgb(214, 214, 214);
    padding: 0px;
    color: RGBA(var(--vz-success-rgb), var(--vz-link-opacity, 1)) !important;
}

.centerContentTableRadicates {
    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
}
.actionButtonTableRadicates {
    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto !important;
    padding: 0.5em;
    border-radius: 5px;
}
.actionButtonTableRadicates:hover {
    background: #dddddd;
    transition: background 250ms;
}
</style>
<style>
:where(.css-dev-only-do-not-override-1hsjdkk).ant-btn-primary:not(:disabled) {
    background-color: #0dcaf0 !important;
    display: inline-flex;
    justify-content: center;
    align-items: center;
}
:where(.css-dev-only-do-not-override-1hsjdkk).ant-btn-primary:not(
        :disabled
    ):hover {
    background-color: #31d2f2 !important;
    display: inline-flex;
    justify-content: center;
    align-items: center;
}
</style>
