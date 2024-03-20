<template>
    <footer class="footer">
        <span
            >{{ new Date().getFullYear() }} © RauDoc - All Rights
            Reserved.</span
        >
        <span class="text-sm-end d-none d-sm-block">
            Design & Develop by CooWeb
        </span>
    </footer>
</template>
<style>
.footer {
    bottom: 0;
    position: relative;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4em;
}

@media screen and (max-width: 767px) {
    .footer {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
