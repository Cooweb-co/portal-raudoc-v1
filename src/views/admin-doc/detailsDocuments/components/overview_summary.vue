<script>
import overview_summary_element from "./overview_summary_element.vue";
export default {
    props: {
        data: Object,
        files: Array,
    },
    components: {
        // simplebar,
        overview_summary_element,
    },
};
</script>
<template>
    <BTab title="Resumen" active class="fw-semibold pt-2">
        <BRow>
            <BCol xl="9" lg="8">
                <BCard no-body>
                    <BCardBody>
                        <div class="text-muted">
                            <h6 class="fw-semibold text-uppercase mb-3">
                                Resumen
                            </h6>
                            <p class="text-muted">{{ data.summary }}</p>

                            <h6 class="fw-semibold text-uppercase mb-3">
                                Información de contacto
                            </h6>
                            <ul>
                                <li>
                                    <strong>Nombre del denunciante:</strong>
                                    {{ data.fullName }}
                                </li>
                                <li>
                                    <strong>Dirección:</strong>
                                    {{ data.address }}
                                </li>
                                <li>
                                    <strong>Teléfono:</strong> {{ data.phone }}
                                </li>
                                <li>
                                    <strong>Correo electrónico:</strong>
                                    {{ data.email }}
                                </li>
                            </ul>

                            <div class="pt-3 border-top border-top-dashed mt-4">
                                <BRow gy-3>
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                Fecha de Creación:
                                            </p>
                                            <h5 class="fs-15 mb-0">
                                                {{ data.createdAt }}
                                            </h5>
                                        </div>
                                    </BCol>
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                Fecha limite:
                                            </p>
                                            <h5 class="fs-15 mb-0">
                                                {{ data.deadline }}
                                            </h5>
                                        </div>
                                    </BCol>
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                Prioridad :
                                            </p>
                                            <BBadge
                                                tag="div"
                                                :class="
                                                    data?.priority?.toLowerCase() ==
                                                    'alta'
                                                        ? 'badge text-uppercase bg-danger'
                                                        : data?.priority?.toLowerCase() ==
                                                            'media' ||
                                                        data?.priority?.toLowerCase() ==
                                                            'no definido'
                                                        ? 'badge text-uppercase bg-warning'
                                                        : 'badge text-uppercase bg-info'
                                                "
                                                >{{ data.priority }}</BBadge
                                            >
                                        </div>
                                    </BCol>
                                    <BCol lg="3" sm="6">
                                        <div>
                                            <p
                                                class="mb-2 text-uppercase fw-medium"
                                            >
                                                Estatus :
                                            </p>
                                            <BBadge
                                                tag="div"
                                                :class="
                                                    data?.status?.toLowerCase() ==
                                                    'completado'
                                                        ? 'badge text-uppercase bg-success-subtle text-success'
                                                        : 'badge text-uppercase bg-danger-subtle text-warning'
                                                "
                                                >{{ data.status }}</BBadge
                                            >
                                        </div>
                                    </BCol>
                                </BRow>
                            </div>

                            <div class="pt-3 border-top border-top-dashed mt-4">
                                <h6 class="mb-3 fw-semibold text-uppercase">
                                    Adjuntos
                                </h6>
                                <BRow class="g-3">
                                    <overview_summary_element
                                        v-for="file in files"
                                        :key="file.name"
                                        :file="file"
                                    />
                                </BRow>
                            </div>
                        </div>
                    </BCardBody>
                </BCard>

                <!-- <BCard no-body>
              <BCardHeader class="align-items-center d-flex py-0">
                  <BCardTitle class="mb-0 flex-grow-1">Comentarios</BCardTitle>
                  <div class="flex-shrink-0">
                      <BDropdown variant="link" class="card-header-dropdown"
                          toggle-class="text-reset dropdown-btn arrow-none"
                          menu-class="dropdown-menu-end" aria-haspopup="true">
                          <template #button-content> <span class="text-muted">Recent<i
                                      class="mdi mdi-chevron-down ms-1"></i></span>
                          </template>
                          <BDropdownItem>Recent</BDropdownItem>
                          <BDropdownItem>Top Rated</BDropdownItem>
                          <BDropdownItem>Last 7 DaysPrevious</BDropdownItem>
                      </BDropdown>
                  </div>
              </BCardHeader>

              <BCardBody>

                  <simplebar data-simplebar style="height: 300px;" class="px-3 mx-n3 mb-2">
                      <div class="d-flex mb-4">
                          <div class="flex-shrink-0">
                              <img src="@/assets/images/users/avatar-8.jpg" alt=""
                                  class="avatar-xs rounded-circle" />
                          </div>
                          <div class="flex-grow-1 ms-3">
                              <h5 class="fs-13">Joseph Parker <small class="text-muted ms-2">20
                                      Dec 2021 - 05:47AM</small></h5>
                              <p class="text-muted">I am getting message from customers that when
                                  they place order always get error message .</p>
                              <BLink href="javascript: void(0);" class="badge text-muted bg-light"><i
                                      class="mdi mdi-reply"></i>
                                  Reply</BLink>
                              <div class="d-flex mt-4">
                                  <div class="flex-shrink-0">
                                      <img src="@/assets/images/users/avatar-10.jpg" alt=""
                                          class="avatar-xs rounded-circle" />
                                  </div>
                                  <div class="flex-grow-1 ms-3">
                                      <h5 class="fs-13">Alexis Clarke <small
                                              class="text-muted ms-2">22 Dec 2021 -
                                              02:32PM</small></h5>
                                      <p class="text-muted">Please be sure to check your Spam
                                          mailbox to see if your email filters have identified the
                                          email from Dell as spam.</p>
                                      <BLink href="javascript: void(0);"
                                          class="badge text-muted bg-light"><i
                                              class="mdi mdi-reply"></i> Reply</BLink>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="d-flex mb-4">
                          <div class="flex-shrink-0">
                              <img src="@/assets/images/users/avatar-6.jpg" alt=""
                                  class="avatar-xs rounded-circle" />
                          </div>
                          <div class="flex-grow-1 ms-3">
                              <h5 class="fs-13">Donald Palmer <small class="text-muted ms-2">24
                                      Dec 2021 - 05:20PM</small></h5>
                              <p class="text-muted">If you have further questions, please contact
                                  Customer Support from the “Action Menu” on your <BLink
                                      href="javascript:void(0);" class="text-decoration-underline">
                                      Online Order Support
                                  </BLink>.
                              </p>
                              <BLink href="javascript: void(0);" class="badge text-muted bg-light"><i
                                      class="mdi mdi-reply"></i>
                                  Reply</BLink>
                          </div>
                      </div>
                      <div class="d-flex">
                          <div class="flex-shrink-0">
                              <img src="@/assets/images/users/avatar-10.jpg" alt=""
                                  class="avatar-xs rounded-circle" />
                          </div>
                          <div class="flex-grow-1 ms-3">
                              <h5 class="fs-13">Alexis Clarke <small class="text-muted ms-2">26
                                      min ago</small></h5>
                              <p class="text-muted">Your <BLink href="javascript:void(0)"
                                      class="text-decoration-underline">Online Order Support
                                  </BLink>
                                  provides you with the most current status of your order. To help
                                  manage your order refer to the “Action Menu” to initiate return,
                                  contact Customer Support and more.</p>
                              <BRow class="g-2 mb-3">
                                  <BCol lg="1" sm="2" cols="6">
                                      <img src="@/assets/images/small/img-4.jpg" alt=""
                                          class="img-fluid rounded">
                                  </BCol>
                                  <BCol lg="1" sm="2" cols="6">
                                      <img src="@/assets/images/small/img-5.jpg" alt=""
                                          class="img-fluid rounded">
                                  </BCol>
                              </BRow>
                              <BLink href="javascript: void(0);" class="badge text-muted bg-light"><i
                                      class="mdi mdi-reply"></i>
                                  Reply</BLink>
                              <div class="d-flex mt-4">
                                  <div class="flex-shrink-0">
                                      <img src="@/assets/images/users/avatar-6.jpg" alt=""
                                          class="avatar-xs rounded-circle" />
                                  </div>
                                  <div class="flex-grow-1 ms-3">
                                      <h5 class="fs-13">Donald Palmer <small class="text-muted ms-2">8
                                              sec ago</small></h5>
                                      <p class="text-muted">Other shipping methods are available
                                          at checkout if you want your purchase delivered faster.
                                      </p>
                                      <BLink href="javascript: void(0);"
                                          class="badge text-muted bg-light"><i
                                              class="mdi mdi-reply"></i> Reply</BLink>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </simplebar>
                  <form class="mt-4">
                      <BRow class="g-3">
                          <BCol cols="12">
                              <label for="exampleFormControlTextarea1"
                                  class="form-label text-body">Dejar un comentario</label>
                              <textarea class="form-control bg-light border-light"
                                  id="exampleFormControlTextarea1" rows="3"
                                  placeholder="Enter your comment..."></textarea>
                          </BCol>
                          <BCol cols="12" class="text-end">
                              <BButton type="button" variant="ghost-primary"
                                  class="btn-icon waves-effect me-1">
                                  <i class="ri-attachment-line fs-16"></i>
                              </BButton>
                              <BLink href="javascript:void(0);" class="btn btn-primary">Post
                                  Comments</BLink>
                          </BCol>
                      </BRow>
                  </form>
              </BCardBody>
          </BCard> -->
            </BCol>

            <BCol xl="3" lg="4">
                <BCard no-body>
                    <BCardHeader>
                        <h5 class="card-title mb-0">Detalle de Radicación</h5>
                    </BCardHeader>
                    <BCardBody>
                        <div class="table-responsive table-card">
                            <table
                                class="table table-borderless align-middle mb-0"
                            >
                                <tbody>
                                    <tr>
                                        <td class="fw-medium">Ticket</td>
                                        <td>#{{ data.id }}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-medium">Area</td>
                                        <td>Juridica</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-medium">Departamente</td>
                                        <td>Gerencia</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-medium">Asiganado a:</td>
                                        <td>
                                            <div class="avatar-group">
                                                <BLink
                                                    href="javascript:void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="Erica Kernan"
                                                >
                                                    <img
                                                        src="@/assets/images/users/avatar-4.jpg"
                                                        alt=""
                                                        class="rounded-circle avatar-xs"
                                                    />
                                                </BLink>
                                                <BLink
                                                    href="javascript:void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="Alexis Clarke"
                                                >
                                                    <img
                                                        src="@/assets/images/users/avatar-10.jpg"
                                                        alt=""
                                                        class="rounded-circle avatar-xs"
                                                    />
                                                </BLink>
                                                <BLink
                                                    href="javascript:void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="James Price"
                                                >
                                                    <img
                                                        src="@/assets/images/users/avatar-3.jpg"
                                                        alt=""
                                                        class="rounded-circle avatar-xs"
                                                    />
                                                </BLink>
                                                <BLink
                                                    href="javascript: void(0);"
                                                    class="avatar-group-item"
                                                    v-b-tooltip.hover
                                                    title="Add Members"
                                                >
                                                    <div class="avatar-xs">
                                                        <div
                                                            class="avatar-title fs-16 rounded-circle bg-light border-dashed border text-primary"
                                                        >
                                                            +
                                                        </div>
                                                    </div>
                                                </BLink>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="fw-medium">Prioridad</td>
                                        <td>
                                            <BBadge :variant="
                                                            data?.priority?.toLowerCase() ==
                                                            'alta'
                                                                ? 'danger'
                                                                : data?.priority?.toLowerCase() ==
                                                                'media' || data?.priority?.toLowerCase() ==
                                                                'no definido'
                                                                ? 'warning'
                                                                : 'info'
                                                        ">{{
                                                data.priority
                                            }}</BBadge>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-medium">
                                            Fecha de Creación
                                        </td>
                                        <td>{{ data.createdAt }}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-medium">Fecha limite</td>
                                        <td>{{ data.deadline }}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-medium">
                                            Última actualización
                                        </td>
                                        <td>hace 14 min</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-medium">Etiqueta</td>
                                        <td class="hstack text-wrap gap-1">
                                            <BBadge
                                                variant="secondary-subtle"
                                                class="bg-secondary-subtle text-secondary"
                                                >Quema</BBadge
                                            >
                                            <BBadge
                                                variant="secondary-subtle"
                                                class="bg-secondary-subtle text-secondary"
                                                >Denuencia</BBadge
                                            >
                                            <BBadge
                                                variant="secondary-subtle"
                                                class="bg-secondary-subtle text-secondary"
                                                >Comparendo</BBadge
                                            >
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </BCardBody>
                </BCard>

                <!-- <BCard no-body>
                    <BCardHeader
                        class="align-items-center d-flex border-bottom-dashed"
                    >
                        <BCardTitle class="mb-0 flex-grow-1"
                            >Colaboradores</BCardTitle
                        >
                        <div class="flex-shrink-0">
                            <BButton
                                type="button"
                                variant="soft-primary"
                                size="sm"
                                ><i class="ri-share-line me-1 align-bottom"></i>
                                Invitar Colaborador
                            </BButton>
                        </div>
                    </BCardHeader>

                    <BCardBody>
                        <simplebar
                            data-simplebar
                            style="height: 235px"
                            class="mx-n3 px-3"
                        >
                            <div class="vstack gap-3">
                                <div class="d-flex align-items-center">
                                    <div class="avatar-xs flex-shrink-0 me-3">
                                        <img
                                            src="@/assets/images/users/avatar-2.jpg"
                                            alt=""
                                            class="img-fluid rounded-circle"
                                        />
                                    </div>
                                    <div class="flex-grow-1">
                                        <h5 class="fs-13 mb-0">
                                            <BLink
                                                href="#"
                                                class="text-body d-block"
                                                >Nancy Martino
                                            </BLink>
                                        </h5>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <div
                                            class="d-flex align-items-center gap-1"
                                        >
                                            <BButton
                                                type="button"
                                                variant="light"
                                                size="sm"
                                                >Message
                                            </BButton>

                                            <BDropdown
                                                variant="link"
                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                menu-class="dropdown-menu-end"
                                                :offset="{
                                                    alignmentAxis: -130,
                                                    crossAxis: 0,
                                                    mainAxis: 10,
                                                }"
                                            >
                                                <template #button-content>
                                                    <i class="ri-more-fill"></i>
                                                </template>
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-eye-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    View</BDropdownItem
                                                >
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-pencil-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Favorite
                                                </BDropdownItem>
                                                <BDropdownItem>
                                                    <i
                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Delete
                                                </BDropdownItem>
                                            </BDropdown>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="avatar-xs flex-shrink-0 me-3">
                                        <div
                                            class="avatar-title bg-success-subtle text-success rounded-circle"
                                        >
                                            HB
                                        </div>
                                    </div>
                                    <div class="flex-grow-1">
                                        <h5 class="fs-13 mb-0">
                                            <BLink
                                                href="#"
                                                class="text-body d-block"
                                                >Henry Baird
                                            </BLink>
                                        </h5>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <div
                                            class="d-flex align-items-center gap-1"
                                        >
                                            <BButton
                                                type="button"
                                                variant="light"
                                                size="sm"
                                                >Message
                                            </BButton>
                                            <BDropdown
                                                variant="link"
                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                menu-class="dropdown-menu-end"
                                                :offset="{
                                                    alignmentAxis: -130,
                                                    crossAxis: 0,
                                                    mainAxis: 10,
                                                }"
                                            >
                                                <template #button-content>
                                                    <i class="ri-more-fill"></i>
                                                </template>
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-eye-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    View</BDropdownItem
                                                >
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-pencil-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Favorite
                                                </BDropdownItem>
                                                <BDropdownItem>
                                                    <i
                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Delete
                                                </BDropdownItem>
                                            </BDropdown>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="avatar-xs flex-shrink-0 me-3">
                                        <img
                                            src="@/assets/images/users/avatar-3.jpg"
                                            alt=""
                                            class="img-fluid rounded-circle"
                                        />
                                    </div>
                                    <div class="flex-grow-1">
                                        <h5 class="fs-13 mb-0">
                                            <BLink
                                                href="#"
                                                class="text-body d-block"
                                                >Frank Hook
                                            </BLink>
                                        </h5>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <div
                                            class="d-flex align-items-center gap-1"
                                        >
                                            <BButton
                                                type="button"
                                                variant="light"
                                                size="sm"
                                                >Message
                                            </BButton>
                                            <BDropdown
                                                variant="link"
                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                menu-class="dropdown-menu-end"
                                                :offset="{
                                                    alignmentAxis: -130,
                                                    crossAxis: 0,
                                                    mainAxis: 10,
                                                }"
                                            >
                                                <template #button-content>
                                                    <i class="ri-more-fill"></i>
                                                </template>
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-eye-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    View</BDropdownItem
                                                >
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-pencil-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Favorite
                                                </BDropdownItem>
                                                <BDropdownItem>
                                                    <i
                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Delete
                                                </BDropdownItem>
                                            </BDropdown>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="avatar-xs flex-shrink-0 me-3">
                                        <img
                                            src="@/assets/images/users/avatar-4.jpg"
                                            alt=""
                                            class="img-fluid rounded-circle"
                                        />
                                    </div>
                                    <div class="flex-grow-1">
                                        <h5 class="fs-13 mb-0">
                                            <BLink
                                                href="#"
                                                class="text-body d-block"
                                                >Jennifer Carter
                                            </BLink>
                                        </h5>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <div
                                            class="d-flex align-items-center gap-1"
                                        >
                                            <BButton
                                                type="button"
                                                variant="light"
                                                size="sm"
                                                >Message
                                            </BButton>
                                            <BDropdown
                                                variant="link"
                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                menu-class="dropdown-menu-end"
                                                :offset="{
                                                    alignmentAxis: -130,
                                                    crossAxis: 0,
                                                    mainAxis: 10,
                                                }"
                                            >
                                                <template #button-content>
                                                    <i class="ri-more-fill"></i>
                                                </template>
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-eye-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    View</BDropdownItem
                                                >
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-pencil-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Favorite
                                                </BDropdownItem>
                                                <BDropdownItem>
                                                    <i
                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Delete
                                                </BDropdownItem>
                                            </BDropdown>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="avatar-xs flex-shrink-0 me-3">
                                        <div
                                            class="avatar-title bg-success-subtle text-success rounded-circle"
                                        >
                                            AC
                                        </div>
                                    </div>
                                    <div class="flex-grow-1">
                                        <h5 class="fs-13 mb-0">
                                            <BLink
                                                href="#"
                                                class="text-body d-block"
                                                >Alexis Clarke
                                            </BLink>
                                        </h5>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <div
                                            class="d-flex align-items-center gap-1"
                                        >
                                            <BButton
                                                type="button"
                                                variant="light"
                                                size="sm"
                                                >Message
                                            </BButton>
                                            <BDropdown
                                                variant="link"
                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                menu-class="dropdown-menu-end"
                                                :offset="{
                                                    alignmentAxis: -130,
                                                    crossAxis: 0,
                                                    mainAxis: 10,
                                                }"
                                            >
                                                <template #button-content>
                                                    <i class="ri-more-fill"></i>
                                                </template>
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-eye-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    View</BDropdownItem
                                                >
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-pencil-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Favorite
                                                </BDropdownItem>
                                                <BDropdownItem>
                                                    <i
                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Delete
                                                </BDropdownItem>
                                            </BDropdown>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="avatar-xs flex-shrink-0 me-3">
                                        <img
                                            src="@/assets/images/users/avatar-7.jpg"
                                            alt=""
                                            class="img-fluid rounded-circle"
                                        />
                                    </div>
                                    <div class="flex-grow-1">
                                        <h5 class="fs-13 mb-0">
                                            <BLink
                                                href="#"
                                                class="text-body d-block"
                                                >Joseph Parker
                                            </BLink>
                                        </h5>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <div
                                            class="d-flex align-items-center gap-1"
                                        >
                                            <BButton
                                                type="button"
                                                variant="light"
                                                size="sm"
                                                >Message
                                            </BButton>
                                            <BDropdown
                                                variant="link"
                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                menu-class="dropdown-menu-end"
                                                :offset="{
                                                    alignmentAxis: -130,
                                                    crossAxis: 0,
                                                    mainAxis: 10,
                                                }"
                                            >
                                                <template #button-content>
                                                    <i class="ri-more-fill"></i>
                                                </template>
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-eye-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    View</BDropdownItem
                                                >
                                                <BDropdownItem
                                                    ><i
                                                        class="ri-pencil-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Favorite
                                                </BDropdownItem>
                                                <BDropdownItem>
                                                    <i
                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"
                                                    ></i>
                                                    Delete
                                                </BDropdownItem>
                                            </BDropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </simplebar>
                    </BCardBody>
                </BCard> -->
            </BCol>
        </BRow>
    </BTab>
</template>
