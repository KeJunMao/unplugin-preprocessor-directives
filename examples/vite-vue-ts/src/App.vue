<script setup lang="ts">
import { ref } from 'vue'

const data = ref(1)
// #if !(DEV||PROD)
data.value += 1
// #endif
</script>

<template>
  <div>
    <div>{{ data }}</div>
    <!-- #if DEV -->
    DEV
    <!-- #endif -->

    <!-- #if !PROD -->
    !PROD
    <!-- #endif -->
  </div>
</template>

<style>
/* #if PROD */
body {
  color: red;
}

/* #else */
body {
  background-color: red;
}

/* #endif */

/* #if DEV */
body {
  color: green;
}

/* #else */
body {
  background-color: green;
}

/* #endif */
</style>
