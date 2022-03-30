<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">
          Drug
          <button
            class="ms-1 pe-4 pt-3 btn btn-primary"
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
          :key="i.uuid || (i.drugName + i.department + i.indication)"
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
              @click="checkRemoveIndication(i)"
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
  <form
    @submit.prevent="submitDrug"
  >
    <BModal
      v-model="displayNewDrugForm"
      title="Create Drug Dosing"
    >
      <template #default>
        <div v-if="form">
          <div class="mb-3">
            <BInput
              v-model="capitalisedDrug"
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
  <BModal
    v-model="displaySureDelete"
    title="Are You Sure?"
  >
    <template #default>
      Do you really want to delete
      {{ form?.drugName }} for {{ form?.indication }}
      used by {{ form?.department }}?
    </template>
    <template #buttons>
      <button
        class="ms-2 btn btn-warning"
        @click="removeIndication()"
        type="button"
      >
        Yes delete!
      </button>
    </template>
  </BModal>
</template>
<script setup lang="ts">
import { BolusDrug, BolusDrugDb } from '@/services/BolusDb'
import BAutocomplete from '@/components/BAutocomplete.vue'
import BModal from '@/components/BModal.vue'
import BInput from '@/components/BInput.vue'
import BSelect from '@/components/BSelect.vue'
import { computed, ref, triggerRef } from 'vue'
import { NewBolusDrug } from '@/services/NewBolusDrug'
import router from '@/router'
import { useAsyncState } from '@vueuse/core'
import { orderedLookup } from '@/services/orderedLookup'

const { state: bolusDrugs, isLoading: drugsLoading } = useAsyncState(async () =>
  orderedLookup(await BolusDrugDb.instance.bolusDrugs.toArray(), b => b.drugName), { '': [] })
const { state: dpts, isLoading: dptsLoading } = useAsyncState(async () =>
  (await BolusDrugDb.instance.departments.toArray()).map(d => ({ value: d.name, text: d.name }))
, [])

const isLoading = computed(() => dptsLoading.value || drugsLoading.value)

const indications = ['Cardiac Arrest', 'Intubation', 'Shock', 'Asthma', 'Epilepsy', 'Arrhythmia', 'Meningo-encephalitis', 'Seizures', 'Sedation']

const displayNewDrugForm = ref(false)
const displaySureDelete = ref(false)

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
  displayNewDrugForm.value = true
}

const capitalisedDrug = computed({
  get: () => form.value?.drugName || '',
  set: (value: string) => {
    if (form.value) {
      form.value.drugName = value
        ? value[0].toUpperCase() + value.substring(1).toLowerCase()
        : value
    }
  }
})

const editDrug = (bd: BolusDrug) => {
  form.value = bd
  displayNewDrugForm.value = true
}

const checkRemoveIndication = (bd: BolusDrug) => {
  form.value = bd
  displaySureDelete.value = true
}

const removeIndication = async () => {
  if (!form.value) throw new Error('Shouldn\'t be able to delete without a form value')
  if (form.value.uuid) {
    await BolusDrugDb.instance.bolusDrugs.delete(form.value.uuid)
  }
  const container = bolusDrugs.value[form.value.drugName]
  if (container.length === 1) {
    delete bolusDrugs.value[form.value.drugName]
  } else {
    bolusDrugs.value[form.value.drugName] = container.filter(c => !(c.uuid === form.value!.uuid && c.department === form.value!.department && c.indication === form.value!.indication))
  }
  triggerRef(bolusDrugs)
  displaySureDelete.value = false
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
