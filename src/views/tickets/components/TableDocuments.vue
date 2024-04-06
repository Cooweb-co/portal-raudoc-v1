<script setup>
import { SearchOutlined, EyeOutlined } from "@ant-design/icons-vue";
import calendarFilter from "./CalendarFilter.vue";
import { ref, reactive, onBeforeMount, computed } from "vue";
import axios from "axios";
import moment from "moment";
import transformDate from "@/helpers/transformDate";
import setState from "@/helpers/setState";
import setVariantStateInfo from "@/helpers/setVariantStateInfo";

const dataSource = ref([]);
const state = reactive({
    searchText: "",
    searchedColumn: "",
});
const searchInput = ref();
const filteredInfo = ref(null);
const sortedInfo = ref(null);

let dateStart = ref(null);
let dateEnd = ref(null);
const originDataSource = ref([]);
const loading = ref(false);

onBeforeMount(async () => {
    loading.value = true;
    const headers = {
        company: "BAQVERDE",
        "Content-Type": "application/json",
    };
    await axios
        .get(
            "https://us-central1-raudoc-gestion-agil.cloudfunctions.net/CLAIM_LIST_V1",
            { headers }
        )
        .then((response) => {
            response.data.map((data) => {
                dataSource.value.push({
                    id: data?.claimId,
                    key: data?.claimId,
                    numberEntryClaim: data?.numberEntryClaim || "-",
                    externalRadicate: data?.externalRadicate || "-",
                    numberOutClaim: data?.numberOutClaim || "-",
                    entryDate:
                        data?.createdAt && data?.createdAt._seconds
                            ? transformDate(data?.createdAt._seconds)
                            : "-",
                    expirationDate:
                        data?.expirationDate && data?.expirationDate._seconds
                            ? transformDate(data?.expirationDate._seconds)
                            : "-",
                    subject: data?.subject || "-",
                    petitioner:
                        data?.petitionerInformation?.firstNames +
                            " " +
                            data?.petitionerInformation?.lastNames || "-",
                    assignedTo: data?.assignedTo || "-",
                    status: setState(data?.status) || "-",
                    priority: data?.priority || "BAJA",
                    action: data?.claimId,
                });
            });
            loading.value = false;
            dataSource.value.sort((a, b) => {
                const numA = parseInt(
                    a.numberEntryClaim.replace(/^EXT-BV-2024-/, "")
                );
                const numB = parseInt(
                    b.numberEntryClaim.replace(/^EXT-BV-2024-/, "")
                );

                return numB - numA;
            });
        })
        .catch((error) => {
            loading.value = false;
            console.error("Error:", error);
        });
});

