export function getIsTriggerEqualHover ({ trigger }) {
  return trigger === 'hover'
}

export function getIsTriggerEqualContextmenu ({ trigger }) {
  return trigger === 'contextmenu'
}

export function getIsTriggerEqualClick ({ trigger }) {
  return trigger === 'click'
}

export function trimTriggers ({ trigger }) {
  if (Array.isArray(trigger)) {
    const triggers = Array.from(new Set(trigger))
    return triggers.map(trigger => ({ trigger }))
  }
  return [{ trigger }]
}
