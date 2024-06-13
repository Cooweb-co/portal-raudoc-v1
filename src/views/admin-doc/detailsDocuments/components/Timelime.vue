<script setup>
import TimelimeElement from "./TimelimeElement.vue";
import { defineProps, onMounted, ref } from "vue";
const props = defineProps({
    numberClaim: String,
    showPrivateClaim: Boolean,
});

const data = ref(null);
const dataLenght = ref(0);

const seconds = Math.floor(Date.now() / 1000);
const nanoseconds = 0;

const timestamp = {
    seconds: seconds,
    nanoseconds: nanoseconds
};

onMounted(() => {
    const dataPrivate = [
        {
            createdAt: timestamp,
            name: "Alanna",
            action: "Respondido",
            content: [
                { name: "Destinatario", value: "Roberto Pérez" },
                { name: "Método de envío", value: "correo electrónico" },
                { name: "Correo", value: "roberto.perez@gmail.com" },
                { name: "Comentario", value: "El documento está bien" },
            ],
        },
        {
            createdAt: timestamp,
            name: "Fernando Alonso",
            action: "Devolución",
            content: [
                { name: "Asignado a", value: "Luis Andrés" },
                {
                    name: "Comentarios",
                    value: "Se realiza l asignación de la devolución",
                },
            ],
        },
        {
            createdAt: timestamp,
            name: "Fernando Alonso",
            action: "Aprobado",
            content: [
                { name: "Area", value: "Administración" },
                { name: "Comentarios", value: "El fue elaborado" },
            ],
        },
        {
            createdAt: timestamp,
            name: "Fernando Alonso",
            action: "Aprobado",
            content: [
                { name: "Area", value: "Administración" },
                { name: "Comentarios", value: "El fue elaborado" },
            ],
        },
        {
            createdAt: timestamp,
            name: "Camilo",
            action: "Elaborado",
            content: [
                { name: "Area", value: "Administración" },
                { name: "Comentarios", value: "El fue elaborado" },
            ],
        },
        {
            createdAt: timestamp,
            name: "Camilo",
            action: "Transferido",
            content: [
                { name: "Area", value: "Administración" },
                { name: "Asignado a", value: "Luis Andrés" },
                { name: "Area", value: "Contaduría" },
                {
                    name: "Comentarios",
                    value: "Se realiza el traspaso de la asignación a contaduría",
                },
            ],
        },
        {
            createdAt: timestamp,
            name: "Camilo",
            action: "Asignado",
            content: [
                { name: "Asignado a", value: "Luis Andrés" },
                { name: "Area", value: "Contaduría" },
                {
                    name: "Comentarios",
                    value: "Se realiza la asignación para la contestación",
                },
            ],
        },
    ];

    const dataPublic = [
        {
            createdAt: timestamp,
            name: "Sistema",
            action: "Respondido",
            content: "Respuesta generada por el entidad",
        },
        {
            createdAt: timestamp,
            name: "Sistema",
            action: "En gestión",
            content: "Documento en gestión por parte del funcionario",
        },
        {
            createdAt: timestamp,
            name: "Sistema",
            action: "Asignado",
            content: "Tramite asignado al funcionario",
        },
    ];
    data.value = !props.showPrivateClaim ? dataPublic : dataPrivate;
    dataLenght.value = data.value.length;
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
        <div
            v-if="!data"
            class="d-flex justify-content-center align-items-center w-100 h-100"
        >
            <h3 class="text-center fs-3 text-muted fst-italic mt-2">
                Este documento no posee un historial.
            </h3>
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
            <TimelimeElement
                :createdAt="''"
                :position="evenOrOdd(dataLenght + 1)"
                :name="'Sistema'"
                :action="'Iniciado'"
                :content="
                    'Ha iniciado el proceso al siguiente documento ' +
                    props.numberClaim +
                    ', en el transcurso de los días se ira actualizando el estado del documento.'
                "
            />
        </div>
    </div>
</template>
