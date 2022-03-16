<template>
  <section class="container">
    <div class="row">
      <div class="col">
        <BolusDrugSelector v-model="drug" />
      </div>
      <div class="col">
        <div class="form-floating flex-grow-1 mb-3">
          <input
            class="form-control"
            id="drug-indication"
            v-model="drugIndication"
          >
          <label for="drug-indication">Indication</label>
        </div>
        <!--end:form-floating-->
      </div>
    </div>
    <div
      class="row gx-0"
      v-for="(chart, indx) of charts"
      :key="chart.id"
    >
      <hr>
      <div class="col-lg-12">
        <div class="form-floating flex-grow-1 mb-3">
          <input
            class="form-control"
            id="new-drug-name"
            v-model.trim="chart.logicalSelector"
          >
          <label for="new-drug-name">Logical Selector</label>
        </div>
        <!--end:form-floating-->
      </div>
      <div class="col-lg-5">
        <BolusDrugEditor
          v-model="chart.drugDetails"
          body-class="text-right"
          :formats="[
            'drug-name',
            'concentration',
            'route',
            'route-emphasis',
            'drug-note',
            'diluent-fluid',
          ]"
        />
      </div>
      <div class="col-lg-5">
        <BolusDrugEditor
          v-model="chart.administer"
          body-class="text-center"
          :formats="[
            'diluted-ml',
            'dilution-method',
            'neat',
            'neat-ml',
            'arrow-right',
          ]"
        />
      </div>
      <div class="col-lg-2">
        <BolusDrugEditor
          v-model="chart.calculations"
          body-class="text-left"
          :formats="['dose-calculation', 'calculated-dose']"
        />
      </div>
      <div class="col-lg-12">
        <button
          class="btn btn-secondary m-3"
          @click="clone(chart)"
        >
          Clone
        </button>
        <button
          class="btn btn-warning"
          @click="del(indx)"
        >
          Delete
        </button>
      </div>
    </div>
    <div class="row">
      <h3 class="col-lg-12">
        Examples
      </h3>
      <div
        class="col-lg-12"
        v-for="(t, indx) in testWeights"
        :key="t.weightKg"
      >
        <hr>
        <SelectExampleWeight v-model="t.weightKg" />
        <BolusDrugWeightExample
          v-if="examples[indx]"
          :weight="t.weightKg"
          :drug-details="examples[indx]?.drugDetails"
          :administer="examples[indx]?.administer"
          :calculations="examples[indx]?.calculations"
        />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import SelectExampleWeight from './SelectExampleWeight.vue'
import BolusDrugEditor from './BolusDrugEditor.vue'
import BolusDrugSelector from './BolusDrugSelector.vue'
import BolusDrugWeightExample from './BolusDrugWeightExample.vue'
// import hash from 'object-hash'
import './../../public/bolus_drugs.css'
import drugDetailsInitialVal from './../assets/BolusDrugDetails.static.html'
import administerInitialVal from './../assets/BolusDrugAdminister.static.html'
import drugCalculationsInitialVal from './../assets/BolusDrugCalculations.static.html'
import { parseAnthro } from '@/services/parse-expression'

const drug = ref('')
const drugIndication = ref('')
const charts = reactive([
  {
    id: 0,
    logicalSelector: '',
    drugDetails: drugDetailsInitialVal,
    administer: administerInitialVal,
    calculations: drugCalculationsInitialVal
  }
])

const testWeights = reactive([
  { weightKg: 1.113 },
  { weightKg: 7.3 },
  { weightKg: 23 },
  { weightKg: 81 }
])

const examples = computed(() => {
  // put empty logicalSelector last
  const sortedBySelector = charts
    .filter((c) => c.logicalSelector)
    .concat(charts.filter((c) => !c.logicalSelector))
  return testWeights.map((wt) =>
    sortedBySelector.find(
      (s) => !s.logicalSelector || parseAnthro(s.logicalSelector, wt)
    )
  )
})

const clone = (item: typeof charts[number]) => {
  charts.push({ ...item, id: charts.length })
}

const del = (index: number) => {
  charts.splice(index, 1)
}
</script>
