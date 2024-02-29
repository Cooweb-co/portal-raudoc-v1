<script>
// import simplebar from "simplebar-vue";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";

import Layout from "@/layouts/main.vue";

export default {
    components: {
        Layout,
        Multiselect,
        // simplebar
    },
};
</script>

<template>
    <Layout>
        <BRow>
            <BCol lg="12">
                <BCard no-body class="mt-n4 mx-n4 mb-n5 border-0">
                    <div class="bg-primary-subtle">
                        <BCardBody class="pb-4 mb-5">
                            <BRow>
                                <BCol md>
                                    <BRow class="align-items-center">
                                        <BCol md="auto">
                                            <div class="avatar-md mb-md-0 mb-4">
                                                <div class="avatar-title bg-white rounded-circle">
                                                    <img src="@/assets/images/companies/img-4.png" alt=""
                                                        class="avatar-sm" />
                                                </div>
                                            </div>
                                        </BCol>
                                        <BCol md>
                                            <h4 class="fw-semibold">#TI-2881 - Denuncia por quema de arboles 
                                            </h4>
                                            <div class="hstack gap-3 flex-wrap">
                                                <div class="text-muted"><i
                                                        class="ri-building-line align-bottom me-1"></i> Juridica
                                                </div>
                                                <div class="vr"></div>
                                                <div class="text-muted">Fecha de Creación : <span class="fw-medium">20 Ene,
                                                        2021</span></div>
                                                <div class="vr"></div>
                                                <div class="text-muted">Fecha limite : <span class="fw-medium">29 Feb,
                                                        2021</span></div>
                                                <div class="vr"></div>
                                                <BBadge pill class="bg-primary fs-12">Nuevo</BBadge>
                                                <BBadge pill variant="success" class="fs-12">Alto</BBadge>
                                            </div>
                                        </BCol>
                                    </BRow>
                                </BCol>
                                <BCol md="auto" class="mt-md-0 mt-4">
                                    <div class="hstack gap-1 flex-wrap">
                                        <button type="button" class="btn avatar-xs mt-n1 p-0 favourite-btn active">
                                            <span class="avatar-title bg-transparent fs-15">
                                                <i class="ri-star-fill"></i>
                                            </span>
                                        </button>
                                        <BDropdown variant="transparent" toggle-class="fs-16 text-body arrow-none"
                                            size="sm" no-caret>
                                            <template #button-content> <i class="ri-share-line"></i>
                                            </template>
                                            <BDropdownItem to="/apps/tickets-details">
                                                <i class="ri-eye-fill align-bottom me-2 text-muted"></i> View
                                            </BDropdownItem>
                                            <BDropdownItem href="#" >
                                                <i class="ri-share-forward-fill align-bottom me-2 text-muted"></i> Share
                                                with
                                            </BDropdownItem>
                                            <BDropdownItem href="#">
                                                <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete
                                            </BDropdownItem>
                                        </BDropdown>
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
            <BCol xxl="9">

                

                    

                        <BCard no-body>
                            
                    <BCardBody class="p-4">

                      

                        <BTabs variant="link" nav-class="nav-tabs-custom border-bottom-0">
                                <BTab title="Resumen" active class="fw-semibold pt-2">
                                    
                                </BTab>

                                <BTab title="Generar Respuesta" active class="fw-semibold pt-2">
                                    
                                </BTab>

                                <BTab title="Vista previa de documento" active class="fw-semibold pt-2">
                                    
                                </BTab>
                            </BTabs>

                      


                        <h6 class="fw-semibold text-uppercase mb-3">Resumen</h6>
                        <p class="text-muted">El documento es una denuncia por tala ilegal de árboles en una zona protegida. El denunciante, Pedro Pérez, acusa a Juan López de talar árboles sin autorización en la Carrera 10 # 12-34, Bogotá, Colombia. La tala ha generado un problema de contaminación ambiental en el sector, afectando la salud y el bienestar de los residentes.

