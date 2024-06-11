import axios from "axios";
export const setTracking = async (
    claimId, // ID del documento
    company, // Nombre de la compañía
    name, // Nombre del usuario
    content, // Contenido del tracking
    action, // Acción del tracking
    isPrivate // Indica si el tracking es privado o no
) => {
    try {
        const data = JSON.stringify({
            claimId: claimId,
            name: name,
            content: content,
            action: action,
            isPrivate: isPrivate,
        });

        const headers = {
            "Content-Type": "application/json",
            company: company,
        };

        const response = await axios.post(
            `${process.env.VUE_APP_CF_BASE_URL}/tracking`,
            data,
            headers
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
