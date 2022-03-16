<template>
  <div>
    <div class="input-group mb-3">
      <div class="form-floating flex-grow-1">
        <select
          class="form-select"
          id="drug-name"
          v-model="value"
        >
          <option
            v-for="d in drugNames"
            :key="d"
            :value="d"
          >
            {{ d }}
          </option>
        </select>
        <label
          for="drug-name"
        >Drug</label>
      </div><!--end:form-floating-->
      <button
        class="btn btn-outline-secondary"
        type="button"
        @click="showAddDrug"
      >
        +
      </button>
    </div><!--end:input-group-->
    <BModal
      id="exampleModal"
      v-model="isAddingDrug"
      size="xl"
      title="New Drug"
    >
      <form class="row">
        <div class="col">
          <div class="input-group mb-3">
            <div class="form-floating flex-grow-1">
              <input
                class="form-control"
                id="new-drug-name"
                v-model="newDrugName"
              >
              <label
                for="new-drug-name"
              >New Drug Name</label>
            </div><!--end:form-floating-->
            <button
              class="btn btn-primary"
              type="button"
              @click="addNewDrug"
            >
              +
            </button>
          </div><!--end:input-group-->
        </div>
      </form>
    </BModal>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import BModal from './BModal.vue'
import { useModelWrapper } from './useModelWrapper'
interface Props {
  modelValue: string,
}
const props = defineProps<Props>()
const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>()

const drugNames = reactive(['Adrenaline', 'Levetiracetam'])
const isAddingDrug = ref(false)
const newDrugName = ref('')
const value = useModelWrapper(props, emit)

const showAddDrug = () => { isAddingDrug.value = true }

const addNewDrug = () => {
  drugNames.push(newDrugName.value)
  newDrugName.value = ''
}

</script>
