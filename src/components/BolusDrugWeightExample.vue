<template>
  <div
    class="row gx-0 gy-5"
  >
    <div class="col-lg-5">
      <div v-html="drugDetails" />
    </div>
    <div class="col-lg-5">
      <div v-html="parsedAdmin" />
    </div>
    <div class="col-lg-2">
      <div v-html="parsedCalc" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { replaceCalcs } from '@/services/parse-expression'
import type { IAnthro } from '@/services/parse-expression'
import './../../public/bolus_drugs.css'

interface Props {
  drugDetails: string,
  administer: string;
  calculations: string;
  weight: number;
}
const props = defineProps<Props>()

const replaceHtml = (html: string, anthro: IAnthro) => {
  const t = document.createElement('template')
  t.innerHTML = html
  replaceCalcs(t.content, anthro)
  return t.innerHTML
}

const anthro = computed(() => ({ weightKg: props.weight }))

const parsedAdmin = computed(() => replaceHtml(props.administer, anthro.value))
const parsedCalc = computed(() => replaceHtml(props.calculations, anthro.value))
</script>
