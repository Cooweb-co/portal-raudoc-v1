<script setup>
import Layout from "../../layouts/main.vue";
import PageHeader from "../../components/page-header.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, sameAs, email } from "@vuelidate/validators";
import { ref, reactive, computed } from "vue";
import { toast } from "vue3-toastify";

import axios from "axios";
import { useRouter } from "vue-router";

const formData = reactive({
    name: '',
    identification: '',
    area: '',
    email: '',
    rol: '',
    password: ''
})
const loading = ref(false);
const tdrs = ref({});
const router = useRouter()
const getAreas = () => {
axios
  .request({
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/TDRS_LIST_V1`,
        headers: {
            company: "BAQVERDE",
        }
    })
    .then((response) => {
        tdrs.value = response.data;
    })
    .catch((error) => {
        console.error(error);
    });
}

const createUser = () => {
    //CREATE_USER_V1
    loading.value = true;
    axios
  .request({
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/CREATE_USER_V1`,
        headers: {
            company: "BAQVERDE",
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "name": formData.name,
            "identification": formData.identification.toString(),
            "areaId": formData.area,
            "email": formData.email,
            "password": formData.password,
            "idRole": formData.rol
        })
    })
    .then((response) => {
        if(response.status == 200) {
            toast("Usuario creado exitosamente...", {
                "type": "success",
                "position": "top-right",
                "pauseOnHover": false,
                "autoClose": 5000,
                "dangerouslyHTMLString": true
            })
        }else{
            toast("Error al intentar crear usuario...", {
                "type": "error",
                "position": "bottom-right",
                "pauseOnHover": false,
                "autoClose": 5000,
                "dangerouslyHTMLString": true
            })
        }
        loading.value = false;
        setTimeout(() => {
            router.push('/administration/users');
        }, 4000);
    })
    .catch((error) => {
        loading.value = false;
        toast("Error al intentar crear usuario...", {
                "type": "error",
                "position": "bottom-right",
                "pauseOnHover": false,
                "autoClose": 5000,
                "dangerouslyHTMLString": true
            })
        console.error(error);
    });
}

