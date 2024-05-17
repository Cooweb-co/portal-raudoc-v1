<script setup>
import OverviewDocumentsElement from "./OverviewDocumentsElement.vue";

import { defineProps } from "vue";


const props = defineProps({
    data: Object,
    files: Array,
    loading: Boolean,
    title: String,
});
const typeDocument = props.title == 'Documentos de salida' ? 'success':'primary'
</script>

<template>
    <a-skeleton v-if="loading" :paragraph="{ rows: 3 }" active x />
    <div v-else class="card">
        <div class="card-body">
            <div class="d-flex align-items-center mb-4">
                <h5 class="card-title flex-grow-1">{{ title }}</h5>
            </div>
            <BRow>
                <div class="table-responsive table-card p-0">
                    <table
                        class="table table-borderless align-middle mb-0 p-0"
                        style="width: 100% !important"
                    >
                        <thead class="table-light">
                            <tr>
                                <th scope="col">Nombre del Archivo</th>
                                <th scope="col">Tipo</th>
                                <th scope="col">Fecha de Creación</th>
                                <th scope="col" style="width: 120px">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <OverviewDocumentsElement
                                v-for="file in files"
                                :file="file"
                                :id="data.id"
                                :key="file.name"
                                v-show="files"
                                :typeDocument="typeDocument"
                            />
                            <tr v-show="!files || files.length == 0" class="w-100">
                                <td colspan="5">
                                    <h6 class="w-100 text-center">
                                        No hay archivos
                                    </h6>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- <div class="text-center mt-3">
                        <BLink href="javascript:void(0);" class="text-primary"
                            ><i
                                class="mdi mdi-loading mdi-spin fs-20 align-middle me-2"
                            ></i>
                            Load more
                        </BLink>
                    </div> -->
            </BRow>
        </div>
    </div>
</template>

<style scoped>
.table-responsive {
    margin: 0 !important;
}
</style>