El denunciante solicita a la autoridad ambiental que investigue el caso y sancione al responsable. Además, solicita que se tomen medidas para remediar el daño ambiental causado por la tala ilegal, como la reforestación de la zona afectada. 
                        </p>

                        <h6 class="fw-semibold text-uppercase mb-3">Hechos</h6>
                        <p class="text-muted">El Sr. Pedro Pérez denuncia al Sr. Juan López por la tala ilegal de árboles en una zona protegida ubicada en la Carrera 10 # 12-34, Bogotá, Colombia. La tala se realizó sin la debida autorización y ha generado un problema de contaminación ambiental en el sector, afectando la salud y el bienestar de los residentes.</p>
                        <h6 class="fw-semibold text-uppercase mb-3">Solicitud</h6>
                        <p class="text-muted">Se solicita a la autoridad ambiental que investigue este caso y tome las medidas necesarias para sancionar al Sr. López. Además, se solicita que se tomen medidas para remediar el daño ambiental causado por la tala ilegal, como la reforestación de la zona afectada.</p>
                        <h6 class="fw-semibold text-uppercase mb-3">Información de contacto</h6>
                        <ul>
                            <li><strong>Nombre del denunciante:</strong> Pedro Pérez</li>
                            <li><strong>Dirección:</strong> Carrera 11 # 13-45, Bogotá, Colombia</li>
                            <li><strong>Teléfono:</strong> +57 123456789</li>
                            <li><strong>Correo electrónico:</strong> pedro.perez@correo.com</li>
                        </ul>


                      
                    </BCardBody>
                    <!-- <BCardBody class="p-4">
                        <h5 class="card-title mb-4">Comentarios</h5>

                        <simplebar data-simplebar style="height: 300px;" class="px-3 mx-n3">
                            <div class="d-flex mb-4">
                                <div class="flex-shrink-0">
                                    <img src="@/assets/images/users/avatar-8.jpg" alt=""
                                        class="avatar-xs rounded-circle" />
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <h5 class="fs-13">Joseph Parker <small class="text-muted">20 Dec 2021 -
                                            05:47AM</small></h5>
                                    <p class="text-muted">I am getting message from customers that when they place order
                                        always get error message .</p>
                                    <BLink href="javascript: void(0);" class="badge text-muted bg-light"><i
                                            class="mdi mdi-reply"></i> Reply</BLink>
                                    <div class="d-flex mt-4">
                                        <div class="flex-shrink-0">
                                            <img src="@/assets/images/users/avatar-10.jpg" alt=""
                                                class="avatar-xs rounded-circle" />
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h5 class="fs-13">Alexis Clarke <small class="text-muted">22 Dec 2021 -
                                                    02:32PM</small></h5>
                                            <p class="text-muted">Please be sure to check your Spam mailbox to see if
                                                your email filters have identified the email from Dell as spam.</p>
                                            <BLink href="javascript: void(0);" class="badge text-muted bg-light"><i
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
                                    <h5 class="fs-13">Donald Palmer <small class="text-muted">24 Dec 2021 -
                                            05:20PM</small></h5>
                                    <p class="text-muted">If you have further questions, please contact Customer Support
                                        from the “Action Menu” on your <BLink href="javascript:void(0);"
                                            class="text-decoration-underline">Online Order Support</BLink>.</p>
                                    <BLink href="javascript: void(0);" class="badge text-muted bg-light"><i
                                            class="mdi mdi-reply"></i> Reply</BLink>
                                </div>
                            </div>
                            <div class="d-flex">
                                <div class="flex-shrink-0">
                                    <img src="@/assets/images/users/avatar-10.jpg" alt=""
                                        class="avatar-xs rounded-circle" />
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <h5 class="fs-13">Alexis Clarke <small class="text-muted">26 min ago</small></h5>
                                    <p class="text-muted">Your <BLink href="javascript:void(0)"
                                            class="text-decoration-underline">Online Order Support</BLink> provides you
                                        with
                                        the most current status of your order. To help manage your order refer to the
                                        “Action Menu” to initiate return, contact Customer Support and more.</p>
                                    <BRow class="g-2 mb-3">
                                        <BCol lg="1" sm="2" cols="6">
                                            <img src="@/assets/images/small/img-4.jpg" alt="" class="img-fluid rounded">
                                        </BCol>
                                        <BCol lg="1" sm="2" cols="6">
                                            <img src="@/assets/images/small/img-5.jpg" alt="" class="img-fluid rounded">
                                        </BCol>
                                    </BRow>
                                    <BLink href="javascript: void(0);" class="badge text-muted bg-light"><i
                                            class="mdi mdi-reply"></i> Reply</BLink>
                                    <div class="d-flex mt-4">
                                        <div class="flex-shrink-0">
                                            <img src="@/assets/images/users/avatar-6.jpg" alt=""
                                                class="avatar-xs rounded-circle" />
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h5 class="fs-13">Donald Palmer <small class="text-muted">8 sec ago</small>
                                            </h5>
                                            <p class="text-muted">Other shipping methods are available at checkout if
                                                you want your purchase delivered faster.</p>
                                            <BLink href="javascript: void(0);" class="badge text-muted bg-light"><i
                                                    class="mdi mdi-reply"></i> Reply</BLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </simplebar>
                        <form action="javascript:void(0);" class="mt-3">
                            <BRow class="g-3">
                                <BCol lg="12">
                                    <label for="exampleFormControlTextarea1" class="form-label">Leave a Comments</label>
                                    <textarea class="form-control bg-light border-light"
                                        id="exampleFormControlTextarea1" rows="3"
                                        placeholder="Enter comments"></textarea>
                                </BCol>
                                <BCol lg="12" class="text-end">
                                    <BLink href="javascript:void(0);" class="btn btn-primary">Post Comments</BLink>
                                </BCol>
                            </BRow>
                        </form>
                    </BCardBody> -->
                </BCard>
            </BCol>
            <BCol xxl="3">
                <BCard no-body>
                    <BCardHeader>
                        <h5 class="card-title mb-0">Ticket Details</h5>
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
                                        <td class="fw-medium">Estatus:</td>
                                        <td>
                                            <Multiselect v-model="value" :close-on-select="true" :searchable="true"
                                                :create-option="true" :options="[
                                                    { value: 'new', label: 'New' },
                                                    { value: 'open', label: 'Open' },
                                                    { value: 'inprogress', label: 'Inprogress' },
                                                    { value: 'closed', label: 'Closed' }
                                                ]" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-medium">Priority</td>
                                        <td>
                                            <BBadge variant="success">High</BBadge>
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
                    <BCardHeader>
                        <h6 class="card-title fw-semibold mb-0">Archivos Adjuntos</h6>
                    </BCardHeader>
                    <BCardBody>
                        <div class="d-flex align-items-center border border-dashed p-2 rounded">
                            <div class="flex-shrink-0 avatar-sm">
                                <div class="avatar-title bg-light rounded">
                                    <i class="ri-file-zip-line fs-20 text-primary"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="mb-1">
                                    <BLink href="javascript:void(0);" class="link-secondary">Derecho de peteicion.pdf</BLink>
                                </h6>
                                <small class="text-muted">3.2 MB</small>
                            </div>
                            <div class="hstack gap-3 fs-16">
                                <BLink href="javascript:void(0);" class="text-muted"><i class="ri-download-2-line"></i>
                                </BLink>
                                <BLink href="javascript:void(0);" class="text-muted"><i class="ri-delete-bin-line"></i>
                                </BLink>
                            </div>
                        </div>
                        <div class="d-flex  align-items-center border border-dashed p-2 rounded mt-2">
                            <div class="flex-shrink-0 avatar-sm">
                                <div class="avatar-title bg-light rounded">
                                    <i class="ri-file-ppt-2-line fs-20 text-primary"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="mb-1">
                                    <BLink href="javascript:void(0);" class="link-secondary">Cedula.jpg</BLink>
                                </h6>
                                <small class="text-muted">4.5 MB</small>
                            </div>
                            <div class="hstack gap-3 fs-16">
                                <BLink href="javascript:void(0);" class="text-muted"><i class="ri-download-2-line"></i>
                                </BLink>
                                <BLink href="javascript:void(0);" class="text-muted"><i class="ri-delete-bin-line"></i>
                                </BLink>
                            </div>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>