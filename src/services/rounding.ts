export function toDecimalPlaces (value: number, decimals = 1): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier + Number.EPSILON) / multiplier
}

export function toNearest (value: number, nearest: number): number {
  const inverse = 1 / nearest // it would make sense to use (Math.round(value/nearest) * value) however, base 2 to base 10 conversion will result in occassional  x.x000000000000002
  return Math.round(value * inverse + Number.EPSILON) / inverse
}

export function toPrecision (value: number, precision: number) {
  const figures = Math.floor(Math.log10(value)) - precision + 1
  return toDecimalPlaces(value, -figures)
}

export function toSyringeVolume (ml: number) {
  if (ml <= 1) {
    return toDecimalPlaces(ml, 2)
  }
  if (ml <= 3) {
    return toNearest(ml, 0.05)
  }
  if (ml <= 10) {
    return toNearest(ml, 0.1) // actually nearest 0.2ml, I am not sure if staff will accept
  }
  return Math.round(ml)
}

/*
export function weightRounding (wtKg: number) {
  if (wtKg < 20) {
    return fixed(wtKg, 1)
  }
  return Math.round(wtKg)
}
*/
