import React from 'react'
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Checkbox } from '@hi-ui/checkbox'
import { Tooltip } from '@hi-ui/tooltip'
import { MenuOutlined, LeftRightOutlined, ToTopOutlined, ToBottomOutlined } from '@hi-ui/icons'
import { useSetting } from './ctx'
import { cls } from './utils'
import type { TableColumn, ColumnFixedType } from './type'

export type SettingItemProps = {
  column: TableColumn
}

function SettingItem({ column }: SettingItemProps) {
  const { settings, updateSetting } = useSetting()
  const setting = settings[column.id]

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.id,
  })

  const handleFixedChange = (fixed: ColumnFixedType) => {
    updateSetting(column.id, { fixed })
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cls('item')}
      {...attributes}
      {...listeners}
    >
      <Checkbox
        checked={setting?.visible ?? true}
        onChange={(e) => updateSetting(column.id, { visible: e.target.checked })}
      >
        {column.title}
      </Checkbox>

      <div className={cls('item-actions')}>
        {setting?.fixed !== 'left' && (
          <Tooltip title="固定到列首">
            <span
              className={cls('item-actions-icon')}
              onClick={(e) => {
                e.stopPropagation()
                handleFixedChange('left')
              }}
            >
              <ToTopOutlined />
            </span>
          </Tooltip>
        )}

        {setting?.fixed !== 'right' && (
          <Tooltip title="固定到列尾">
            <span
              className={cls('item-actions-icon')}
              onClick={(e) => {
                e.stopPropagation()
                handleFixedChange('right')
              }}
            >
              <ToBottomOutlined />
            </span>
          </Tooltip>
        )}

        {setting?.fixed && (
          <Tooltip title="不固定">
            <span
              className={cls('item-actions-icon')}
              // TODO 待确定icon后移除旋转样式
              style={{ transform: 'rotate(90deg)' }}
              onClick={(e) => {
                e.stopPropagation()
                handleFixedChange(false)
              }}
            >
              <LeftRightOutlined />
            </span>
          </Tooltip>
        )}

        {/* 拖拽手柄 */}
        <MenuOutlined className={cls('item-actions-drag-handle')} />
      </div>
    </div>
  )
}

export type SettingListProps = {
  title: string
  columns: TableColumn[]
}

export function SettingList(props: SettingListProps) {
  const { columns } = props
  const { settings, moveColumn } = useSetting()

  // 根据settings中的order对columns排序
  const sortedColumns = React.useMemo(() => {
    return [...columns].sort((a, b) => {
      const orderA = settings[a.id]?.order ?? 0
      const orderB = settings[b.id]?.order ?? 0
      return orderA - orderB
    })
  }, [columns, settings])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    moveColumn(active.id as string, over.id as string)
  }

  return (
    <div className={cls('section')}>
      <div className={cls('section-title')}>{props.title}</div>

      {sortedColumns.length === 0 ? <div className={cls('list-empty')}>暂无数据</div> : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sortedColumns.map((col) => col.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={cls('list')}>
            {sortedColumns.map((column) => (
              <SettingItem key={column.id} column={column} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
