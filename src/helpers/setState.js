export default function setState(state) {
    const states = {
        "EXPIRED": "Vencido",
        "TO_EXPIRE": "Por vencer",
        "IN_TERM": "En termino",
        "ANSWERED": "Respondido",
        "NO_RESPONSE": "No requiere respuesta",
    }
    return states[state] ?? state;
}