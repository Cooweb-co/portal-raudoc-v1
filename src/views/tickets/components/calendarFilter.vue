<template>
    <div class="containerCalendar">
        <flat-pickr
            v-model="filterdate"
            :config="rangeDateconfig"
            class="form-control bg-light border-light me-2"
            placeholder="Seleccione fecha"
        ></flat-pickr>
        <BButton
            type="button"
            variant="primary"
            class="w-100 ms-2"
            @click="SearchData"
        >
            <i class="ri-equalizer-fill me-1 align-bottom"></i>
            Filtros
        </BButton>
        <BButton
            type="button"
            variant="secondary"
            class="w-100 ms-2"
            @click="clearFilter()"
        >
            Limpiar filtro de fechas
        </BButton>
    </div>
</template>

<style>
.containerCalendar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1em;
}
</style>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
export default {
    data() {
        return {
            rangeDateconfig: {
                wrap: true,
                altFormat: "M j, Y",
                altInput: true,
                dateFormat: "d M, Y",
                mode: "range",
            },
            filterdate: null,
        };
    },
    components: {
        flatPickr,
    },
    methods: {
        SearchData() {
            this.$emit("filterDate", this.filterdate);
        },
        clearFilter() {
            this.clearFilterDate()
            this.filterdate = null
        }
    },
    props: {
        clearFilterDate: {
            type: Function,
            required: true,
        },
    },
};
</script>
