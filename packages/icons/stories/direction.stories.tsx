import React from 'react'
import * as Icons from '../src'
import message from '@hi-ui/message'

/**
 * @title 方向
 */
export const Direction = () => {
  const icons = React.useMemo(() => {
    return [
      {
        id: 'filled',
        title: '面型',
        children: [
          { component: Icons.CaretDownFilled, tagName: 'CaretDownFilled' },
          { component: Icons.CaretLeftFilled, tagName: 'CaretLeftFilled' },
          { component: Icons.CaretRightFilled, tagName: 'CaretRightFilled' },
          { component: Icons.CaretUpFilled, tagName: 'CaretUpFilled' },
          { component: Icons.DragFilled, tagName: 'DragFilled' },
          { component: Icons.SortFilled, tagName: 'SortFilled' },
        ],
      },
      {
        id: 'outlined',
        title: '线型',
        children: [
          { component: Icons.ArrowDownBoldOutlined, tagName: 'ArrowDownBoldOutlined' },
          { component: Icons.ArrowDownOutlined, tagName: 'ArrowDownOutlined' },
          { component: Icons.ArrowLeftBoldOutlined, tagName: 'ArrowLeftBoldOutlined' },
          { component: Icons.ArrowLeftOutlined, tagName: 'ArrowLeftOutlined' },
          { component: Icons.ArrowRightBoldOutlined, tagName: 'ArrowRightBoldOutlined' },
          { component: Icons.ArrowRightOutlined, tagName: 'ArrowRightOutlined' },
          { component: Icons.ArrowUpBoldOutlined, tagName: 'ArrowUpBoldOutlined' },
          { component: Icons.ArrowUpOutlined, tagName: 'ArrowUpOutlined' },
          { component: Icons.DirectionDownBoldOutlined, tagName: 'DirectionDownBoldOutlined' },
          { component: Icons.DirectionDownOutlined, tagName: 'DirectionDownOutlined' },
          { component: Icons.DirectionLeftBoldOutlined, tagName: 'DirectionLeftBoldOutlined' },
          { component: Icons.DirectionLeftOutlined, tagName: 'DirectionLeftOutlined' },
          { component: Icons.DirectionRightBoldOutlined, tagName: 'DirectionRightBoldOutlined' },
          { component: Icons.DirectionRightOutlined, tagName: 'DirectionRightOutlined' },
          { component: Icons.DirectionUpBoldOutlined, tagName: 'DirectionUpBoldOutlined' },
          { component: Icons.DirectionUpOutlined, tagName: 'DirectionUpOutlined' },
          { component: Icons.DownBoldOutlined, tagName: 'DownBoldOutlined' },
          { component: Icons.DownOutlined, tagName: 'DownOutlined' },
          { component: Icons.DownShortBoldOutlined, tagName: 'DownShortBoldOutlined' },
          { component: Icons.DownShortOutlined, tagName: 'DownShortOutlined' },
          { component: Icons.ExpandOutlined, tagName: 'ExpandOutlined' },
          { component: Icons.FullscreenExitOutlined, tagName: 'FullscreenExitOutlined' },
          { component: Icons.FullscreenOutlined, tagName: 'FullscreenOutlined' },
          { component: Icons.LeftBoldOutlined, tagName: 'LeftBoldOutlined' },
          { component: Icons.LeftOutlined, tagName: 'LeftOutlined' },
          { component: Icons.LeftRightOutlined, tagName: 'LeftRightOutlined' },
          { component: Icons.LeftShortBoldOutlined, tagName: 'LeftShortBoldOutlined' },
          { component: Icons.LeftShortOutlined, tagName: 'LeftShortOutlined' },
          { component: Icons.MenuFoldOutlined, tagName: 'MenuFoldOutlined' },
          { component: Icons.MenuUnfoldOutlined, tagName: 'MenuUnfoldOutlined' },
          { component: Icons.RightBoldOutlined, tagName: 'RightBoldOutlined' },
          { component: Icons.RightOutlined, tagName: 'RightOutlined' },
          { component: Icons.RightShortBoldOutlined, tagName: 'RightShortBoldOutlined' },
          { component: Icons.RightShortOutlined, tagName: 'RightShortOutlined' },
          { component: Icons.ShrinkOutlined, tagName: 'ShrinkOutlined' },
          { component: Icons.ToBottomOutlined, tagName: 'ToBottomOutlined' },
          { component: Icons.ToTopOutlined, tagName: 'ToTopOutlined' },
          { component: Icons.UpBoldOutlined, tagName: 'UpBoldOutlined' },
          { component: Icons.UpOutlined, tagName: 'UpOutlined' },
          { component: Icons.UpShortBoldOutlined, tagName: 'UpShortBoldOutlined' },
          { component: Icons.UpShortOutlined, tagName: 'UpShortOutlined' },
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
      <h1>方向</h1>
      <div className="icons-direction__wrap">
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
