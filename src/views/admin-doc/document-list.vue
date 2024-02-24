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
                                <BAccordionItem>
                                    <template #title>
                                                        <h5 class="mb-0">GERENCIA <BBadge variant="light">#10000</BBadge></h5>
                                    </template>
                                    <BAccordion free>
                                        <BAccordionItem>
                                            <template #title>
                                                        <h6>ACTOS ADMINISTRATIVOS <BBadge variant="primary">#100002</BBadge></h6>
                                            </template>
                                            <BAccordion free>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Acuerdos <BBadge variant="primary">#10000212</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Acuerdos de Aprobación del Presupuesto</BBadge></h5>
                                                    <h5><BBadge>Acuerdo Modificación del presupuesto</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Circulares <BBadge variant="primary">#10000213</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Consecutivo de Circulares</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Resoluciones <BBadge variant="primary">#10000214</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Consecutivo de Resoluciones</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem>
                                            <template #title>
                                                        <h6>COMUNICACIONES OFICIALES <BBadge variant="primary">#100003</BBadge></h6>
                                            </template>
                                            <BAccordion free>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Comunicaciones Oficiales Despachadas y Recibidas <BBadge variant="primary">#10000315</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Comunicaciones Oficiales Recibidas</BBadge></h5>
                                                    <h5><BBadge>Comunicaciones Oficiales Despachadas</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem title="INFORMES #10007">
                                            <template #title>
                                                        <h6>INFORMES <BBadge variant="primary">#100007</BBadge></h6>
                                            </template>
                                            <BAccordion free>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Informes a Junta Directiva <BBadge variant="primary">#10000721</BBadge></h6>
                                                    </template>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Informes eriódicos  de Gestión <BBadge variant="primary">#10000722</BBadge></h6>
                                                    </template>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Informe consolidado de Rendición y cuentas <BBadge variant="primary">#10000723</BBadge></h6>
                                                    </template>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Informe a la Alcaldía <BBadge variant="primary">#10000724</BBadge></h6>
                                                    </template>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Informe al Concejo <BBadge variant="primary">#10000725</BBadge></h6>
                                                    </template>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Informe a Entes de Control y vigilancia <BBadge variant="primary">#10000727</BBadge></h6>
                                                    </template>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Informe Austeridad del Gasto <BBadge variant="primary">#10000726</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Informe</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Rendición de Cuentas Semestral <BBadge variant="primary">#10000733</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Rendición de Cuentas Fiduprevisora PAP EDT</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem title="PLANES #10009">
                                            <template #title>
                                                        <h6>PLANES <BBadge variant="primary">#100009</BBadge></h6>
                                            </template>
                                            <BAccordion free>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Plan Anticorrupción y Atención al Ciudadano <BBadge variant="primary">#10000956</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Plan</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Plan de Acción <BBadge variant="primary">#10000957</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Plan de Acción Formulado</BBadge></h5>
                                                    <h5><BBadge>Acciones de Mejoramiento</BBadge></h5>
                                                    <h5><BBadge>Acta de reunión</BBadge></h5>
                                                    <h5><BBadge>Registro de asistencia</BBadge></h5>
                                                    <h5><BBadge>Informes de seguimiento</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Plan Anual de Contratación <BBadge variant="primary">#10000959</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Plan</BBadge></h5>
                                                    <h5><BBadge>Informes</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                    </BAccordion>
                                </BAccordionItem>
                                <BAccordionItem>
                                        <template #title>
                                                        <h5 class="mb-0">JURIDICA <BBadge variant="light">#10100</BBadge></h5>
                                        </template>
                                        <BAccordionItem>
                                            <template #title>
                                                        <h6>COMUNICACIONES OFICIALES <BBadge variant="primary">#101003</BBadge></h6>
                                        </template>
                                            <BAccordion free>
                                                <BAccordionItem >
                                                    <template #title>
                                                        <h6>Comunicaciones Oficiales Despachadas y Recibidas <BBadge variant="primary">#10100315</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Comunicaciones Oficiales Recibidas</BBadge></h5>
                                                    <h5><BBadge>Comunicaciones Oficiales Despachadas</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem>
                                            <template #title>
                                                        <h6>INFORMES <BBadge variant="primary">#101003</BBadge></h6>
                                                    </template>
                                            <BAccordion free>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Informes a Entidades de Control <BBadge variant="primary">#1010028</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Comunicaciones oficiales</BBadge></h5>
                                                    <h5><BBadge>Informe</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Informes periódicos  de Gestión  <BBadge variant="primary">#1010022</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Comunicación</BBadge></h5>
                                                    <h5><BBadge>Informe</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem>
                                            <template #title>
                                                        <h6>PETICIONES, SOLICITUDES Y  RECLAMACIONES ADMINISTRATIVAS <BBadge variant="primary">#1010015</BBadge></h6>
                                            </template>
                                            <BAccordion free>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Atención Derechos de Petición <BBadge variant="primary">#101001588</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Oficio del peticionario</BBadge></h5>
                                                    <h5><BBadge>Respuesta al peticionario</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Requerimientos Judiciales <BBadge variant="primary">#1010015109</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Comunicación de Requerimiento</BBadge></h5>
                                                    <h5><BBadge>Solicitud de un documento al área competente por correo electrónico</BBadge></h5>
                                                    <h5><BBadge>Solicitud de Prórroga (si hubiere lugar a ello)</BBadge></h5>
                                                    <h5><BBadge>Remisión al despacho judicial del oficio de respuesta</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                        </BAccordionItem>
                                        <BAccordionItem>
                                            <template #title>
                                                        <h6>PROCESOS <BBadge variant="primary">#1010016</BBadge></h6>
                                                    </template>
                                            <BAccordion free>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Procesos Judiciales  <BBadge variant="primary">#1010016113</BBadge></h6>
                                                    </template>
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
                                <BAccordionItem>
                                    <template #title>
                                                    <h5 class="mb-0">GESTIÓN HUMANA <BBadge variant="light">#10300</BBadge></h5>
                                    </template>
                                    <BAccordionItem>
                                            <template #title>
                                                    <h6>HISTORIA LABORAL <BBadge variant="primary">#1030032</BBadge></h6>
                                            </template>
                                            <h5><BBadge>Hoja de Vida</BBadge></h5>
                                            <h5><BBadge>Hoja de vida Formato Único de la Función Pública</BBadge></h5>
                                            <h5><BBadge>Cédula de Ciudadanía (Fotocopia)</BBadge></h5>
                                            <h5><BBadge>Certificados  Antecedentes Disciplinarios y Judiciales</BBadge></h5>
                                            <h5><BBadge>Examen Médico</BBadge></h5>
                                            <h5><BBadge>Certificado de Estudio</BBadge></h5>
                                            <h5><BBadge>Certificados Laborales</BBadge></h5>
                                            <h5><BBadge>Estudio Técnico de Requisitos</BBadge></h5>
                                            <h5><BBadge>Resolución de Nombramiento o Contrato de Trabajo</BBadge></h5>
                                            <h5><BBadge>Declaración Juramentada de bienes y rentas</BBadge></h5>
                                            <h5><BBadge>Formulario de afiliación EPS</BBadge></h5>
                                            <h5><BBadge>Afiliación ARP</BBadge></h5>
                                            <h5><BBadge>Formulario de Afiliación Pensión</BBadge></h5>
                                            <h5><BBadge>Acta de Posesión</BBadge></h5>
                                            <h5><BBadge>Liquidación Parcial de Cesantías</BBadge></h5>
                                            <h5><BBadge>Comunicaciones al Fondo de Cesantías</BBadge></h5>
                                            <h5><BBadge>Solicitud de Inscripción y Actualización  del Servicio Civil</BBadge></h5>
                                            <h5><BBadge>Comunicaciones al Fondo de Cesantías</BBadge></h5>
                                            <h5><BBadge>Certificados de Tiempo de Servicios</BBadge></h5>
                                            <h5><BBadge>Certificado para Bono Pensional</BBadge></h5>
                                            <h5><BBadge>Licencia de Maternidad</BBadge></h5>
                                            <h5><BBadge>Licencias Ordinarias</BBadge></h5>
                                            <h5><BBadge>Certificado de Incapacidad</BBadge></h5>
                                            <h5><BBadge>Permisos</BBadge></h5>
                                            <h5><BBadge>Certificado de Salarios</BBadge></h5>
                                            <h5><BBadge>Resolución de _Reconocimiento de Prestaciones Sociales</BBadge></h5>
                                            <h5><BBadge>Resolución de Liquidación de Prestaciones</BBadge></h5>
                                            <h5><BBadge>Evaluación de Desempeño Laboral</BBadge></h5>
                                            <h5><BBadge>Procesos Disciplinarios: oficios, Quejas, Fallos</BBadge></h5>
                                            <h5><BBadge>Resolución de Comisión de Servicios y/o Estudios</BBadge></h5>
                                            <h5><BBadge>Cesantías Parciales  Retroactivas</BBadge></h5>
                                            <h5><BBadge>Cesantías Parciales Fondo Privado</BBadge></h5>
                                            <h5><BBadge>Cesantías definitivas Régimen Retroactivo</BBadge></h5>
                                            <h5><BBadge>Solicitud de peticiones</BBadge></h5>
                                            <h5><BBadge>Anexos</BBadge></h5>
                                            <h5><BBadge>Respuestas</BBadge></h5>
                                            <h5><BBadge>Reportes de Accidentes de Trabajo</BBadge></h5>
                                            <h5><BBadge>Otras situaciones administrativas</BBadge></h5>
                                    </BAccordionItem>
                                    <BAccordionItem>
                                        <template #title>
                                                    <h6>NOMINAS <BBadge variant="primary">#1030034</BBadge></h6>
                                            </template>
                                            <BAccordion free>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Nómina Fin de mes <BBadge variant="primary">#1030034141</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Registro de novedades</BBadge></h5>
                                                    <h5><BBadge>Devengados y deducciones</BBadge></h5>
                                                    <h5><BBadge>Total por centro de costo</BBadge></h5>
                                                    <h5><BBadge>Neto a pagar</BBadge></h5>
                                                    <h5><BBadge>Oficio remisorio</BBadge></h5>
                                                    <h5><BBadge>Oficio de novedades del  mes</BBadge></h5>
                                                    <h5><BBadge>Soportes</BBadge></h5>
                                                    <h5><BBadge>Facturas, libranzas</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                    </BAccordionItem>
                                    <BAccordionItem>
                                            <template #title>
                                                    <h6>PLANES <BBadge variant="primary">#1030009</BBadge></h6>
                                            </template>
                                            <BAccordion free>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Plan de Acción <BBadge variant="primary">#103000957</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Plan de acción</BBadge></h5>
                                                    <h5><BBadge>Comunicaciones</BBadge></h5>
                                                    <h5><BBadge>Informes</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Plan Anual de Bienestar e Incentivos <BBadge variant="primary">#103000961</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Plan</BBadge></h5>
                                                    <h5><BBadge>Comunicaciones</BBadge></h5>
                                                    <h5><BBadge>Informes</BBadge></h5>
                                                    <h5><BBadge>Anexos</BBadge></h5>
                                                </BAccordionItem>
                                                <BAccordionItem>
                                                    <template #title>
                                                        <h6>Plan de Capacitación <BBadge variant="primary">#103000962</BBadge></h6>
                                                    </template>
                                                    <h5><BBadge>Plan de capacitación</BBadge></h5>
                                                    <h5><BBadge>Necesidades</BBadge></h5>
                                                    <h5><BBadge>Acta de Comité de capacitación que aprueba el plan</BBadge></h5>
                                                    <h5><BBadge>Registros de asistencia a las capacitaciones</BBadge></h5>
                                                    <h5><BBadge>Formato de evaluación de la capacitaciones</BBadge></h5>
                                                </BAccordionItem>
                                            </BAccordion>
                                    </BAccordionItem>
                                </BAccordionItem>
                                <BAccordionItem>
                                    <template #title>
                                                    <h5 class="mb-0">FINANCIERA Y TESORERIA <BBadge variant="light">#10200</BBadge></h5>
                                    </template>
                                    <BAccordionItem>
                                        <template #title>
                                                    <h6>ACTAS <BBadge variant="primary">#1020001</BBadge></h6>
                                        </template>
                                        <BAccordion free>
                                            <BAccordionItem>
                                                <template #title>
                                                    <h6>Actas Comité de Sostenibilidad Contable Público <BBadge variant="primary">#102000107</BBadge></h6>
                                                </template>
                                                <h5><BBadge>Citación</BBadge></h5>
                                                <h5><BBadge>Actas</BBadge></h5>
                                                <h5><BBadge>Anexos</BBadge></h5>
                                            </BAccordionItem>
                                            <BAccordionItem>
                                                <template #title>
                                                    <h6>Acta Comité Financiero <BBadge variant="primary">#102000108</BBadge></h6>
                                                </template>
                                                <h5><BBadge>Citación</BBadge></h5>
                                                <h5><BBadge>Actas</BBadge></h5>
                                                <h5><BBadge>Anexos</BBadge></h5>
                                            </BAccordionItem>
                                        </BAccordion>
                                    </BAccordionItem>
                                    <BAccordionItem>
                                        <template #title>
                                                    <h6>AUDITORIAS <BBadge variant="primary">#1020021</BBadge></h6>
                                        </template>
                                        <BAccordion free>
                                            <BAccordionItem>
                                                <template #title>
                                                    <h6>Auditoria Cuadres de Caja y Consignaciones diarias <BBadge variant="primary">#1020021170</BBadge></h6>
                                                </template>
                                                <h5><BBadge>Informe de auditorías</BBadge></h5>
                                            </BAccordionItem>
                                        </BAccordion>
                                    </BAccordionItem>
                                    <BAccordionItem>
                                        <template #title>
                                                    <h6>COMPROBANTES <BBadge variant="primary">#1020022</BBadge></h6>
                                        </template>
                                        <BAccordion free>
                                            <BAccordionItem>
                                                <template #title>
                                                    <h6>Comprobantes de Egreso <BBadge variant="primary">#1020022118</BBadge></h6>
                                                </template>
                                                <h5><BBadge>Comprobantes de egreso</BBadge></h5>
                                                <h5><BBadge>Ordenes de pago</BBadge></h5>
                                                <h5><BBadge>Facturas</BBadge></h5>
                                                <h5><BBadge>Cuentas de cobro</BBadge></h5>
                                                <h5><BBadge>Registros presupuestales</BBadge></h5>
                                                <h5><BBadge>Copia pago de impuestos</BBadge></h5>
                                            </BAccordionItem>
                                            <BAccordionItem title="Comprobante de Ingreso #1020022119" >
                                                <template #title>
                                                    <h6>Comprobantes de Ingreso <BBadge variant="primary">#1020022119</BBadge></h6>
                                                </template>
                                                <h5><BBadge>Transacciones</BBadge></h5>
                                                <h5><BBadge>Notas Bancarias</BBadge></h5>
                                                <h5><BBadge>Comprobantes de consignación</BBadge></h5>
                                            </BAccordionItem>
                                        </BAccordion>
                                    </BAccordionItem>
                                    <BAccordionItem>
                                        <template #title>
                                            <h6>COMUNICACIONES OFICIALES <BBadge variant="primary">#1020003</BBadge></h6>
                                        </template>
                                        <BAccordion free>
                                            <BAccordionItem>
                                                <template #title>
                                                    <h6>Comunicaciones Oficiales Despachadas y Recibidas <BBadge variant="primary">#102000315</BBadge></h6>
                                                </template>
                                                <h5><BBadge>Comunicaciones Oficiales Recibidas</BBadge></h5>
                                                <h5><BBadge>Comunicaciones Oficiales Despachadas</BBadge></h5>
                                            </BAccordionItem>
                                        </BAccordion>
                                    </BAccordionItem>
                                </BAccordionItem>
                            </BAccordion>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>