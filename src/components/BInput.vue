<template>
  <div class="form-floating flex-grow-1">
    <input
      class="form-control"
      :id="id"
      v-model.trim="value"
      type="text"
    >
    <label
      :for="id"
    >{{ label }}</label>
  </div><!--end:form-floating-->
</template>
<script setup lang="ts">
import { createUniqueId } from '@/services/uniqueIdFactory'
import { useModelWrapper } from './useModelWrapper'
interface Props {
  modelValue: string;
  label: string;
}

const props = defineProps<Props>()

const emit = defineEmits<{(e: 'update:modelValue', value: string): void
  (e: 'update:selectedIndex', value: number): void
}>()

const value = useModelWrapper(props, emit)

const id = createUniqueId(props)
</script>
