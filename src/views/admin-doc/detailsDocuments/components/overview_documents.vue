<script>
import overview_documents_elementVue from "./overview_documents_element.vue";

export default {
    props: {
        data: Object,
        files: Array
    },
    components: {
        overview_documents_elementVue,
    },
};
</script>

<template>
    <BTab title="Documentos" class="fw-semibold pt-2">
        <div class="card">
            <div class="card-body">
                <div class="d-flex align-items-center mb-4">
                    <h5 class="card-title flex-grow-1">Documentos</h5>
                </div>
                <BRow>
                    <div class="table-responsive table-card">
                        <table class="table table-borderless align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col">Nombre del Archivo</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col">Nombre del Cliente</th>
                                    <th scope="col">Fecha de Creación</th>
                                    <th scope="col" style="width: 120px">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <overview_documents_elementVue v-for="file in files" :file="file" :id="data.id" :key="file.name" />
                            </tbody>
                        </table>
                    </div>
                    <div class="text-center mt-3">
                        <BLink href="javascript:void(0);" class="text-primary"
                            ><i
                                class="mdi mdi-loading mdi-spin fs-20 align-middle me-2"
                            ></i>
                            Load more
                        </BLink>
                    </div>
                </BRow>
            </div>
        </div>
    </BTab>
</template>