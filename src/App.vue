<template>
 <router-view>
  </router-view>
</template>


<script setup>



</script>

<style>

*::-webkit-scrollbar {
  width: 6px;               /* width of the entire scrollbar */
}

*::-webkit-scrollbar-track {
  background: transparent;        /* color of the tracking area */
}

*::-webkit-scrollbar-thumb {
  background-color: #e5e5e9;    /* color of the scroll thumb */
  border-radius: 20px;       /* roundness of the scroll thumb */
}

body::-webkit-scrollbar-thumb {
  background-color: rgba(var(--vz-primary-rgb), 1);    /* color of the scroll thumb */
  border-radius: 20px;       /* roundness of the scroll thumb */
}
</style>
