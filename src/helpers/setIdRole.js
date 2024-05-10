export default function setIdRole(state) {
    const role = state.toUpperCase();
    let newState;
    switch (role) {
        case "FUNCTIONARY":
            newState = "FUNCIONARIO";
            break;
        case "BOSS_OF_AREA":
            newState = "JEFE DE AREA";
            break;
        case "DIRECTOR":
            newState = "DIRECTOR";
            break;
        case "ADMIN":
            newState = "ADMINISTRADOR";
            break;
        case "RADICATOR":
            newState = "RADICADOR";
            break;
        default:
            newState = role;
            break;
    }
    return newState;
}