const columns = computed(() => {
    const sorted = sortedInfo.value || {};
    return [
        {
            title: "Visualizar",
            dataIndex: "action",
            key: "action",
            width: "2%",
            className: "text-center",
        },
        {
            title: "N° Radicado",
            dataIndex: "numberEntryClaim",
            key: "numberEntryClaim",
            width: "3%",
            customFilterDropdown: true,
            onFilter: (value, record) =>
                record.numberEntryClaim
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
            title: "Asunto",
            dataIndex: "subject",
            key: "subject",
            width: "5%",
        },
        {
            title: "Nombre Peticionario",
            dataIndex: "petitioner",
            key: "petitioner",
            customFilterDropdown: true,
            width: "3%",
            className: "text-center",
            onFilter: (value, record) =>
                record.petitioner
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => {
                        searchInput.value?.focus();
                    }, 100);
                }
            },
        },
        {
            title: "Asignado a",
            dataIndex: "assignedTo",
            key: "assignedTo",
            width: "3%",
            className: "text-center",
            customFilterDropdown: true,
            onFilter: (value, record) =>
                record.assignedTo
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => {
                        searchInput.value?.focus();
                    }, 100);
                }
            },
        },
        {
            title: "Radicado de salida",
            dataIndex: "numberOutClaim",
            key: "numberOutClaim",
            width: "3%",
            className: "text-center",
            customFilterDropdown: true,
            onFilter: (value, record) =>
                record.numberOutClaim
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => {
                        searchInput.value?.focus();
                    }, 100);
                }
            },
        },
        {
            title: "Fecha de entrada",
            dataIndex: "entryDate",
            key: "entryDate",
            className: "text-center",
            width: "3%",
            sorter: (a, b) => {
                const firstDate = moment(a.entryDate, "DD MMM, YYYY")
                    .startOf("day")
                    .toISOString();
                const secondDate = moment(b.entryDate, "DD MMM, YYYY")
                    .startOf("day")
                    .toISOString();
                return new Date(firstDate) - new Date(secondDate);
            },

            sortOrder: sorted.columnKey === "entryDate" && sorted.order,
            ellipsis: true,
        },
        {
            title: "Fecha de vencimiento",
            dataIndex: "expirationDate",
            key: "expirationDate",
            className: "text-center",
            width: "3%",
            sorter: (a, b) => {
                const firstDate = moment(a.expirationDate, "DD MMM, YYYY")
                    .startOf("day")
                    .toISOString();
                const secondDate = moment(b.expirationDate, "DD MMM, YYYY")
                    .startOf("day")
                    .toISOString();
                return new Date(firstDate) - new Date(secondDate);
            },

            sortOrder: sorted.columnKey === "expirationDate" && sorted.order,
            ellipsis: true,
        },
        {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            width: "1.8%",
            filters: [
                {
                    text: "Vencido", //Rojo
                    value: "Vencido",
                },
                {
                    text: "Por vencer", //Amarillo
                    value: "Por vencer",
                },
                {
                    text: "En Termino", // Verde
                    value: "En termino",
                },
                {
                    text: "Respondido", // Azul
                    value: "Respondido",
                },
                {
                    text: "No requiere respuesta", // Azul
                    value: "No requiere respuesta",
                },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            defaultFilteredValue: ["En termino","Por vencer", "Vencido"],
        },
        // {
        //     title: "Prioridad",
        //     dataIndex: "priority",
        //     key: "priority",
        //     width: "7%",
        //     filters: [
        //         {
        //             text: "Alta",
        //             value: "ALTA",
        //         },
        //         {
        //             text: "Media",
        //             value: "MEDIA",
        //         },
        //         {
        //             text: "Baja",
        //             value: "BAJA",
        //         },
        //     ],
        //     onFilter: (value, record) =>
        //         record.priority.indexOf(value) === 0,
        // },
    ];
});

//Filtro de búsqueda
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

const handleChangeSort = (pagination, filters, sorter) => {
    filteredInfo.value = filters;
    sortedInfo.value = sorter;
};

//Filtro de fechas

const filterDateReceived = (filterDate) => {
    filterForDate(filterDate);
};

const filterForDate = (dates) => {
    if (!dates) return "";
    const validateString = dates.includes(" to ");

    if (originDataSource.value.length > 0) clearFilterDate();

    if (!validateString) {
        originDataSource.value = [...dataSource.value];
        console.log(dataSource.value);
        dataSource.value = dataSource.value.filter((data) => {
            const fechaMoment = moment(data.entryDate, "DD MMM, YYYY");
            console.log(fechaMoment.isSameOrAfter(dates));
            return fechaMoment.isSameOrAfter(dates);
        });
    } else {
        const datesArray = dates?.split(" to ");
        for (let i = 0; i < datesArray.length; i++) {
            // const dateObject = convertToDateISO(datesArray[i]);
            if (i == 0) dateStart.value = datesArray[i];
            else dateEnd.value = datesArray[i];
        }
        originDataSource.value = [...dataSource.value];
        dataSource.value = dataSource.value.filter((data) => {
            const fechaMoment = moment(data.entryDate, "DD MMM, YYYY");
            console.log(dateStart.value, dateEnd.value);
            return fechaMoment.isBetween(
                dateStart.value,
                dateEnd.value,
                null,
                "[]"
            );
        });
    }
};

