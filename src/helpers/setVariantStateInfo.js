export default function setVariantStateInfo(state) {
    const stateLowerCase = state?.toLowerCase();
    const variants = {
        "vencido": "danger",
        "por vencer": "warning",
        "en termino": "success",
        "respondido": "primary",
        "no requiere respuesta": "primary"
    }
    return variants[stateLowerCase] ?? "secondary";
}
