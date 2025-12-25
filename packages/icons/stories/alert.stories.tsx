import React from 'react'
import * as Icons from '../src'
import message from '@hi-ui/message'

/**
 * @title 提示
 */
export const Alert = () => {
  const icons = React.useMemo(() => {
    return [
      {
        id: 'filled',
        title: '面型',
        children: [
          { component: Icons.AddCircleFilled, tagName: 'AddCircleFilled' },
          { component: Icons.CheckCircleFilled, tagName: 'CheckCircleFilled' },
          { component: Icons.CheckSquareFilled, tagName: 'CheckSquareFilled' },
          { component: Icons.CloseCircleFilled, tagName: 'CloseCircleFilled' },
          { component: Icons.CloseSquareFilled, tagName: 'CloseSquareFilled' },
          { component: Icons.ExclamationCircleFilled, tagName: 'ExclamationCircleFilled' },
          { component: Icons.InfoCircleFilled, tagName: 'InfoCircleFilled' },
          { component: Icons.MinusSquareFilled, tagName: 'MinusSquareFilled' },
          { component: Icons.PlusSquareFilled, tagName: 'PlusSquareFilled' },
          { component: Icons.QuestionCircleFilled, tagName: 'QuestionCircleFilled' },
          { component: Icons.StopFilled, tagName: 'StopFilled' },
          { component: Icons.WarningFilled, tagName: 'WarningFilled' },
        ],
      },
      {
        id: 'outlined',
        title: '线型',
        children: [
          { component: Icons.CheckCircleOutlined, tagName: 'CheckCircleOutlined' },
          { component: Icons.CheckOutlined, tagName: 'CheckOutlined' },
          { component: Icons.CheckSquareOutlined, tagName: 'CheckSquareOutlined' },
          { component: Icons.CloseCircleOutlined, tagName: 'CloseCircleOutlined' },
          { component: Icons.CloseOutlined, tagName: 'CloseOutlined' },
          { component: Icons.CloseSquareOutlined, tagName: 'CloseSquareOutlined' },
          { component: Icons.ExclamationCircleOutlined, tagName: 'ExclamationCircleOutlined' },
          { component: Icons.ExclamationOutlined, tagName: 'ExclamationOutlined' },
          { component: Icons.InfoCircleOutlined, tagName: 'InfoCircleOutlined' },
          { component: Icons.InfoOutlined, tagName: 'InfoOutlined' },
          { component: Icons.MinusOutlined, tagName: 'MinusOutlined' },
          { component: Icons.MinusSquareOutlined, tagName: 'MinusSquareOutlined' },
          { component: Icons.PlusOutlined, tagName: 'PlusOutlined' },
          { component: Icons.PlusSquareOutlined, tagName: 'PlusSquareOutlined' },
          { component: Icons.QuestionCircleOutlined, tagName: 'QuestionCircleOutlined' },
          { component: Icons.QuestionOutlined, tagName: 'QuestionOutlined' },
          { component: Icons.StopOutlined, tagName: 'StopOutlined' },
          { component: Icons.WarningOutlined, tagName: 'WarningOutlined' },
        ],
      },
    ]
  }, [])

  const renderIcon = React.useCallback(({ component: Component, tagName }) => {
    return (
      <div
        key={tagName}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 0',
          borderRadius: '8px',
        }}
        onMouseEnter={(evt) => {
          evt.currentTarget.style.backgroundColor = '#f2f4f7'
          evt.currentTarget.style.cursor = 'pointer'
        }}
        onMouseLeave={(evt) => {
          evt.currentTarget.style.backgroundColor = 'transparent'
          evt.currentTarget.style.cursor = 'default'
        }}
        onClick={() => {
          try {
            const textArea = document.createElement('textarea')
            textArea.value = `<${tagName} />`
            textArea.style.position = 'fixed'
            textArea.style.opacity = '0'
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            message.open({
              title: `复制成功：\n<${tagName} />`,
              type: 'success',
            })
          } catch (err) {
            console.error('复制失败:', err)
            message.open({
              title: '复制失败',
              type: 'error',
            })
          }
        }}
      >
        <Component style={{ fontSize: '32px' }} />
        <div style={{ marginTop: '16px', fontSize: '12px' }}>{tagName}</div>
      </div>
    )
  }, [])

  return (
    <>
      <h1>提示</h1>
      <div className="icons-alert__wrap">
        {icons.map((typeItem) => (
          <React.Fragment key={typeItem.id}>
            <div style={{ lineHeight: '22px', fontSize: '16px', margin: '8px 0' }}>
              {typeItem.title}
            </div>
            <div
              style={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              }}
            >
              {typeItem.children.map(renderIcon)}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}
