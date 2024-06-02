export default function capitalizeText(text) {
    return text
        .toLowerCase() // Convierte todo el texto a minúsculas
        .split(" ") // Divide el texto en un array de palabras
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza la primera letra de cada palabra
        .join(" "); // Une las palabras nuevamente en un solo string
}
