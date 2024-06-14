export default function setState(state) {
    let newState;
    switch (state) {
        case "EXPIRED":
            newState = "Vencido";
            break;
        case "TO_EXPIRE":
            newState = "Por vencer";
            break;
        case "IN_TERM":
            newState = "En termino";
            break;
        case "ANSWERED":
            newState = "Respondido";
            break;
        case "NO_RESPONSE":
            newState = "No requiere respuesta";
            break;
        default:
            newState = state;
            break;
    }
    return newState;
}