<script setup>
import { CountTo } from "vue3-count-to";
import { defineProps, ref } from "vue";
const props = defineProps(["cardsData"]);

const cardsData = ref(props.cardsData);
console.log(cardsData.value)
</script>

<template>
    <BCol v-for="(cardData, i) in cardsData" :key="i" xxl="3" sm="6">
        <BCard no-body class="card-animate">
            <BCardBody>
                <div class="d-flex justify-content-between">
                    <div>
                        <p class="fw-medium text-muted mb-0">
                            {{ cardData.value }}
                        </p>
                        <h2 class="mt-4 ff-secondary fw-semibold">
                            <count-to
                                :duration="1000"
                                :startVal="0"
                                :endVal="cardData.count"
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
</template>
