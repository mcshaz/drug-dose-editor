<template>
  <div v-if="editor">
    <EditorContent
      :editor="editor"
    />
    <ul class="nav nav-pills">
      <li class="nav-item">
        <button
          v-if="includeCode"
          @click="editor!.chain().focus().toggleCode().run()"
          :class="{ 'is-active active': isCodeActive }"
          class="nav-link"
          title="add formula"
        >
          𝑓(𝑥)
        </button>
      </li>
      <li
        v-if="includeCode"
        class="nav-item dropdown"
      >
        <button
          :disabled="!isCodeActive"
          class="nav-link dropdown-toggle"
          :class="isCodeActive ? '' : 'disabled'"
          data-bs-toggle="dropdown"
          role="button"
          aria-expanded="false"
        >
          <font-awesome-icon icon="weight-scale" />
        </button>
        <ul class="dropdown-menu">
          <li>
            <button
              class="dropdown-item"
              @click="editor?.commands.insertContent('weightKg')"
              type="button"
            >
              Weight <small>(kg)</small>
            </button>
          </li>
          <li>
            <button
              class="dropdown-item"
              @click="editor?.commands.insertContent('bsa')"
              type="button"
              title="Body surface area in square metres"
            >
              BSA <small>(m²)</small>
            </button>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <button
              class="dropdown-item"
              @click="editor?.commands.insertContent('ageYears')"
              type="button"
              title="Age in years"
            >
              Age <small>(years)</small>
            </button>
          </li>
          <li>
            <button
              class="dropdown-item"
              @click="editor?.commands.insertContent('ageDays')"
              type="button"
              title="Age in days"
            >
              Age <small>(days)</small>
            </button>
          </li>
          <li>
            <button
              class="dropdown-item"
              @click="editor?.commands.insertContent('cga')"
              type="button"
              title="Corrected gestational age in weeks"
            >
              CGA <small>(weeks)</small>
            </button>
          </li>
        </ul>
      </li>
      <li class="nav-item dropdown">
        <button
          class="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          role="button"
          aria-expanded="false"
        >
          {{ currentStyle || '[Style]' }}
          <!--possibly font-awesome pen-nib-->
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
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup lang="ts">
import { arrowRight, paragraphDiv } from '@/services/custom-tiptap'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { computed } from 'vue'
import { myCode } from '@/services/tiptap/myCode'
import { TextClass } from '@/services/tiptap/text-class'
import { History } from '@tiptap/extension-history'

export type drugFormats = 'drug-name' | 'concentration' | 'route' | 'route-emphasis' | 'drug-note' | 'diluent-fluid'
  | 'diluted-ml' | 'dilution' | 'neat' | 'neat-ml' | 'arrow-right' | 'dose-calc' | 'final-dose'
export type bodyClasses = 'text-right' | 'text-center' | 'text-left'

interface Props {
  modelValue: string | null;
  formats: drugFormats[];
  bodyClass: bodyClasses;
  includeCode?: boolean;
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
    arrowRight,
    TextClass,
    History
  ],
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    // HTML
    emit('update:modelValue', editor.getHTML())

    // JSON
    // emit('update:modelValue', editor.getJSON())
  }
})

const currentStyle = computed(() => props.formats.find(f => editor.value?.isActive('superscript') || editor.value?.isActive('textClass', { class: f })))

const isCodeActive = computed(() => editor.value?.isActive('code'))

const selectStyle = (f: FormatInfo) => {
  if (f.className === 'arrow-right') {
    editor.value!.chain().focus().setSuperscript().run()
  } else {
    editor.value!.chain().focus().setClass(f.className).run()
  }
}
</script>
<style>
.ProseMirror {
  min-height: 6.1em;
  border:lightgray 1px dotted;
  padding: 0 0.5em;
}
</style>
