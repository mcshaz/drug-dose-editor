import { computed, WritableComputedRef } from 'vue'

export function useModelWrapper<TProps extends Record<string, unknown> | { modelValue: unknown },
                                TKey extends keyof TProps & string = 'modelValue',
                                TEmit extends (event: `update:${TKey}`, value: TProps[TKey]) => void = (event: `update:${TKey}`, value: TProps[TKey]) => void > (
  props: TProps,
  emit: TEmit,
  name: TKey = 'modelValue' as TKey
) : WritableComputedRef<TProps[TKey]> {
  return computed<TProps[TKey]>({
    get: () => props[name],
    set: (value: TProps[TKey]) => emit(`update:${name}` as `update:${TKey}`, value)
  })
}
