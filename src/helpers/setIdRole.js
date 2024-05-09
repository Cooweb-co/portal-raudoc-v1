export default function setIdRole(state) {
  const role = state.toLocaleUpperCase();
  let newState;
  switch (role) {
      case "FUNCTIONARY":
          newState = "Funcionario";
          break;
      case "BOSS_OF_AREA":
          newState = "Jefe de area";
          break;
      case "DIRECTOR":
          newState = "Director";
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