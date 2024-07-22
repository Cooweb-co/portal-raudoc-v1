import moment from "moment/moment";
moment.locale("es");

export function transformDate(data, format = "DD MMMM, YYYY") {
    const date = new Date(data * 1000); // Convertir a milisegundos
    const formattedDate = moment(date).format(format);
    return formattedDate;
}

export function transformTimeStampToDate(timestamp, format) {
    const timestampMillis =
        timestamp.seconds * 1000 + Math.round(timestamp.nanoseconds / 1000000);
    // Convierte el timestamp a un objeto Moment.js
    const fechaMoment = moment(timestampMillis);

    // Formatea la fecha en el formato deseado
    const fechaFormateada = fechaMoment.format(format);

    return fechaFormateada;
}

export function transformCreatedAtToDate(timestamp, format) {
    const timestampMillis =
    timestamp._seconds * 1000 + Math.round(timestamp._nanoseconds / 1000000);
// Convierte el timestamp a un objeto Moment.js
const fechaMoment = moment(timestampMillis);

// Formatea la fecha en el formato deseado
const fechaFormateada = fechaMoment.format(format);

return fechaFormateada;
}

