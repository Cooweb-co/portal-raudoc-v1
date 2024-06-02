export default function setIdRole(state) {
    const role = state.toUpperCase();
    let newState;
    switch (role) {
        case "FUNCTIONARY":
            newState = "Funcionario";
            break;
        case "BOSS_OF_AREA":
            newState = "Jefe de área";
            break;
        case "DIRECTOR":
            newState = "Director";
            break;
        case "ADMIN":
            newState = "Administrador";
            break;
        case "RADICATOR":
            newState = "Radicador";
            break;
        default:
            newState = role;
            break;
    }
    return newState;
}
