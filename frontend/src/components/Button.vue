<template>
  <div>
{{ count.toFixed(2) }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(1)

</script>

<style scoped>
  
</style>