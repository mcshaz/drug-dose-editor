import uniqueId from 'lodash.uniqueid'
import { computed } from 'vue'

export function createUniqueId (props: {label: string}) {
  return computed(() => uniqueId(props.label.replaceAll(/\s+/g, '-')))
}
