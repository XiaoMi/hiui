/**
   * 提取非函数属性
   * @param {object} oldProps 原始props
   */
export const getAttrs = (oldProps) => {
  const noNeed = ['value', 'className', 'class', 'id', 'style', 'size', 'disabled']
  const attrs = {}
  const events = {}

  for (let i in oldProps) {
    if (!(oldProps[i] instanceof Function)) {
      if (noNeed.indexOf(i) === -1) {
        attrs[i] = oldProps[i]
      }
    } else {
      events[i] = oldProps[i]
    }
  }

  return { attrs, events }
}

/**
 * 格式化身份证
 */
export const formatId = (val) => {
  val = val.replace(/[^a-zA-Z0-9]/g, '')
  const len = val.length

  if (val === '' || len < 7) {
    return val
  }

  if (len < 11) {
    return val.slice(0, 6) + ' ' + val.slice(6, 10)
  } else if (len < 15) {
    return val.slice(0, 6) + ' ' + val.slice(6, 10) + ' ' + val.slice(10, 14)
  } else {
    return val.slice(0, 6) + ' ' + val.slice(6, 10) + ' ' + val.slice(10, 14) + ' ' + val.slice(14, 18)
  }
}

/**
 * 格式化手机号
 */
export const formatTel = (val) => {
  val = val.replace(/\D/g, '')
  const len = val.length

  if (val === '' || len < 4) {
    return val
  }

  if (len < 8) {
    return val.slice(0, 3) + ' ' + val.slice(3, 7)
  } else {
    return val.slice(0, 3) + ' ' + val.slice(3, 7) + ' ' + val.slice(7, 11)
  }
}

/**
 * 格式化银行卡号
 */
export const formatCard = (val) => {
  val = val.replace(/\D/g, '')
  const len = val.length

  if (val === '' || val.length < 5) {
    return val
  }

  if (len < 9) {
    return val.slice(0, 4) + ' ' + val.slice(4, 8)
  } else if (len < 13) {
    return val.slice(0, 4) + ' ' + val.slice(4, 8) + ' ' + val.slice(8, 12)
  } else if (len < 17) {
    return val.slice(0, 4) + ' ' + val.slice(4, 8) + ' ' + val.slice(8, 12) + ' ' + val.slice(12, 16)
  } else {
    return val.slice(0, 4) + ' ' + val.slice(4, 8) + ' ' + val.slice(8, 12) + ' ' + val.slice(12, 16) + ' ' + val.slice(16, 19)
  }
}

/**
 * 输入规则
 * @param {string} val  需要处理的值
 * @param {string} type 输入框类型
 */
export const format = (val, type) => {
  switch (type) {
    case 'id':
      return formatId(val)
    case 'tel':
      return formatTel(val)
    case 'card':
      return formatCard(val)
    case 'email':
      return val.replace(/\W/g, '')
    case 'amount':
      val = val.replace(/[^\d|.|,]/g, '').replace(/(\.\d*?)(\.|,).*/, (_, $1) => {
        return $1
      })
      return val
    default:
      return val
  }
}

/**
 * 金额自动生成小数
 * @param {string} val  需要处理的值
 */
export const formatAmount = (val) => {
  return val.indexOf('.') > -1 ? val : val + '.00'
}

/**
 * 净化数据
 */
export const formatValue = (val, type) => {
  const numberType = ['id', 'tel', 'amount', 'card']

  if (numberType.indexOf(type) > -1) {
    let tmp = val.replace(/[^\d|.]/g, '')
    switch (type) {
      case 'id': return tmp.slice(0, 18)
      case 'tel': return tmp.slice(0, 11)
      case 'card': return tmp.slice(0, 19)
      default: return tmp
    }
  } else {
    return val
  }
}

/**
 * 过滤属性
 */
export const filterObjProps = (obj, propsNeedFilter) => {
  return Object.keys(obj).filter(key => !propsNeedFilter.includes(key)).reduce((filteredObj, key) => {
    filteredObj[key] = obj[key]
    return filteredObj
  }, {})
}
