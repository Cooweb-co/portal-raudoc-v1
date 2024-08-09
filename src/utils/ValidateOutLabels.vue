<script lang="js" setup>

import { defineProps } from 'vue'
const props = defineProps({
  v2$: {type: String},
  attribute: {type: String}
});
</script>

<template>
  <span
    v-for="error in props?.v2$[props?.attribute]?.$errors"
    :key="error.$uid"
    class="text-danger fs-8"
  >
    {{ error.$message }}
  </span>
</template>