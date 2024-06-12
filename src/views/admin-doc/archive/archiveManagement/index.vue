<script setup>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import TableArchive from "./components/TableArchives";
import Widget from "@/views/dashboard/projects/widget.vue";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
    <Layout>
        <div>
            <PageHeader title="LISTA DE ENTRADAS" pageTitle="Radicados" />

            <Widget />

            <div>
                <button class="btn btn-danger" @click="() => {
                    router.push(`/expediente/${Math.floor(100000 + Math.random() * 900000)}`)
                }">
                    + Crear Expediente
                </button>
                <TableArchive />
            </div>
        </div>
    </Layout>
</template>

<style scoped>
.footer {
    position: relative;
    left: 0;
    right: 0;
}
</style>
