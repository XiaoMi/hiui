import { F } from '@hi-ui/schema-core'

const MANAGED_FILTER_INPUT_APPEARANCE = 'filled'
const MANAGED_FILTER_PICKER_APPEARANCE = 'contained'

export function createManagedQueryTextField({ field, label, placeholder, ...props }) {
  const creator = F(label, field).Text({
    appearance: MANAGED_FILTER_INPUT_APPEARANCE,
    ...props,
  })

  if (placeholder) {
    creator.Placeholder(placeholder)
  }

  return creator.val
}

export function createManagedQuerySelectField({ field, label, data = [], overlay, ...props }) {
  return F(label, field)
    .Select({
      appearance: MANAGED_FILTER_PICKER_APPEARANCE,
      data,
      overlay,
      ...props,
    })
    .val
}

export function createManagedQueryDateRangeField({
  field,
  label,
  placeholder,
  overlay,
  ...props
}) {
  return F(label, field)
    .Date({
      type: 'daterange',
      appearance: MANAGED_FILTER_PICKER_APPEARANCE,
      placeholder,
      overlay,
      ...props,
    })
    .val
}