const clearFilterDate = () => {
    if (originDataSource.value.length <= 0) return "";
    dataSource.value = [...originDataSource.value];
    originDataSource.value = [];
};

const setVariantState = (text) => {
    return setVariantStateInfo(text);
};

// const getYearNameMonthDay = (dateString) => {
//     const dateMoment = moment(dateString, "DD MMM, YYYY");
//     const year = dateMoment.format("YYYY");
//     const monthName = dateMoment.format("MMMM"); // 'MMMM' devuelve el nombre completo del mes
//     const day = dateMoment.format("DD");

//     return { year, monthName, day };
// };
// //Convertir fecha de created a UTC-5
// const convertToUTC5 = (date) => {
//     // const dateMoment = moment(date);
//     // const dateUTC5 = dateMoment.subtract(5, 'hours').toISOString();
//     const transformedDate = moment(date)
//         .utcOffset(-5)
//         .format("D MMM, YYYY HH:mm:ss");
//     return transformedDate;
// };
</script>

<template>
    <div>
        <calendarFilter
            @filterDate="filterDateReceived"
            :clearFilterDate="clearFilterDate"
        />
    </div>
    <div>
        <a-table
            :dataSource="dataSource"
            :columns="columns"
            :scroll="{ x: 2000 }"
            :loading="loading"
            @change="handleChangeSort"
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
                        (state.searchText &&
                            state.searchedColumn === column.dataIndex &&
                            column.dataIndex === 'numberEntryClaim') ||
                        (state.searchText &&
                            state.searchedColumn === column.dataIndex &&
                            column.dataIndex === 'numberOutClaim')
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
                            class="fw-medium"
                            :class="
                                column.dataIndex === 'numberEntryClaim'
                                    ? 'link-primary highlight-numberEntryClaim '
                                    : 'link-success highlight-numberOutClaim'
                            "
                        >
                            {{ fragment }}
                        </mark>
                        <template v-else>
                            <a
                                :key="i"
                                class="fw-medium"
                                :class="
                                    column.dataIndex === 'numberEntryClaim'
                                        ? 'link-primary'
                                        : 'link-success'
                                "
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
                    <a
                        class="fw-medium link-primary text-center actionButtonTableRadicates"
                        :href="`/gestion-documental/radicado/${text}`"
                    >
                        <EyeOutlined />
                    </a>
                </template>

                <template
                    v-if="
                        column.dataIndex == 'numberEntryClaim' &&
                        !state.searchText
                    "
                >
                    <a
                        class="fw-medium link-primary"
                        :href="`/gestion-documental/radicado/${record.id}`"
                    >
                        {{ text }}
                    </a>
                </template>

                <template
                    v-if="
                        column.dataIndex == 'numberOutClaim' &&
                        !state.searchText
                    "
                >
                    <a
                        class="fw-medium link-success"
                        :href="`/gestion-documental/radicado/${record.id}`"
                    >
                        {{ text }}
                    </a>
                </template>

                <template v-if="column.dataIndex === 'status'">
                    <div class="centerContentTableRadicates">
                        <BBadge pill :variant="setVariantState(text)">{{
                            text
                        }}</BBadge>
                    </div>
                </template>

                <template v-if="column.dataIndex === 'priority'">
                    <div class="centerContentTableRadicates">
                        <span
                            :class="
                                text.toLowerCase() == 'alta'
                                    ? 'badge text-uppercase bg-danger'
                                    : text.toLowerCase() == 'media'
                                    ? 'badge text-uppercase bg-warning'
                                    : 'badge text-uppercase bg-info'
                            "
                            class="span-table"
                        >
                            {{ text.toUpperCase() }}
                        </span>
                    </div>
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
