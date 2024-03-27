<script>
import OverviewMain from './components/OverviewMain.vue';
import Layout from "@/layouts/main.vue";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'Overview',
    components: {
        OverviewMain,
        Layout
    }
})
</script>

<template>
    <Layout>
        <OverviewMain/>
    </Layout>
</template>