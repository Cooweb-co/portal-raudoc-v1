<script>
import {
  required,
  email,
  helpers
} from "@vuelidate/validators";

import {
  authMethods,
  authFackMethods,
  notificationMethods,
} from "@/state/helpers";


export default {
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
      processing: false,
      passwordFieldType: "password",
    };
  },
  validations: {
    email: {
      required: helpers.withMessage("Email es requerido", required),
      email: helpers.withMessage("Ingresa un email valido", email),
    },
    password: {
      required: helpers.withMessage("Contreaseña es requerida", required),
    },
  },
  computed: {

  },
  methods: {
    ...authMethods,
    ...authFackMethods,
    ...notificationMethods,

    // async signinapi() {
    //   this.processing = true;
    //   const result = await axios.post('https://api-node.themesbrand.website/auth/signin', {
    //     email: this.email,
    //     password: this.password
    //   });
    //   if (result.data.status == 'errors') {
    //     return this.authError = result.data.data;
    //   }
    //   localStorage.setItem('jwt', result.data.token);
    //   this.$router.push({
    //     path: '/'
    //   });
    // },

    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      this.processing = true;
      this.submitted = true;
      // stop here if form is invalid
      this.$touch;

      if (this.$invalid) {
        return;
      } else {
        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          this.tryingToLogIn = true;
          // Reset the authError if it existed.
          this.authError = null;
          return (
            this.logIn({
              email: this.email,
              password: this.password,
            })
              // eslint-disable-next-line no-unused-vars
              .then((token) => {
                this.tryingToLogIn = false;
                this.isAuthError = false;
                // Redirect to the originally requested page, or to the home page
                this.$router.push({
                  path: '/'
                });
              })
              .catch((error) => {
                this.tryingToLogIn = false;
                this.authError = error ? error : "";
                this.isAuthError = true;
                this.processing = false;
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
    <!-- <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
      <div class="bg-overlay"></div>

     
    </div> -->

    <div class="auth-page-content">
      <BContainer>
        <BRow>
          <BCol lg="12">
            <div class="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                <router-link to="/" class="d-inline-block auth-logo">
                  <img src="@/assets/images/logo-dark.png" alt="" height="80" />
                </router-link>
              </div>
              <p class="mt-3 fs-15 fw-medium">
                Premium Admin & Dashboard Template
              </p>
            </div>
          </BCol>
        </BRow>

        <BRow class="justify-content-center">
          <BCol md="8" lg="6" xl="5">
            <BCard no-body class="mt-4">
              <BCardBody class="p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">Bienvenidos a RauDoc</h5>
                  <p class="text-muted">Ingresa tus credenciales para iniciar sesión</p>
                </div>
                <div class="p-2 mt-4">
                  <b-alert v-model="authError" variant="danger" class="mt-3" dismissible>{{ authError }}</b-alert>

                  <div>

                  </div>

                  <form @submit.prevent="tryToLogIn">
                    <div class="mb-3">
                      <label for="email" class="form-label">Email</label>
                      <input type="email" class="form-control" id="email" placeholder="Enter email" v-model="email" />
                      <div class="invalid-feedback">
                        <span></span>
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="float-end">
                        <router-link to="/forgot-password" class="text-muted">Olvidaste contraseña?</router-link>
                      </div>
                      <label class="form-label" for="password-input">Contraseña</label>
                      <div class="position-relative auth-pass-inputgroup mb-3">
                        <input :type="passwordFieldType"  v-model="password" class="form-control pe-5" placeholder="Ingresa contraseña"
                          id="password-input" />
                        <BButton variant="link" @click="passwordFieldType = passwordFieldType === 'password' ? 'text' : 'password'" class="position-absolute end-0 top-0 text-decoration-none text-muted"
                          type="button" id="password-addon">
                          <i class="ri-eye-fill align-middle"></i>
                        </BButton>
                        <div class="invalid-feedback">
                          <span></span>
                        </div>
                      </div>
                    </div>

                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                      <label class="form-check-label" for="auth-remember-check">Recordar</label>
                    </div>

                    <div class="mt-4">
                      
                      <BButton variant="primary" class="w-100 btn btn-primary waves-effect waves-light" type="submit" @click="tryToLogIn" :disabled="processing">
                        {{ processing ? "Procesando..." : "Ingresar" }}
                      </BButton>
                    </div>

                    <div class="mt-4 text-center">
                      <div class="signin-other-title">
                        <h5 class="fs-13 mb-4 title">Ingresar con</h5>
                      </div>
                      <div>
                        <BButton variant="primary" type="button" class="btn btn-primary btn-icon">
                          <i class="ri-microsoft-fill fs-16"></i>
                        </BButton>
                        <BButton variant="danger" type="button" class="btn btn-danger btn-icon ms-1">
                          <i class="ri-google-fill fs-16"></i>
                        </BButton>
                        <!-- <BButton variant="dark" type="button" class="btn btn-dark btn-icon ms-1">
                          <i class="ri-github-fill fs-16"></i>
                        </BButton>
                        <BButton variant="info" type="button" class="btn btn-info btn-icon ms-1">
                          <i class="ri-twitter-fill fs-16"></i>
                        </BButton> -->
                      </div>
                    </div>
                  </form>
                </div>
              </BCardBody>
            </BCard>

            <!-- <div class="mt-4 text-center">
              <p class="mb-0">
                No tienes cuenta aún ?
                <router-link to="/register" class="fw-semibold text-primary
                  text-decoration-underline">
                  Registarse
                </router-link>
              </p>
            </div> -->
          </BCol>
        </BRow>
      </BContainer>
    </div>

    <footer class="footer">
      <BContainer>
        <BRow>
          <BCol lg="12">
            <div class="text-center">
              <p class="mb-0 text-muted">
                &copy; {{ new Date().getFullYear() }} RauDoc. Powered by
                <i class="mdi mdi-heart text-danger"></i> by CooWeb
              </p>
            </div>
          </BCol>
        </BRow>
      </BContainer>
    </footer>
  </div>
</template>