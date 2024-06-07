<script setup>
import OverviewMain from './components/OverviewMain.vue';
import Layout from "@/layouts/main.vue";

</script>

<template>
    <Layout>
        <OverviewMain :showPrivateClaim="true" />
    </Layout>
</template>