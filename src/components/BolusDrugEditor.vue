<template>
  <div v-if="editor">
    <ul class="nav nav-pills">
      <li class="nav-item">
        <button
          @click="editor!.chain().focus().toggleCode().run()"
          :class="{ 'is-active active': editor.isActive('code') }"
          class="nav-link btn-sm"
          title="add formula"
        >
          {x+y}
        </button>
      </li>
      <li class="nav-item dropdown">
        <button
          class="nav-link dropdown-toggle"
          data-bs-toggle="dropdown btn-sm"
          role="button"
          aria-expanded="false"
        >
          {{ currentStyle || 'Style' }}
        </button>
        <ul class="dropdown-menu">
          <li>
            <button
              v-for="f of formatDetails"
              :key="f.className"
              class="dropdown-item"
              :class="{ 'is-active active': editor.isActive('textClass', { class: f.className }) }"
              @click="selectStyle(f)"
              type="button"
            >
              <span :class="f.className">
                {{ f.displayName }}
              </span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
    <EditorContent
      :editor="editor"
    />
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup lang="ts">
import { paragraphDiv } from '@/services/custom-tiptap'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { computed } from 'vue'
import { myCode } from '@/services/tiptap/myCode'
import { TextClass } from '@/services/tiptap/text-class'

export type drugFormats = 'drug-name' | 'concentration' | 'route' | 'route-emphasis' | 'drug-note' | 'diluent-fluid'
  | 'diluted-ml' | 'dilution' | 'neat' | 'neat-ml' | 'arrow-right' | 'dose-calc' | 'final-dose'
export type bodyClasses = 'text-right' | 'text-center' | 'text-left'

interface Props {
  modelValue: string | null;
  formats: drugFormats[];
  bodyClass: bodyClasses;
}
const props = defineProps<Props>()
const emit = defineEmits<{(e: 'update:modelValue', value: string | null): void}>()

interface FormatInfo { className: string; displayName: string; }

const formatDetails = computed(() => props.formats.map(f => ({
  className: f,
  displayName: f[0].toUpperCase() + f.substring(1).replaceAll('-', ' ')
} as FormatInfo)))

const editor = useEditor({
  editorProps: {
    attributes: {
      class: props.bodyClass
    }
  },
  extensions: [
    Document,
    paragraphDiv,
    Text,
    myCode,
    TextClass
  ],
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    // HTML
    emit('update:modelValue', editor.getHTML())

    // JSON
    // emit('update:modelValue', editor.getJSON())
  }
})

const currentStyle = computed(() => props.formats.find(f => editor.value?.isActive('textClass', { class: f })))

const selectStyle = (f: FormatInfo) => {
  editor.value!.chain().focus().setClass(f.className).run()
}

</script>
