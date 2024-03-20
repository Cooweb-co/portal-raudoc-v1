<script setup>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from "axios";
import { ref } from "vue";

const trds = ref({});
let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://us-central1-raudoc-gestion-agil.cloudfunctions.net/TDRS_LIST_V1",
  headers: {
    company: "BAQVERDE",
  },
};

axios
  .request(config)
  .then((response) => {
    trds.value = response.data;
  })
  .catch((error) => {
    console.log(error);
  });
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
          <BCardBody>
            <div class="sitemap-content">
              <BAccordion free v-for="e in trds" :key="e">
                <BAccordionItem>
                  <template #title>
                    <h5 class="mb-0">
                      {{ e.tdrsId }}
                      <BBadge variant="light">#{{ e.id }}</BBadge>
                    </h5>
                  </template>
                  <BAccordion free v-for="i in e.areas" :key="i">
                    <BAccordionItem>
                      <template #title>
                        <h6>
                          {{ i.name }}
                          <BBadge variant="primary">#{{ i.id }}</BBadge>
                        </h6>
                      </template>
                      <BAccordion free v-for="c in i.categories" :key="c">
                        <BAccordionItem>
                          <template #title>
                            <h6>
                              {{ c.name }}
                              <BBadge variant="primary">#{{ c.id }}</BBadge>
                            </h6>
                          </template>
                          <div v-for="d in c.docs" :key="d">
                            <h5>
                              <BBadge>{{ d }}</BBadge>
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
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>
