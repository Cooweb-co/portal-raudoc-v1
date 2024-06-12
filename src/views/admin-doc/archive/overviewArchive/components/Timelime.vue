<script setup>
import TimelimeElement from "./TimelimeElement.vue";
import { defineProps, onMounted, ref } from "vue";
const props = defineProps({
    numberClaim: String,
    showPrivateClaim: Boolean,
});

const data = ref(null);

onMounted(() => {
    const dataPrivate = [
        {
            createdAt: "19 marzo 2021 - 12:00 pm",
            name: "Alanna",
            action: "Respondido",
            content: [
                ["Destinatario", "Roberto Pérez"],
                ["Método de envío", "correo electrónico"],
                ["Correo", "roberto.perez@gmail.com"],
                ["Comentario", "El documento está bien"],
            ],
        },
        {
            createdAt: "16 marzo 2021 - 12:00 pm",
            name: "Fernando Alonso",
            action: "Devolución",
            content: [
                ["Asignado a", "Luis Andrés"],
                ["Comentarios", "Se realiza l asignación de la devolución"],
            ],
        },
        {
            createdAt: "16 marzo 2021 - 12:00 pm",
            name: "Fernando Alonso",
            action: "Aprobado",
            content: [
                ["Area", "Contaduría"],
                ["Comentarios", "El fue elaborado"],
            ],
        },
        {
            createdAt: "16 marzo 2021 - 12:00 pm",
            name: "Camilo",
            action: "Elaborado",
            content: [
                ["Area", "Administración"],
                ["Comentarios", "El fue elaborado"],
            ],
        },
        {
            createdAt: "15 marzo 2021 - 12:00 pm",
            name: "Camilo",
            action: "Transferido",
            content: [
                ["Area", "Administración"],
                ["Asignado a", "Luis Andrés"],
                ["Area", "Contaduría"],
                [
                    "Comentarios",
                    "Se realiza el traspaso de la asignación a contaduría",
                ],
            ],
        },
        {
            createdAt: "14 marzo 2021 - 2:12 pm",
            name: "Camilo",
            action: "Asignado",
            content: [
                ["Asignado a", "Luis Andrés"],
                ["Area", "Contaduría"],
                [
                    "Comentarios",
                    "Se realiza la asignación para la contestación",
                ],
            ],
        },
        {
            createdAt: "",
            name: "Sistema",
            action: "Iniciado",
            content: `Ha iniciado el proceso al siguiente documento ${props.numberClaim}, en el transcurso de los días se ira actualizando el estado del documento.`,
        },
    ];

    const dataPublic = [
        {
            createdAt: "19 marzo 2021 - 12:00 pm",
            name: "Sistema",
            action: "Respondido",
            content: "Respuesta generada por el entidad",
        },
        {
            createdAt: "16 marzo 2021 - 12:00 pm",
            name: "Sistema",
            action: "En gestión",
            content: "Documento en gestión por parte del funcionario",
        },
        {
            createdAt: "14 marzo 2021 - 2:12 pm",
            name: "Sistema",
            action: "Asignado",
            content: "Tramite asignado al funcionario",
        },
        {
            createdAt: "",
            name: "Sistema",
            action: "Iniciado",
            content: `Ha iniciado el proceso al siguiente documento ${props.numberClaim}, en el transcurso de los días se ira actualizando el estado del documento.`,
        },
    ];
    data.value = !props.showPrivateClaim ? dataPublic : dataPrivate;
});

// Methods

// This function will return the position of the timeline element
function evenOrOdd(number) {
    if (number % 2 === 0) {
        return "right";
    } else {
        return "left";
    }
}
</script>
<template>
    <div>
        <div v-if="!data" class="d-flex justify-content-center align-items-center w-100 h-100">
            <h3 class="text-center fs-3 text-muted fst-italic mt-2">Este documento no posee un historial.</h3>
        </div>
        <div class="timeline">
            <TimelimeElement
                v-for="(item, index) in data"
                :key="index"
                :createdAt="item.createdAt"
                :position="evenOrOdd(index + 1)"
                :name="item.name"
                :action="item.action"
                :content="item.content"
            />
        </div>
    </div>
</template>
