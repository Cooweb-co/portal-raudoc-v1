<script setup>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import TableTickets from "@/views/tickets/components/TableTickets";
import ClaimsCounter from "@/views/tickets/components/ClaimsCounter";

</script>

<template>
    <Layout>
        <div>
            <PageHeader title="LISTA DE ENTRADAS" pageTitle="Tickets" />

            <ClaimsCounter />

            <TableTickets />
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
