/**
 * 格式化身份证
 */
export const formatId = (val: string) => {
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
    return (
      val.slice(0, 6) + ' ' + val.slice(6, 10) + ' ' + val.slice(10, 14) + ' ' + val.slice(14, 18)
    )
  }
}

export const pureId = (val: string) => {
  const tmp = val.replace(/[^\d|.]/g, '')
  return tmp.slice(0, 18)
}

/**
 * 格式化手机号
 */
export const formatTel = (val: string) => {
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

export const pureTel = (val: string) => {
  const tmp = val.replace(/[^\d|.]/g, '')
  return tmp.slice(0, 11)
}

/**
 * 格式化银行卡号
 */
export const formatCard = (val: string) => {
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
    return (
      val.slice(0, 4) + ' ' + val.slice(4, 8) + ' ' + val.slice(8, 12) + ' ' + val.slice(12, 16)
    )
  } else {
    return (
      val.slice(0, 4) +
      ' ' +
      val.slice(4, 8) +
      ' ' +
      val.slice(8, 12) +
      ' ' +
      val.slice(12, 16) +
      ' ' +
      val.slice(16, 19)
    )
  }
}

export const pureCard = (val: string) => {
  const tmp = val.replace(/[^\d|.]/g, '')
  return tmp.slice(0, 19)
}

/**
 * 金额自动生成小数
 * @param {string} val  需要处理的值
 */
export const formatAmount = (val: string) => {
  val = val.replace(/[^\d|.|,]/g, '').replace(/(\.\d*?)(\.|,).*/, (_, $1) => $1)
  return val.indexOf('.') > -1 ? val : val + '.00'
}

export const pureAmount = (val: string) => {
  return val
}

export const formatEmail = (val: string) => {
  return val.replace(/\W/g, '')
}

export const pureEmail = (val: string) => {
  return val
}
