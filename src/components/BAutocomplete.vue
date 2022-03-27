<template>
  <div class="form-floating flex-grow-1">
    <input
      type="text"
      ref="autocompleteEl"
      class="form-control"
      :id="id"
      v-model.trim="value"
      :list="listid"
    >
    <label
      :for="id"
    >{{ label }}</label>
  </div><!--end:form-floating-->
  <datalist
    :id="listid"
  >
    <option
      v-for="k of filteredOpts"
      :key="k"
      :value="k"
    />
  </datalist>
</template>
<script setup lang="ts">
import { createUniqueId } from '@/services/uniqueIdFactory'

import { computed, watchEffect } from 'vue'
import { useModelWrapper } from './useModelWrapper'

interface Props {
  modelValue: string;
  label: string;
  options: string[];
}

const props = defineProps<Props>()

const emit = defineEmits<{(e: 'update:modelValue', value: string): void
  (e: 'update:selectedIndex', value: number): void
}>()

const value = useModelWrapper(props, emit)

const id = createUniqueId(props)

const listid = computed(() => id + '-options')

const searchableValue = computed(() => props.modelValue.toLowerCase())

// potentially some kind of regex replace /[^a-zA-Z0-9], ' '/
const searchableOpts = computed(() => props.options.map(o => o.toLowerCase()))

const filteredOpts = computed(() =>
  searchableValue.value
    ? searchableOpts.value.reduce((accum, s, indx) => {
      if (s.includes(searchableValue.value)) accum.push(indx)
      return accum
    }, [] as number[]).map(i => props.options[i])
    : props.options)

let oldIndex = -1
watchEffect(() => {
  const newIndex = searchableOpts.value.findIndex(s => s === searchableValue.value)
  if (oldIndex !== newIndex) emit('update:selectedIndex', (oldIndex = newIndex))
})
</script>
