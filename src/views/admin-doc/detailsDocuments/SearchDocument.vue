<script setup>
import { toast } from "vue3-toastify";
import { ref, computed } from "vue";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import { useRouter } from "vue-router";
// import DocumentIcon from "./components/DocumentIcon.vue";
import axios from "axios";
// const emit = defineEmits(["handleShowModal"]);
const id = ref("");
const company = ref("");
const errorForm = ref(false);
const searchLoading = ref(false);
const router = useRouter();

const styleInputForm = computed(() => {
    const styleInput = " border rounded text-center mb-2 w-100";
    const styleError = errorForm.value ? "border-danger" : "border-info";
    return `${styleInput} ${styleError}`;
});

const sendData = () => {
    if (id.value && company.value) {
        searchLoading.value = true;
        axios
            .get(
                `${process.env.VUE_APP_CF_BASE_URL}/CLAIM_LIST_BY_ID_V1/${id.value}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        company: company.value,
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
                searchLoading.value = false;
                router.push(`/r/${company.value}/${response.data.claimId}`);
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        errorForm.value = true;
        toast.error(`Faltan datos.`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        setTimeout(() => (errorForm.value = false), 3000);
    }
};

const handleCancelButton = () => {
    router.push({ path: "/login" });
};
</script>

<template>
    <main class="d-flex justify-content-center align-items-center">
        <div
            class="bg-white p-3 rounded-3 shadow-sm border container-form"
            :class="errorForm ? 'errorForm' : ''"
        >
            <p class="text-center text-success">
                <!-- <img :src="DocumentIcon" alt="Documento Icono"/> -->
                <img src="/img/logo-dark.ebe2f4e5.png" alt="Logo de Raudoc" style="width: 250px; margin: 1.5em 2em;"/>
                <!-- <DocumentIcon
                    :color="errorForm ? 'text-danger' : 'text-info'"
                /> -->
            </p>

            <p class="text-center text-center h6">
                Por favor ingresa el número del radicado
            </p>

            <!-- <p class="text-muted text-center">
                Te enviaremos el código a {{ email }}
            </p> -->

            <form
                class="d-flex flex-column justify-content-between px-2 pt-4 pb-2 align-items-center"
            >
                <input
                    type="text"
                    :class="styleInputForm"
                    v-model="id"
                    placeholder="Ingrese el código del radicado"
                    autocomplete="on"
                />

                <Multiselect
                    v-model="company"
                    :required="true"
                    :close-on-select="true"
                    :searchable="true"
                    :create-option="true"
                    placeholder="Seleccione la compañía"
                    :options="[
                        {
                            value: 'BAQVERDE',
                            label: 'Barranquilla Verde',
                        },
                    ]"
                />
            </form>

            <div class="row pt-4">
                <div class="col-6">
                    <button
                        class="btn btn-outline-secondary w-100"
                        @click="handleCancelButton"
                    >
                        Cancelar
                    </button>
                </div>
                <div class="col-6">
                    <button
                        class="btn w-100"
                        :class="errorForm ? 'btn-danger' : 'btn-primary'"
                        @click="sendData"
                    >
                        <span class="mx-2">Buscar</span>
                        <span
                            v-if="searchLoading"
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-content: center;
}

.errorForm {
    animation: errorForm 1s ease 1;
}
@keyframes errorForm {
    30% {
        transform: scale(1);
    }
    40%,
    60% {
        transform: rotate(-10deg) scale(1);
    }
    50% {
        transform: rotate(10deg) scale(1);
    }
    70% {
        transform: rotate(0deg) scale(1);
    }
    100% {
        transform: scale(1);
    }
}

input {
    outline: none;
    border-style: solid;
    height: 2.5em;
}
</style>
