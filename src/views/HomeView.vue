<template>
  <DrugFormulaEditor />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DrugFormulaEditor from '@/views/EditBolusRows.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    DrugFormulaEditor
  }
})
</script>
