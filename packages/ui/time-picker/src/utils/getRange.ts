export const getRange = (min: number, max: number) => {
  const result = []

  if (min > max) {
    return []
  }

  if (min < 0 || max < 0) {
    return []
  }

  for (let counter = min; counter <= max; counter++) {
    result.push(counter)
  }

  return result
}
