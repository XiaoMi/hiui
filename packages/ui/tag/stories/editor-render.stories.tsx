import React, { useState } from 'react'
import Tag, { TagGroupDataItem } from '../src'
import Select from '@hi-ui/select'

/**
 * @title 自定义编辑器渲染
 */
export const EditorRender = () => {
  const [baseData, setBaseData] = useState<TagGroupDataItem[]>([
    {
      children: 'Test',
      id: 1,
    },
  ])
  const [tagsData] = useState([
    { id: 1, title: 'Test' },
    { id: 2, title: 'Test2' },
    { id: 3, title: 'Test3' },
    { id: 4, title: 'Test4' },
    { id: 5, title: 'Test5' },
  ])

  const selectData = React.useMemo(() => {
    return tagsData.filter((item) => !baseData.find((d) => d.id === item.id))
  }, [baseData, tagsData])

  return (
    <>
      <h1>EditorRender</h1>
      <Tag.Group
        data={baseData}
        // editable={false}
        editorRender={(updated) => {
          return (
            <Select
              style={{ display: 'inline-flex', width: 120, margin: '8px 0 0 0' }}
              size={'sm'}
              data={selectData}
              onClose={() => updated()}
              onChange={(id, item) => {
                if (id !== undefined) {
                  setBaseData((pre) => {
                    const result = [...pre]
                    result.push({
                      children: item.title,
                      id,
                    })
                    return result
                  })

                  updated()
                }
              }}
            />
          )
        }}
        onDelete={(e, index) => {
          setBaseData((pre) => {
            const result = [...pre]
            result.splice(index, 1)
            return result
          })
        }}
      />
    </>
  )
}
