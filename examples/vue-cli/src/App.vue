<script>
export default {
  name: 'App',
}
</script>

<template>
  <!-- #if NODE_ENV !== 'development' -->
  <div>if</div>
  <!-- #else -->
  <div>else</div>
  <!-- #endif -->
</template>
