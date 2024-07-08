<script>
import { authMethods } from "@/state/helpers";
import { required, email, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { toast } from "vue3-toastify";

export default {
    setup() {
        return { v$: useVuelidate() };
    },
    validations: {
        email: {
            required: helpers.withMessage("Email is required", required),
            email: helpers.withMessage("Please enter valid email", email),
        },
    },
    data() {
        return {
            email: "",
            submitted: false,
            error: null,
            tryingToReset: false,
            isResetError: false,
            // defaultOptions: { animationData: animationData },
        };
    },
    methods: {
        ...authMethods,
        // Try to register the user in with the email, fullname
        // and password they provided.
        tryToReset() {
            this.submitted = true;
            // stop here if form is invalid
            this.v$.$touch();

            if (this.v$.$invalid) {
                return;
            } else {
                if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
                    this.tryingToReset = true;
                    // Reset the authError if it existed.
                    this.error = null;
                    return (
                        this.resetPassword({
                            email: this.email,
                        })
                            // eslint-disable-next-line no-unused-vars
                            .then((token) => {
                                this.tryingToReset = false;
                                this.isResetError = false;
                                this.error = null;
                                toast.success("¡Enlace de recuperación enviado correctamente!", {
                                    position: toast.POSITION.TOP_RIGHT,
                                    autoClose: 3000,
                                });
                            })
                            .catch((error) => {
                                this.tryingToReset = false;
                                this.error = error ? error : "";
                                this.isResetError = true;
                                console.error(error);
                            })
                    );
                }
            }
        },
    },
};
</script>

<template>
    <div class="auth-page-wrapper pt-5">
        <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
            <div class="bg-overlay"></div>

            <div class="shape">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 1440 120"
                >
                    <path
                        d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"
                    ></path>
                </svg>
            </div>
        </div>

        <div class="auth-page-content">
            <BContainer>
                <BRow class="justify-content-center">
                    <BCol md="8" lg="6" xl="5">
                        <BCard no-body class="mt-4">
                            <BCardBody class="p-5">
                                <div class="text-center text-white-50">
                                    <div>
                                        <router-link
                                            to="/"
                                            class="d-inline-block auth-logo"
                                        >
                                            <img
                                                src="@/assets/images/logo-dark.png"
                                                alt=""
                                                height="50"
                                            />
                                        </router-link>
                                    </div>
                                </div>

                                <div class="mt-4">
                                    <h5 class="text-primary">
                                        Restablece tu contraseña
                                    </h5>
                                    <p class="text-muted mt-4">
                                        Escribe tu correo electrónico y te
                                        enviaremos un enlace para restablecer tu
                                        contraseña
                                    </p>
                                </div>

                                <div class="mt-4">
                                    <BAlert
                                        v-model="isResetError"
                                        class="mb-4"
                                        variant="danger"
                                        dismissible
                                        >{{ error }}</BAlert
                                    >
                                    <form @submit.prevent="tryToReset">
                                        <div class="mb-4">
                                            <label class="form-label"
                                                >Correo electrónico</label
                                            >
                                            <input
                                                type="email"
                                                v-model="email"
                                                class="form-control"
                                                id="email"
                                                :class="{
                                                    'is-invalid': isResetError,
                                                }"
                                                :disabled="tryingToReset"
                                                placeholder="Ingresa tu correo electrónico"
                                            />
                                            <div
                                                v-for="(item, index) in v$.email
                                                    .$errors"
                                                :key="index"
                                                class="invalid-feedback"
                                            >
                                                <span v-if="item.$message">{{
                                                    item.$message
                                                }}</span>
                                            </div>
                                        </div>

                                        <div class="text-center mt-4">
                                            <BButton
                                                variant="success"
                                                class="w-100"
                                                type="submit"
                                                :disabled="tryingToReset"
                                            >
                                                Enviar enlace de recuperación
                                                <span
                                                    v-if="tryingToReset"
                                                    class="spinner-border spinner-border-sm ms-1"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            </BButton>
                                        </div>
                                    </form>
                                </div>
                            </BCardBody>
                        </BCard>

                        <div class="text-center">
                            <p class="mb-0">
                                <router-link
                                    to="/login"
                                    class="fw-semibold text-primary text-decoration-underline"
                                >
                                    Iniciar sesión
                                </router-link>
                            </p>
                        </div>
                    </BCol>
                </BRow>
            </BContainer>
        </div>

        <footer class="footer relative">
            <BContainer>
                <BRow>
                    <BCol lg="12">
                        <div class="text-center">
                            <p class="mb-0 text-muted">
                                &copy; {{ new Date().getFullYear() }} Raudoc.
                                Powered by
                                <i class="mdi mdi-heart text-danger"></i> by
                                CooWeb
                            </p>
                        </div>
                    </BCol>
                </BRow>
            </BContainer>
        </footer>
    </div>
</template>
