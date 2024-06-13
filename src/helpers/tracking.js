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

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${process.env.VUE_APP_CF_BASE_URL}/tracking`,
            headers: {
                "Accept": "/",
                "Content-Type": "application/json",
                company: company,

            },
            data: data,
        }

        const response = await axios.request(config)
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
