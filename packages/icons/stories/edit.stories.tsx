import React from 'react'
import * as Icons from '../src'
import message from '@hi-ui/message'

/**
 * @title 编辑
 */
export const Edit = () => {
  const icons = React.useMemo(() => {
    return [
      {
        id: 'filled',
        title: '面型',
        children: [
          { component: Icons.ClearFilled, tagName: 'ClearFilled' },
          { component: Icons.CopyFilled, tagName: 'CopyFilled' },
          { component: Icons.DeleteFilled, tagName: 'DeleteFilled' },
          { component: Icons.DetailsFilled, tagName: 'DetailsFilled' },
          { component: Icons.DuplicateFilled, tagName: 'DuplicateFilled' },
          { component: Icons.EditFilled, tagName: 'EditFilled' },
          { component: Icons.EllipsisCircleFilled, tagName: 'EllipsisCircleFilled' },
          { component: Icons.EmptyFilled, tagName: 'EmptyFilled' },
          { component: Icons.EqualProportionFilled, tagName: 'EqualProportionFilled' },
          { component: Icons.FilterFilled, tagName: 'FilterFilled' },
          { component: Icons.FolderAddFilled, tagName: 'FolderAddFilled' },
          { component: Icons.FolderMoveFilled, tagName: 'FolderMoveFilled' },
          { component: Icons.PasteFilled, tagName: 'PasteFilled' },
          { component: Icons.RotateLeftFilled, tagName: 'RotateLeftFilled' },
          { component: Icons.RotateRightFilled, tagName: 'RotateRightFilled' },
          { component: Icons.TableFilled, tagName: 'TableFilled' },
          { component: Icons.ZoomInFilled, tagName: 'ZoomInFilled' },
          { component: Icons.ZoomOutFilled, tagName: 'ZoomOutFilled' },
        ],
      },
      {
        id: 'outlined',
        title: '线型',
        children: [
          { component: Icons.AverageOutlined, tagName: 'AverageOutlined' },
          { component: Icons.ClearOutlined, tagName: 'ClearOutlined' },
          { component: Icons.ColumnHeightOutlined, tagName: 'ColumnHeightOutlined' },
          { component: Icons.ColumnsOutlined, tagName: 'ColumnsOutlined' },
          { component: Icons.CopyOutlined, tagName: 'CopyOutlined' },
          { component: Icons.DeleteOutlined, tagName: 'DeleteOutlined' },
          { component: Icons.DetailsOutlined, tagName: 'DetailsOutlined' },
          { component: Icons.DocumentSearchOutlined, tagName: 'DocumentSearchOutlined' },
          { component: Icons.DragOutlined, tagName: 'DragOutlined' },
          { component: Icons.DuplicateOutlined, tagName: 'DuplicateOutlined' },
          { component: Icons.EditOutlined, tagName: 'EditOutlined' },
          { component: Icons.EllipsisCircleOutlined, tagName: 'EllipsisCircleOutlined' },
          { component: Icons.EllipsisOutlined, tagName: 'EllipsisOutlined' },
          { component: Icons.EllipsisVerticalOutlined, tagName: 'EllipsisVerticalOutlined' },
          { component: Icons.EmptyOutlined, tagName: 'EmptyOutlined' },
          { component: Icons.EqualProportionOutlined, tagName: 'EqualProportionOutlined' },
          { component: Icons.FilterOutlined, tagName: 'FilterOutlined' },
          { component: Icons.FolderAddOutlined, tagName: 'FolderAddOutlined' },
          { component: Icons.FolderMoveOutlined, tagName: 'FolderMoveOutlined' },
          { component: Icons.FreezeColumnOutlined, tagName: 'FreezeColumnOutlined' },
          { component: Icons.FrozenLineOutlined, tagName: 'FrozenLineOutlined' },
          { component: Icons.PasteOutlined, tagName: 'PasteOutlined' },
          { component: Icons.RotateLeftOutlined, tagName: 'RotateLeftOutlined' },
          { component: Icons.RotateRightOutlined, tagName: 'RotateRightOutlined' },
          { component: Icons.SaveOutlined, tagName: 'SaveOutlined' },
          { component: Icons.ScissorOutlined, tagName: 'ScissorOutlined' },
          { component: Icons.SortAscendingOutlined, tagName: 'SortAscendingOutlined' },
          { component: Icons.SortDescendingOutlined, tagName: 'SortDescendingOutlined' },
          { component: Icons.SummationOutlined, tagName: 'SummationOutlined' },
          { component: Icons.TableOutlined, tagName: 'TableOutlined' },
          { component: Icons.ZoomInOutlined, tagName: 'ZoomInOutlined' },
          { component: Icons.ZoomOutOutlined, tagName: 'ZoomOutOutlined' },
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
      <h1>编辑</h1>
      <div className="icons-edit__wrap">
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
