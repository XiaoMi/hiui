import { TimePickerFormat } from '../@types'

export const disposeInputValue = (format: TimePickerFormat, original: string) => {
  const inputMaxLength = format.length
  // 初步处理（去除前后空格，兼容中文：，去除无效字符，不允许超过长度）
  const rough = original
    .trim()
    .replace(/[\uff1a]/g, ':')
    .replace(/[^0-9:]/g, '')
    .slice(0, inputMaxLength)

  // 兼容直接在为空情况下输入 : 的情况
  if (rough === ':') {
    return ''
  }

  if (/:{2}$/.test(rough)) {
    return rough.slice(0, rough.length - 1)
  }

  // 已经输入两个数字了，现在新输入的一个字符不是 : 号
  if (/[0-9]{2}[^:]$/.test(rough)) {
    // 字符串已经到达最长长度，代表，此时，字符串是一个错乱的，直接忽略新输入的字符
    if (rough.length === inputMaxLength) {
      return rough.slice(0, rough.length - 1)
    }
    // 字符串还有添加空间，则自动添加:在新字符前方
    else {
      return rough.slice(0, rough.length - 1) + ':' + rough.slice(rough.length - 1)
    }
  }

  // 在某个部分只输入了一个数字，然后输入 : 想要结束这个部分
  if (/:[0-9]:$/.test(rough) || /^[0-9]:$/.test(rough)) {
    // 已经达到最大输入了，则此时输入的 : 是无效的
    // 自动转换，去除：，添加 0 在数字前
    if (rough.length === inputMaxLength) {
      return (
        rough.slice(0, rough.length - 2) + '0' + rough.slice(rough.length - 2, rough.length - 1)
      )
    }
    // 输入没有达到最大，则，此时输入 : 是有效的
    // 自动补充此章节，添加 0
    else {
      return rough.slice(0, rough.length - 2) + '0' + rough.slice(rough.length - 2, rough.length)
    }
  }

  return rough
}
