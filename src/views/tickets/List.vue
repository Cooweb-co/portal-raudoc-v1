<script setup>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import TableDocuments from "@/views/tickets/components/TableDocuments";
// import ClaimsCounter from "@/views/tickets/components/ClaimsCounter";
import Widget from "@/views/dashboard/projects/widget.vue";

</script>

<template>
    <Layout>
        <div>
            <PageHeader title="LISTA DE ENTRADAS" pageTitle="Radicados" />

            <Widget />

            <TableDocuments />
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
