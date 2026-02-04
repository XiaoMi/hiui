import React from 'react'
import { Button } from '@hi-ui/button'
import type { TableCtxRefType } from '../../table'

/**
 * 创建行编辑按钮
 * @param rowActions 行操作对象
 * @param index 行索引
 * @returns 编辑按钮对象
 */
export function createEditButtons(
  rowActions: TableCtxRefType<AnyType>['rowActions'],
  index: number
) {
  // 编辑按钮
  const edit = (
    <Button key="edit" appearance="link" type="primary" onClick={() => rowActions.startEdit(index)}>
      编辑
    </Button>
  )

  // 保存按钮
  const save = (
    <Button key="save" appearance="link" type="primary" onClick={() => rowActions.saveEdit()}>
      保存
    </Button>
  )

  // 取消按钮
  const cancel = (
    <Button key="cancel" appearance="link" type="primary" onClick={() => rowActions.cancelEdit()}>
      取消
    </Button>
  )

  return { edit, save, cancel }
}
