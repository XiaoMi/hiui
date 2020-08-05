import _ from 'lodash'

// 需要做一个filed的规则解析
const tranformListValues = (field, listNestValues, value, listname) => {
  const key = field.split('#')[1]
  const keyName = field.split('#')[0]
  if (listNestValues[listname][keyName]) {
    listNestValues[listname][keyName] = _.merge(
      listNestValues[listname][keyName],
      {
        [key]: value
      }
    )
  } else {
    listNestValues[listname][keyName] = { [key]: value }
  }
}
// 转换输出的值
export const transformValues = (allvalue, fields) => {
  let tranformValues = {}
  let listNestValues = {}
  // 根据sort进行数据排列
  const sortfields = _.sortBy(fields, ['sort'])
  sortfields.forEach(filedItem => {
    const { field, propsField, _type, listname } = filedItem
    if (_type === 'list') {
      if (propsField !== field) {
        listNestValues[listname] = listNestValues[listname] || {}
        tranformListValues(field, listNestValues, allvalue[field], listname)
        Object.keys(listNestValues).forEach(key => {
          let arr = []
          Object.keys(listNestValues[key]).forEach(item => {
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
        }, allvalue[field])
        tranformValues = _.merge(tranformValues, chainKeys)
      } else {
        tranformValues = _.merge(tranformValues, { [field]: allvalue[field] })
      }
    }
  })
  return tranformValues
}
