export function useDate() {
  const masks = {
    input: "DD/MM/YYYY",
  };

  const substract = (days) => {
    const res = new Date();
    res.setDate(res.getDate() - days);
    return res;
  };

  const getDate = (date, isClientTable = false, includeTime = false) => {
    if (!date) return date;

    if (typeof date == "string") date = new Date(date);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();

    let formattedDate;

    if (!isClientTable) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } else {
      formattedDate = `${day.padStart(2, "0")}/${month.padStart(
        2,
        "0"
      )}/${year}`;
    }

    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      formattedDate += ` ${hours}:${minutes}`;
    }

    return formattedDate;
  };

  const getFormattedDate = (date, isIsoFormat = true) => {
    if (!date) return;

    if (date === "N/A") return;

    if (!isIsoFormat) {
      const [year, month, day] = date.split("-");
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }

    const [year, month, day] = date.slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
  };

  const calculateAge = (dob) => {
    if (!dob) return 0;
    if (typeof dob == "string") dob = new Date(dob);
    var diffMonths = Date.now() - dob.getTime();
    var ageDate = new Date(diffMonths);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const diff = (date) => {
    date = new Date(date);

    const now = new Date();
    const differenceInMillis = now.getTime() - date.getTime();

    return differenceInMillis / (1000 * 60 * 60 * 24);
  };

  const getDateCycle = (date, stage) => {
    let _date = new Date(date);

    if (stage == "start") {
      _date = _date.setHours(0, 0, 0);
    } else {
      _date = _date.setHours(23, 59, 59);
    }
    return new Date(_date);
  };

  return {
    getDate,
    substract,
    getFormattedDate,
    calculateAge,
    masks,
    diff,
    getDateCycle,
  };
}
