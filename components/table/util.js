import _ from 'lodash'

// 将树状数据拍平
export const flatTreeData = (data, flattedData = []) => {
  data.forEach((d) => {
    flattedData.push(d)
    if (d.children) {
      flatTreeData(d.children, flattedData)
    }
  })
  return flattedData
}

// 给树状数据设置层级
export const setDepth = (data, parentDepth = 0, depthArray = []) => {
  data.forEach((d) => {
    d.depth = parentDepth + 1
    const children = d.children
    if (children && children.length > 0) {
      setDepth(children, d.depth, depthArray)
    } else {
      d.isLast = true
      depthArray.push(d.depth)
    }
  })
}

// 获取叶子节点后代
export const getLeafChildren = (item, children = []) => {
  if (item.children && item.children.length > 0) {
    item.children.forEach((child) => {
      if (child.isLast) {
        children.push(child)
      } else {
        getLeafChildren(child, children)
      }
    })
  }
}
// 将树形数据按照层级分组
export const groupDataByDepth = (data, depth = 1) => {
  const flattedData = flatTreeData(data)
  const result = Array(depth)
    .fill(undefined)
    .map((item) => {
      return []
    })

  result.forEach((group, index) => {
    flattedData.forEach((d) => {
      if (d.depth === index + 1) {
        group.push(d)
      }
    })
  })
  return result
}

// 根据固定列获取固定数据
export const getFixedDataByFixedColumn = (fixedColumns, data) => {
  const dataKeys = fixedColumns.map((item) => item.dataKey).concat('key')
  const result = data.map((d) => {
    const obj = {}
    dataKeys.forEach((dataKey) => {
      obj[dataKey] = d[dataKey]
    })
    return obj
  })
  return result
}

export const getStyle = (obj, attr) => {
  if (obj.currentStyle) {
    return obj.currentStyle[attr]
  } else {
    return window.getComputedStyle(obj, null)[attr]
  }
}

let cached
export function getScrollBarSize(fresh) {
  if (typeof document === 'undefined') {
    return 0
  }

  if (fresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthScroll
  }
  return cached
}

// 判断是否为字符串数字
export const checkIsNumberStr = (str) => {
  const reg = /^\d+(\.\d+)?$/
  const num = parseInt(str)
  return !isNaN(num) && reg.test(str)
}

// 检查是否需要展示Total或average
export const checkNeedTotalOrEvg = (_data, item, calcKey) => {
  if (item[calcKey]) {
    // 当每一项都为数字类型字符串时，才进行求和计算
    const isDataKeyValueAllNumber = _data.every((dataItem) => checkIsNumberStr(dataItem[item.dataKey]))
    return isDataKeyValueAllNumber
  }
  return false
}

// 获取总和或取平均值
export const getTotalOrEvgRowData = (_data, c, isAvg) => {
  const dataPointCountList = _data.map((dataItem) => {
    const strNum = dataItem[c.dataKey] + ''
    const afterPonterStr = strNum.split('.')[1]
    return afterPonterStr ? afterPonterStr.length : 0
  })
  const maxPointCount = dataPointCountList && dataPointCountList.length ? Math.max(...dataPointCountList) : 0
  const columnSumData = _.sumBy(_data, (d) => +d[c.dataKey])
  if (isAvg) {
    const avgData = columnSumData / _data.length
    return maxPointCount > 0 ? avgData.toFixed(maxPointCount) : avgData
  } else {
    return maxPointCount > 0 ? columnSumData.toFixed(maxPointCount) : columnSumData
  }
}
