<template>
  <div
    class="modal"
    tabindex="-1"
    ref="modalDOM"
  >
    <div
      class="modal-dialog"
      :class="sizeClass"
    >
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
            data-bs-dismiss="modal"
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
            data-bs-dismiss="modal"
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
interface Props {
  modelValue: boolean,
  title?: string
  size?: 'sm' | 'lg' | 'xl'
}
const props = defineProps<Props>()
const emit = defineEmits<{(e: 'update:modelValue', value: boolean): void}>()
const modalDOM = ref<HTMLDivElement>()
const requestClose = () => emit('update:modelValue', false)
let modalBS: Modal

onMounted(() => {
  if (modalDOM.value) {
    modalBS = new Modal(modalDOM.value)
    modalDOM.value.addEventListener('hide.bs.modal', requestClose)
  }
})

onUnmounted(() => {
  modalBS?.dispose()
  modalDOM.value?.removeEventListener('hide.bs.modal', requestClose)
})

watch(() => props.modelValue, (newVal) => { newVal ? modalBS.show() : modalBS.hide() })

const sizeClass = computed(() => props.size ? 'modal-' + props.size : undefined)

</script>
