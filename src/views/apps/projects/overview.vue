<script>
import { reactive } from "vue";
import Layout from "@/layouts/main.vue";
import simplebar from "simplebar-vue"

import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {

    setup() {
        const state = reactive({
        content:
            "<h3><span class='ql-size-large;'>Hello World!</span></h3><p><br></p><h3>This is an simple editable area.</h3><p><br></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p><br></p><p>End of simple area</p>",
        _content: "",
        disabled: false,
        });
        return {
        state
        };
    },

    data(){
        return {
            editor: ClassicEditor,
        }
    },

    components: {
        Layout,
        simplebar,
        ckeditor: CKEditor.component
    },

    methods: {
        toggleFavourite(ele) {
            ele.target.closest('.favourite-btn').classList.toggle("active");
        }
    },
};
</script>

<template>
    <Layout>
        <BRow>
            <BCol lg="12">
                <BCard no-body class="mt-n4 mx-n4 border-0">
                    <div class="bg-primary-subtle">
                        <BCardBody class="pb-0 px-4">
                            <BRow class="mb-3">
                                <BCol md>
                                    <BRow class="align-items-center g-3">
                                        <!-- <BCol md="auto">
                                            <div class="avatar-md">
                                                <div class="avatar-title bg-white rounded-circle">
                                                    <img src="@/assets/images/brands/slack.png" alt="" class="avatar-xs">
                                                </div>
                                            </div>
                                        </BCol> -->
                                        <BCol md>
                                            <div>
                                                <h4 class="fw-bold">#TI-2881 - Denuncia por quema de arboles </h4>
                                                <div class="hstack gap-3 flex-wrap">
                                                    <div><i class="ri-building-line align-bottom me-1"></i> Juridica
                                                    </div>
                                                    <div class="vr"></div>
                                                    <div>Fecha de creación : <span class="fw-medium">15 Enero, 2024</span></div>
                                                    <div class="vr"></div>
                                                    <div>Fecha limite : <span class="fw-medium">24 Fecbrero, 2024</span></div>
                                                    <div class="vr"></div>
                                                    <BBadge pill class="bg-primary fs-12">Nuevo</BBadge>
                                                    <BBadge variant="danger" pill class="bg-success fs-12">Alta</BBadge>
                                                </div>
                                            </div>
                                        </BCol>
                                    </BRow>
                                </BCol>
                                <BCol md="auto">
                                    <div class="hstack gap-1 flex-wrap">
                                        <button type="button" class="btn py-0 fs-16 favourite-btn active">
                                            <i class="ri-star-fill" @click="toggleFavourite"></i>
                                        </button>
                                        <button type="button" class="btn py-0 fs-16 text-body">
                                            <i class="ri-share-line"></i>
                                        </button>
                                        <button type="button" class="btn py-0 fs-16 text-body">
                                            <i class="ri-flag-line"></i>
                                        </button>
                                    </div>
                                </BCol>
                            </BRow>
                        </BCardBody>
                    </div>
                </BCard>
            </BCol>
        </BRow>

        <BRow>
            <BCol lg="12">
                <BTabs variant="link" nav-class="nav-tabs-custom border-bottom-0">
                    <BTab title="Resumen" active class="fw-semibold pt-2">
                        <BRow>
                            <BCol xl="9" lg="8">
                                <BCard no-body>
                                    <BCardBody>
                                        <div class="text-muted">
                                            <h6 class="fw-semibold text-uppercase mb-3">Resumen</h6>
                        <p class="text-muted">El documento es una denuncia por tala ilegal de árboles en una zona protegida. El denunciante, Pedro Pérez, acusa a Juan López de talar árboles sin autorización en la Carrera 10 # 12-34, Barranquilla, Colombia. La tala ha generado un problema de contaminación ambiental en el sector, afectando la salud y el bienestar de los residentes.

