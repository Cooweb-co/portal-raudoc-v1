<script>
import Layout from "@/layouts/main.vue";

export default {
    components: {
        Layout
    },
};
</script>

<template>
    <Layout>
        <BRow>
            <BCol lg="12">
                <BCard no-body class="rounded-0 bg-primary-subtle mx-n4 mt-n4 border-top">
                    <div class="px-4">
                        <BRow>
                            <BCol xxl="5" class="align-self-center">
                                <div class="py-4">
                                    <h4 class="">Preguntas Frecuentes</h4>
                                    <p class="text-muted fs-15 mt-3">Aqui podras resolver algunas dudas que tengas 
                                        sobre lo que hacemos, informate!</p>
                                    <!-- <div class="hstack flex-wrap gap-2">
                                        <BButton pill variant="primary" type="button" class="btn-label"><i
                                                class="ri-mail-line label-icon align-middle rounded-pill fs-16 me-2"></i>
                                            envianos un mensaje</BButton>
                                        <BButton pill variant="secondary" type="button" class="btn-label"><i
                                            class="ri-close-line label-icon align-middle rounded-pill fs-16 me-2"></i>
                                            o contactans en X</BButton>
                                    </div> -->
                                </div>
                            </BCol>
                            <BCol xxl="3" class="ms-auto">
                                <div class="mb-n5 pb-1 faq-img d-none d-xxl-block">
                                    <img src="@/assets/images/faq-img.png" alt="" class="img-fluid">
                                </div>
                            </BCol>
                        </BRow>
                    </div>
                </BCard>

                <BRow class="justify-content-evenly mb-4">
                    <BCol lg="4">
                        <div class="mt-3">
                            <div class="d-flex align-items-center mb-2">
                                <div class="flex-shrink-0 me-1">
                                    <i class="ri-question-line fs-24 align-middle text-success me-1"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h5 class="fs-16 mb-0 fw-semibold">PREGUNTAS GENERALES</h5>
                                </div>
                            </div>

                            <BAccordion class="accordion-border-box" id="genques-accordion">
                                <BAccordionItem title="¿Qué es Raudoc?" visible>
                                    Raudoc es un sistema de gestión documental que permite a las empresas y organizaciones
                                     administrar de forma eficiente sus documentos. Raudoc ofrece 
                                     una amplia gama de funcionalidades, como:
                                     <p>• Almacenamiento centralizado de documentos<br>
                                    • Control de versiones<br>
                                    • Búsqueda y recuperación de documentos<br>
                                    • Flujos de trabajo de documentos<br>
                                    • Seguridad y permisos<br>
                                    • Firma electrónica<br>
                                    • Generación de Documentos con IA</p>                                    
                                </BAccordionItem>
                                <BAccordionItem title="¿Cuáles son los beneficios de utilizar Raudoc?">
                                    Raudoc ofrece una serie de beneficios, entre los que se encuentran:
                                    <p>• Mejora de la eficiencia: Raudoc permite a las empresas y organizaciones automatizar los procesos de gestión documental, 
                                        lo que reduce el tiempo y los recursos necesarios para gestionar los documentos.<br>
                                    • Mejora de la productividad: Raudoc facilita la búsqueda y recuperación de documentos,
                                     lo que mejora la productividad de los empleados.<br>
                                    • Mejora de la seguridad: Raudoc ofrece una serie de funcionalidades de 
                                    seguridad que protegen los documentos contra el acceso no autorizado.<br>
                                    • Mejora del cumplimiento normativo: Raudoc puede ayudar a las empresas y 
                                    organizaciones a cumplir con las normas y regulaciones aplicables a la gestión documental.</p>

                                </BAccordionItem>
                                <BAccordionItem title="¿Cómo puedo encontrar un documento en Raudoc?">

                                    Puedes encontrar un documento en Raudoc utilizando la función de búsqueda. 
                                    Puedes buscar por número de radicado,  palabras claves, nombre del documento, 
                                    fecha de creación o modificación, usuario, etc.
                                </BAccordionItem>
                                <BAccordionItem title="¿Cómo puedo proteger mis documentos en Raudoc?">
                                    Raudoc ofrece una serie de funcionalidades de seguridad que te permite proteger tus documentos contra el acceso no autorizado. 
                                    Puedes establecer permisos de acceso a través de la definición de roles y controlar quién puede gestionar, 
                                    ver y editar documentos. También puedes utilizar la firma electrónica para garantizar la autenticidad e 
                                    integridad de los documentos.  

                                </BAccordionItem>
                            </BAccordion>
                        </div>
                    </BCol>

                    <BCol lg="4">
                        <div class="mt-3">
                            <div class="d-flex align-items-center mb-2">
                                <div class="flex-shrink-0 me-1">
                                    <i class="ri-user-settings-line fs-24 align-middle text-success me-1"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h5 class="fs-16 mb-0 fw-semibold">ADMINISTRACIÓN &amp; USO DE CUENTAS</h5>
                                </div>
                            </div>

                            <BAccordion class="accordion-border-box" id="manageaccount-accordion">
                                <BAccordionItem title="¿Cómo puedo navegar por Raudoc?">
                                    <p>Raudoc tiene una interfaz de usuario intuitiva que te permite encontrar fácilmente lo que buscas.
                                         Puedes usar la barra de búsqueda para encontrar documentos, usuarios, grupos, etc. También puedes 
                                         usar el menú principal para acceder a las diferentes funciones como: Dashboard, Informes, de Raudoc.</p>
                                </BAccordionItem>

                                <BAccordionItem title="Puede haber Colaboración en la gestión de Documentos en Raudoc?" visible>
                                    <p>Sí, es posible que varias personas puedan colaborar en un documento de Raudoc. Raudoc ofrece una serie
                                         de funcionalidades que permiten la colaboración en tiempo real, como:</p>

                                         <p>• Edición simultánea: Varios usuarios pueden editar el mismo documento al mismo tiempo.<br>
                                            • Control de versiones: Raudoc guarda automáticamente cada versión del documento, 
                                            lo que permite a los usuarios ver el historial de cambios y restaurar versiones anteriores.<br>
                                            • Comentarios y sugerencias: Los usuarios pueden dejar comentarios y sugerencias
                                             en el documento, lo que facilita la comunicación y la colaboración.<br>
                                            • Seguimiento de cambios: Raudoc permite a los usuarios ver quién ha realizado cambios
                                             en el documento y cuándo se han realizado.</p>
                                </BAccordionItem>
                                
                             
                            </BAccordion>
                        </div>
                    </BCol>

                    <BCol lg="4">
                        <div class="mt-3">
                            <div class="d-flex align-items-center mb-2">
                                <div class="flex-shrink-0 me-1">
                                    <i class="ri-shield-keyhole-line fs-24 align-middle text-success me-1"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h5 class="fs-16 mb-0 fw-semibold">SEGURIDAD &amp; PRIVACIDAD</h5>
                                </div>
                            </div>

                            <BAccordion class="accordion-border-box" id="privacy-accordion">
                                <BAccordionItem title="¿Cómo se asegura Raudoc de que mis datos estén seguros?" visible>
                                    Raudoc utiliza una serie de medidas de seguridad para proteger tus datos, incluyendo:
                                    <p>• Encriptación de datos: Todos tus datos están encriptados tanto en reposo como en tránsito.<br>
                                        • Control de acceso: Solo los usuarios con los permisos adecuados pueden acceder a tus datos.<br>
                                        • Auditoría de seguridad: Raudoc registra todas las actividades del usuario para que puedas rastrear quién ha accedido a tus datos y cuándo lo ha hecho.</p>



                                </BAccordionItem>
                                <BAccordionItem title="¿Dónde se almacenan mis datos?">
                                    Tus datos se almacenan en centros de datos seguros en la nube. Raudoc utiliza proveedores de servicios en
                                     la nube de primer nivel que ofrecen altos niveles de seguridad y disponibilidad.
                                </BAccordionItem>
                              
                                <BAccordionItem title="¿Puedo controlar quién tiene acceso a mis datos?">
                                    Sí, puedes controlar quién tiene acceso a tus datos mediante la configuración de permisos. Puedes conceder 
                                    permisos a usuarios individuales o a grupos de usuarios.
                                </BAccordionItem>
                            </BAccordion>
                        </div>
                    </BCol>
                </BRow>
            </BCol>
        </BRow>
    </Layout>
</template>
