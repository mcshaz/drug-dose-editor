<template>
  <div>
    <div class="input-group">
      <span class="input-group-text">{{ min }}</span>
      <div class="form-floating flex-grow-1 mb-4">
        <label
          :for="id"
        >{{ label }}:{{ value }}</label>
        <input
          type="range"
          class="form-range"
          :id="id"
          :value="value"
          @input="onInput"
          @change="onChange"
          :min="min"
          :max="max"
          :step="step"
        >
      </div><!--form-floating-->
      <span class="input-group-text">{{ max }}</span>
    </div><!--input-group-->
  </div>
</template>
<script setup lang="ts">
import uniqueId from 'lodash.uniqueid'
import { computed, ref, watchEffect } from 'vue'

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

const id = computed(() => uniqueId(props.label.replaceAll(/\s/g, '-')))

</script>
