import React from 'react'
import * as Icons from '../src'
import message from '@hi-ui/message'

/**
 * @title 数据
 */
export const Data = () => {
  const icons = React.useMemo(() => {
    return [
      {
        id: 'filled',
        title: '面型',
        children: [
          { component: Icons.BarChartFilled, tagName: 'BarChartFilled' },
          { component: Icons.PieChartFilled, tagName: 'PieChartFilled' },
          { component: Icons.StockChartFilled, tagName: 'StockChartFilled' },
        ],
      },
      {
        id: 'outlined',
        title: '线型',
        children: [
          { component: Icons.BarChartOutlined, tagName: 'BarChartOutlined' },
          { component: Icons.LineChartOutlined, tagName: 'LineChartOutlined' },
          { component: Icons.PieChartOutlined, tagName: 'PieChartOutlined' },
          { component: Icons.StockChartOutlined, tagName: 'StockChartOutlined' },
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
      <h1>数据</h1>
      <div className="icons-data__wrap">
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
