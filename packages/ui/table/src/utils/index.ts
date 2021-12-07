export const deleteRowByKey = (data: object[], dragInfo: any) => {
  const { dragKey } = dragInfo
  data.some((item: any, index) => {
    const { key, children } = item

    if (dragKey === key) {
      data.splice(index, 1)
      return true
    }

    if (children) {
      deleteRowByKey(children, dragInfo)
    }

    return false
  })

  return data
}

export const setRowByKey = (data: object[], dragInfo: any, inSameLevel = true) => {
  const { dropKey, dropClientY, startClientY, rowData } = dragInfo
  data.some((item: any, index) => {
    const { key, children } = item
    if (dropKey === key) {
      const direction = startClientY > dropClientY ? 0 : 1
      data.splice(index + direction, 0, rowData)
      return true
    }

    if (children) {
      inSameLevel = false
      setRowByKey(children, dragInfo, inSameLevel)
    }
    return false
  })
  return data
}

export const setColumnsDefaultWidth = (columns: any, defaultWidth: any) => {
  const _columns: any = columns.concat()

  const setWidth = (_columns: any) => {
    _columns.forEach((item: any) => {
      const { children } = item
      if (children) {
        setWidth(children)
      } else if (item.dataKey) {
        item.width = item.width || defaultWidth
      }
    })
  }

  setWidth(_columns)
  return _columns
}

export const getMaskItemsWIdth = (columns: any) => {
  let num = 0
  const getAllItemWidth = (column: any) => {
    column.forEach((item: any) => {
      if (item.children) {
        getAllItemWidth(item.children)
      } else {
        num += item.width
      }
    })
  }
  getAllItemWidth(columns)
  return num
}
