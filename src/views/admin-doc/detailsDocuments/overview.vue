<script>
import { reactive } from "vue";
import Layout from "@/layouts/main.vue";
import {
    getDocument,
    getDocumentFilesUploads,
} from "@/services/docservice/doc.service";

import overview_summaryVue from "./components/overview_summary.vue";
import overview_documentsVue from "./components/overview_documents.vue";
import overview_responseVue from "./components/overview_response.vue";

import transform_date from "@/helpers/transform_date";

export default {
    setup() {
        const state = reactive({
            content:
                "<h3><span class='ql-size-large;'>Hello World!</span></h3><p><br></p><h3>This is an simple editable area.</h3><p><br></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p><br></p><p>End of simple area</p>",
            _content: "",
            disabled: false,
        });
        return {
            state,
        };
    },
    data() {
        return {
            data: "",
            id: "",
            files: [],
            entryDate: "",
            expirationDate: "",
        };
    },

    async mounted() {
        console.log(this.$route.query.id);
        this.id = this.$route.query.id;
        const docData = await getDocument("BAQVERDE", this.id);
        if (docData?.entryDate && docData?.entryDate.seconds) {
            const formattedDate = transform_date(docData?.entryDate.seconds); // Formatear fecha
            this.entryDate = formattedDate; // Guardar la fecha formateada
        }

        if (docData?.expirationDate && docData?.expirationDate.seconds) {
            const formattedDate = transform_date(
                docData?.expirationDate.seconds
            ); // Formatear fecha
            this.expirationDate = formattedDate; // Guardar la fecha formateada
        }

        this.data = {
            id: this.id,
            numberEntryClaim: docData?.numberEntryClaim || "No definido",
            area: docData?.area || "No definido",
            documentaryTypologyOut:
                docData?.documentaryTypologyOut || "No definido",
            entryDate: this.entryDate || "No definido",
            status:
                docData?.status?.toUpperCase() == "COMPLETED"
                    ? "COMPLETADO"
                    : docData?.status?.toUpperCase() == "INPROGRESS"
                    ? "EN PROGRESO"
                    : docData?.status?.toUpperCase() == "PENDING"
                    ? "PENDIENTE"
                    : docData?.status?.toUpperCase() == "CREATED"
                    ? "CREADO"
                    : docData?.status?.toUpperCase() || "No definido",
            expirationDate: this.expirationDate || "No definido",
            priority: docData?.priority || "BAJA",
            serie: docData?.serie,
            subSerie: docData?.subSerie,
            externalRadicate: docData?.externalRadicate,
            assignedTo: docData?.assignedTo,
            folios: docData?.folios,
            observations: docData?.observations,
            summary:
                docData?.summary?.replace("<p>", "").replace("</p>", "") ||
                "No definido",
            personType: docData?.petitionerInformation?.personType,
            IdentificationType:
                docData?.petitionerInformation?.identificationType,
            identificationNumber:
                docData?.petitionerInformation?.identificationNumber,
            fullName:
                docData?.petitionerInformation?.firstNames +
                    " " +
                    docData?.petitionerInformation?.firstNames || "No definido",
            email: docData?.petitionerInformation?.email || "No definido",
            phoneNumber:
                docData?.petitionerInformation?.phoneNumber || "No definido",
            address: docData?.petitionerInformation?.address || "No definido",
        };
        await getDocumentFilesUploads("BAQVERDE", this.id).then((data) => {
            console.log(data);
            this.files = data;
        });
    },

    components: {
        Layout,
        overview_summaryVue,
        overview_documentsVue,
        overview_responseVue,
    },

    methods: {
        toggleFavourite(ele) {
            ele.target.closest(".favourite-btn").classList.toggle("active");
        },
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
                                                <h4 class="fw-bold">
                                                    {{ data.numberEntryClaim }}
                                                    -
                                                    {{
                                                        data.documentaryTypologyOut
                                                    }}
                                                </h4>
                                                <div
                                                    class="hstack gap-3 flex-wrap"
                                                >
                                                    <div>
                                                        <i
                                                            class="ri-building-line align-bottom me-1"
                                                        ></i>
                                                        {{ data.area }}
                                                    </div>
                                                    <div class="vr"></div>
                                                    <div>
                                                        Fecha de creación :
                                                        <span
                                                            class="fw-medium"
                                                            >{{
                                                                data.entryDate
                                                            }}</span
                                                        >
                                                    </div>
                                                    <div class="vr"></div>
                                                    <div>
                                                        Fecha limite :
                                                        <span
                                                            class="fw-medium"
                                                            >{{
                                                                data.expirationDate
                                                            }}</span
                                                        >
                                                    </div>
                                                    <div class="vr"></div>
                                                    <BBadge
                                                        pill
                                                        :variant="
                                                            data?.status?.toLowerCase() ==
                                                            'completado'
                                                                ? 'success'
                                                                : data?.status?.toLowerCase() ==
                                                                  'en progreso'
                                                                ? 'info'
                                                                : data?.status?.toLowerCase() ==
                                                                  'pendiente'
                                                                ? 'warning'
                                                                : data?.status?.toLowerCase() ==
                                                                  'creado'
                                                                ? 'primary'
                                                                : 'danger'
                                                        "
                                                        >{{
                                                            data.status
                                                        }}</BBadge
                                                    >
                                                    <BBadge
                                                        pill
                                                        :variant="
                                                            data?.priority?.toLowerCase() ==
                                                            'alta'
                                                                ? 'danger'
                                                                : data?.priority?.toLowerCase() ==
                                                                      'media' ||
                                                                  data?.priority?.toLowerCase() ==
                                                                      'no definido'
                                                                ? 'warning'
                                                                : 'info'
                                                        "
                                                        >{{
                                                            data.priority
                                                        }}</BBadge
                                                    >
                                                </div>
                                            </div>
                                        </BCol>
                                    </BRow>
                                </BCol>
                                <BCol md="auto">
                                    <div class="hstack gap-1 flex-wrap">
                                        <button
                                            type="button"
                                            class="btn py-0 fs-16 favourite-btn active"
                                        >
                                            <i
                                                class="ri-star-fill"
                                                @click="toggleFavourite"
                                            ></i>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn py-0 fs-16 text-body"
                                        >
                                            <i class="ri-share-line"></i>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn py-0 fs-16 text-body"
                                        >
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
                <BTabs
                    variant="link"
                    nav-class="nav-tabs-custom border-bottom-0"
                >
                    <!-- Resumen -->
                    <overview_summaryVue :data="data" :files="files" />

                    <overview_documentsVue :data="data" :files="files" />
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
                    <overview_responseVue />
                </BTabs>
            </BCol>
        </BRow>
    </Layout>
</template>