const v$ = useVuelidate({
    name: { required },
    identification: { required },
    area: { required },
    rol: { required },
    email: { required, email },
    password: {
      required,
      minLength: minLength(8),
      containsUppercase: function (value) {
        return /[A-Z]/.test(value)
      },
      containsLowercase: function (value) {
        return /[a-z]/.test(value)
      },
      containsNumber: function (value) {
        return /[0-9]/.test(value)
      },
      containsSpecial: function (value) {
        return /[#?!@$%^&*-]/.test(value)
      },
    },
    confirmPassword: { required, sameAs: sameAs(computed(() => formData.password)) },
}, formData)

getAreas();
</script>
<template>
    <Layout>
    <PageHeader title="Crear usuario" />
    <div class="container" no-body>
        <BCard class="mt-3" no-body>
            <BCardHeader>
            <h5 class="card-title mb-0 text-muted fw-light fst-italic">
              INFORMACIÓN DEL USUARIO
            </h5>
          </BCardHeader>
          <BCardBody>
            <div class="row">
                <div class="col mb-3">
                    <label class="form-label">Nombre Completo</label>
                    <input type="text" v-model="v$.name.$model" class="form-control" :class="{ 'border border-danger': v$.name.$error }" placeholder="John Doe">
                    <p class="text-danger" :class="{ 'd-none': !v$.name.$error }">
                        Valor incorrecto
                    </p>
                </div>
                <div class="col mb-3">
                    <label for="">Número de identificación</label>
                    <input type="number" v-model="v$.identification.$model" class="form-control" :class="{ 'border border-danger': v$.identification.$error }" placeholder="1234567890">
                    <p class="text-danger" :class="{ 'd-none': !v$.identification.$error }">
                        Valor incorrecto
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col mb-3">
                    <label class="form-label">Área</label>
                    <select v-model="v$.area.$model" class="form-select" :class="{ 'border border-danger': v$.area.$error }" name="" id="">
                        <option value="">Seleccione Área</option>
                        <option v-for="e in tdrs" :key="e" :value="e.id">{{ e.name }}</option>
                    </select>
                    <p class="text-danger" :class="{ 'd-none': !v$.area.$error }">
                        Valor incorrecto
                    </p>
                </div>
                
                <div class="col mb-3">
                    <label class="form-label">Rol</label>
                    <select v-model="v$.rol.$model" class="form-select" :class="{ 'border border-danger': v$.rol.$error }" name="" id="">
                        <option value="">Seleccione Rol</option>
                        <option value="FUNCTIONARY">FUNCIONARIO</option>
                        <option value="BOSS_OF_AREA">JEFE DE AREA</option>
                        <option value="DIRECTOR">DIRECTOR</option>
                        <option value="RADICATOR">RADICADOR</option>
                    </select>
                    <p class="text-danger" :class="{ 'd-none': !v$.rol.$error }">
                        Valor incorrecto
                    </p>
                </div>
            </div>

            <BCard class="mt-2" no-body> </BCard>

            <div class="row mt-4 align-items-start">
                        <div class="col">
                            <div class="row">
                                <div class="col mb-3">
                                    <label for="">Email</label>
                                    <input type="email" v-model="v$.email.$model" class="form-control" :class="{ 'border border-danger': v$.email.$error }" placeholder="m@email.co">
                                    <p class="text-danger" :class="{ 'd-none': !v$.email.$error }">
                                        Valor incorrecto
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col mb-3">
                                    <label for="">Contraseña</label>
                                    <input type="password" v-model="v$.password.$model" class="form-control" :class="{ 'border border-danger': v$.password.$error }">
                                    <p class="text-danger" :class="{ 'd-none': !v$.password.$error }">
                                        Valor incorrecto
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col mb-3">
                                    <label for="">Confirmación de contraseña</label>
                                    <input type="password" v-model="v$.confirmPassword.$model" class="form-control" :class="{ 'border border-danger': v$.confirmPassword.$error }">
                                    <p class="text-danger" :class="{ 'd-none': !v$.confirmPassword.$error }">
                                        Valor incorrecto
                                    </p>
                                </div>
                            </div>
                            <div class="row text-center">
                                <div class="col mb-3 mt-3">
                                    <BOverlay
                                        :show="loading"
                                        rounded
                                        opacity="0.6"
                                        spinner-small
                                        spinner-variant="primary"
                                        class="d-inline-block"
                                    >
                                        <button type="button" class="btn btn-primary px-5" @click="createUser" :disabled="v$.$invalid || loading">Crear</button>
                                    </BOverlay>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <BCard class="bg-primary-subtle text-black-50">
                                <p class="text-break">
                                    Para asegurar la seguridad de tu cuenta, la contraseña debe cumplir con las siguientes reglas:</p>
                                    <p class="text-break">- Mínimo 8 caracteres de longitud.</p>
                                    <p class="text-break">- Debe incluir al menos una letra mayúscula.</p>
                                    <p class="text-break">- Debe contener al menos una letra minúscula.</p>
                                    <p class="text-break">- Incluir al menos un número.</p>
                                    <p class="text-break">- Contener al menos un caracter especial (como @, #, $, %, etc.).</p>

                                    <p class="text-break">Estas reglas ayudan a crear contraseñas fuertes que son más difíciles de adivinar o hackear. Asegúrate de elegir una contraseña que puedas recordar, pero que no sea fácil de deducir para alguien más.
                                </p>
                            </BCard>
                        </div>
                    </div>
          </BCardBody>
            
        </BCard>
    </div>
    <BAlert
    v-model="dismissCountDown"
    dismissible
    variant="warning"
    @close-countdown="countdown = $event"
  >
    <p>This alert will dismiss after {{ countdown / 1000 }} seconds...</p>
    <BProgress variant="warning" :max="dismissCountDown" :value="countdown" height="4px" />
  </BAlert>
    </Layout>
</template>
<!-- name, identification, area, email, rol, password -->