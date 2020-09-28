import React, { forwardRef, Fragment } from 'react'
import Dropdown from './Dropdown'
import './style/index'

export const prefixCls = 'hi-dropdown'

const CompatedDropdown = forwardRef(({ prefix, suffix, data, list, ...props }, ref) => {
  let originData = []
  originData = list && !data ? [...list] : [...data]
  originData = convertData(originData, prefix, suffix)
  return <Dropdown ref={ref} data={originData} {...props} />
})

export default CompatedDropdown

function convertData(data, prefix = '', suffix = '') {
  const recur = (data) => {
    return data.map((item) => {
      if (item.children) {
        item.children = recur(item.children)
      }
      if (item.title !== '-') {
        if (item.prefix) {
          item.title = (
            <Fragment>
              {item.prefix} {item.title}
            </Fragment>
          )
        } else {
          item.title = (
            <Fragment>
              {prefix} {item.title}
            </Fragment>
          )
        }
        if (item.suffix && !item.children) {
          item.title = (
            <Fragment>
              {item.title} {item.suffix}
            </Fragment>
          )
        } else {
          item.title = (
            <Fragment>
              {item.title} {suffix}
            </Fragment>
          )
        }
      }
      if (item.url && !item.href) {
        item.href = item.url
      }
      if (item.value && !item.id) {
        item.id = item.value
      }
      return item
    })
  }
  return recur(data)
}
