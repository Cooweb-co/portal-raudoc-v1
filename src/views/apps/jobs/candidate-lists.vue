<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "vue3-toastify";

export default {
  data() {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.VUE_APP_CF_BASE_URL}/USERS_LIST_V1`,
      headers: {
        company: "BAQVERDE",
      },
    };
    const data = sessionStorage.getItem("tdrs");
    const user = JSON.parse(sessionStorage.getItem("authUserInfo"));

    return {
      searchQuery: null,
      page: 1,
      perPage: 16,
      pages: [],
      candidatelist: [],
      originalCandidatelist: [],
      config: config,
      loading: false,
      selectRole: "",
      trds: JSON.parse(data),
      user,
    };
  },
  computed: {
    displayedPosts() {
      return this.paginate(this.candidatelist);
    },
    resultQuery() {
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();

        return this.displayedPosts.filter((data) => {
          return (
            data.name.toLowerCase().includes(search) ||
            `${data.identification}`.includes(search) ||
            data.email.toLowerCase().includes(search)
          );
        });
      } else {
        return this.displayedPosts;
      }
    },
  },
  watch: {
    candidatelist() {
      this.setPages();
    },
    selectRole(newValue) {
      this.fetchUsers(newValue);
    },
    searchQuery(newValue) {
      if (newValue) {
        const search = newValue.toLowerCase();
        this.candidatelist = this.originalCandidatelist.filter((data) => {
          return (
            data.name.toLowerCase().includes(search) ||
            `${data.identification}`.includes(search) ||
            data.email.toLowerCase().includes(search)
          );
        });
      } else {
        this.candidatelist = [...this.originalCandidatelist];
      }
    },
  },
  created() {
    this.setPages();
  },
  mounted() {
    this.loading = true;
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
      .request(this.config)
      .then((response) => {
        this.originalCandidatelist = response.data;
        this.selectRole = "TODOS";
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        console.error(error);
      });
  },
  methods: {
    setPages() {
      let numberOfPages = Math.ceil(this.candidatelist.length / this.perPage);
      this.pages = [];
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate(candidatelist) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return candidatelist.slice(from, to);
    },
    fetchUsers(selectedRole) {
      if (selectedRole != "TODOS") {
        this.candidatelist = this.originalCandidatelist.filter(
          (user) => user.idRole == selectedRole
        );
      } else {
        // Si el rol seleccionado es "TODOS", simplemente copia de nuevo todos los datos originales
        this.candidatelist = [...this.originalCandidatelist];
      }
    },
    setArea(areaId) {
      const areaName = this.trds.find((item) => item.id == areaId)?.name;
      return areaName;
    },
    setStatusColor(status) {
      return status
        ? "text-success bg-success-subtle"
        : "text-danger bg-danger-subtle";
    },
    async handleChangePassword(email) {
      await axios.post(
        `${process.env.VUE_APP_CF_BASE_URL}/user/update-password/`,
        { email },
        {
          headers: {
            company: "BAQVERDE",
          },
        }
      );
      toast("Información enviada al correo del usuario!", {
        type: "success",
        position: "top-right",
      });
    },
    async handleChangeUserStatus(status, uid) {
      let message = status ? "habilitar" : "deshabilitar";
      Swal.fire({
        title: `Estas seguro de querer ${message} a este usuario?`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "No, cancelar!",
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Si, continuar!",
      }).then(async (result) => {
        if (result.value) {
          await axios.put(
            `${process.env.VUE_APP_CF_BASE_URL}/user/update-status`,
            { status, uid },
            {
              headers: {
                company: "BAQVERDE",
              },
            }
          );
        }
      });
    },
  },
  components: {
    Layout,
    PageHeader,
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Gestión de usuarios" pageTitle="Lista de usuarios" />
    <BRow class="g-4 mb-4">
      <BCol sm="auto">
        <div>
          <BLink href="/creacion-usuario" class="btn btn-primary"
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
              autocomplete="off"
              placeholder="Nombre o designación"
              v-model="searchQuery"
            />
            <i class="ri-search-line search-icon"></i>
          </div>
          <div class="w-md">
            <select
              v-model="selectRole"
              class="form-select"
              data-choices
              data-choices-search-false
            >
              <option value="TODOS" selected>Todos</option>
              <option value="ADMIN">Administrador</option>
              <option value="BOSS_OF_AREA">Jefe de área</option>
              <option value="DIRECTOR">Director</option>
              <option value="FUNCTIONARY">Funcionario</option>
              <option value="RADICATOR">Radicador</option>
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
              <th scope="col">DOCUMENTO</th>
              <th scope="col">NOMBRE COMPLETO</th>
              <th scope="col">ESTADO</th>
              <th scope="col">PERFIL</th>
              <th scope="col">AREA</th>
              <th scope="col">CORREO</th>
              <th scope="col">ACCIONES</th>
            </tr>
          </thead>
          <tbody v-if="loading">
            <tr>
              <td>
                <a-skeleton :loading="loading" :active="loading" />
              </td>
              <td>
                <a-skeleton :loading="loading" :active="loading" />
              </td>
              <td>
                <a-skeleton :loading="loading" :active="loading" />
              </td>
              <td>
                <a-skeleton :loading="loading" :active="loading" />
              </td>
              <td>
                <a-skeleton :loading="loading" :active="loading" />
              </td>
              <td>
                <a-skeleton :loading="loading" :active="loading" />
              </td>
              <td>
                <a-skeleton :loading="loading" :active="loading" />
              </td>
            </tr>
          </tbody>
          <tbody v-else v-for="(data, index) of resultQuery" :key="index">
            <tr>
              <td>{{ data.identification }}</td>
              <td>{{ data.name }}</td>
              <td>
                <h5>
                  <span
                    class="badge"
                    :class="[setStatusColor(data.isActive)]"
                    >{{ data.isActive ? "Habilitado" : "Deshabilitado" }}</span
                  >
                </h5>
              </td>
              <td>
                <h5>
                  <span
                    class="badge"
                    :class="{
                      'bg-success-subtle text-success':
                        data.idRole == 'FUNCTIONARY',
                      'bg-danger-subtle text-danger':
                        data.idRole == 'BOSS_OF_AREA',
                      'bg-warning-subtle text-warning':
                        data.idRole == 'ADMIN' || data.idRole == 'DIRECTOR',
                      'bg-info-subtle text-info': data.idRole == 'RADICATOR',
                    }"
                    >{{ data.role }}</span
                  >
                </h5>
              </td>
              <td>{{ this.setArea(data.areaId) }}</td>
              <td>{{ data.email }}</td>
              <td class="d-flex justify-content-evenly align-items-center">
                <a-tooltip
                  v-if="user.idRole == 'ADMIN'"
                  title="Restaurar contraseña"
                >
                  <BLink
                    class="btn btn-primary p-2"
                    @click="handleChangePassword(data.email)"
                  >
                    <i class="ri-lock-line align-bottom"></i>
                  </BLink>
                </a-tooltip>
                <a-tooltip title="Editar">
                  <BLink
                    :href="`/edicion-usuario/${data.uid}`"
                    class="btn btn-outline-primary p-2"
                  >
                    <i class="ri-edit-line align-bottom"></i>
                  </BLink>
                </a-tooltip>
                <template v-if="user.idRole == 'ADMIN'">
                  <a-tooltip v-if="data.isActive" title="Deshabilitar">
                    <BLink
                      class="btn btn-danger oulined p-2"
                      @click="handleChangeUserStatus(false)"
                    >
                      <i class="ri-close-fill align-bottom"></i>
                    </BLink>
                  </a-tooltip>
                  <a-tooltip v-else title="Habilitar">
                    <BLink
                      class="btn btn-success oulined p-2"
                      @click="handleChangeUserStatus(true)"
                    >
                      <i class="ri-check-fill align-bottom"></i>
                    </BLink>
                  </a-tooltip>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <span
          v-if="resultQuery.length == 0 && !loading"
          class="w-100 text-center fs-4 text-muted pt-2 d-block"
          >No se encontraron usuarios</span
        >
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
              >Siguiente
            </BLink>
          </div>
        </div>
      </BCol>
    </BRow>
  </Layout>
</template>
