<template>
  <div
    class="modal"
    tabindex="-1"
    ref="modalDOM"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="Title">
            <h5 class="modal-title">
              {{ title }}
            </h5>
          </slot>
          <button
            type="button"
            class="btn-close"
            @click="onClose"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="onClose"
          >
            Close
          </button>
          <slot
            name="buttons"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Modal } from 'bootstrap'
import { onMounted, onUnmounted, ref, watch } from 'vue'
interface Props {
  modelValue: boolean,
  title?: string
}
const props = defineProps<Props>()
const emit = defineEmits<{(e: 'update:modelValue', value: boolean): void}>()
const modalDOM = ref<HTMLDivElement>()
let modalBS: Modal

onMounted(() => { modalBS = new Modal(modalDOM.value!) })

onUnmounted(() => { modalBS?.dispose() })

const onClose = () => { emit('update:modelValue', false) }

watch(() => props.modelValue, (newVal) => { newVal ? modalBS.show() : modalBS.hide() })

</script>
