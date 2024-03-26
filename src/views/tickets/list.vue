<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import animationData from "@/components/widgets/msoeawqm.json";
import animationData1 from "@/components/widgets/gsqxdxog.json";
import tableTickets from "./components/tableTickets.vue";
import { CountTo } from "vue3-count-to";
import axios from "axios";

export default {
    data() {
        return {
            defaultOptions: {
                animationData: animationData,
            },
            defaultOptions1: {
                animationData: animationData1,
            },

            cardsData: [
                // {
                //     title: "Entradas Totales",
                //     quantity: 547,
                //     percent: "10.00%",
                // },
                // {
                //     title: "Salidas Totales",
                //     quantity: 124,
                //     percent: "10.00%",
                // },
                // {
                //     title: "Pendientes",
                //     quantity: 107,
                //     percent: "10.00%",
                // },
                // {
                //     title: "No requiere respuesta",
                //     quantity: 15,
                //     percent: "10.00%",
                // },
            ],
        };
    },

    async mounted() {
        try {
            // this.loading = true;
        const headers = {
            company: "BAQVERDE",
            // "Content-Type": "application/json",
        };
        await axios
            .get(
                "https://us-central1-raudoc-gestion-agil.cloudfunctions.net/getCountClims'",
                { headers }
            )
            .then((response) => {
                console.log(response);
            });
        } catch (error) {
            console.log(error)
        }
    },

    components: {
        Layout,
        PageHeader,
        tableTickets,
        CountTo,
    },
};
</script>

<template>
    <Layout>
        <div>
            <PageHeader title="LISTA DE ENTRADAS" pageTitle="Tickets" />
            <BRow>
                <BCol v-for="item in cardsData" :key="item" xxl="3" sm="6">
                    <BCard no-body class="card-animate">
                        <BCardBody>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <p class="fw-medium text-muted mb-0">
                                        {{ item.title }}
                                    </p>
                                    <h2 class="mt-4 ff-secondary fw-semibold">
                                        <count-to
                                            :duration="1000"
                                            :startVal="0"
                                            :endVal="item.quantity"
                                        ></count-to>
                                    </h2>
                                    <!-- <p class="mb-0 text-muted">
                                        <BBadge
                                            class="bg-light text-success mb-0"
                                        >
                                            <i
                                                class="ri-arrow-up-line align-middle"
                                            ></i>
                                            {{ item.percent }}
                                        </BBadge>
                                        vs. mes anterior
                                    </p> -->
                                </div>
                                <div>
                                    <div class="avatar-sm flex-shrink-0">
                                        <span
                                            class="avatar-title bg-primary-subtle text-primary rounded-circle fs-4"
                                        >
                                            <i class="ri-ticket-2-line"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </BCardBody>
                    </BCard>
                </BCol>
            </BRow>

            <tableTickets />
        </div>
    </Layout>
</template>
<style>
.footer {
    position: relative;
    left: 0;
    right: 0;
}
</style>
