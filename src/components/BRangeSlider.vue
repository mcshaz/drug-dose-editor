<template>
  <div>
    <div class="input-group">
      <span class="input-group-text">{{ min }}</span>
      <div class="form-control">
        <label
          class="range-label"
          :for="id"
        >{{ label }}:{{ value }}</label>
        <input
          type="range"
          class="form-range mt-3"
          :id="id"
          :value="value"
          @input="onInput"
          @change="onChange"
          :min="min"
          :max="max"
          :step="step"
        >
      </div>
      <span class="input-group-text">{{ max }}</span>
    </div><!--input-group-->
  </div>
</template>
<script setup lang="ts">
import { createUniqueId } from '@/services/uniqueIdFactory'
import { ref, watchEffect } from 'vue'

interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1
})
const emit = defineEmits<{(e: 'update:modelValue', value: number): void}>()

const value = ref(props.modelValue)

const onChange = (evt: Event) => {
  emit('update:modelValue', Number((evt.target as HTMLInputElement).value))
}

const onInput = (evt: Event) => {
  value.value = Number((evt.target as HTMLInputElement).value)
}

watchEffect(() => { value.value = props.modelValue })

const id = createUniqueId(props)

</script>
<style>
label.range-label {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  padding: 1rem 0.75rem;
  pointer-events: none;
  border: 1px solid transparent;
  transform-origin: 0 0;
  transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
  opacity: 0.65;
}
</style>
