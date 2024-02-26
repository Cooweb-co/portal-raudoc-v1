<script>
import flatPickr from "vue-flatpickr-component";

export default {
  components: {
    flatPickr,
  },
  data() {
    return {
      date: null,
      config: {
        inline: true,
      },
    };
  },
};
</script>

<template>
  <BCard no-body>
    <BCardHeader class="border-0">
      <BCardTitle class="mb-0">Calendario de pendientes</BCardTitle>
    </BCardHeader>
    <BCardBody class="pt-0">
      <div class="upcoming-scheduled">
        <flat-pickr v-model="date" :config="config"></flat-pickr>
      </div>

      <h6 class="text-uppercase fw-semibold mt-4 mb-3 text-muted">PROXIMAS A VENCER:</h6>
      <div class="mini-stats-wid d-flex align-items-center mt-3">
        <div class="flex-shrink-0 avatar-sm">
          <span class="mini-stat-icon avatar-title rounded-circle text-primary bg-primary-subtle fs-4">
            09
          </span>
        </div>
        <div class="flex-grow-1 ms-3">
          <h6 class="mb-1">Proceso en contra sel señor Juan</h6>
          <p class="text-muted mb-0">Juridica</p>
        </div>
        <div class="flex-shrink-0">
          <p class="text-muted mb-0">
            9:20 <span class="text-uppercase">am</span>
          </p>
        </div>
      </div>
      <div class="mini-stats-wid d-flex align-items-center mt-3">
        <div class="flex-shrink-0 avatar-sm">
          <span class="mini-stat-icon avatar-title rounded-circle text-primary bg-primary-subtle fs-4">
            12
          </span>
        </div>
        <div class="flex-grow-1 ms-3">
          <h6 class="mb-1">Proceso de tutela en curso</h6>
          <p class="text-muted mb-0">Juridica</p>
        </div>
        <div class="flex-shrink-0">
          <p class="text-muted mb-0">
            11:30 <span class="text-uppercase">am</span>
          </p>
        </div>
      </div>
      <div class="mini-stats-wid d-flex align-items-center mt-3">
        <div class="flex-shrink-0 avatar-sm">
          <span class="mini-stat-icon avatar-title rounded-circle text-primary bg-primary-subtle fs-4">
            25
          </span>
        </div>
        <div class="flex-grow-1 ms-3">
          <h6 class="mb-1">Emisión de de 20 cobro coactivo</h6>
          <p class="text-muted mb-0">Financiera</p>
        </div>
        <div class="flex-shrink-0">
          <p class="text-muted mb-0">
            02:00 <span class="text-uppercase">pm</span>
          </p>
        </div>
      </div>
      <!-- <div class="mini-stats-wid d-flex align-items-center mt-3">
        <div class="flex-shrink-0 avatar-sm">
          <span class="mini-stat-icon avatar-title rounded-circle text-primary bg-primary-subtle fs-4">
            27
          </span>
        </div>
        <div class="flex-grow-1 ms-3">
          <h6 class="mb-1">James Bangs (Client) Meeting</h6>
          <p class="text-muted mb-0">Nesta Technologies</p>
        </div>
        <div class="flex-shrink-0">
          <p class="text-muted mb-0">
            03:45 <span class="text-uppercase">pm</span>
          </p>
        </div>
      </div> -->

      <div class="mt-3 text-center">
        <BLink href="javascript:void(0);" class="text-muted text-decoration-underline">Ver todos los pendientes</BLink>
      </div>
    </BCardBody>
  </BCard>
</template>
