<script>
  import { ref, computed } from "vue";
  import Multiselect from "@vueform/multiselect";
  import "@vueform/multiselect/themes/default.css";
  import useVuelidate from "@vuelidate/core";
  import { MESSAGE_REQUIRED, MESSAGE_EMAIL } from "../../constants/rules.ts";
  import Swal from "sweetalert2";
  import ValidateLabel from "../../utils/ValidateLabel.vue";
  import { requiredIf } from "@vuelidate/validators";
  import { useRouter } from "vue-router";

  import {
    ContinentList,
    CountryList,
    DepartmentList,
  } from "../../constants/locations.ts";

  export default {
    setup() {
      const router = useRouter();

      const externalClaim = ref({
        documentNumber: "",
        name: "",
        lastName: "",
        secondSurname: "",
        phone: "",
        address: "",
        email: "",
        continent: "america",
        country: "colombia",
        department: "",
        municipality: "",
        claimSubject: "",
        annexDescription: "",
        claimType: "",
        termsAndConditions: false,
        sendNotifications: false,
      });

      const MunicipalityList = computed(() => {
        let selected = DepartmentList.filter(
          (element) => element.value == externalClaim.value.department
        );

        if (selected[0]?.ciudades != undefined) {
          let auxMunicipalityList = [];

          selected[0]?.ciudades.forEach((element) => {
            auxMunicipalityList.push({
              label: element,
              value: element,
            });
          });

          return auxMunicipalityList;
        } else {
          return [];
        }
      });

      // reglas de validacion
      const rules = {
        documentNumber: { required: MESSAGE_REQUIRED },
        name: { required: MESSAGE_REQUIRED },
        lastName: { required: MESSAGE_REQUIRED },
        secondSurname: { required: MESSAGE_REQUIRED },
        phone: { required: MESSAGE_REQUIRED },
        address: { required: MESSAGE_REQUIRED },
        email: { required: MESSAGE_REQUIRED && MESSAGE_EMAIL },
        continent: { required: MESSAGE_REQUIRED },
        country: { required: MESSAGE_REQUIRED },
        department: { required: MESSAGE_REQUIRED },
        municipality: { required: MESSAGE_REQUIRED },
        claimSubject: { required: MESSAGE_REQUIRED },
        annexDescription: { required: MESSAGE_REQUIRED },
        termsAndConditions: {
          required: requiredIf(() => {
            if (externalClaim.value.termsAndConditions === false) {
              return MESSAGE_REQUIRED;
            }
          }),
        },
      };

      const v$ = useVuelidate(rules, externalClaim);

      const file = ref([]);

      const selectedFile = () => {
        const newFile = document.getElementById("formFile").files;
        for (let i = 0; i < newFile.length; i++) {
          file.value.push(newFile[i]);
        }
      };

      const sendClaim = async () => {
        try {
          v$.value.$touch();

          if (v$.value.$invalid) return;

          // const response = await axios.post(``, externalClaim)

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Faltan campos obligatorios del formulario",
            showConfirmButton: false,
            timer: 1500,
          });

          router.replace("/");
        } catch (error) {
          console.log(error);
        }
      };

      return {
        externalClaim,
        ContinentList,
        CountryList,
        DepartmentList,
        MunicipalityList,
        v$,
        sendClaim,
        selectedFile,
        file,
      };
    },

    components: {
      Multiselect,
      ValidateLabel,
    },
  };
</script>

