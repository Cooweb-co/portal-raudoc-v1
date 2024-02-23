<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { candidatelist } from "@/common/data";

export default {
  data() {
    const new_cadidateList = candidatelist.map(candidate => {
                                                                  return {
                                                                      ...candidate,
                                                                      user: `user${Math.floor(Math.random() * 1000000)}`
                                                                  }
                                                    })
    return {
      searchQuery: null,
      page: 1,
      perPage: 8,
      pages: [],
      candidatelist: new_cadidateList
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
            data.designation.toLowerCase().includes(search) ||
            data.type.toLowerCase().includes(search) ||
            data.ratingCount.toLowerCase().includes(search) ||
            data.rating.toLowerCase().includes(search) ||
            data.location.toLowerCase().includes(search)
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
  },
  created() {
    this.setPages();
  },
  mounted() {
    document.querySelectorAll(".custom-toggle").forEach((item) => {

      item.addEventListener('click', function () {
        if (item.classList.contains("active")) {
        item.classList.remove("active")
      } else {
        item.classList.add("active")
      }
      });
    })
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
    }
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
          <BLink href="#!" class="btn btn-primary"><i class="ri-add-line align-bottom me-1"></i> Agregar usuario</BLink>
        </div>
      </BCol>
      <BCol sm>
        <div class="d-md-flex justify-content-sm-end gap-2">
          <div class="search-box ms-md-2 flex-shrink-0 mb-3 mb-md-0">
            <input type="text" class="form-control" id="searchJob" autocomplete="off"
              placeholder="Nombre o designación" v-model="searchQuery">
            <i class="ri-search-line search-icon"></i>
          </div>
          <div class="w-md">
            <select class="form-select" data-choices data-choices-search-false>
              <option value="TODOS" selected>Todos</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER ADMIN" >SUPER ADMIN</option>
              <option value="ADMIN EMPRESA">ADMIN EMPRESA</option>
              <option value="ASESOR">ASESOR</option>
              <option value="REDICADOR">REDICADOR</option>
              <option value="SUPERVISOR SISTEMA">SUPERVISOR SISTEMA</option>
            </select>
          </div>
        </div>
      </BCol>
    </BRow>

    <BRow class="gy-2 mb-2" id="candidate-list">
      <BCol lg="12">
        <table class="table ">
          <thead class="table-light">
            <tr>
              <th scope="col">USUARIO</th>
              <th scope="col">NOMBRE COMPLETO</th>
              <th scope="col">PERFIL</th>
              <th scope="col">CORREO</th>
            </tr>
          </thead>
          <tbody v-for="(data, index) of resultQuery" :key="index">
              <tr>
                <td>{{ data.user }}</td>
                <td>{{ data.name }}</td>
                <td><div v-for="design in data.designation" :key="design">
                  
                  <span class="badge" :class="{
                    'bg-success-subtle text-success': design == 'ASESOR',
                    'bg-danger-subtle text-danger': design == 'RADICADOR',
                    'bg-primary-subtle text-primary': design == 'ADMIN EMPRESA' || design == 'SUPER ADMIN',
                    'bg-warning-subtle text-warning': design == 'ADMINISTRADOR DE SISTEMA',
                    'bg-info-subtle text-info': design == 'SUPERVISOR DE SISTEMA',
                  }">{{ design }}</span>
                </div></td>
                <td>{{ data.user + '@email.com' }}</td>
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
          v-if="pages.length > 1">
          <div class="page-item">
            <BLink href="#" class="page-link" id="page-prev" :disabled="page <= 1" @click="page--">Anterior</BLink>
          </div>
          <span id="page-num" class="pagination">
            <div class="page-item" :class="{ active: pageNumber == page, disabled: pageNumber == '...', }"
              v-for="(pageNumber, index) in pages" :key="index" @click="page = pageNumber">
              <BLink class="page-link clickPageNumber" href="javascript:void(0);">{{ pageNumber }}</BLink>
            </div>
          </span>
          <div class="page-item">
            <BLink href="#" class="page-link" id="page-next" :disabled="page >= pages.length" @click="page++">Siguiente</BLink>
          </div>
        </div>
      </BCol>
    </BRow>
  </Layout>
</template>