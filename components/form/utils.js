import _ from 'lodash'

// 需要做一个filed的规则解析
const tranformListValues = (field, listNestValues, value, listname) => {
  const fieldSplit = field.split('#')
  const key = fieldSplit[1]
  const keyName = fieldSplit[0]
  if (listNestValues[listname][keyName]) {
    listNestValues[listname][keyName] = _.merge(listNestValues[listname][keyName], {
      [key]: value
    })
  } else {
    listNestValues[listname][keyName] = { [key]: value }
  }
}
// 转换输出的值
export const transformValues = (allvalue, fields) => {
  let tranformValues = {}
  const listNestValues = {}
  // 根据sort进行数据排列
  const sortfields = _.sortBy(fields, ['sort'])
  sortfields.forEach((filedItem) => {
    const { realField, propsField, _type, listname, field } = filedItem
    if (_type === 'list') {
      if (propsField !== field) {
        listNestValues[listname] = listNestValues[listname] || {}
        tranformListValues(field, listNestValues, allvalue[field], listname)
        Object.keys(listNestValues).forEach((key) => {
          const arr = []
          Object.keys(listNestValues[key]).forEach((item) => {
            arr.push(listNestValues[key][item])
          })
          tranformValues[key] = arr
        })
        return
      }
      if (tranformValues[listname]) {
        tranformValues[listname].push(allvalue[field])
      } else {
        tranformValues[listname] = [allvalue[field]]
      }
    } else {
      if (Array.isArray(propsField)) {
        const chainKeys = propsField.reduceRight((pre, next) => {
          return { [next]: pre }
        }, allvalue[realField])
        tranformValues = _.merge(tranformValues, chainKeys)
      } else {
        tranformValues = _.merge(tranformValues, { [realField]: allvalue[realField] })
      }
    }
  })
  return tranformValues
}
