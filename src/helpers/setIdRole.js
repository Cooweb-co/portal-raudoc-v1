export default function setIdRole(state) {
    const role = state.toUpperCase();
    const roles = {
        "FUNCTIONARY": "Funcionario",
        "BOSS_OF_AREA": "Jefe de área",
        "DIRECTOR": "Director",
        "ADMIN": "Administrador",
        "RADICATOR": "Radicador"
    }
    return roles[role] ?? role;
}