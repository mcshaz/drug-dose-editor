<template>
  <div
    class="card border-warning"
  >
    <div class="card-header">
      404 Not found
    </div>
    <div class="card-body">
      <h5 class="card-title">
        There seems to be a problem...
      </h5>
      <p class="card-text">
        Unfortunately this page <span class="text-muted">({{ from }})</span> does not exist.
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
// import { useRoute } from 'vue-router'
// const route = useRoute()
const from = window.location
</script>
