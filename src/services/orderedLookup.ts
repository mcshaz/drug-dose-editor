export function orderedLookup<T> (objects: T[], getString: (arg: T) => string) {
  const m = new Map<string, T[]>()
  for (const o of objects) {
    const k = getString(o)
    const a = m.get(k)
    if (a) {
      a.push(o)
    } else {
      m.set(k, [o])
    }
  }
  return Object.fromEntries([...m.entries()].sort())
}
