<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import animationData from "@/components/widgets/msoeawqm.json";
import animationData1 from "@/components/widgets/gsqxdxog.json";
import TableTickets from "@/views/tickets/components/TableTickets";
import ClaimsCounter from "@/views/tickets/components/ClaimsCounter";
import { defineComponent } from "vue";

export default defineComponent({
    name: "List",
    data() {
        return {
            defaultOptions: {
                animationData: animationData,
            },
            defaultOptions1: {
                animationData: animationData1,
            },
        };
    },

    components: {
        Layout,
        PageHeader,
        TableTickets,
        ClaimsCounter,
    },
});
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
