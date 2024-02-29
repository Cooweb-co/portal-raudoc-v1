<script>
import {  ref, watch,getCurrentInstance } from "vue";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";

import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DropZone from "@/components/widgets/dropZone";
import useVuelidate from "@vuelidate/core";

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";

import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { getFirebaseBackend } from '../../authUtils.js'

import { uploadBytes, ref as storageRef } from "firebase/storage";


import {createClaimID} from '../../helpers/docservice/doc.service'

// import VueRouter from 'vue-router'







export default {
  setup() {

    // const router = VueRouter.useRoute()

  

    const instance = getCurrentInstance();

    let files = ref([]);
    let dropzoneFile = ref("");
    let loadingBtnAI = ref(false)
    let documentID = ref(null)
    let companyID = ref('BAQVERDE')
    let year = ref(new Date().getFullYear())



    
    const drop = (e) => {
      dropzoneFile.value = e.dataTransfer.files[0];
      files.value.push(dropzoneFile.value);
    };

    const storage = getFirebaseBackend().storage

    const selectedFile = async () => {

      // loadingBtnAI.value = true
      dropzoneFile.value = document.querySelector(".dropzoneFile").files[0];


      files.value.push(dropzoneFile.value);

      const file = dropzoneFile.value

      console.log('file::::',file);


     
      try {

        if(!documentID.value){
          await instance.proxy.handleCreateClaimID()
        }


        const user = instance.proxy.user
        console.log('Setup:',user);


        const uniqueFileName = Date.now() + ".pdf";



        const folder = `Companies/${companyID.value}/${year.value}/Claims/${documentID.value}`

        const storagePath =  `${folder}/${uniqueFileName}`;
        const fileRef = storageRef(storage, storagePath);


        // const fileName = file.name
        const uploadResult =  await uploadBytes(fileRef, file);
        console.log("Archivo subido con éxito:", uploadResult.metadata.fullPath);


      } catch (error) {
        console.error("Error al subir el archivo:", error);
      }



    };
    watch(
      () => [...files.value],
      (currentValue) => {
        return currentValue;
      }
    );
    return { dropzoneFile, files, drop, selectedFile, v$: useVuelidate(), loadingBtnAI, documentID };
  },
  data() {
    return {
      value: ["C#", "HTML", "CSS"],
      value3: ["Private"],
      value4: ["Designing"],
      value5: ["Ellen Smith"],
      value1: ["Inprogress"],
      value2: ["High"],
      country: ["Colombia"],
      city: ["Barranquilla"],
      value6: ["Low"],
      value7: ["Low"],
      editor: ClassicEditor,
      editorData:"", 
      content: "<h1>Some initial content</h1>",
      isDisabledAI:false,
      // loadingBtnAI: false,
      isDisabledCreate: false,
      loadingBtnCreate: false,
    };
  },
  methods: {
    async handleCreateClaimID(){
      
      try {

        const user = this.$store.state.auth.currentUser
        const userID = user.uid

        
        const id = await createClaimID(userID)
        this.documentID = id

        


   
          
        } catch (error) {
          console.log(error);
        }
    },
    deleteRecord(ele) {
      ele.target.parentElement.parentElement.parentElement.remove();
    },
  },
  mounted() {
    setTimeout(() => {
      this.isDisabledAI = false;
      //this.createIdRadicate()
      // this.isDisabledCreate = false;
      // this.loadingBtnCreate = false;
    }, 1000);
  },
  computed: {
    user() {
      return this.$store.state.auth.currentUser
    },
  },
 
 
  components: {
    DropZone,
    Layout,
    PageHeader,
    ckeditor: CKEditor.component,
    Multiselect,
    flatPickr
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="`Radiación: #${documentID ? documentID : 'Nueva'}`" subTitle="Crear"  pageTitle="Proyectos" />
    <BRow>
      <BCol lg="8">

        <BRow v-if="documentID">

        <div class="text-end mb-4">
          <BButton type="button" :disabled="isDisabledAI" v-if="documentID" :loading="loadingBtnAI" variant="info" :loadingFill="false" loadingText="Aplicando IA " class="w-sm me-1 float-start">Aplicar IA
            <i class="ri-magic-fill ms-1 align-bottom"></i>
          </BButton>
          <!-- <BButton type="submit" variant="primary" class="w-sm me-1"> Borrador </BButton> -->
          <BButton type="submit" v-if="documentID" variant="success" class="w-sm">Guardar Cambios</BButton>
        </div>

        </BRow>


        <BCard no-body>
          
          <BCardHeader>
            <h5 class="card-title mb-0">Agrega archivo para radicar</h5>
          </BCardHeader>
          <BCardBody>
            <div>
              <p class="text-muted">Agregue archivos aquí.</p>

              <DropZone @drop.prevent="drop" @change="selectedFile" class="mb-2" />
              <div class="vstack gap-2">
                <div class="border rounded" v-for="(file, index) of files" :key="index">
                  <div class="d-flex align-items-center p-2">
                    <div class="flex-grow-1">
                      <div class="pt-1">
                        <h5 class="fs-14 mb-1" data-dz-name="">
                          {{ file.name }}
                        </h5>
                        <p class="fs-13 text-muted mb-0" data-dz-size="">
                          <strong>{{ file.size / 1024 }}</strong> KB
                        </p>
                        <strong class="error text-danger" data-dz-errormessage=""></strong>
                      </div>
                    </div>
                    <div class="flex-shrink-0 ms-3">
                      <BButton variant="danger" size="sm" data-dz-remove="" @click="deleteRecord">
                        borrar
                      </BButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BCardBody>
          <BCardBody>
            <div class="mb-3">
              <label class="form-label" for="project-title-input">Asunto</label>
              <input type="text" class="form-control" id="project-title-input" placeholder="Ingrese asunto del radicado" />
            
            </div>

            <BCard no-body>
        </BCard>



            <div class="mb-3">
              <label class="form-label">Resumen de radicado</label>
              <ckeditor v-model="editorData" :editor="editor"></ckeditor>
            </div>

            <BRow>
              <BCol lg="4">
                <div class="mb-3 mb-lg-0">
                  <label for="choices-priority-input" class="form-label">Prioridad</label>

                  <Multiselect v-model="value2" :close-on-select="true" :searchable="true" :create-option="true"
                    :options="[
                      { value: 'Alta', label: 'Alta' },
                      { value: 'Media', label: 'Media' },
                      { value: 'Baja', label: 'Baja' },
                    ]" />
                </div>
              </BCol>
              <BCol lg="4">
                <div class="mb-3 mb-lg-0">
                  <label for="choices-status-input" class="form-label">Estado</label>

                  <Multiselect v-model="value1" :close-on-select="true" :searchable="true" :create-option="true"
                    :options="[
                      { value: 'Inprogress', label: 'En curso' },
                      { value: 'Completed', label: 'Completado' },
                    ]" />
                </div>
              </BCol>
              <BCol lg="4">
                <div>
                  <label for="datepicker-deadline-input" class="form-label">Fecha límite</label>

                  <flat-pickr v-model="date" :config="config" class="form-control flatpickr-input"></flat-pickr>
                </div>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>

      
       
      </BCol>
      <BCol lg="4">
        <BCard no-body>
          <BCardHeader>
            <h5 class="card-title mb-0">Datos del Solicitante</h5>
          </BCardHeader>
          <BCardBody>
            <div class="mb-3">
              <label for="choices-privacy-status-input" class="form-label">Tipo de Solicitud</label>
              <Multiselect v-model="value3" :close-on-select="true" :searchable="true" :create-option="true" :options="[
                { value: 'Aporedado', label: 'Aporedado' },
                { value: 'Nino, nina, adolescente', label: 'Nino, Nina, Adolescente' },
                { value: 'persona judirica', label: 'Persona Judirica' },
                { value: 'persona natural', label: 'Persona Natural' },
              ]" />
              
              
            </div>

            <div class="mb-3">
              <label for="choices-privacy-status-input" class="form-label">Tipo de Documento</label>
              <Multiselect v-model="value4" :close-on-select="true" :searchable="true" :create-option="true" :options="[
                { value: 'CC', label: 'C.C' },
                { value: 'CE', label: 'C.E' },
                { value: 'carnet Dplomatico CD', label: 'Carnet Diplomatico CD' },
                { value: 'NIT', label: 'NIT' },
                { value: 'Psaporte PA', label: 'Pasaporte PA' },
                { value: 'Permiso Especial de PMCA', label: 'Permiso Especial de PMCA' },
                { value: 'Permiso de Proteccion', label: 'Permiso de Proteccion' },
                { value: 'Temporal - PPT', label: 'Temporal - PPT' },
                { value: 'Salvoconducto-SC', label: 'Salvoconducto-SC' },
                { value: 'T.I', label: 'T.I' },
                
              ]" />

            </div>

            <div class="mb-3">
              <label for="choices-privacy-status-input" class="form-label">sexo</label>
              <Multiselect v-model="value5" :close-on-select="true" :searchable="true" :create-option="true" :options="[
                { value: 'masculino', label: 'Masculino' },
                { value: 'femenino', label: 'Femenino' },
                { value: 'otro', label: 'Otro' },
  
              ]" />
              
              
            </div>


            <div class="mb-3">
            
              <label for="choices-privacy-status-input" class="form-label">Pais de Recidencia</label>
              <Multiselect v-model="country" :close-on-select="true" :searchable="true" :create-option="true" :options="[
              
            {value: 'CO', label: 'Colombia'},
            {value: 'US', label: 'Estados Unidos'},
            {value: 'MX', label: 'México'},
            {value: 'ES', label: 'España'},
            {alue: 'AR', label: 'Argentina'},
            {value: 'BR', label: 'Brasil'},
            {value: 'CL', label: 'Chile'},
            {value: 'PE', label: 'Per'},
            {value: 'EC', label: 'Ecuador'},
            {value: 'GT', label: 'Guatemala'},
            {value: 'CU', label: 'Cuba'},
            {value: 'BO', label: 'Bolivia'},
            {value: 'DO', label: 'República Dominicana'},
            {value: 'HD', label: 'Honduras'}
      
              ]" />
            </div>
          <div >

              <label for="choices-privacy-status-input" class="form-label">Cuidad de Recidencia</label>
              <Multiselect v-model="city" :close-on-select="true" :searchable="true" :create-option="true" :options="[
              
          
            {value: 'smr', label: 'Santa Marta'},
            {value: 'PER', label: 'Pereira'},
            {value: 'BGA', label: 'Bucaramanga'},
            {value: 'CUC', label: 'Cucuta'},
            {value: 'IBG', label: 'Ibague'},
            {value: 'arm', label: 'Amenai'},
            {value: 'PT', label: 'Pasto'},
            {value: 'POP', label: 'Popayan'}
      
              ]" />

              


              
              
            </div>
          </BCardBody>
        </BCard>

      

        <BCard no-body>
          <BCardHeader>
            <h5 class="card-title mb-0">Etiquetas</h5>
          </BCardHeader>
          <BCardBody>
            <div class="mb-3">
              <label for="choices-categories-input" class="form-label">Categorías</label>
              <Multiselect v-model="value4" :close-on-select="true" :searchable="true" :create-option="true" :options="[
                { value: 'Diseño', label: 'Diseño' },
                { value: 'Desarrollo', label: 'Desarrollo' },
              ]" />
            </div>

      
          </BCardBody>
        </BCard>

        <BCard no-body>
          <BCardHeader>
            <h5 class="card-title mb-0">Miembros</h5>
          </BCardHeader>
          <BCardBody>
            <div class="mb-3">
              <label for="choices-lead-input" class="form-label">Jefe de equipo</label>
              <Multiselect v-model="value5" :close-on-select="true" :searchable="true" :create-option="true" :options="[
                { value: 'Brent Gonzalez', label: 'Brent Gonzalez' },
                { value: 'Darline Williams', label: 'Darline Williams' },
                { value: 'Sylvia Wright', label: 'Sylvia Wright' },
                { value: 'Ellen Smith', label: 'Ellen Smith' },
                { value: 'Jeffrey Salazar', label: 'Jeffrey Salazar' },
                { value: 'Mark Williams', label: 'Mark Williams' },
              ]" />
            </div>

            <div>
              <label class="form-label">Miembros del equipo</label>
              <div class="avatar-group">
                <BLink href="javascript: void(0);" class="avatar-group-item" v-b-tooltip.hover title="Brent Gonzalez">
                  <div class="avatar-xs">
                    <img src="@/assets/images/users/avatar-3.jpg" alt="" class="rounded-circle img-fluid" />
                  </div>
                </BLink>
                <BLink href="javascript: void(0);" class="avatar-group-item" v-b-tooltip.hover title="Sylvia Wright">
                  <div class="avatar-xs">
                    <div class="avatar-title rounded-circle bg-primary">
                      S
                    </div>
                  </div>
                </BLink>
                <BLink href="javascript: void(0);" class="avatar-group-item" v-b-tooltip.hover title="Ellen Smith">
                  <div class="avatar-xs">
                    <img src="@/assets/images/users/avatar-4.jpg" alt="" class="rounded-circle img-fluid" />
                  </div>
                </BLink>
                <BLink href="javascript: void(0);" class="avatar-group-item" v-b-tooltip.hover title="Add Members">
                  <div class="avatar-xs" data-bs-toggle="modal" data-bs-target="#inviteMembersModal">
                    <div class="avatar-title fs-16 rounded-circle bg-light border-dashed border text-primary">
                      +
                    </div>
                  </div>
                </BLink>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>
