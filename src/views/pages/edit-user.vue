<script setup>
import Layout from "../../layouts/main.vue";
import PageHeader from "../../components/page-header.vue";
// import { useVuelidate } from "@vuelidate/core";
// import { required, minLength, sameAs, email } from "@vuelidate/validators";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import UserForm from "../../components/user/UserForm.vue";
import { useRouter } from "vue-router";
import axios from "axios";

const loading = ref(false);
const tdrs = ref({});
const router = useRouter();
const getAreas = () => {
  axios
    .request({
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.VUE_APP_CF_BASE_URL}/TDRS_LIST_V1`,
      headers: {
        company: "BAQVERDE",
      },
    })
    .then((response) => {
      tdrs.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};
const userData = ref({});

const createUser = (form) => {
  //CREATE_USER_V1
  loading.value = true;
  axios
    .request({
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.VUE_APP_CF_BASE_URL}/EDIT_USER_V1`,
      headers: {
        company: "BAQVERDE",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        name: form.name,
        identification: form.identification.toString(),
        areaId: form.area,
        email: form.email,
        idRole: form.rol,
      }),
    })
    .then((response) => {
      if (response.status == 200) {
        toast("Usuario editado exitosamente...", {
          type: "success",
          position: "top-right",
          pauseOnHover: false,
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
      } else {
        toast("Error al intentar editar usuario...", {
          type: "error",
          position: "bottom-right",
          pauseOnHover: false,
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
      }
      loading.value = false;
      setTimeout(() => {
        router.push("/administracion/usuarios");
      }, 4000);
    })
    .catch((error) => {
      loading.value = false;
      toast("Error al intentar editar usuario...", {
        type: "error",
        position: "bottom-right",
        pauseOnHover: false,
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
      console.error(error);
    });
};

const getUser = () => {
  try {
    loading.value = true;
    const user = axios.get(
      `${process.env.VUE_APP_CF_BASE_URL}/user/${router.params.userID}`,
      {
        headers: {
          company: "BAQVERDE",
        },
      }
    );
    userData.value = {
      name: user.name,
      identification: user.identification,
      area: user.areaId,
      email: user.email,
      rol: user.idRole,
    };
  } catch (error) {
    toast("Error obteniendo usuario...", {
      type: "error",
      position: "bottom-right",
    });
  } finally {
    loading.value = false;
  }
};

getAreas();
getUser();
</script>
<template>
  <Layout>
    <PageHeader title="Editar usuario" />
    <div class="container" no-body>
      <UserForm
        :loading="loading"
        :is-editing="true"
        :tdrs="tdrs"
        :data="userData"
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
      <BProgress
        variant="warning"
        :max="dismissCountDown"
        :value="countdown"
        height="4px"
      />
    </BAlert>
  </Layout>
</template>
<!-- name, identification, area, email, rol, password -->
