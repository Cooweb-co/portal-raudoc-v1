<script setup>
import TimelimeElement from "./TimelimeElement.vue";
import { defineProps, onMounted, ref } from "vue";
import axios from "axios";

const props = defineProps({
    numberClaim: String,
    showPrivateClaim: Boolean,
    data: Object,
});

const company = ref("BAQVERDE");
const loading = ref(false);
const data = ref(null);
const dataLength = ref(0);

onMounted(async () => {
    loading.value = true;
    if (props?.numberClaim && props?.data?.id) {
        const requestData = {
            isPrivate: props?.showPrivateClaim,
            claimId: props?.data?.id,
        };
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${process.env.VUE_APP_CF_BASE_URL}/tracking/get-by-claim-id/`,
            headers: {
                Accept: "/",
                company: company.value,
                "Content-Type": "application/json",
            },
            data: requestData,
        };

        try {
            const response = await axios.request(config);
            data.value = response.data;
            dataLength.value = data.value.length;
        } catch (error) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    }
});

// Methods
function evenOrOdd(number) {
    return number % 2 === 0 ? "right" : "left";
}
</script>

<template>
    <div>
        <div
            v-if="loading"
            class="d-flex justify-content-center align-items-center w-100 h-100"
        >
            <a-skeleton :paragraph="{ rows: 5 }" />
        </div>
        <div
            v-else-if="dataLength === 0 || !data"
            class="d-flex justify-content-center align-items-center w-100 h-100"
        >
            <h3 class="text-center fs-3 text-muted fst-italic mt-2">
                Este documento no posee un historial.
            </h3>
        </div>
        <div class="timeline" v-else>
            <TimelimeElement
                v-for="(item, index) in data"
                :key="index"
                :createdAt="item.createdAt"
                :position="evenOrOdd(index + 1)"
                :name="item.name"
                :action="item.action"
                :content="item.content || 'No se encontraron detalles'"
            />
            <!-- <TimelimeElement
                :createdAt="''"
                :position="evenOrOdd(dataLength + 1)"
                :name="'Sistema'"
                :action="'Iniciado'"
                :content="
                    'Ha iniciado el proceso al siguiente documento ' +
                    props.numberClaim +
                    ', en el transcurso de los días se ira actualizando el estado del documento.'
                "
            /> -->
        </div>
    </div>
</template>
