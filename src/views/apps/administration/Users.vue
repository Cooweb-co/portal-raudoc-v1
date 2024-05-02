<script setup>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from "axios";
import Modal from "../../modals/Modal.vue";
import { reactive, computed, onMounted, watch, ref } from "vue";
import { MESSAGE_REQUIRED, MESSAGE_EMAIL } from "../../../constants/rules.ts";
import useVuelidate from "@vuelidate/core";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";

let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.VUE_APP_CF_BASE_URL}/USERS_LIST_V1`,
    headers: {
        company: "BAQVERDE",
    },
};

const rules = {
    names: { required: MESSAGE_REQUIRED },
    rol: { required: MESSAGE_REQUIRED },
    email: { required: MESSAGE_REQUIRED, MESSAGE_EMAIL },
};

const form = reactive({
    names: "",
    rol: "",
    email: "",
});

const v$ = useVuelidate(rules, form);
const searchQuery = ref(null);
const page = ref(1);
const perPage = ref(8);
const pages = ref([]);
const userList = ref([]);
const initialUserList = ref([]);
const loading = ref(false);
const select = ref("TODOS");
const showModal = ref(false);

const displayedPosts = computed(() => paginate(userList.value));
const resultQuery = computed(() => {
    if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase();
        return displayedPosts.value.filter((data) => {
            return (
                data.name.toLowerCase().includes(search) ||
                `${data.identification}`.includes(search) ||
                data.email.toLowerCase().includes(search)
            );
        });
    } else {
        return displayedPosts.value;
    }
});

const roles = [
    {
        label: "Director",
        value: "DIRECTOR",
    },
    {
        label: "ADMIN",
        value: "ADMIN",
    },
    {
        label: "Jefe de area",
        value: "BOSS_OF_AREA",
    },
    {
        label: "Funcionario",
        value: "FUNCTIONARY",
    },
    {
        label: "Radicador",
        value: "DOCUMENTER",
    },
];

watch(userList, () => {
    setPages();
});

watch(select, () => {
    if (select.value == "TODOS") userList.value = initialUserList.value;
    else {
        userList.value = initialUserList.value.filter(
            (user) => user.rol == select.value
        );
    }
});

onMounted(() => {
    loading.value = true;
    document.querySelectorAll(".custom-toggle").forEach((item) => {
        item.addEventListener("click", function () {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            } else {
                item.classList.add("active");
            }
        });
    });
    axios
        .request(config)
        .then((response) => {
            userList.value = response.data;
            initialUserList.value = response.data;
            loading.value = false;
        })
        .catch((error) => {
            loading.value = false;
            console.log(error);
        });
});

function setPages() {
    let numberOfPages = Math.ceil(userList.value.length / perPage.value);
    pages.value = [];
    for (let index = 1; index <= numberOfPages; index++) {
        pages.value.push(index);
    }
}

function paginate(userList) {
    let from = page.value * perPage.value - perPage.value;
    let to = page.value * perPage.value;
    return userList.slice(from, to);
}

async function handleSubmit() {
    try {
        if (v$.$invalid) {
            return;
        } else {
            console.log(form.names, form.email, form.rol);
        }
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <Modal
        v-if="showModal"
        title="Nuevo usuario"
        size="small"
        :hideIconClose="true"
        @close="showModal = false"
    >
        <template #content>
            <form
                @submit.prevent="handleSubmit"
                class="d-flex flex-column justify-content-center gap-3"
            >
                <label for="username" class="form-label fw-bold"
                    >Nombre completo
                    <span class="text-danger fw-bold">*</span></label
                >
                <input
                    type="text"
                    class="form-control"
                    v-model="form.names"
                    id="username"
                    placeholder="Ingrese su nombre completo"
                />
                <label for="email" class="form-label fw-bold"
                    >Email <span class="text-danger fw-bold">*</span></label
                >
                <input
                    type="email"
                    class="form-control"
                    v-model="form.email"
                    id="email"
                    placeholder="Ingrese su email"
                />
                <label class="form-label fw-bold">Área</label>
                <Multiselect
                    v-model="form.rol"
                    :required="true"
                    :close-on-select="true"
                    :searchable="true"
                    placeholder="Escoja el rol"
                    :options="roles"
                />
                <input
                    type="submit"
                    value="Crear usuario"
                    class="btn btn-primary"
                />
            </form>
        </template>
    </Modal>
    <Layout>
        <PageHeader title="Gestión de usuarios" pageTitle="Lista de usuarios" />
        <BRow class="g-4 mb-4">
            <BCol sm="auto">
                <div>
                    <BLink
                        href="#!"
                        class="btn btn-primary"
                        @click="showModal = true"
                        ><i class="ri-add-line align-bottom me-1"></i> Agregar
                        usuario</BLink
                    >
                </div>
            </BCol>
            <BCol sm>
                <div class="d-md-flex justify-content-sm-end gap-2">
                    <div class="search-box ms-md-2 flex-shrink-0 mb-3 mb-md-0">
                        <input
                            type="text"
                            class="form-control"
                            id="searchJob"
                            autocomplete="on"
                            placeholder="Nombre o designación"
                            v-model="searchQuery"
                        />
                        <i class="ri-search-line search-icon"></i>
                    </div>
                    <div class="w-md">
                        <select
                            class="form-select"
                            data-choices
                            data-choices-search-false
                            v-model="select"
                        >
                            <option value="TODOS" selected>Todos</option>
                            <option value="DIRECTOR">Director</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="BOSS_OF_AREA">Jefe de area</option>
                            <option value="FUNCTIONARY">Funcionario</option>
                            <option value="DOCUMENTER">
                                Radicador
                            </option>
                        </select>
                    </div>
                </div>
            </BCol>
        </BRow>

        <BRow class="gy-2 mb-2" id="candidate-list">
            <BCol lg="12">
                <table class="table">
                    <thead class="table-light">
                        <tr>
                            <th scope="col">USUARIO</th>
                            <th scope="col">NOMBRE COMPLETO</th>
                            <th scope="col">PERFIL</th>
                            <th scope="col">CORREO</th>
                        </tr>
                    </thead>
                    <tbody v-if="loading">
                        <tr>
                            <td>
                                <a-skeleton
                                    :loading="loading"
                                    :active="loading"
                                />
                            </td>
                            <td>
                                <a-skeleton
                                    :loading="loading"
                                    :active="loading"
                                />
                            </td>
                            <td>
                                <a-skeleton
                                    :loading="loading"
                                    :active="loading"
                                />
                            </td>
                            <td>
                                <a-skeleton
                                    :loading="loading"
                                    :active="loading"
                                />
                            </td>
                        </tr>
                    </tbody>
                    <tbody
                        v-else
                        v-for="(data, index) of resultQuery"
                        :key="index"
                    >
                        <tr>
                            <td>{{ data.identification }}</td>
                            <td>{{ data.name }}</td>
                            <td>
                                <span
                                    class="badge"
                                    :class="{
                                        'bg-primary-subtle text-primary':
                                            data.rol == 'DIRECTOR' ||
                                            data.rol == 'SUPER ADMIN',
                                        'bg-danger-subtle text-danger':
                                            data.rol == 'BOSS_OF_AREA',
                                        'bg-success-subtle text-success':
                                            data.rol == 'FUNCTIONARY',
                                        'bg-info-subtle text-info':
                                            data.rol == 'SUPERVISOR DE SISTEMA',
                                        'bg-warning-subtle text-warning':
                                            data.rol ==
                                            'ADMINISTRADOR DE SISTEMA',
                                    }"
                                    >{{ data.rol }}</span
                                >
                            </td>
                            <td>{{ data.email }}</td>
                        </tr>
                    </tbody>
                </table>
                <!-- <BCard no-body class="mb-0">
          <BCardBody>
            <div class="d-lg-flex align-items-center">
              <div class="flex-shrink-0">
                <div class="avatar-sm rounded">
                  <img :src="data.img" alt="" class="member-img img-fluid d-block rounded">
                </div>
              </div>
              <div class="ms-3">
                <router-link to="/pages/profile">
                  <h5 class="fs-16 mb-2">{{ data.name }}</h5>
                </router-link>
                <p class="text-muted mb-0">{{ data.id_number }}</p>
              </div>
              <div class="d-flex gap-4 mt-0 text-muted">
                <div v-for="design in data.designation" :key="design">
                  
                  <span class="badge" :class="{
                    'bg-success-subtle text-success': design == 'ASESOR',
                    'bg-danger-subtle text-danger': design == 'REDICADOR',
                    'bg-primary-subtle text-primary': design == 'ADMIN EMPRESA' || design == 'SUPER ADMIN',
                    'bg-warning-subtle text-warning': design == 'ADMINISTRADOR DE SISTEMA',
                    'bg-info-subtle text-info': design == 'SUPERVISOR DE SISTEMA',
                  }">{{ design }}</span>
                </div>
              </div>
              <div>
                <BLink href="#!" class="btn btn-soft-success me-1">View Details</BLink>
                <BLink href="#!" class="btn btn-ghost-danger btn-icon custom-toggle"
                  :class="{ 'active': data.bookmark == 'true', '': data.bookmark == 'false' }" data-bs-toggle="button"
                  aria-pressed="false">
                  <span class="icon-on"><i class="ri-bookmark-line align-bottom"></i></span>
                  <span class="icon-off"><i class="ri-bookmark-3-fill align-bottom"></i></span>
                </BLink>
              </div>
            </div>
          </BCardBody>
        </BCard> -->
            </BCol>
        </BRow>

        <BRow class="g-0 justify-content-end mb-4" id="pagination-element">
            <BCol sm="6">
                <div
                    class="pagination-block pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0"
                    v-if="pages.length > 1"
                >
                    <div class="page-item">
                        <BLink
                            href="#"
                            class="page-link"
                            id="page-prev"
                            :disabled="page <= 1"
                            @click="page--"
                            >Anterior</BLink
                        >
                    </div>
                    <span id="page-num" class="pagination">
                        <div
                            class="page-item"
                            :class="{
                                active: pageNumber == page,
                                disabled: pageNumber == '...',
                            }"
                            v-for="(pageNumber, index) in pages"
                            :key="index"
                            @click="page = pageNumber"
                        >
                            <BLink
                                class="page-link clickPageNumber"
                                href="javascript:void(0);"
                                >{{ pageNumber }}</BLink
                            >
                        </div>
                    </span>
                    <div class="page-item">
                        <BLink
                            href="#"
                            class="page-link"
                            id="page-next"
                            :disabled="page >= pages.length"
                            @click="page++"
                            >Siguiente</BLink
                        >
                    </div>
                </div>
            </BCol>
        </BRow>
    </Layout>
</template>
