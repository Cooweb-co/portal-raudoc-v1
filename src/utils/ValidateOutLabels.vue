<script lang="js" setup>

import { defineProps } from 'vue'
const props = defineProps({
  addressee$: {type: String},
  attribute: {type: String}
});
</script>

<template>
  <span
    v-for="error in props?.addressee$[props?.attribute]?.$errors"
    :key="error.$uid"
    class="text-danger fs-8"
  >
    {{ error.$message }}
  </span>
</template>