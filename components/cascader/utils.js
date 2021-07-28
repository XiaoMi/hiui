import _ from 'lodash'

export const getLabelKey = (fieldNames = {}) => {
  return fieldNames.label || 'content'
}

export const getValueKey = (fieldNames = {}) => {
  return fieldNames.value || 'id'
}

export const getChildrenKey = (fieldNames = {}) => {
  return fieldNames.children || 'children'
}
export const parseData = (data, fieldNames) => {
  const _data = _.cloneDeep(data)
  const setDataItemPath = (data = [], parent) => {
    data.forEach((item, index) => {
      item._path = parent ? parent._path + '-' + index : index
      if (item[getChildrenKey(fieldNames)]) {
        setDataItemPath(item[getChildrenKey()], item)
      }
    })
  }
  setDataItemPath(_data)
  return _.cloneDeep(_data)
}

export const getCascaderLabel = (values, fieldNames, displayRender, data, dataList) => {
  if (displayRender) {
    return displayRender(values)
  }

  if (!values || values.length === 0) {
    return ''
  } else {
    const labels = []
    let index = 0
    let _options = dataList || data
    const labelKey = getLabelKey(fieldNames)
    const valueKey = getValueKey(fieldNames)
    const childrenKey = getChildrenKey(fieldNames)

    while (_options && _options.length > 0 && labels.length <= values.length) {
      const value = values[index]
      index++
      _options.every((option) => {
        if (option[valueKey] === value) {
          labels.push(option[labelKey])
          _options = option[childrenKey]
          return false
        } else {
          _options = []
          return true
        }
      })
    }
    return labels.join(' / ')
  }
}

export const getSearchId = (filterOptions, keyword, filterOption, fieldNames) => {
  const filterFunc = filterOption
  const levelItems = []
  const levelItemsObj = {}

  const labelKey = getLabelKey(fieldNames)
  const valueKey = getValueKey(fieldNames)
  if (filterOptions.length === 0) {
    return []
  } else {
    filterOptions.map((options) => {
      const jointOption = {
        jointOption: true,
        [labelKey]: [],
        [valueKey]: []
      }
      options.map((option, index) => {
        const levelItem = {
          [valueKey]: ''
        }

        levelItem[valueKey] = jointOption[valueKey].concat(option[valueKey])

        jointOption[valueKey].push(option[valueKey])
        option.disabled && (jointOption.disabled = option.disabled)
        option.disabled && (levelItem.disabled = option.disabled)

        if (!levelItemsObj[levelItem[valueKey]]) {
          levelItemsObj[levelItem[valueKey]] = levelItem[valueKey]
          if (filterFunc) {
            if (
              filterFunc(keyword, option) &&
              (levelItem[valueKey].toString().includes(keyword) || option[labelKey].toString().includes(keyword))
            ) {
              levelItems.push(levelItem)
            }
          } else {
            if (option[labelKey].toString().includes(keyword)) {
              levelItems.push(levelItem)
            }
          }
        }
      })
    })
  }
  if (levelItems.length === 0) {
    return []
  }

  const ids = levelItems.map((item) => item.id)
  let targetId = ids[0].join(',')
  for (let i = 1; i < ids.length; i++) {
    if (ids[i].join(',').includes(targetId)) {
      targetId = ids[i].join(',')
    }
  }

  return targetId.split(',').map((item) => Number(item))
}

export const getfilterOptions = (data, initMatchOptions, fieldNames, keyword) => {
  const filterOptions = []
  const labelKey = getLabelKey(fieldNames)
  const valueKey = getValueKey(fieldNames)
  const childrenKey = getChildrenKey(fieldNames)
  const _checkOptions = (options, match) => {
    options.map((option) => {
      const label = option[labelKey]
      const value = option[valueKey]
      const children = option[childrenKey]
      if (label.toString().includes(keyword) || value.toString().includes(keyword)) {
        match.matchCount++
      }

      match.options.push({
        [labelKey]: label,
        [valueKey]: value,
        disabled: option.disabled
      })

      if (children && children.length > 0) {
        _checkOptions(children, match)
      } else {
        if (match.matchCount > 0) {
          filterOptions.push(match.options.slice())
        }
      }
      if (label.toString().includes(keyword) || value.toString().includes(keyword)) {
        match.matchCount--
      }

      match.options.pop()
    })
  }
  _checkOptions(data, initMatchOptions)
  return filterOptions
}
