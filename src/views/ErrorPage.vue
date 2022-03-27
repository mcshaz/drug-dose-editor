<template>
  <div class="container">
    <div class="card text-dark bg-warning mb-3">
      <div class="card-header">
        Error
      </div>
      <div class="card-body">
        <h5 class="card-title">
          There seems to be a problem
        </h5>
        <p class="card-text">
          Appologies, but the page you were navigating to encountered an error.
          <span v-if="reason">Additional details are below:</span>
        </p>
        <blockquote v-if="reason">
          {{ reason }}
          <cite>{{ from }}</cite>
        </blockquote>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const reason = route.params.reason
const from = route.redirectedFrom
</script>
