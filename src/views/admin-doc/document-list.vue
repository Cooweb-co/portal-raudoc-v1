<script setup>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { onMounted, ref } from "vue";
import axios from "axios";

const trds = ref({});
const loading = ref(true);
const newDay = ref("")

onMounted(() => {
  let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/TDRS_LIST_V1`,
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
            console.error(error);
        });
  
  loading.value = false;
})

const setNewDay = (day) => {
  newDay.value = day
}

const updateArray = async (i, array) => {
  try {
    array[i].days = newDay.value
    await axios.put('http://127.0.0.1:5001/raudoc-gestion-agil-dev/us-central1/tdrs/', { newTrds: trds.value, company: "BAQVERDE" })
  } catch (error) {
    console.log(error);
  }
}

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
                            <div v-for="(d, i) in c.docs" :key="d">
                                <h5>
                                    <BBadge>{{ d.name }} 
                                      <BBadge variant="light" style="font-size: 13px;" @click="setNewDay(d.days, i, c.docs)">
                                        <a-popover title="Días" trigger="click">
                                          <template #content>
                                            <a-input-group compact>
                                              <a-input v-model:value="newDay" style="width: calc(100% - 100px)" />
                                              <a-button type="primary" @click="updateArray(i, c.docs)">Guardar</a-button>
                                            </a-input-group>
                                          </template>
                                          Días: {{ d.days }}
                                        </a-popover>
                                      </BBadge>
                                    </BBadge>
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
