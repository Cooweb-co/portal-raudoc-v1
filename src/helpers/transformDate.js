import moment from "moment";
moment.locale('es');

export default function transformDate(data) {
  const date = new Date(data * 1000); // Convertir a milisegundos
  const formattedDate = moment(date).format("DD MMMM, YYYY");
  return formattedDate
}