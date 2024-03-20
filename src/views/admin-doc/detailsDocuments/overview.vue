<template>
    <Layout>
        <overview_main/>
    </Layout>
</template>
<script>
import overview_main from './components/overview_main.vue';
import Layout from "@/layouts/main.vue";

export default {
    components: {
        overview_main,
        Layout
    }
}
</script>