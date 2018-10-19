import warning from 'warning'

const warned = {}
export function warningOnce (condition, format, args) {
  if (!warned[format]) {
    warning(condition, format, args)
    warned[format] = !condition
  }
}
