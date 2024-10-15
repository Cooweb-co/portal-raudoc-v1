<script setup>
import Layout from "../../layouts/main.vue";
import PageHeader from "../../components/page-header.vue";
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import UserForm from "../../components/user/UserForm.vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const loading = ref(false);
const tdrs = ref({});
const route = useRoute();
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

const updateUser = async (form) => {
  try {
    loading.value = true;
    await axios.put(
      `${process.env.VUE_APP_CF_BASE_URL}/user`,
      {
        uid: route.params.userID.toString(),
        name: form.name,
        identification: form.identification.toString(),
        areaId: form.area,
        email: form.email,
        idRole: form.rol,
      },
      {
        headers: {
          company: "BAQVERDE",
        },
      }
    );
    toast("Usuario editado exitosamente...", {
      type: "success",
      position: "top-right",
    });
    setTimeout(() => {
      router.push("/administracion/usuarios");
    }, 4000);
  } catch (error) {
    toast("Error al intentar editar usuario...", {
      type: "error",
      position: "bottom-right",
    });
  } finally {
    loading.value = false;
  }
};

const getUser = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get(
      `${process.env.VUE_APP_CF_BASE_URL}/user/${route.params.userID}`,
      {
        headers: {
          company: "BAQVERDE",
        },
      }
    );
    userData.value = {
      name: data.name,
      identification: data.identification,
      area: data.areaId,
      email: data.email,
      rol: data.idRole,
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

onMounted(() => {
  getAreas();
  getUser();
});
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
        @submit="(form) => updateUser(form)"
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
