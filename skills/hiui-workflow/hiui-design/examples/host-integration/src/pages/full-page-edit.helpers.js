export function resolveNextProductSequence(rows) {
  let maxSequence = 0

  for (const row of rows || []) {
    const id = typeof row?.id === 'string' ? row.id : ''
    const matched = /(\d+)$/.exec(id)
    if (!matched) continue

    const sequence = Number(matched[1])
    if (Number.isFinite(sequence) && sequence > maxSequence) {
      maxSequence = sequence
    }
  }

  return maxSequence + 1
}
