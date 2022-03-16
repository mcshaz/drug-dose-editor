<template>
  <div class="home container-fluid">
    <DrugFormulaEditor />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DrugFormulaEditor from '@/components/DrugFormulaEditor.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    DrugFormulaEditor
  }
})
</script>
