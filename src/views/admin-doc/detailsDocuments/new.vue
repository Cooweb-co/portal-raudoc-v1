<script>
import Layout from "@/layouts/main.vue";

export default {
    components: {
        Layout,
    },
};
</script>
<template>
    <Layout>
        <!DOCTYPE html>
<html>
<head>
    <title>Formulario de Registro</title>
</head>
<body>
    <form action="/submit_form" method="post">
        <label for="nombre">Nombre:</label><br>
        <input type="text" id="nombre" name="nombre"><br>

        <label for="documento">Número de Documento (CC):</label><br>
        <input type="text" id="documento" name="documento"><br>

        <label for="sexo">Sexo:</label><br>
        <select id="sexo" name="sexo">
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
        </select><br>

        <label for="razon_social">Nombre o Razón Social:</label><br>
        <input type="text" id="razon_social" name="razon_social"><br>

        <label for="apellidos">Apellidos:</label><br>
        <input type="text" id="apellidos" name="apellidos"><br>

        <label for="telefono">Teléfono:</label><br>
        <input type="tel" id="telefono" name="telefono"><br>

        <label for="email">Correo Electrónico:</label><br>
        <input type="email" id="email" name="email"><br>

        <input type="submit" value="Enviar">
    </form>
</body>
</html>

    </Layout>
</template>