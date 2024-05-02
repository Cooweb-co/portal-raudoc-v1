<script setup>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { onMounted, ref } from "vue";

const trds = ref({});
const loading = ref(true);
onMounted(() => {
  let data = sessionStorage.getItem("tdrs")
  trds.value = JSON.parse(data);
  loading.value = false;
})

</script>

<template>
  <Layout>
    <PageHeader title="Tipo de documentos" pageTitle="menú" />
    <BRow>
      <BCol lg="12">
        <BCard no-body>
          <BCardHeader>
            <BCardTitle class="mb-0">Areas</BCardTitle>
          </BCardHeader>
          <BOverlay :show="loading" rounded="sm">
          <BCardBody>
            <div class="sitemap-content">
              <BAccordion free v-for="e in trds" :key="e">
                    <BAccordionItem>
                    <template #title>
                        <h5 class="mb-0">
                        {{ e.name }}
                        <BBadge variant="light">#{{ e.id }}</BBadge>
                        </h5>
                    </template>
                    <BAccordion free v-for="i in e.series" :key="i">
                        <BAccordionItem>
                        <template #title>
                            <h6>
                            {{ i.name }}
                            <BBadge variant="primary">#{{ i.id }}</BBadge>
                            </h6>
                        </template>
                        <BAccordion free v-for="c in i.subseries" :key="c">
                            <BAccordionItem>
                            <template #title>
                                <h6>
                                {{ c.name }}
                                <BBadge variant="primary">#{{ c.id }}</BBadge>
                                </h6>
                            </template>
                            <div v-for="d in c.docs" :key="d">
                                <h5>
                                    <BBadge>{{ d.name }} <BBadge variant="light" style="font-size: 13px;">Días: {{ d.days }}</BBadge></BBadge>
                                </h5>
                            </div>
                            </BAccordionItem>
                        </BAccordion>
                        </BAccordionItem>
                    </BAccordion>
                    </BAccordionItem>
              </BAccordion>
            </div>
          </BCardBody>
        </BOverlay>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>
