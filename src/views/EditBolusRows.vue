<template>
  <div class="container">
    <div
      v-if="isLoading"
      class="alert alert-info"
    >
      Please wait - loading...
    </div>
    <div v-else-if="drugInfo">
      <div class="row">
        <h3 class="col">
          {{ drugInfo.drugName }}
          <small>
            for {{ drugInfo.indication }}
          </small>
          <small class="text-muted">
            (as used by {{ drugInfo.department }})
          </small>
        </h3>
      </div><!--end:row-->
      <div class="row">
        <div class="d-grid gap-2 col-4 mx-auto">
          <button
            class="btn btn-info mb-3"
            @click="showHelp=true"
          >
            <font-awesome-icon icon="circle-info" />
            Using this editor
          </button>
          <BModal
            v-model="showHelp"
            title="Using the editor"
            size="xl"
          >
            <EditorHelp />
          </BModal>
        </div><!--end:col-->
      </div><!--end:row-->
      <div
        class="row"
        v-for="(row, indx) of drugInfo.rows"
        :key="indx"
      >
        <hr>
        <div class="col-lg-12">
          <div class="form-floating flex-grow-1 mb-3">
            <input
              class="form-control"
              id="new-drugInfo-name"
              v-model.trim="row.logicalSelector"
            >
            <label for="new-drugInfo-name">Logical Selector</label>
          </div>
        <!--end:form-floating-->
        </div>
        <div class="col-lg-4">
          <BolusDrugEditor
            v-model="row.drugDetails"
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
        <div class="col-lg-6">
          <BolusDrugEditor
            v-model="row.administer"
            body-class="text-center"
            :formats="[
              'diluted-ml',
              'dilution',
              'neat',
              'neat-ml',
              'arrow-right',
            ]"
          />
        </div>
        <div class="col-lg-2">
          <BolusDrugEditor
            v-model="row.calculations"
            body-class="text-left"
            :formats="['dose-calc', 'final-dose']"
          />
        </div>
        <div class="col-lg-12">
          <button
            class="btn btn-secondary m-3"
            @click="clone(row)"
          >
            Clone
            <font-awesome-icon icon="clone" />
          </button>
          <button
            class="btn btn-warning"
            @click="del(indx)"
          >
            <font-awesome-icon icon="trash-can" />
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
    </div>
    <button
      @click="saveDrug"
      class="btn btn-primary py-3"
    >
      Save
      <font-awesome-icon icon="floppy-disk" />
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import SelectExampleWeight from '@/components/SelectExampleWeight.vue'
import BolusDrugEditor from '@/components/BolusDrugEditor.vue'
import BolusDrugWeightExample from '@/components/BolusDrugWeightExample.vue'
import BModal from '@/components/BModal.vue'
import EditorHelp from '@/components/EditorHelp.vue'
// import hash from 'object-hash'
import './../../public/bolus_drugs.css'
import { parseAnthro, replaceWithEnDash } from '@/services/parse-expression'
import { AdministerDetail, BolusDrugDb } from '@/services/BolusDb'
import router from '@/router'
import { useAsyncState } from '@vueuse/core'

const bolusDrugId = useRoute().params.id
const { isLoading, state } = useAsyncState(() => {
  if (!bolusDrugId) {
    router.push({ name: 'NotFound' })
    throw new Error('no drug Id provided in route')
  }
  const returnedDrug = BolusDrugDb.instance.bolusDrugs.get(bolusDrugId as string)
  if (!returnedDrug) {
    router.push({ name: 'NotFound' })
    throw new Error('drug with given id not found')
  }
  return returnedDrug
}, undefined)

const drugInfo = reactive(state)

const testWeights = reactive([
  { weightKg: 1.113 },
  { weightKg: 7.3 },
  { weightKg: 23 },
  { weightKg: 81 }
])

const showHelp = ref(false)

const examples = computed(() => {
  // put empty logicalSelector last
  if (!drugInfo.value) return []
  const sortedBySelector = drugInfo.value.rows
    .filter((r) => r.logicalSelector)
    .concat(drugInfo.value.rows.filter((r) => !r.logicalSelector))
  return testWeights.map((wt) =>
    sortedBySelector.find(
      s => !s.logicalSelector || parseAnthro(s.logicalSelector, wt)
    )!
  )
})

const clone = (item: AdministerDetail) => {
  drugInfo.value?.rows.push({ ...item })
  console.log(drugInfo)
}

const del = (index: number) => {
  drugInfo.value?.rows.splice(index, 1)
}

const saveDrug = () => {
  // localDb will not accept proxies. by working with the state we loose reactivity, but have the underlying object
  if (!state.value) throw new Error('Page should have redirected if drugInfo not found')
  const replaceHtml = (html: string) => {
    const t = document.createElement('template')
    t.innerHTML = html
    replaceWithEnDash(t.content)
    return t.innerHTML
  }
  state.value.rows.forEach(r => {
    r.administer = replaceHtml(r.administer)
    r.calculations = replaceHtml(r.calculations)
  })
  BolusDrugDb.instance.bolusDrugs.put(state.value)
  router.push({ name: 'home' })
}
</script>
