import { ref, computed } from "vue";
import axios from "axios";
import {
  entryColumns,
  departureColumns,
  pendingColumns,
} from "../constants/reportColums";

export function useReport(reportTypeRef) {
  const reporType = ref(reportTypeRef);
  const columnsData = {
    entry: entryColumns,
    departure: departureColumns,
    pending: pendingColumns,
  };

  const columns = computed(() => columnsData[reporType.value] || []);

  async function getReport(startDate, endDate) {
    try {
      if (!(startDate && endDate)) throw "Debe seleccionar un rango valido";
      return (
        await axios.get(
          `${process.env.VUE_APP_CF_BASE_URL}/reports/${reporType.value}/${startDate}/${endDate}`,
          {
            headers: {
              company: "BAQVERDE",
            },
          }
        )
      ).data;
    } catch (error) {
      return error;
    }
  }

  return {
    getReport,
    columns,
  };
}