El denunciante solicita a la autoridad ambiental que investigue el caso y sancione al responsable. Además, solicita que se tomen medidas para remediar el daño ambiental causado por la tala ilegal, como la reforestación de la zona afectada. 
                        </p>

                        <h6 class="fw-semibold text-uppercase mb-3">Hechos</h6>
                        <p class="text-muted">El Sr. Pedro Pérez denuncia al Sr. Juan López por la tala ilegal de árboles en una zona protegida ubicada en la Carrera 10 # 12-34, Barranquilla, Colombia. La tala se realizó sin la debida autorización y ha generado un problema de contaminación ambiental en el sector, afectando la salud y el bienestar de los residentes.</p>
                        <h6 class="fw-semibold text-uppercase mb-3">Solicitud</h6>
                        <p class="text-muted">Se solicita a la autoridad ambiental que investigue este caso y tome las medidas necesarias para sancionar al Sr. López. Además, se solicita que se tomen medidas para remediar el daño ambiental causado por la tala ilegal, como la reforestación de la zona afectada.</p>
                        <h6 class="fw-semibold text-uppercase mb-3">Información de contacto</h6>
                        <ul>
                            <li><strong>Nombre del denunciante:</strong> Pedro Pérez</li>
                            <li><strong>Dirección:</strong> Carrera 11 # 13-45, Bogotá, Colombia</li>
                            <li><strong>Teléfono:</strong> +57 123456789</li>
                            <li><strong>Correo electrónico:</strong> pedro.perez@correo.com</li>
                        </ul>


                                            <div class="pt-3 border-top border-top-dashed mt-4">
                                                <BRow gy-3>

                                                    <BCol lg="3" sm="6">
                                                        <div>
                                                            <p class="mb-2 text-uppercase fw-medium">Create Date :</p>
                                                            <h5 class="fs-15 mb-0">15 Sep, 2021</h5>
                                                        </div>
                                                    </BCol>
                                                    <BCol lg="3" sm="6">
                                                        <div>
                                                            <p class="mb-2 text-uppercase fw-medium">Due Date :</p>
                                                            <h5 class="fs-15 mb-0">29 Dec, 2021</h5>
                                                        </div>
                                                    </BCol>
                                                    <BCol lg="3" sm="6">
                                                        <div>
                                                            <p class="mb-2 text-uppercase fw-medium">Priority :</p>
                                                            <BBadge tag="div" class="bg-success fs-12">High</BBadge>
                                                        </div>
                                                    </BCol>
                                                    <BCol lg="3" sm="6">
                                                        <div>
                                                            <p class="mb-2 text-uppercase fw-medium">Status :</p>
                                                            <BBadge tag="div" class="bg-primary fs-12">Inprogress</BBadge>
                                                        </div>
                                                    </BCol>
                                                </BRow>
                                            </div>

                                            <div class="pt-3 border-top border-top-dashed mt-4">
                                                <h6 class="mb-3 fw-semibold text-uppercase">Adjuntos</h6>
                                                <BRow class="g-3">
                                                    <BCol xxl="4" lg="6">
                                                        <div class="border rounded border-dashed p-2">
                                                            <div class="d-flex align-items-center">
                                                                <div class="flex-shrink-0 me-3">
                                                                    <div class="avatar-sm">
                                                                        <div
                                                                            class="avatar-title bg-light text-primary rounded fs-24">
                                                                            <i class="ri-folder-zip-line"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="flex-grow-1 overflow-hidden">
                                                                    <h5 class="fs-13 mb-1">
                                                                        <BLink href="#"
                                                                            class="text-body text-truncate d-block">Certificaciones.jpg</BLink>
                                                                    </h5>
                                                                    <div>2.2MB</div>
                                                                </div>
                                                                <div class="flex-shrink-0 ms-2">
                                                                    <div class="d-flex gap-1">
                                                                        <button type="button"
                                                                            class="btn btn-icon text-muted btn-sm fs-18"><i
                                                                                class="ri-download-2-line"></i></button>
                                                                        <BDropdown variant="link"
                                                                            toggle-class="btn btn-icon btn-sm fs-18 text-muted arrow-none"
                                                                            menu-class="dropdown-menu-end"
                                                                            :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                                            <template #button-content>
                                                                                <i class="ri-more-fill"></i>
                                                                            </template>
                                                                            <BDropdownItem><i
                                                                                    class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                                                                Rename </BDropdownItem>
                                                                            <BDropdownItem> <i
                                                                                    class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                                                                Delete
                                                                            </BDropdownItem>
                                                                        </BDropdown>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </BCol>
                                                    <BCol xxl="4" lg="6">
                                                        <div class="border rounded border-dashed p-2">
                                                            <div class="d-flex align-items-center">
                                                                <div class="flex-shrink-0 me-3">
                                                                    <div class="avatar-sm">
                                                                        <div
                                                                            class="avatar-title bg-light text-primary rounded fs-24">
                                                                            <i class="ri-file-ppt-2-line"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="flex-grow-1 overflow-hidden">
                                                                    <h5 class="fs-13 mb-1">
                                                                        <BLink href="#"
                                                                            class="text-body text-truncate d-block">
                                                                            Respuesta a derecho.pff</BLink>
                                                                    </h5>
                                                                    <div>2.4MB</div>
                                                                </div>
                                                                <div class="flex-shrink-0 ms-2">
                                                                    <div class="d-flex gap-1">
                                                                        <button type="button"
                                                                            class="btn btn-icon text-muted btn-sm fs-18"><i
                                                                                class="ri-download-2-line"></i></button>
                                                                        <BDropdown variant="link"
                                                                            toggle-class="btn btn-icon btn-sm fs-18 text-muted arrow-none"
                                                                            menu-class="dropdown-menu-end"
                                                                            :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                                            <template #button-content>
                                                                                <i class="ri-more-fill"></i>
                                                                            </template>
                                                                            <BDropdownItem><i
                                                                                    class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                                                                Rename </BDropdownItem>
                                                                            <BDropdownItem> <i
                                                                                    class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                                                                Delete
                                                                            </BDropdownItem>
                                                                        </BDropdown>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </BCol>
                                                </BRow>
                                            </div>
                                        </div>
                                    </BCardBody>
                                </BCard>

                                <BCard no-body>
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
                                </BCard>
                            </BCol>
                            <BCol xl="3" lg="4">
                                <BCard no-body>
                                    <BCardHeader>
                                        <h5 class="card-title mb-0">Detalle de Radicación</h5>
                                    </BCardHeader>
                                    <BCardBody>
                                        <div class="table-responsive table-card">
                                            <table class="table table-borderless align-middle mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td class="fw-medium">Ticket</td>
                                                        <td>#TI-2881</td>
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
                                                                <BLink href="javascript:void(0);" class="avatar-group-item"
                                                                    v-b-tooltip.hover title="Erica Kernan">
                                                                    <img src="@/assets/images/users/avatar-4.jpg" alt=""
                                                                        class="rounded-circle avatar-xs" />
                                                                </BLink>
                                                                <BLink href="javascript:void(0);" class="avatar-group-item"
                                                                    v-b-tooltip.hover title="Alexis Clarke">
                                                                    <img src="@/assets/images/users/avatar-10.jpg" alt=""
                                                                        class="rounded-circle avatar-xs" />
                                                                </BLink>
                                                                <BLink href="javascript:void(0);" class="avatar-group-item"
                                                                    v-b-tooltip.hover title="James Price">
                                                                    <img src="@/assets/images/users/avatar-3.jpg" alt=""
                                                                        class="rounded-circle avatar-xs" />
                                                                </BLink>
                                                                <BLink href="javascript: void(0);" class="avatar-group-item"
                                                                    v-b-tooltip.hover title="Add Members">
                                                                    <div class="avatar-xs">
                                                                        <div
                                                                            class="avatar-title fs-16 rounded-circle bg-light border-dashed border text-primary">
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
                                                            <BBadge variant="success">Alta</BBadge>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="fw-medium">Fecha de Creación</td>
                                                        <td>20 Dec, 2021</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="fw-medium">Fecha limite</td>
                                                        <td>29 Dec, 2021</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="fw-medium">Última actualización</td>
                                                        <td>hace 14 min</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="fw-medium">Etiqueta</td>
                                                        <td class="hstack text-wrap gap-1">
                                                            <BBadge variant="secondary-subtle" class="bg-secondary-subtle text-secondary">Quema</BBadge>
                                                            <BBadge variant="secondary-subtle" class="bg-secondary-subtle text-secondary">Denuencia</BBadge>
                                                            <BBadge variant="secondary-subtle" class="bg-secondary-subtle text-secondary">Comparendo</BBadge>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </BCardBody>
                                </BCard>
                               

                                <BCard no-body>
                                    <BCardHeader class="align-items-center d-flex border-bottom-dashed">
                                        <BCardTitle class="mb-0 flex-grow-1">Colaboradores</BCardTitle>
                                        <div class="flex-shrink-0">
                                            <BButton type="button" variant="soft-primary" size="sm"><i
                                                    class="ri-share-line me-1 align-bottom"></i> Invitar Colaborador
                                            </BButton>
                                        </div>
                                    </BCardHeader>

                                    <BCardBody>
                                        <simplebar data-simplebar style="height: 235px;" class="mx-n3 px-3">
                                            <div class="vstack gap-3">
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-xs flex-shrink-0 me-3">
                                                        <img src="@/assets/images/users/avatar-2.jpg" alt=""
                                                            class="img-fluid rounded-circle">
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <h5 class="fs-13 mb-0">
                                                            <BLink href="#" class="text-body d-block">Nancy Martino
                                                            </BLink>
                                                        </h5>
                                                    </div>
                                                    <div class="flex-shrink-0">
                                                        <div class="d-flex align-items-center gap-1">
                                                            <BButton type="button" variant="light" size="sm">Message
                                                            </BButton>

                                                            <BDropdown variant="link"
                                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                                menu-class="dropdown-menu-end"
                                                                :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                                <template #button-content>
                                                                    <i class="ri-more-fill"></i>
                                                                </template>
                                                                <BDropdownItem><i
                                                                        class="ri-eye-fill align-bottom me-2 text-muted"></i>
                                                                    View</BDropdownItem>
                                                                <BDropdownItem><i
                                                                        class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                                                    Favorite </BDropdownItem>
                                                                <BDropdownItem> <i
                                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                                                    Delete
                                                                </BDropdownItem>
                                                            </BDropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-xs flex-shrink-0 me-3">
                                                        <div
                                                            class="avatar-title bg-success-subtle text-success rounded-circle">
                                                            HB
                                                        </div>
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <h5 class="fs-13 mb-0">
                                                            <BLink href="#" class="text-body d-block">Henry Baird
                                                            </BLink>
                                                        </h5>
                                                    </div>
                                                    <div class="flex-shrink-0">
                                                        <div class="d-flex align-items-center gap-1">
                                                            <BButton type="button" variant="light" size="sm">Message
                                                            </BButton>
                                                            <BDropdown variant="link"
                                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                                menu-class="dropdown-menu-end"
                                                                :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                                <template #button-content>
                                                                    <i class="ri-more-fill"></i>
                                                                </template>
                                                                <BDropdownItem><i
                                                                        class="ri-eye-fill align-bottom me-2 text-muted"></i>
                                                                    View</BDropdownItem>
                                                                <BDropdownItem><i
                                                                        class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                                                    Favorite </BDropdownItem>
                                                                <BDropdownItem> <i
                                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                                                    Delete
                                                                </BDropdownItem>
                                                            </BDropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-xs flex-shrink-0 me-3">
                                                        <img src="@/assets/images/users/avatar-3.jpg" alt=""
                                                            class="img-fluid rounded-circle">
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <h5 class="fs-13 mb-0">
                                                            <BLink href="#" class="text-body d-block">Frank Hook
                                                            </BLink>
                                                        </h5>
                                                    </div>
                                                    <div class="flex-shrink-0">
                                                        <div class="d-flex align-items-center gap-1">
                                                            <BButton type="button" variant="light" size="sm">Message
                                                            </BButton>
                                                            <BDropdown variant="link"
                                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                                menu-class="dropdown-menu-end"
                                                                :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                                <template #button-content>
                                                                    <i class="ri-more-fill"></i>
                                                                </template>
                                                                <BDropdownItem><i
                                                                        class="ri-eye-fill align-bottom me-2 text-muted"></i>
                                                                    View</BDropdownItem>
                                                                <BDropdownItem><i
                                                                        class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                                                    Favorite </BDropdownItem>
                                                                <BDropdownItem> <i
                                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                                                    Delete
                                                                </BDropdownItem>
                                                            </BDropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-xs flex-shrink-0 me-3">
                                                        <img src="@/assets/images/users/avatar-4.jpg" alt=""
                                                            class="img-fluid rounded-circle">
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <h5 class="fs-13 mb-0">
                                                            <BLink href="#" class="text-body d-block">Jennifer Carter
                                                            </BLink>
                                                        </h5>
                                                    </div>
                                                    <div class="flex-shrink-0">
                                                        <div class="d-flex align-items-center gap-1">
                                                            <BButton type="button" variant="light" size="sm">Message
                                                            </BButton>
                                                            <BDropdown variant="link"
                                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                                menu-class="dropdown-menu-end"
                                                                :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                                <template #button-content>
                                                                    <i class="ri-more-fill"></i>
                                                                </template>
                                                                <BDropdownItem><i
                                                                        class="ri-eye-fill align-bottom me-2 text-muted"></i>
                                                                    View</BDropdownItem>
                                                                <BDropdownItem><i
                                                                        class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                                                    Favorite </BDropdownItem>
                                                                <BDropdownItem> <i
                                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                                                    Delete
                                                                </BDropdownItem>
                                                            </BDropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-xs flex-shrink-0 me-3">
                                                        <div
                                                            class="avatar-title bg-success-subtle text-success rounded-circle">
                                                            AC
                                                        </div>
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <h5 class="fs-13 mb-0">
                                                            <BLink href="#" class="text-body d-block">Alexis Clarke
                                                            </BLink>
                                                        </h5>
                                                    </div>
                                                    <div class="flex-shrink-0">
                                                        <div class="d-flex align-items-center gap-1">
                                                            <BButton type="button" variant="light" size="sm">Message
                                                            </BButton>
                                                            <BDropdown variant="link"
                                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                                menu-class="dropdown-menu-end"
                                                                :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                                <template #button-content>
                                                                    <i class="ri-more-fill"></i>
                                                                </template>
                                                                <BDropdownItem><i
                                                                        class="ri-eye-fill align-bottom me-2 text-muted"></i>
                                                                    View</BDropdownItem>
                                                                <BDropdownItem><i
                                                                        class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                                                    Favorite </BDropdownItem>
                                                                <BDropdownItem> <i
                                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                                                    Delete
                                                                </BDropdownItem>
                                                            </BDropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-xs flex-shrink-0 me-3">
                                                        <img src="@/assets/images/users/avatar-7.jpg" alt=""
                                                            class="img-fluid rounded-circle">
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <h5 class="fs-13 mb-0">
                                                            <BLink href="#" class="text-body d-block">Joseph Parker
                                                            </BLink>
                                                        </h5>
                                                    </div>
                                                    <div class="flex-shrink-0">
                                                        <div class="d-flex align-items-center gap-1">
                                                            <BButton type="button" variant="light" size="sm">Message
                                                            </BButton>
                                                            <BDropdown variant="link"
                                                                toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                                menu-class="dropdown-menu-end"
                                                                :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                                <template #button-content>
                                                                    <i class="ri-more-fill"></i>
                                                                </template>
                                                                <BDropdownItem><i
                                                                        class="ri-eye-fill align-bottom me-2 text-muted"></i>
                                                                    View</BDropdownItem>
                                                                <BDropdownItem><i
                                                                        class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                                                    Favorite </BDropdownItem>
                                                                <BDropdownItem> <i
                                                                        class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                                                    Delete
                                                                </BDropdownItem>
                                                            </BDropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </simplebar>
                                    </BCardBody>
                                </BCard>

                            
                            </BCol>
                        </BRow>
                    </BTab>
                    <BTab title="Documentos" class="fw-semibold pt-2">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-4">
                                    <h5 class="card-title flex-grow-1">Docuemntos</h5>
                                </div>
                                <BRow>
                                    <div class="table-responsive table-card">
                                        <table class="table table-borderless align-middle mb-0">
                                            <thead class="table-light">
                                                <tr>
                                                    <th scope="col">File Name</th>
                                                    <th scope="col">Type</th>
                                                    <th scope="col">Size</th>
                                                    <th scope="col">Upload Date</th>
                                                    <th scope="col" style="width: 120px;">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <div class="avatar-sm">
                                                                <div
                                                                    class="avatar-title bg-light text-primary rounded fs-24">
                                                                    <i class="ri-folder-zip-line"></i>
                                                                </div>
                                                            </div>
                                                            <div class="ms-3 flex-grow-1">
                                                                <h5 class="fs-14 mb-0">
                                                                    <BLink href="javascript:void(0)" class="text-body">
                                                                        Artboard-documents.zip
                                                                    </BLink>
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>Zip File</td>
                                                    <td>4.57 MB</td>
                                                    <td>12 Dec 2021</td>
                                                    <td>
                                                        <BDropdown variant="link"
                                                            toggle-class="btn btn-soft-primary btn-sm btn-icon arrow-none"
                                                            menu-class="dropdown-menu-end"
                                                            :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                            <template #button-content>
                                                                <i class="ri-more-fill"></i>
                                                            </template>
                                                            <BDropdownItem><i
                                                                    class="ri-eye-fill me-2 align-bottom text-muted"></i>
                                                                View </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-download-2-fill me-2 align-bottom text-muted"></i>
                                                                Download </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>
                                                                Delete </BDropdownItem>
                                                        </BDropdown>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <div class="avatar-sm">
                                                                <div
                                                                    class="avatar-title bg-light text-primary rounded fs-24">
                                                                    <i class="ri-file-pdf-fill"></i>
                                                                </div>
                                                            </div>
                                                            <div class="ms-3 flex-grow-1">
                                                                <h5 class="fs-14 mb-0">
                                                                    <BLink href="javascript:void(0);" class="text-body">
                                                                        Bank Management System
                                                                    </BLink>
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>PDF File</td>
                                                    <td>8.89 MB</td>
                                                    <td>24 Nov 2021</td>
                                                    <td>
                                                        <BDropdown variant="link"
                                                            toggle-class="btn btn-soft-primary btn-sm btn-icon arrow-none"
                                                            menu-class="dropdown-menu-end"
                                                            :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                            <template #button-content>
                                                                <i class="ri-more-fill"></i>
                                                            </template>
                                                            <BDropdownItem><i
                                                                    class="ri-eye-fill me-2 align-bottom text-muted"></i>
                                                                View </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-download-2-fill me-2 align-bottom text-muted"></i>
                                                                Download </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>
                                                                Delete </BDropdownItem>
                                                        </BDropdown>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <div class="avatar-sm">
                                                                <div
                                                                    class="avatar-title bg-light text-primary rounded fs-24">
                                                                    <i class="ri-video-line"></i>
                                                                </div>
                                                            </div>
                                                            <div class="ms-3 flex-grow-1">
                                                                <h5 class="fs-14 mb-0">
                                                                    <BLink href="javascript:void(0);" class="text-body">
                                                                        Tour-video.mp4</BLink>
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>MP4 File</td>
                                                    <td>14.62 MB</td>
                                                    <td>19 Nov 2021</td>
                                                    <td>
                                                        <BDropdown variant="link"
                                                            toggle-class="btn btn-soft-primary btn-sm btn-icon arrow-none"
                                                            menu-class="dropdown-menu-end"
                                                            :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                            <template #button-content>
                                                                <i class="ri-more-fill"></i>
                                                            </template>
                                                            <BDropdownItem><i
                                                                    class="ri-eye-fill me-2 align-bottom text-muted"></i>
                                                                View </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-download-2-fill me-2 align-bottom text-muted"></i>
                                                                Download </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>
                                                                Delete </BDropdownItem>
                                                        </BDropdown>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <div class="avatar-sm">
                                                                <div
                                                                    class="avatar-title bg-light text-primary rounded fs-24">
                                                                    <i class="ri-file-excel-fill"></i>
                                                                </div>
                                                            </div>
                                                            <div class="ms-3 flex-grow-1">
                                                                <h5 class="fs-14 mb-0">
                                                                    <BLink href="javascript:void(0);" class="text-body">
                                                                        Account-statement.xsl
                                                                    </BLink>
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>XSL File</td>
                                                    <td>2.38 KB</td>
                                                    <td>14 Nov 2021</td>
                                                    <td>
                                                        <BDropdown variant="link"
                                                            toggle-class="btn btn-soft-primary btn-sm btn-icon arrow-none"
                                                            menu-class="dropdown-menu-end"
                                                            :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                            <template #button-content>
                                                                <i class="ri-more-fill"></i>
                                                            </template>
                                                            <BDropdownItem><i
                                                                    class="ri-eye-fill me-2 align-bottom text-muted"></i>
                                                                View </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-download-2-fill me-2 align-bottom text-muted"></i>
                                                                Download </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>
                                                                Delete </BDropdownItem>
                                                        </BDropdown>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <div class="avatar-sm">
                                                                <div
                                                                    class="avatar-title bg-light text-primary rounded fs-24">
                                                                    <i class="ri-folder-fill"></i>
                                                                </div>
                                                            </div>
                                                            <div class="ms-3 flex-grow-1">
                                                                <h5 class="fs-14 mb-0">
                                                                    <BLink href="javascript:void(0);" class="text-body">
                                                                        Project Screenshots
                                                                        Collection</BLink>
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>Folder File</td>
                                                    <td>87.24 MB</td>
                                                    <td>08 Nov 2021</td>
                                                    <td>
                                                        <BDropdown variant="link"
                                                            toggle-class="btn btn-soft-primary btn-sm btn-icon arrow-none"
                                                            menu-class="dropdown-menu-end"
                                                            :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                            <template #button-content>
                                                                <i class="ri-more-fill"></i>
                                                            </template>
                                                            <BDropdownItem><i
                                                                    class="ri-eye-fill me-2 align-bottom text-muted"></i>
                                                                View </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-download-2-fill me-2 align-bottom text-muted"></i>
                                                                Download </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>
                                                                Delete </BDropdownItem>
                                                        </BDropdown>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <div class="avatar-sm">
                                                                <div
                                                                    class="avatar-title bg-light text-primary rounded fs-24">
                                                                    <i class="ri-image-2-fill"></i>
                                                                </div>
                                                            </div>
                                                            <div class="ms-3 flex-grow-1">
                                                                <h5 class="fs-14 mb-0">
                                                                    <BLink href="javascript:void(0);" class="text-body">
                                                                        Velzon-logo.png</BLink>
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>PNG File</td>
                                                    <td>879 KB</td>
                                                    <td>02 Nov 2021</td>
                                                    <td>
                                                        <BDropdown variant="link"
                                                            toggle-class="btn btn-soft-primary btn-sm btn-icon arrow-none"
                                                            menu-class="dropdown-menu-end"
                                                            :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }">
                                                            <template #button-content>
                                                                <i class="ri-more-fill"></i>
                                                            </template>
                                                            <BDropdownItem><i
                                                                    class="ri-eye-fill me-2 align-bottom text-muted"></i>
                                                                View </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-download-2-fill me-2 align-bottom text-muted"></i>
                                                                Download </BDropdownItem>
                                                            <BDropdownItem><i
                                                                    class="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>
                                                                Delete </BDropdownItem>
                                                        </BDropdown>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="text-center mt-3">
                                        <BLink href="javascript:void(0);" class="text-primary "><i
                                                class="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i> Load
                                            more </BLink>
                                    </div>

                                </BRow>
                            </div>
                        </div>
                    </BTab>
                    <!-- <BTab title="Actividad" class="fw-semibold pt-2">
                        <BCard no-body>
                            <BCardBody>
                                <h5 class="card-title">Activities</h5>
                                <div class="acitivity-timeline py-3">
                                    <div class="acitivity-item d-flex">
                                        <div class="flex-shrink-0">
                                            <img src="@/assets/images/users/avatar-1.jpg" alt=""
                                                class="avatar-xs rounded-circle acitivity-avatar" />
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h6 class="mb-1">Oliver Phillips <BBadge variant="primary-subtle"
                                                    class="bg-primary-subtle text-primary align-middle">New</BBadge>
                                            </h6>
                                            <p class="text-muted mb-2">We talked about a project on linkedin.</p>
                                            <small class="mb-0 text-muted">Today</small>
                                        </div>
                                    </div>
                                    <div class="acitivity-item py-3 d-flex">
                                        <div class="flex-shrink-0 avatar-xs acitivity-avatar">
                                            <div class="avatar-title bg-success-subtle text-success rounded-circle">
                                                N
                                            </div>
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h6 class="mb-1">Nancy Martino <BBadge variant="secondary-subtle"
                                                    class="bg-secondary-subtle text-secondary align-middle">In
                                                    Progress</BBadge>
                                            </h6>
                                            <p class="text-muted mb-2"><i class="ri-file-text-line align-middle ms-2"></i>
                                                Create new project
                                                Building product</p>
                                            <div class="avatar-group mb-2">
                                                <BLink href="javascript: void(0);" class="avatar-group-item"
                                                    data-bs-toggle="tooltip" data-bs-placement="top" title=""
                                                    data-bs-original-title="Christi">
                                                    <img src="@/assets/images/users/avatar-4.jpg" alt=""
                                                        class="rounded-circle avatar-xs" />
                                                </BLink>
                                                <BLink href="javascript: void(0);" class="avatar-group-item"
                                                    data-bs-toggle="tooltip" data-bs-placement="top" title=""
                                                    data-bs-original-title="Frank Hook">
                                                    <img src="@/assets/images/users/avatar-3.jpg" alt=""
                                                        class="rounded-circle avatar-xs" />
                                                </BLink>
                                                <BLink href="javascript: void(0);" class="avatar-group-item"
                                                    data-bs-toggle="tooltip" data-bs-placement="top" title=""
                                                    data-bs-original-title=" Ruby">
                                                    <div class="avatar-xs">
                                                        <div class="avatar-title rounded-circle bg-light text-primary">
                                                            R
                                                        </div>
                                                    </div>
                                                </BLink>
                                                <BLink href="javascript: void(0);" class="avatar-group-item"
                                                    data-bs-toggle="tooltip" data-bs-placement="top" title=""
                                                    data-bs-original-title="more">
                                                    <div class="avatar-xs">
                                                        <div class="avatar-title rounded-circle">
                                                            2+
                                                        </div>
                                                    </div>
                                                </BLink>
                                            </div>
                                            <small class="mb-0 text-muted">Yesterday</small>
                                        </div>
                                    </div>
                                    <div class="acitivity-item py-3 d-flex">
                                        <div class="flex-shrink-0">
                                            <img src="@/assets/images/users/avatar-2.jpg" alt=""
                                                class="avatar-xs rounded-circle acitivity-avatar" />
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h6 class="mb-1">Natasha Carey <BBadge variant="success-subtle"
                                                    class="bg-success-subtle text-success align-middle">Completed</BBadge>
                                            </h6>
                                            <p class="text-muted mb-2">Adding a new event with attachments</p>
                                            <BRow>
                                                <BCol xxl="4">
                                                    <BRow class="border border-dashed gx-2 p-2 mb-2">
                                                        <BCol cols="4">
                                                            <img src="@/assets/images/small/img-2.jpg" alt=""
                                                                class="img-fluid rounded" />
                                                        </BCol>
                                                        <BCol cols="4">
                                                            <img src="@/assets/images/small/img-3.jpg" alt=""
                                                                class="img-fluid rounded" />
                                                        </BCol>
                                                        <BCol cols="4">
                                                            <img src="@/assets/images/small/img-4.jpg" alt=""
                                                                class="img-fluid rounded" />
                                                        </BCol>
                                                    </BRow>
                                                </BCol>
                                            </BRow>
                                            <small class="mb-0 text-muted">25 Nov</small>
                                        </div>
                                    </div>
                                    <div class="acitivity-item py-3 d-flex">
                                        <div class="flex-shrink-0">
                                            <img src="@/assets/images/users/avatar-6.jpg" alt=""
                                                class="avatar-xs rounded-circle acitivity-avatar" />
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h6 class="mb-1">Bethany Johnson</h6>
                                            <p class="text-muted mb-2">added a new member to velzon dashboard</p>
                                            <small class="mb-0 text-muted">19 Nov</small>
                                        </div>
                                    </div>
                                    <div class="acitivity-item py-3 d-flex">
                                        <div class="flex-shrink-0">
                                            <div class="avatar-xs acitivity-avatar">
                                                <div class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                    <i class="ri-shopping-bag-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h6 class="mb-1">Your order is placed <BBadge variant="danger-subtle"
                                                    class="bg-danger-subtle text-danger align-middle ms-1">Out of
                                                    Delivery</BBadge>
                                            </h6>
                                            <p class="text-muted mb-2">These customers can rest assured their order has
                                                been placed.</p>
                                            <small class="mb-0 text-muted">16 Nov</small>
                                        </div>
                                    </div>
                                    <div class="acitivity-item py-3 d-flex">
                                        <div class="flex-shrink-0">
                                            <img src="@/assets/images/users/avatar-7.jpg" alt=""
                                                class="avatar-xs rounded-circle acitivity-avatar" />
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h6 class="mb-1">Lewis Pratt</h6>
                                            <p class="text-muted mb-2">They all have something to say beyond the words
                                                on the page. They can come across as casual or neutral, exotic or
                                                graphic. </p>
                                            <small class="mb-0 text-muted">22 Oct</small>
                                        </div>
                                    </div>
                                    <div class="acitivity-item py-3 d-flex">
                                        <div class="flex-shrink-0">
                                            <div class="avatar-xs acitivity-avatar">
                                                <div class="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                    <i class="ri-line-chart-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h6 class="mb-1">Monthly sales report</h6>
                                            <p class="text-muted mb-2"><span class="text-danger">2 days left</span>
                                                notification to submit the monthly sales report. <BLink
                                                    href="javascript:void(0);"
                                                    class="link-primary text-decoration-underline">Reports Builder
                                                </BLink>
                                            </p>
                                            <small class="mb-0 text-muted">15 Oct</small>
                                        </div>
                                    </div>
                                    <div class="acitivity-item d-flex">
                                        <div class="flex-shrink-0">
                                            <img src="@/assets/images/users/avatar-8.jpg" alt=""
                                                class="avatar-xs rounded-circle acitivity-avatar" />
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h6 class="mb-1">New ticket received <BBadge variant="success-subtle"
                                                    class="bg-success-subtle text-success align-middle">Completed</BBadge>
                                            </h6>
                                            <p class="text-muted mb-2">User <span class="text-secondary">Erica245</span>
                                                submitted a ticket.</p>
                                            <small class="mb-0 text-muted">26 Aug</small>
                                        </div>
                                    </div>
                                </div>
                            </BCardBody>
                        </BCard>
                    </BTab> -->
                    <BTab title="Respuesta" class="fw-semibold pt-2">
                        <template #title>
                            <i class="las la-check-circle align-middle me-1"></i> Respuesta al Ciudadano
                        </template>


                        <BCardBody>
                            
                            <div class="ckeditor-classic">
                                <ckeditor v-model="editorData" :editor="editor"></ckeditor>
                            </div>
                        </BCardBody>

                        

                    </BTab>
                </BTabs>
            </BCol>
        </BRow>
    </Layout>
</template>
