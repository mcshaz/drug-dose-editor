<template>
  <div class="form-floating flex-grow-1">
    <select
      class="form-select"
      :id="id"
      v-model="value"
    >
      <option
        v-for="d in options"
        :key="d.value"
        :value="d.value"
      >
        {{ d.text }}
      </option>
    </select>
    <label
      :for="id"
    >{{ label }}</label>
  </div><!--end:form-floating-->
</template>
<script setup lang="ts">
import { createUniqueId } from '@/services/uniqueIdFactory'
import { useModelWrapper } from './useModelWrapper'

interface Props {
  modelValue: string | number;
  label: string;
  options: { value: string | number; text: string | number }[];
}

const props = defineProps<Props>()

const emit = defineEmits<{(e: 'update:modelValue', value: string | number): void }>()

const value = useModelWrapper(props, emit)

const id = createUniqueId(props)

</script>
