<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";

import Widgets from "./widget.vue";
import Schedules from "./schedule.vue";
// import Project from "./projects.vue";

export default {
  components: {
    Layout,
    PageHeader,
    Widgets,
    Schedules,
    // Project,
    // Task,
    // ActiveProjects,
  },

};
</script>

<template>
  <Layout>
    <PageHeader title="FLUJO DE PETICIONES" pageTitle="Dashboards" />

    <BRow class="project-wrapper">
      <BCol xxl="8">
        <BRow>
          <Widgets />
          <BCol xl="4">
          </BCol>
          <BCol xl="4">
          </BCol>
        </BRow>
        <BRow>
          <BCol xl="12">
            <!-- <Project /> -->
          </BCol>
        </BRow>
      </BCol>

      <BCol xxl="4">
        <Schedules />
      </BCol>
    </BRow>

  </Layout>
</template>