import classNames from 'classnames'

let name = 'hi'
export default function (...obj) {
  return 'hi-table--legacy ' + name + '-' + classNames(obj)
}
