export default function setVariantStateInfo(state) {
    const stateLowerCase = state?.toLowerCase();
    let variant;
    switch (stateLowerCase) {
        case "vencido":
            variant = "danger";
            break;
        case "por vencer":
            variant = "warning";
            break;
        case "en termino":
            variant = "success";
            break;
        case "respondido":
            variant = "primary";
            break;
        case "no requiere respuesta":
            variant = "primary";
            break;
        default:
            variant = "secondary";
            break;
    }
    return variant;
}
