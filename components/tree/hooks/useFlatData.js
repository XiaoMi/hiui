import { useState, useEffect } from 'react'
import _ from 'lodash'
const transformData = (_data) => {
  for (let i = 0; i < _data.length; i++) {
    if (!_data[i].depth) {
      _data[i].depth = 0
    }
    if (_data[i].children) {
      const _children = _data[i].children.map((child) => {
        child.depth = _data[i].depth + 1
        child.parentId = _data[i].id
        return child
      })
      // _data[i].children = _data[i].children.map(child => {
      //   return child.id
      // })
      _data.splice(i + 1, 0, ..._children)
    }
  }
}
const useFlatData = (data) => {
  const [flatData, setFlatData] = useState(data)
  useEffect(() => {
    let _data = _.cloneDeep(data)
    transformData(_data)
    setFlatData(_data)
  }, [data])

  return [flatData, setFlatData]
}

export default useFlatData
