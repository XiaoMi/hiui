import classNames from 'classnames'

let name = 'hi'
export default function (...obj) {
  return name + '-' + classNames(obj)
}