<template>
  <div class="main-box">
    <div class="row">
      <div class="col-lg-12 text-center mb-5">
        <img src="@/assets/images/BAQVERDE.png" alt="" height="80" />
      </div>
      <div class="col-lg-12">
        <span class="fs-4 fw-bold">Radicar Documentos</span>
      </div>
      <div class="col-lg-12">
        <span class="fs-6 fw-normal text-dark">Recuerde que: </span><br />
        <span class="fs-6 text-secondary">
          La Ey 1755 de 2015 en su artiulo 13 establece que toda la actuación
          que inicie cualquier persona ante las autoridades implica el ejercicio
          del derechoo de petición consagrado en el articulo 23 de la
          constitucion Politica, sin que sea necesario invocarlo
        </span>
      </div>

      <!-- File input -->
      <BCol lg="4" class="mt-3">
        <label for="name" class="form-label"
          >Archivo asociado al radicado
          <span class="text-danger fw-bold">*</span></label
        >
        <input
          class="form-control"
          type="file"
          id="formFile"
          @change="selectedFile"
        />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="documentNumber" class="form-label"
          >Número de documento <span class="text-danger fw-bold">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="documentNumber"
          :required="true"
          placeholder="Ingrese número de documento"
          v-model="externalClaim.documentNumber"
        />
        <ValidateLabel v-bind="{ v$ }" attribute="documentNumber" />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="name" class="form-label"
          >Nombre <span class="text-danger fw-bold">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="name"
          :required="true"
          placeholder="Ingrese su nombre"
          v-model="externalClaim.name"
        />
        <ValidateLabel v-bind="{ v$ }" attribute="name" />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="lastname" class="form-label"
          >Primer apellido <span class="text-danger fw-bold">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="lastname"
          :required="true"
          placeholder="Ingrese primer apellido"
          v-model="externalClaim.lastName"
        />
        <ValidateLabel v-bind="{ v$ }" attribute="lastName" />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="surname" class="form-label"
          >Segundo apellido <span class="text-danger fw-bold">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="surname"
          :required="true"
          placeholder="Ingrese segundo apellido"
          v-model="externalClaim.secondSurname"
        />
        <ValidateLabel v-bind="{ v$ }" attribute="secondSurname" />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="phone" class="form-label"
          >teléfono <span class="text-danger fw-bold">*</span></label
        >
        <div
          style="display: flex; align-items: center; justify-content: center"
        >
          <div class="country-phone-flag">
            <img src="@/assets/images/colombia.webp" alt="" height="30" />
          </div>
          <input
            type="text"
            class="form-control"
            id="phone"
            :required="true"
            placeholder="Ingrese teléfono"
            v-model="externalClaim.phone"
          />
        </div>
        <ValidateLabel v-bind="{ v$ }" attribute="phone" />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="address" class="form-label"
          >Dirección <span class="text-danger fw-bold">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="address"
          :required="true"
          placeholder="Ingrese dirección"
          v-model="externalClaim.address"
        />
        <ValidateLabel v-bind="{ v$ }" attribute="address" />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="email" class="form-label"
          >Correo <span class="text-danger fw-bold">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="email"
          :required="true"
          placeholder="Ingrese correo eléctronico"
          v-model="externalClaim.email"
        />
        <ValidateLabel v-bind="{ v$ }" attribute="email" />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="continent" class="form-label"
          >Continente <span class="text-danger fw-bold">*</span></label
        >
        <Multiselect
          :required="true"
          v-model="externalClaim.continent"
          :close-on-select="true"
          :searchable="true"
          :create-option="true"
          :options="ContinentList"
          placeholder="Seleccione"
          :disabled="true"
        />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="continent" class="form-label"
          >País <span class="text-danger fw-bold">*</span></label
        >
        <Multiselect
          :required="true"
          v-model="externalClaim.country"
          :close-on-select="true"
          :searchable="true"
          :create-option="true"
          :options="CountryList"
          placeholder="Seleccione"
          :disabled="true"
        />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="continent" class="form-label"
          >Departamento <span class="text-danger fw-bold">*</span></label
        >
        <Multiselect
          :required="true"
          v-model="externalClaim.department"
          :close-on-select="true"
          :searchable="true"
          :create-option="true"
          :options="DepartmentList"
          placeholder="Seleccione"
        />
        <ValidateLabel v-bind="{ v$ }" attribute="department" />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="continent" class="form-label"
          >Municipio <span class="text-danger fw-bold">*</span></label
        >
        <Multiselect
          :required="true"
          v-model="externalClaim.municipality"
          :close-on-select="true"
          :searchable="true"
          :create-option="true"
          :options="MunicipalityList"
          placeholder="Seleccione"
        />
        <ValidateLabel v-bind="{ v$ }" attribute="municipality" />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="subject" class="form-label"
          >Asunto del radicado <span class="text-danger fw-bold">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="subject"
          :required="true"
          placeholder="Ingrese asunto"
          v-model="externalClaim.claimSubject"
        />
        <ValidateLabel v-bind="{ v$ }" attribute="claimSubject" />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="description" class="form-label"
          >Descripción de anexos
          <span class="text-danger fw-bold">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="description"
          :required="true"
          placeholder="Ingrese descripción de anexos"
          v-model="externalClaim.annexDescription"
        />
        <ValidateLabel v-bind="{ v$ }" attribute="annexDescription" />
      </BCol>

      <BCol lg="4" class="mt-3">
        <label for="claimType" class="form-label"
          >Tipo de radicado <span class="text-danger fw-bold">*</span></label
        >
        <Multiselect
          :required="true"
          v-model="externalClaim.claimType"
          :close-on-select="true"
          :searchable="true"
          :create-option="true"
          :options="claimTypes"
          placeholder="Seleccione"
        />
        <ValidateLabel v-bind="{ v$ }" attribute="claimType" />
      </BCol>

      <BCol lg="12" class="mt-3">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="flexCheckDefault"
            v-model="externalClaim.termsAndConditions"
          />
          <label class="form-check-label" for="flexCheckDefault">
            Aceptar
            <span class="text-primary text-decoration-underline">
              términos y condiciones
            </span>
          </label>
        </div>

        <ValidateLabel v-bind="{ v$ }" attribute="termsAndConditions" />
      </BCol>

      <BCol lg="12" class="mt-3">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
            v-model="externalClaim.sendNotifications"
          />
          <label class="form-check-label" for="flexCheckDefault">
            Acepta usted el envío de notificaciones a través de su correo.
          </label>
        </div>
      </BCol>

      <BCol lg="12" class="mt-3 text-center">
        <button
          type="button"
          class="col-12 col-md-12 col-lg-3 btn btn-success"
          @click="sendClaim"
        >
          Radicar
        </button>
      </BCol>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .main-box {
    width: 100vw;
    height: 100vh;
    top: 0;
    bottom: 0;
    align-content: center;
    padding: 30px 12%;
  }

  .country-phone-flag {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 39px;
    width: auto;
    background-color: white;
    border: 1px solid lightgray;
    width: 50px;
  }

  .multiselect.is-disabled,
  .form-control:disabled {
    background-color: #e9ebec !important;
    cursor: not-allowed !important;
  }
</style>
