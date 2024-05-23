<script>
import { CountTo } from "vue3-count-to";
import { ref, onMounted } from "vue";
import { state } from "@/state/modules/auth";
import axios from "axios";

import getChartColorsArray from "@/common/getChartColorsArray";

export default {
  components: {
    CountTo
  },
  setup() {
    const user = ref(JSON.parse(state.currentUserInfo));
    const loading = ref(false)
    const projectsWidgets = ref();


    onMounted(async () => {
    try {
        loading.value = true;
        const url =
            `${process.env.VUE_APP_CF_BASE_URL}/GET_COUNT_CLAIMS_BY_USER`;
        const config = {
            params: {
                uid: user.value.uid,
            },
            headers: {
                company: "BAQVERDE",
                "Content-Type": "application/json",
            },
        };
       
        const dataForCard = await axios.post(url, {}, config);
        if (dataForCard.data.length > 0) {
            loading.value = false;
            projectsWidgets.value = dataForCard.data;
        } else {
            loading.value = false;
            projectsWidgets.value = [
                {
                    value: "Peticiones Recibidas",
                    count: 0,
                },
                {
                    value: "Peticiones Respondidas",
                    count: 0,
                },
                {
                    value: "Peticiones por responder",
                    count: 0,
                },
                {
                    value: "Documentos Procesados",
                    count: 0,
                },
            ];
        }
    } catch (error) {
        console.error(error);
        loading.value = false;
        projectsWidgets.value = [
            {
                value: "Peticiones Recibidas",
                count: 0,
            },
            {
                value: "Peticiones Respondidas",
                count: 0,
            },
            {
                value: "Peticiones por responder",
                count: 0,
            },
            {
                value: "Documentos Procesados",
                count: 0,
            },
        ];
    }
});

    return {
      series: [{
        name: "Peticiones",
        type: "bar",
        data: [27, 35, 31, 23, 15, 20, 10, 20, 40, 50, 60, 70],
      },
      {
        name: "Respuestas",
        type: "area",
        data: [27, 35, 30, 19, 15, 18, 10, 18, 40, 45, 60, 70],
      },
      {
        name: "Pendientes",
        type: "bar",
        data: [0, 0, 1, 4, 0, 2, 0, 2, 0, 5, 0, 0],
      },
      ],
      chartOptions: {
        chart: {
          height: 374,
          type: "line",
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: "smooth",
          dashArray: [0, 3, 0],
          width: [0, 1, 0],
        },
        fill: {
          opacity: [1, 0.1, 1],
        },
        markers: {
          size: [0, 4, 0],
          strokeWidth: 2,
          hover: {
            size: 4,
          },
        },
        xaxis: {
          categories: [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
          },
        },
        grid: {
          show: true,
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
          padding: {
            top: 0,
            right: -2,
            bottom: 15,
            left: 10,
          },
        },
        legend: {
          show: true,
          horizontalAlign: "center",
          offsetX: 0,
          offsetY: -5,
          markers: {
            width: 9,
            height: 9,
            radius: 6,
          },
          itemMargin: {
            horizontal: 10,
            vertical: 0,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "30%",
            barHeight: "70%",
          },
        },
        colors: getChartColorsArray('["--vz-primary", "--vz-primary-rgb, 0.1", "--vz-primary-rgb, 0.50"]'),
        tooltip: {
          shared: true,
          y: [{
            formatter: function (y) {
              if (typeof y !== "undefined") {
                return y.toFixed(0);
              }
              return y;
            },
          },
          {
            formatter: function (y) {
              if (typeof y !== "undefined") {
                return + y.toFixed(0);
              }
              return y;
            },
          },
          {
            formatter: function (y) {
              if (typeof y !== "undefined") {
                return y.toFixed(0);
              }
              return y;
            },
          },
          ],
        },
      },
      projectsWidgets
    };
  },
};
</script>

<template>
  <BCard no-body>
    <BCardHeader class="border-0 align-items-center d-flex">
      <BCardTitle class="mb-0 flex-grow-1">Peticiones</BCardTitle>
      <div class="hstack gap-1">
        <BButton type="button" variant="soft-secondary" size="sm">ALL</BButton>
        <BButton type="button" variant="soft-secondary" size="sm">1M</BButton>
        <BButton type="button" variant="soft-secondary" size="sm">6M</BButton>
        <BButton type="button" variant="soft-primary" size="sm">1Y</BButton>
      </div>
    </BCardHeader>

    <BCardHeader class="p-0 border-0 bg-light-subtle">
      <BRow class="g-0 text-center">
        <BCol v-for="(item, idx) in projectsWidgets" :key="idx" cols="6" sm="3">
          <div class="p-3 border border-dashed border-start-0">
            <h5 class="mb-1">
              <count-to :duration="1000" :startVal='0' :endVal="item.count">PETICIONES</count-to>
            </h5>
            <p class="text-muted mb-0">{{ item.value }}</p>
          </div>
        </BCol>
      </BRow>
    </BCardHeader>
    <BCardBody class="p-0 pb-2">
      <div>
        <apexchart class="apex-charts" height="374" dir="ltr" :series="series" :options="chartOptions"></apexchart>
      </div>
    </BCardBody>
  </BCard>
</template>