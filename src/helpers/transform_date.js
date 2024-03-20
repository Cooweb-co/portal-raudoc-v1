import moment from "moment";
moment.locale('es');

export default function transform_date(data) {
  const date = new Date(data * 1000); // Convertir a milisegundos
  const formattedDate = moment(date).format("DD MMMM, YYYY");
  return formattedDate
}