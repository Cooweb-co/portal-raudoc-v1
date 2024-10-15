<script setup>
import Layout from "../../layouts/main.vue";
import PageHeader from "../../components/page-header.vue";
// import { useVuelidate } from "@vuelidate/core";
// import { required, minLength, sameAs, email } from "@vuelidate/validators";
import { ref, } from "vue";
import { toast } from "vue3-toastify";
import UserForm from "../../components/user/UserForm.vue";

import axios from "axios";
import { useRouter } from "vue-router";
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

const createUser = (form) => {
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
            "name": form.name,
            "identification": form.identification.toString(),
            "areaId": form.area,
            "email": form.email,
            "password": form.password,
            "idRole": form.rol
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
            router.push('/administracion/usuarios');
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
getAreas();
</script>
<template>
    <Layout>
    <PageHeader title="Crear usuario" />
    <div class="container" no-body>
        <UserForm 
            :loading="loading"
            :is-editing="false"
            :tdrs="tdrs"
            @submit="(form) => createUser(form)"
        />
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