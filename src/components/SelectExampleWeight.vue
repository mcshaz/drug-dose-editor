<template>
  <div class="row">
    <div class="col-lg-4">
      <div class="form-floating flex-grow-1 mb-3">
        <select
          class="form-select"
          :id="weightGroupId"
          v-model="selectedWeightRange"
        >
          <option
            v-for="(p, v) in weightOpts"
            :key="v"
            :value="p"
          >
            {{ v }} ({{ p.min }} – {{ p.max }} kg)
          </option>
        </select>
        <label
          :for="weightGroupId"
        >Age group</label>
      </div><!--end:form-floating-->
    </div>
    <div class="col-lg-8">
      <BRangeSlider
        v-model="value"
        label="Weight"
        :min="selectedWeightRange.min"
        :max="selectedWeightRange.max"
        :step="selectedWeightRange.step"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useModelWrapper } from './useModelWrapper'
import uniqueId from 'lodash.uniqueid'
import BRangeSlider from './BRangeSlider.vue'

interface Props {
  modelValue: number;
}

const weightGroupId = uniqueId('weight-group')
const props = defineProps<Props>()
const emit = defineEmits<{(e: 'update:modelValue', value: number): void}>()
const value = useModelWrapper(props, emit)

interface WeightRange {min: number; max: number; step: number }
const weightOpts: Record<string, WeightRange> = {
  neonate: { min: 0.4, max: 5, step: 0.01 },
  infant: { min: 5, max: 12, step: 0.1 },
  child: { min: 12, max: 30, step: 0.1 },
  adult: { min: 30, max: 150, step: 1 }
}

const selectedWeightRange = ref(Object.values(weightOpts).find(v => props.modelValue < v.max) ?? weightOpts.adult)

</script>
