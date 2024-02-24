<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";

export default {
    components: {
        Layout,
        PageHeader,
    },
};
</script>

<template>
    <Layout>
        <PageHeader title="Tipo de documentos" pageTitle="menú" />
        <BRow>
            <BCol lg="12">
                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Areas</BCardTitle>
                    </BCardHeader>
                    <BCardBody>
                        <div class="sitemap-content">
                            <BAccordion free>
                                <BAccordionItem title="GERENCIA #10000">
                                    <BAccordion free>
                                        <BAccordionItem title="ACTOS ADMINISTRATIVOS #10002">
                                            <BAccordion free>
                                                <BAccordionItem title="Acuerdos #1000212">
                                                    <h5><BBadge>Acuerdos de Aprobación del Presupuesto</BBadge></h5>
                                                    <h5><BBadge>Acuerdo Modificación del presupuesto</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem title="Circulares #1000213">
                                                    <h5><BBadge>Consecutivo de Circulares</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem title="Resoluciones #1000214">
                                                    <h5><BBadge>Consecutivo de Resoluciones</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem title="COMUNICACIONES OFICIALES #10003">
                                            <BAccordion free>
                                                <BAccordionItem title="Comunicaciones Oficiales Despachadas y Recibidas #1000315">
                                                    <h5><BBadge>Comunicaciones Oficiales Recibidas</BBadge></h5>
                                                    <h5><BBadge>Comunicaciones Oficiales Despachadas</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem title="INFORMES #10007">
                                            <BAccordion free>
                                                <BAccordionItem title="Informes a Junta Directiva #1000721"/>
                                                <BAccordionItem title="Informes periódicos  de Gestión #1000722"/>
                                                <BAccordionItem title="Informe consolidado de Rendición y cuentas #1000723"/>
                                                <BAccordionItem title="Informes a la Alcaldía #1000724"/>
                                                <BAccordionItem title="Informes al Concejo #1000725"/>
                                                <BAccordionItem title="Informes a Entes de Control y vigilancia #1000727" />
                                                <BAccordionItem title="Informe Austeridad del Gasto #1000726" >
                                                    <h5><BBadge>Informe</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem title="Rendición de Cuentas Semestral #1000733" >
                                                    <h5><BBadge>Rendición de Cuentas Fiduprevisora PAP EDT</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem title="PLANES #10009">
                                            <BAccordion free>
                                                <BAccordionItem title="Plan Anticorrupción y Atención al Ciudadano #1000956" >
                                                    <h5><BBadge>Plan</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem title="Plan de Acción #1000957" >
                                                    <h5><BBadge>Plan de Acción Formulado</BBadge></h5>
                                                    <h5><BBadge>Acciones de Mejoramiento</BBadge></h5>
                                                    <h5><BBadge>Acta de reunión</BBadge></h5>
                                                    <h5><BBadge>Registro de asistencia</BBadge></h5>
                                                    <h5><BBadge>Informes de seguimiento</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem title="Plan Anual de Contratación #1000959" >
                                                    <h5><BBadge>Plan</BBadge></h5>
                                                    <h5><BBadge>Informes</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                    </BAccordion>
                                </BAccordionItem>
                                <BAccordionItem title="JURIDICA #10100">
                                        <BAccordionItem title="COMUNICACIONES OFICIALES #101003">
                                            <BAccordion free>
                                                <BAccordionItem title="Comunicaciones Oficiales Despachadas y Recibidas #10100315" >
                                                    <h5><BBadge>Comunicaciones Oficiales Recibidas</BBadge></h5>
                                                    <h5><BBadge>Comunicaciones Oficiales Despachadas</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem title="INFORMES #101003">
                                            <BAccordion free>
                                                <BAccordionItem title="Informes a Entidades de Control #1010028" >
                                                    <h5><BBadge>Comunicaciones oficiales</BBadge></h5>
                                                    <h5><BBadge>Informe</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem title="Informes periódicos  de Gestión #1010022" >
                                                    <h5><BBadge>Comunicación</BBadge></h5>
                                                    <h5><BBadge>Informe</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem title="PETICIONES, SOLICITUDES Y  RECLAMACIONES ADMINISTRATIVAS #1010015">
                                            <BAccordion free>
                                                <BAccordionItem title="Atención Derechos de Petición #101001588" >
                                                    <h5><BBadge>Oficio del peticionario</BBadge></h5>
                                                    <h5><BBadge>Respuesta al peticionario</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem title="Requerimientos Judiciales #1010015109" >
                                                    <h5><BBadge>Comunicación de Requerimiento</BBadge></h5>
                                                    <h5><BBadge>Solicitud de un documento al área competente por correo electrónico</BBadge></h5>
                                                    <h5><BBadge>Solicitud de Prórroga (si hubiere lugar a ello)</BBadge></h5>
                                                    <h5><BBadge>Remisión al despacho judicial del oficio de respuesta</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem title="PROCESOS #1010016">
                                            <BAccordion free>
                                                <BAccordionItem title="Procesos Judiciales #1010016113" >
                                                    <h5><BBadge>Notificación, demanda y anexos</BBadge></h5>
                                                    <h5><BBadge>Poder</BBadge></h5>
                                                    <h5><BBadge>Contestación de la demanda</BBadge></h5>
                                                    <h5><BBadge>Autos</BBadge></h5>
                                                    <h5><BBadge>Alegatos</BBadge></h5>
                                                    <h5><BBadge>Fallo de primera instancia</BBadge></h5>
                                                    <h5><BBadge>Acta comité de conciliación (si hubiere lugar a ello)</BBadge></h5>
                                                    <h5><BBadge>Apelación fallo de primera instancia</BBadge></h5>
                                                    <h5><BBadge>Acta audiencia de conciliación como requisito de procedibilidad para el trámite de apelación (si hubiere lugar a ello)</BBadge></h5>
                                                    <h5><BBadge>Fallo de segunda instancia</BBadge></h5>
                                                    <h5><BBadge>Recurso de casación</BBadge></h5>
                                                    <h5><BBadge>Sustentación recurso de casación ó Réplica</BBadge></h5>
                                                    <h5><BBadge>Fallo de casación</BBadge></h5>
                                                    <h5><BBadge>Auto obedézcase y cúmplase</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                </BAccordionItem>
                                <BAccordionItem title="Accordion Item #3">
                                    <strong>This is the third item's accordion body.</strong> It is hidden by default, until the
                                    collapse plugin adds the appropriate classes that we use to style each element. These classes
                                    control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                                    modify any of this with custom CSS or overriding our default variables. It is also worth noting
                                    that just about any HTML can go within the <code>default</code> slot, though the transition does
                                    limit overflow.
                                </BAccordionItem>
                            </BAccordion>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>