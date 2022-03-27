<template>
  <div class="container">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">
            Drug
            <button
              class="ms-2 pe-3 btn btn-primary"
              @click="createDrug"
              title="Create drug"
            >
              <font-awesome-layers class="fa-lg">
                <font-awesome-icon icon="prescription" />
                <font-awesome-icon
                  icon="plus"
                  transform="up-7 right-12"
                />
              </font-awesome-layers>
            </button>
          </th>
          <th scope="col">
            Indication
          </th>
          <th scope="col">
            Department
          </th>
          <td />
        </tr>
      </thead>
      <tbody>
        <template v-if="isLoading">
          <tr>
            <td colspan="4">
              Loading...
            </td>
          </tr>
        </template>
        <template
          v-else
          v-for="d in bolusDrugs"
        >
          <tr
            v-for="(i, iindx) of d"
            :key="i.drugName + i.department + i.indication"
          >
            <th
              v-if="iindx===0"
              scope="row"
              :rowspan="d.length"
            >
              {{ i.drugName }}
            </th>
            <td>
              {{ i.indication }}
            </td>
            <td>
              {{ i.department }}
            </td>
            <td>
              <button
                class="btn btn-secondary"
                @click="editDrug(i)"
                title="Edit name"
              >
                <font-awesome-icon icon="pen-to-square" />
              </button>
              <button
                class="ms-2 btn btn-warning"
                @click="removeIndication(i)"
                title="Delete"
              >
                <font-awesome-icon icon="trash-can" />
              </button>
              <button
                class="ms-2 btn btn-info"
                @click="editRows(i)"
                title="Go to calculations"
              >
                <font-awesome-icon icon="calculator" />
                <font-awesome-icon
                  icon="bars"
                  class="ms-1"
                />
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
  <form
    @submit.prevent="submitDrug"
  >
    <BModal
      v-model="displayModal"
    >
      <template #default>
        <div v-if="form">
          <div class="mb-3">
            <BInput
              v-model="form.drugName"
              label="Drug Name"
            />
          </div>
          <div class="mb-3">
            <BAutocomplete
              v-model="form.indication"
              :options="indications"
              label="Indication"
            />
          </div>
          <div class="mb-3">
            <BSelect
              v-model="form.department"
              label="Department"
              :options="dpts"
            />
          </div>
        </div>
      </template>
      <template #buttons>
        <button
          class="ms-2 btn btn-success"
          type="submit"
        >
          Save
          <font-awesome-icon icon="floppy-disk" />
        </button>
      </template>
    </BModal>
  </form>
</template>
<script setup lang="ts">
import { BolusDrug, BolusDrugDb } from '@/services/BolusDb'
import BAutocomplete from '@/components/BAutocomplete.vue'
import BModal from '@/components/BModal.vue'
import BInput from '@/components/BInput.vue'
import BSelect from '@/components/BSelect.vue'
import { computed, ref } from 'vue'
import { NewBolusDrug } from '@/services/NewBolusDrug'
import router from '@/router'
import { useAsyncState } from '@vueuse/core'

const { state: bolusDrugs, isLoading: drugsLoading } = useAsyncState(async () =>
  (await BolusDrugDb.instance.bolusDrugs.toArray()).reduce((accum, bd) => {
    if (accum[bd.drugName]) {
      accum[bd.drugName].push(bd)
    } else {
      accum[bd.drugName] = [bd]
    }
    return accum
  }, {} as {[indx: string]: BolusDrug[]}), { '': [] })
const { state: dpts, isLoading: dptsLoading } = useAsyncState(async () =>
  (await BolusDrugDb.instance.departments.toArray()).map(d => ({ value: d.name, text: d.name }))
, [])

const isLoading = computed(() => dptsLoading.value || drugsLoading.value)

const indications = ['Cardiac Arrest', 'Intubation', 'Shock', 'Asthma', 'Epilepsy', 'Arrhythmia', 'Meningo-encephalitis', 'Seizures', 'Sedation']

const displayModal = ref(false)

const form = ref<{
  uuid?: string;
  drugName: string;
  indication: string;
  department: string;}>()

const createDrug = () => {
  form.value = {
    drugName: '',
    indication: '',
    department: dpts.value[0].text
  }
  displayModal.value = true
}

const editDrug = (bd: BolusDrug) => {
  form.value = bd
  displayModal.value = true
}

const removeIndication = async (bd: BolusDrug) => {
  if (bd.uuid) {
    await BolusDrugDb.instance.bolusDrugs.delete(bd.uuid)
  }
}

const editRows = (bd: BolusDrug) => {
  router.push({ name: 'editBolusRows', params: { id: bd.uuid } })
}

const submitDrug = async () => {
  if (!form.value) throw new Error('Shouldn\'t be able to submit without form value')
  if (form.value.uuid) {
    await BolusDrugDb.instance.bolusDrugs.put(form.value as BolusDrug)
    editRows(form.value as BolusDrug)
  } else {
    const nd = new NewBolusDrug(form.value.drugName, form.value.department, form.value.indication)
    await BolusDrugDb.instance.bolusDrugs.put(nd)
    editRows(nd)
  }
}
</script>
