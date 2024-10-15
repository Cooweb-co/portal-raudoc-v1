<script setup>
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  requiredIf,
  minLength,
  sameAs,
  email,
} from "@vuelidate/validators";
import { reactive, defineProps, defineEmits, computed, watch } from "vue";

const props = defineProps({
  isEditing: { type: Boolean, required: false, default: false },
  loading: { type: Boolean, required: true },
  tdrs: { type: Array, required: true },
  data: { type: Object, required: false, default: () => ({}) },
});
const emit = defineEmits(["submit"]);

const formData = reactive({
  name: "",
  identification: "",
  area: "",
  email: "",
  rol: "",
  password: "",
});

const v$ = useVuelidate(
  {
    name: { required },
    identification: { required },
    area: { required },
    rol: { required },
    email: { required, email },
    password: {
      required: requiredIf(() => !props.isEditing),
      minLength: !props.isEditing && minLength(8),
      containsUppercase:
        !props.isEditing &&
        function (value) {
          return /[A-Z]/.test(value);
        },
      containsLowercase:
        !props.isEditing &&
        function (value) {
          return /[a-z]/.test(value);
        },
      containsNumber:
        !props.isEditing &&
        function (value) {
          return /[0-9]/.test(value);
        },
      containsSpecial:
        !props.isEditing &&
        function (value) {
          return /[#?!@$%^&*-]/.test(value);
        },
    },
    confirmPassword: {
      required: requiredIf(() => !props.isEditing),
      sameAs: !props.isEditing && sameAs(computed(() => formData.password)),
    },
  },
  formData
);

function handleSubmit() {
  emit("submit", { ...formData });
}

watch(
  () => props.loading,
  () => {
    if (props.isEditing) {
      Object.assign(formData, props.data);
    }
  }
);
</script>

<template>
  <BCard class="mt-3" no-body>
    <BCardHeader>
      <h5 class="card-title mb-0 text-muted fw-light fst-italic">
        INFORMACIÓN DEL USUARIO
      </h5>
    </BCardHeader>
    <BCardBody>
      <div class="row">
        <div class="col mb-3">
          <label class="form-label">Nombre Completo</label>
          <input
            type="text"
            v-model="v$.name.$model"
            class="form-control"
            :class="{ 'border border-danger': v$.name.$error }"
            placeholder="John Doe"
          />
          <p class="text-danger" :class="{ 'd-none': !v$.name.$error }">
            Valor incorrecto
          </p>
        </div>
        <div class="col mb-3">
          <label for="">Número de identificación</label>
          <input
            type="number"
            v-model="v$.identification.$model"
            class="form-control"
            :class="{ 'border border-danger': v$.identification.$error }"
            placeholder="1234567890"
          />
          <p
            class="text-danger"
            :class="{ 'd-none': !v$.identification.$error }"
          >
            Valor incorrecto
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col mb-3">
          <label class="form-label">Área</label>
          <select
            v-model="v$.area.$model"
            class="form-select"
            :class="{ 'border border-danger': v$.area.$error }"
            name=""
            id=""
          >
            <option value="">Seleccione Área</option>
            <option v-for="e in tdrs" :key="e" :value="e.id">
              {{ e.name }}
            </option>
          </select>
          <p class="text-danger" :class="{ 'd-none': !v$.area.$error }">
            Valor incorrecto
          </p>
        </div>

        <div class="col mb-3">
          <label class="form-label">Rol</label>
          <select
            v-model="v$.rol.$model"
            class="form-select"
            :class="{ 'border border-danger': v$.rol.$error }"
            name=""
            id=""
          >
            <option value="">Seleccione Rol</option>
            <option value="FUNCTIONARY">FUNCIONARIO</option>
            <option value="BOSS_OF_AREA">JEFE DE AREA</option>
            <option value="DIRECTOR">DIRECTOR</option>
            <option value="RADICATOR">RADICADOR</option>
          </select>
          <p class="text-danger" :class="{ 'd-none': !v$.rol.$error }">
            Valor incorrecto
          </p>
        </div>
      </div>

      <BCard class="mt-2" no-body> </BCard>

      <div class="row mt-4 align-items-start">
        <div class="col">
          <div class="row">
            <div class="col mb-3">
              <label for="">Email</label>
              <input
                type="email"
                v-model="v$.email.$model"
                class="form-control"
                :class="{ 'border border-danger': v$.email.$error }"
                placeholder="m@email.co"
              />
              <p class="text-danger" :class="{ 'd-none': !v$.email.$error }">
                Valor incorrecto
              </p>
            </div>
          </div>
          <template v-if="!isEditing">
            <div class="row">
              <div class="col mb-3">
                <label for="">Contraseña</label>
                <input
                  type="password"
                  v-model="v$.password.$model"
                  class="form-control"
                  :class="{ 'border border-danger': v$.password.$error }"
                />
                <p
                  class="text-danger"
                  :class="{ 'd-none': !v$.password.$error }"
                >
                  Valor incorrecto
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="">Confirmación de contraseña</label>
                <input
                  type="password"
                  v-model="v$.confirmPassword.$model"
                  class="form-control"
                  :class="{ 'border border-danger': v$.confirmPassword.$error }"
                />
                <p
                  class="text-danger"
                  :class="{ 'd-none': !v$.confirmPassword.$error }"
                >
                  Valor incorrecto
                </p>
              </div>
            </div>
          </template>
          <div class="row text-center">
            <div class="col mb-3 mt-3">
              <BOverlay
                :show="loading"
                rounded
                opacity="0.6"
                spinner-small
                spinner-variant="primary"
                class="d-inline-block"
              >
                <button
                  type="button"
                  class="btn btn-primary px-5"
                  @click="handleSubmit()"
                  :disabled="v$.$invalid || loading"
                >
                  Crear
                </button>
              </BOverlay>
            </div>
          </div>
        </div>
        <div v-if="!isEditing" class="col">
          <BCard class="bg-primary-subtle text-black-50">
            <p class="text-break">
              Para asegurar la seguridad de tu cuenta, la contraseña debe
              cumplir con las siguientes reglas:
            </p>
            <p class="text-break">- Mínimo 8 caracteres de longitud.</p>
            <p class="text-break">
              - Debe incluir al menos una letra mayúscula.
            </p>
            <p class="text-break">
              - Debe contener al menos una letra minúscula.
            </p>
            <p class="text-break">- Incluir al menos un número.</p>
            <p class="text-break">
              - Contener al menos un caracter especial (como @, #, $, %, etc.).
            </p>

            <p class="text-break">
              Estas reglas ayudan a crear contraseñas fuertes que son más
              difíciles de adivinar o hackear. Asegúrate de elegir una
              contraseña que puedas recordar, pero que no sea fácil de deducir
              para alguien más.
            </p>
          </BCard>
        </div>
      </div>
    </BCardBody>
  </BCard>
</template>
