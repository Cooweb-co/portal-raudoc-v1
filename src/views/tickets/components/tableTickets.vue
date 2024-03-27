<script>
import { Table } from "ant-design-vue";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons-vue";
import calendarFilter from "./CalendarFilter.vue";

import { ref, reactive, defineComponent } from "vue";
import axios from "axios";
import moment from "moment";
import transformDate from "@/helpers/transformDate";
import setState from "@/helpers/setState";
import setVariantStateInfo from "@/helpers/setVariantStateInfo";

export default defineComponent({
    name: "TableTickets",
    data() {
        return {
            selectedRowKeys: [],
            dataSource: [],
            state: reactive({
                searchText: "",
                searchedColumn: "",
            }),
            searchInput: ref(),
            sortedInfo: ref(null),
            filteredInfo: ref(null),
            rangeDateconfig: {
                wrap: true, // set wrap to true only when using 'input-group'
                altFormat: "M j, Y",
                altInput: true,
                dateFormat: "d M, Y",
                mode: "range",
            },
            dateStart: null,
            dateEnd: null,
            originDataSource: [],
            loading: false,
        };
    },
    async beforeMount() {
        this.loading = true;
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
                    this.dataSource.push({
                        id: data?.claimId,
                        key: data?.claimId,
                        numberEntryClaim: data?.numberEntryClaim || "-",
                        outputDocument: data?.externalRadicate || "-",
                        entryDate: data?.entryDate,
                        expirationDate:
                            data?.expirationDate &&
                            data?.expirationDate._seconds
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
                this.loading = false;
            })
            .catch((error) => {
                this.loading = false;
                console.error("Error:", error);
            });
    },
    computed: {
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.onSelectChange,
                hideDefaultSelections: true,
                selections: [
                    Table.SELECTION_ALL,
                    Table.SELECTION_INVERT,
                    Table.SELECTION_NONE,
                    {
                        key: "odd",
                        text: "Select Odd Row",
                        onSelect: this.onSelectOddRow,
                    },
                    {
                        key: "even",
                        text: "Select Even Row",
                        onSelect: this.onSelectEvenRow,
                    },
                ],
            };
        },
        columns() {
            const sorted = this.sortedInfo || {};
            return [
                {
                    title: "ID",
                    dataIndex: "numberEntryClaim",
                    key: "numberEntryClaim",
                    width: "10%",
                    customFilterDropdown: true,
                    onFilter: (value, record) =>
                        record.numberEntryClaim
                            .toString()
                            .toLowerCase()
                            .includes(value.toLowerCase()),
                    onFilterDropdownOpenChange: (visible) => {
                        if (visible) {
                            setTimeout(() => {
                                this.searchInput?.focus();
                            }, 100);
                        }
                    },
                },
                {
                    title: "Titulo",
                    dataIndex: "subject",
                    key: "subject",
                    width: "15%",
                },
                {
                    title: "Peticionario",
                    dataIndex: "petitioner",
                    key: "petitioner",
                    customFilterDropdown: true,
                    width: "10%",
                    className: "text-center",
                    onFilter: (value, record) =>
                        record.petitioner
                            .toString()
                            .toLowerCase()
                            .includes(value.toLowerCase()),
                    onFilterDropdownOpenChange: (visible) => {
                        if (visible) {
                            setTimeout(() => {
                                this.searchInput?.focus();
                            }, 100);
                        }
                    },
                },
                {
                    title: "Asignado a",
                    dataIndex: "assignedTo",
                    key: "assignedTo",
                    width: "10%",
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
                                this.searchInput?.focus();
                            }, 100);
                        }
                    },
                },
                {
                    title: "Radicado de salida",
                    dataIndex: "outputDocument",
                    key: "outputDocument",
                    width: "10%",
                    className: "text-center",
                    customFilterDropdown: true,
                    onFilter: (value, record) =>
                        record.outputDocument
                            .toString()
                            .toLowerCase()
                            .includes(value.toLowerCase()),
                    onFilterDropdownOpenChange: (visible) => {
                        if (visible) {
                            setTimeout(() => {
                                this.searchInput?.focus();
                            }, 100);
                        }
                    },
                },
                {
                    title: "Fecha de entrada",
                    dataIndex: "entryDate",
                    key: "entryDate",
                    className: "text-center",
                    width: "10%",
                    // sorter: (a, b) => {
                    //     const firstDate = moment(a.entryDate, "DD MMM, YYYY")
                    //         .startOf("day")
                    //         .toISOString();
                    //     const secondDate = moment(b.entryDate, "DD MMM, YYYY")
                    //         .startOf("day")
                    //         .toISOString();
                    //     return new Date(firstDate) - new Date(secondDate);
                    // },

                    // sortOrder: sorted.columnKey === "entryDate" && sorted.order,
                    // ellipsis: true,
                },
                {
                    title: "Fecha de vencimiento",
                    dataIndex: "expirationDate",
                    key: "expirationDate",
                    className: "text-center",
                    width: "10%",
                    sorter: (a, b) => {
                        const firstDate = moment(
                            a.expirationDate,
                            "DD MMM, YYYY"
                        )
                            .startOf("day")
                            .toISOString();
                        const secondDate = moment(
                            b.expirationDate,
                            "DD MMM, YYYY"
                        )
                            .startOf("day")
                            .toISOString();
                        return new Date(firstDate) - new Date(secondDate);
                    },

                    sortOrder:
                        sorted.columnKey === "expirationDate" && sorted.order,
                    ellipsis: true,
                },
                {
                    title: "Estado",
                    dataIndex: "status",
                    key: "status",
                    width: "6%",
                    filters: [
                        {
                            text: "Vencido", //Rojo
                            value: "EXPIRE",
                        },
                        {
                            text: "Por vencer", //Amarillo
                            value: "ABOUT_TO_EXPIRE",
                        },
                        {
                            text: "En Termino", // Verde
                            value: "IN_TERM",
                        },
                        {
                            text: "Respondido", // Azul
                            value: "ANSWERED",
                        },
                        {
                            text: "No requiere respuesta", // Azul
                            value: "NO_RESPONSE",
                        },
                    ],
                    onFilter: (value, record) =>
                        record.status.indexOf(value) === 0,
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
                {
                    title: "Acción",
                    dataIndex: "action",
                    key: "action",
                    width: "5%",
                },
            ];
        },
    },
    methods: {
        //Filtros de state y priority
        onSelectChange(changableRowKeys) {
            console.log("selectedRowKeys changed: ", changableRowKeys);
            this.selectedRowKeys = changableRowKeys;
        },
        onSelectOddRow(changableRowKeys) {
            this.selectedRowKeys = changableRowKeys.filter(
                (_key, index) => index % 2 !== 0
            );
        },
        onSelectEvenRow(changableRowKeys) {
            this.selectedRowKeys = changableRowKeys.filter(
                (_key, index) => index % 2 === 0
            );
        },

        //Filtro de búsqueda
        handleChange(selectedKeys, dataIndex) {
            this.state.searchText = selectedKeys[0];
            this.state.searchedColumn = dataIndex;
        },
        handleChangeSort(pagination, filters, sorter) {
            console.log("Various parameters", pagination, filters, sorter);
            this.filteredInfo = filters;
            this.sortedInfo = sorter;
        },
        handleSearch(selectedKeys, confirm, dataIndex) {
            confirm();
            this.handleChange(selectedKeys, dataIndex);
        },
        handleReset(clearFilters) {
            clearFilters({ confirm: true });
            this.state.searchText = "";
        },

        //Filtro de fechas
        convertToDateISO(dateString) {
            // Analizar la cadena utilizando Moment.js
            const dateMoment = moment(dateString, "DD MMM, YYYY");
            // Convertir a objeto Date
            const isoDate = dateMoment.toISOString();
            return isoDate;
        },
        getYearNameMonthDay(dateString) {
            const dateMoment = moment(dateString, "DD MMM, YYYY");
            const year = dateMoment.format("YYYY");
            const monthName = dateMoment.format("MMMM"); // 'MMMM' devuelve el nombre completo del mes
            const day = dateMoment.format("DD");

            return { year, monthName, day };
        },
        filterDateReceived(filterDate) {
            this.filterForDate(filterDate);
        },
        filterForDate(dates) {
            if (!dates) return "";
            const validateString = dates.includes(" to ");

            if (this.originDataSource.length > 0) this.clearFilterDate();

            if (!validateString) {
                this.originDataSource = [...this.dataSource];
                this.dataSource = this.dataSource.filter((data) => {
                    const fechaMoment = moment(data.entryDate);
                    return fechaMoment.isSameOrAfter(dates);
                });
            } else {
                const datesArray = dates.split(" to ");
                for (let i = 0; i < datesArray.length; i++) {
                    const dateObject = this.convertToDateISO(datesArray[i]);
                    if (i == 0) this.dateStart = dateObject;
                    else this.dateEnd = dateObject;
                }
                this.originDataSource = [...this.dataSource];
                this.dataSource = this.dataSource.filter((data) => {
                    const fechaMoment = moment(data.entryDate);
                    return fechaMoment.isBetween(
                        this.dateStart,
                        this.dateEnd,
                        null,
                        "[]"
                    );
                });
            }
        },
        clearFilterDate() {
            if (this.originDataSource.length <= 0) return "";
            this.dataSource = [...this.originDataSource];
            this.originDataSource = [];
        },

        //Convertir fecha de created a UTC-5
        convertToUTC5(date) {
            // const dateMoment = moment(date);
            // const dateUTC5 = dateMoment.subtract(5, 'hours').toISOString();
            const transformedDate = moment(date)
                .utcOffset(-5)
                .format("D MMM, YYYY HH:mm:ss");
            return transformedDate;
        },
        setVariantState(text) {
            return setVariantStateInfo(text);
        },
    },
    components: {
        SearchOutlined,
        EyeOutlined,
        calendarFilter,
    },
});
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
            :row-selection="rowSelection"
            @change="handleChangeSort"
            :loading="loading"
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

            <template #bodyCell="{ column, text }">
                <!-- Search -->

                <span
                    v-if="
                        state.searchText &&
                        state.searchedColumn === column.dataIndex &&
                        column.dataIndex === 'numberEntryClaim'
                    "
                >
                    <template
                        v-for="(fragment, i) in text
                            .toString()
                            .splitT(
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
                            class="highlight-numberEntryClaim fw-medium link-primary"
                        >
                            {{ fragment }}
                        </mark>
                        <template v-else>
                            <span :key="i" class="fw-medium link-primary">
                                {{ fragment }}</span
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
                            .toString()
                            .split(
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

                <template
                    v-if="
                        column.dataIndex === 'numberEntryClaim' &&
                        !state.searchText &&
                        state.searchedColumn !== column.dataIndex
                    "
                >
                    <a class="fw-medium link-primary">
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

                <template v-if="column.dataIndex === 'action'">
                    <a
                        class="fw-medium link-primary text-center actionButtonTableRadicates"
                        :href="`/gestion-documental/radicado/${text}`"
                    >
                        <EyeOutlined />
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
