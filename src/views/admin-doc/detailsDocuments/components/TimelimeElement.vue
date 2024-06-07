<script setup>
import { defineProps } from "vue";

defineProps({
    createdAt: String,
    name: String,
    content: {
        type: [String, Array],
        required: true, // si es requerido, puedes quitar esta línea si no lo es
    },
    action: String,
    position: String,
});
</script>
<template>
    <div :class="'timeline-item ' + position">
        <i class="icon ri-stack-line"></i>
        <div class="date">
            <b>{{ action }}</b>
            <p>{{ createdAt }}</p>
        </div>
        <div class="content shadow-none">
            <div class="d-flex">
                <div class="flex-shrink-0">
                    <img
                        src="@/assets/images/users/user-dummy-img.jpg"
                        alt=""
                        class="avatar-sm rounded bg-info"
                    />
                </div>
                <div class="flex-grow-1 ms-3">
                    <h5 class="fs-15 fw-bold">
                        {{ name }}
                        <small class="text-muted fs-13 fw-normal"
                            >{{ createdAt ? "- " + createdAt : "" }}</small
                        >
                    </h5>
                    <div v-if="Array.isArray(content)">
                        <div
                            class="row"
                            v-for="(item, index) in content"
                            :key="index"
                        >
                            <p class="col-sm-5 col-12">
                                {{ item[0] }}
                            </p>
                            <p
                                class="col-sm-6 col-12 text-muted d-flex align-items-center"
                            >
                                {{ item[1] }}
                            </p>
                        </div>
                    </div>
                    <span class="text-muted fs-14 fw-normal" v-else>{{ content }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
