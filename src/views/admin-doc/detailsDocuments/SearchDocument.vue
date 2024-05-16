<script setup>
import { toast } from "vue3-toastify";
import { ref, computed } from "vue";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import { useRouter } from "vue-router";
import DocumentIcon from "./components/DocumentIcon.vue";

// const emit = defineEmits(["handleShowModal"]);
const id = ref("");
const company = ref("");
const loading = ref(false);
const errorForm = ref(false);


const router = useRouter();

const styleInputForm = computed(() => {
    const styleInput = " border rounded text-center mb-2 w-100";
    const styleError = errorForm.value ? "border-danger" : "border-info";
    return `${styleInput} ${styleError}`;
});

const sendData = () => {
    if(id.value && company.value) {
        loading.value = true
        router.push(`/r/${company.value}/${id.value}`)
    }
    else {
        errorForm.value = true
        toast.error(`Faltan datos.`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        setTimeout(() => errorForm.value = false, 3000)
    }
}

const handleCancelButton = () => {
    router.push({ path: "/login" });
};
//     sendCodeToEmail();
//     showCounter.value = true;
//     startCounter();
// };
// const startCounter = () => {
//     counter.value = 60;
//     intervalId.value = setInterval(() => {
//         if (counter.value > 0) {
//             counter.value--;
//         } else {
//             clearInterval(intervalId.value);
//             showCounter.value = false;
//         }
//     }, 1000);
// };
// const validOTP = async (code) => {
//     if (reCaptcha.value) {
//         if (code === "334455") {
//             clearAllInputs();
//             emit("handleShowModal", false);
//         } else {
//             toast.error(`Código inválido`, {
//                 position: toast.POSITION.TOP_RIGHT,
//                 autoClose: 3000,
//             });
//             errorForm.value = true;
//             setTimeout(() => {
//                 errorForm.value = false;
//             }, 4000);
//             clearAllInputs();
//         }
//     } else {
//         toast.error(`Has clic en la casilla no soy un robot.`, {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 3000,
//         });
//         errorForm.value = true;
//         setTimeout(() => {
//             errorForm.value = false;
//         }, 4000);
//     }
// };
// const getInputElement = (index) => {
//     return document.getElementById("digit-" + index + "-input");
// };
// const clearAllInputs = () => {
//     code1.value = "";
//     code2.value = "";
//     code3.value = "";
//     code4.value = "";
//     code5.value = "";
//     code6.value = "";
// };

// const clearPreviousVModelInput = (index) => {
//     switch (index) {
//         case 2:
//             code1.value = "";
//             break;
//         case 3:
//             code2.value = "";
//             break;
//         case 4:
//             code3.value = "";
//             break;
//         case 5:
//             code4.value = "";
//             break;
//         case 6:
//             code5.value = "";
//             break;
//         default:
//             break;
//     }
// };
// const moveToNextOrPrevious = (index, event) => {
//     if (event.which == 8) {
//         if (index !== 1) {
//             const previousInput = getInputElement(index - 1);
//             clearPreviousVModelInput(index)
//             previousInput.value = "";
//             previousInput.focus();
//         }
//     }
//     if (getInputElement(index).value.length === 1) {
//         if (index !== 6) {
//             getInputElement(index + 1).focus();
//         } else {
//             getInputElement(index).blur();

//             token.value =
//                 code1.value +
//                 code2.value +
//                 code3.value +
//                 code4.value +
//                 code5.value +
//                 code6.value;
//             validOTP(token.value);
//         }
//     }
// };

// const getEmail = async () => {
//     try {
//         email.value = "cam*******.co";
//     } catch (error) {
//         errorForm.value = true;
//         setTimeout(() => {
//             errorForm.value = false;
//         }, 4000);
//         toast.error(`Problemas para obtener el email`, {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 3000,
//         });
//     }
// };
// const sendCodeToEmail = async () => {
//     try {
//         toast.success(`Email enviado correctamente`, {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 3000,
//         });
//     } catch (error) {
//         errorForm.value = true;
//         setTimeout(() => {
//             errorForm.value = false;
//         }, 4000);
//         toast.error(`Problemas al enviar el email, intente más tarde`, {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 3000,
//         });
//     }
// };
</script>

<template>
    <main class="d-flex justify-content-center align-items-center">
        <div
            class="bg-white p-3 rounded-3 shadow-sm border container-form"
            :class="errorForm ? 'errorForm' : ''"
        >
            <p class="text-center text-success">
                <!-- <img :src="DocumentIcon" alt="Documento Icono" style="color: aqua;"/> -->
                <DocumentIcon :color="errorForm ? 'text-danger': 'text-info'"/>
            </p>

            <p class="text-center text-center h5">
                Por favor ingresa los datos de tu petición
            </p>

            <!-- <p class="text-muted text-center">
                Te enviaremos el código a {{ email }}
            </p> -->

            <form class="d-flex flex-column justify-content-between p-2 align-items-center">
                <input type="text" :class="styleInputForm" v-model="id" placeholder="Ingrese el código del radicado"/>

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

            <div class="row pt-5">
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
                        Verificar
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
}

</style>
