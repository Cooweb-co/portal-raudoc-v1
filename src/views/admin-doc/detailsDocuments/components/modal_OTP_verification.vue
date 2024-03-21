<template>
    <main class="d-flex justify-content-center align-items-center">
        <div
            class="bg-white p-3 rounded-3 shadow-sm border container-form"
            :class="errorForm ? 'errorForm' : ''"
        >
            <p class="text-center text-success">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="122"
                    width="130"
                    viewBox="0 0 640 512"
                >
                    <path
                        :fill="errorForm ? '#E74C3C' : '#32CCFF'"
                        d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0l57.4-43c23.9-59.8 79.7-103.3 146.3-109.8l13.9-10.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176V384c0 35.3 28.7 64 64 64H360.2C335.1 417.6 320 378.5 320 336c0-5.6 .3-11.1 .8-16.6l-26.4 19.8zM640 336a144 144 0 1 0 -288 0 144 144 0 1 0 288 0zm-76.7-43.3c6.2 6.2 6.2 16.4 0 22.6l-72 72c-6.2 6.2-16.4 6.2-22.6 0l-40-40c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L480 353.4l60.7-60.7c6.2-6.2 16.4-6.2 22.6 0z"
                    />
                </svg>
            </p>

            <p class="text-center text-center h5">Por favor revisa tu email</p>

            <p class="text-muted text-center">
                Te enviaremos el código a {{ email }}
            </p>

            <form class="d-flex justify-content-between p-2 align-items-center">
                <input
                    type="text"
                    class="otp-letter-input border-bottom text-center"
                    :class="errorForm ? 'border-danger' : 'border-info'"
                    v-on:keyup="moveToNext(1)"
                    v-model="code1"
                    maxLength="1"
                    id="digit-1-input"
                />

                <input
                    type="text"
                    class="otp-letter-input border-bottom text-center"
                    :class="errorForm ? 'border-danger' : 'border-info'"
                    v-on:keyup="moveToNext(2)"
                    v-model="code2"
                    maxLength="1"
                    id="digit-2-input"
                />

                <input
                    type="text"
                    class="otp-letter-input border-bottom text-center"
                    :class="errorForm ? 'border-danger' : 'border-info'"
                    v-on:keyup="moveToNext(3)"
                    v-model="code3"
                    maxLength="1"
                    id="digit-3-input"
                />

                <input
                    type="text"
                    class="otp-letter-input border-bottom text-center"
                    :class="errorForm ? 'border-danger' : 'border-info'"
                    v-on:keyup="moveToNext(4)"
                    v-model="code4"
                    maxLength="1"
                    id="digit-4-input"
                />

                <input
                    type="text"
                    class="otp-letter-input border-bottom text-center"
                    :class="errorForm ? 'border-danger' : 'border-info'"
                    v-on:keyup="moveToNext(5)"
                    v-model="code5"
                    maxLength="1"
                    id="digit-5-input"
                />

                <input
                    type="text"
                    class="otp-letter-input border-bottom text-center"
                    :class="errorForm ? 'border-danger' : 'border-info'"
                    v-on:keyup="moveToNext(6)"
                    v-model="code6"
                    maxLength="1"
                    id="digit-6-input"
                />
            </form>

            <p v-if="showCounter" class="text-muted text-center">
                Podrás enviar de nuevo el link en {{ counter }} segundos
            </p>

            <p v-else class="text-muted text-center">
                ¿No recibiste el código?
                <button
                    @click="handleSendLink"
                    class="border-0 bg-transparent "
                    :class="errorForm ? 'link-danger text-danger' : 'link-primary text-primary'"
                >
                    Click acá para reenviar el código.
                </button>
            </p>

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
                        @click="validOTP(this.token)"
                    >
                        Verificar
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { toast } from "vue3-toastify";
export default {
    data() {
        return {
            code1: "",
            code2: "",
            code3: "",
            code4: "",
            code5: "",
            code6: "",
            token: "",
            email: "",
            showCounter: false,
            intervalId: null,
            errorForm: false,
            counter: 0,
        };
    },
    async mounted() {
        this.sendCodeToEmail();
        this.getEmail();
    },
    methods: {
        async handleSendLink() {
            this.sendCodeToEmail();
            this.showCounter = true;
            this.startCounter();
        },
        startCounter() {
            this.counter = 60;
            this.intervalId = setInterval(() => {
                if (this.counter > 0) {
                    this.counter--;
                } else {
                    clearInterval(this.intervalId);
                    this.showCounter = false;
                }
            }, 1000);
        },
        async validOTP(code) {
            console.log(code);
            if (code === "334455") {
                this.clearAllInputs();
                this.$emit("handleShowModal", false);
            } else {
                toast.error(`Código inválido`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                this.errorForm = true;
                setTimeout(() => {
                    this.errorForm = false;
                }, 4000);
                this.clearAllInputs();
            }
        },
        getInputElement(index) {
            return document.getElementById("digit-" + index + "-input");
        },
        clearAllInputs() {
            this.code1 = "";
            this.code2 = "";
            this.code3 = "";
            this.code4 = "";
            this.code5 = "";
            this.code6 = "";
        },
        moveToNext(index) {
            if (this.getInputElement(index).value.length === 1) {
                if (index !== 6) {
                    this.getInputElement(index + 1).focus();
                } else {
                    this.getInputElement(index).blur();

                    this.token =
                        this.code1 +
                        this.code2 +
                        this.code3 +
                        this.code4 +
                        this.code5 +
                        this.code6;
                    this.validOTP(this.token);
                }
            }
        },
        handleCancelButton() {
            this.clearAllInputs();
            clearInterval(this.intervalId);
            this.$router.push({ path: "/login" });
        },
        async getEmail() {
            try {
                this.email = "cam*******.co";
            } catch (error) {
                this.errorForm = true;
                setTimeout(() => {
                    this.errorForm = false;
                }, 4000);
                toast.error(`Problemas para obtener el email`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            }
        },
        async sendCodeToEmail() {
            try {
                console.log("Email enviado");
                toast.success(`Email enviado correctamente`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            } catch (error) {
                this.errorForm = true;
                setTimeout(() => {
                    this.errorForm = false;
                }, 4000);
                toast.error(`Problemas al enviar el email, intente más tarde`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            }
        },
    },
};
</script>

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

.container-form {
    width: 35% !important;
}

.otp-letter-input {
    width: 10%;
    height: 80%;
    outline: none;
    border: none;
    font-size: 25px;
    background-color: transparent;
}
.btn {
    height: 50px;
}

@media (max-width: 768px) {
    .otp-letter-input {
        max-width: 100%;
        height: 40px;
    }
    .container-form {
        width: 100% !important;
    }
}
</style>
