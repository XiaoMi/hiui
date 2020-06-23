import { useState, useEffect } from 'react'
// import { flattenNodesData } from '../util'

const useFlattenData = (data) => {
  const [flattenData, setFlattenData] = useState(data)
  useEffect(() => {
    // const result = flattenNodesData(data)
    // setFlattenData(data)
  }, [data])

  return [flattenData, setFlattenData]
}

export default useFlattenData
