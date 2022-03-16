<template>
  <Editor
    api-key="ubk5mxwv8p0h5gtw5ww4h2qi9w8wsocb587aynodsqvnabge"
    :init="options"
    v-model="value"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import { mceBaseOptions } from './mceBaseOptions'
import { useModelWrapper } from './useModelWrapper'
export type drugFormats = 'drug-name' | 'concentration' | 'route' | 'route-emphasis' | 'drug-note' | 'diluent-fluid'
  | 'diluted-ml' | 'dilution-method' | 'neat' | 'neat-ml' | 'arrow-right' | 'dose-calculation' | 'calculated-dose'
export type bodyClasses = 'text-right' | 'text-center' | 'text-left'

interface Props {
  modelValue: string | null;
  formats: drugFormats[];
  bodyClass: bodyClasses;
}
const props = defineProps<Props>()
const emit = defineEmits<{(e: 'update:modelValue', value: string | null): void}>()
const value = useModelWrapper(props, emit)

const options = computed(() => ({
  ...mceBaseOptions,
  body_class: props.bodyClass,
  style_formats: props.formats.map(f => ({
    name: f.replaceAll('-', ''),
    title: f[0].toUpperCase() + f.substring(1).replaceAll('-', ' '),
    classes: [f],
    inline: f === 'drug-note' ? 'small' : f === 'arrow-right' ? 'sup' : 'span'
  }))
}))

</script>
