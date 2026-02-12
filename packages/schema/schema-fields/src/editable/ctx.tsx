import React from 'react'
import type { FieldControlType } from '@hi-ui/schema-core'

export type EditableControlCtxType = Partial<Pick<FieldControlType, 'editable' | 'readonly'>>

const EditableControlContext = React.createContext<EditableControlCtxType>({
  editable: undefined, // 默认可编辑
  readonly: undefined, // 默认非只读
})

export function EditableControlProvider(props: React.PropsWithChildren<EditableControlCtxType>) {
  // 只是用来保持引用不变
  const value = React.useMemo(
    () => ({ editable: props.editable, readonly: props.readonly }),
    [props.editable, props.readonly]
  )

  return (
    <EditableControlContext.Provider value={value}>
      {props.children}
    </EditableControlContext.Provider>
  )
}

export function useEditableControlCtx() {
  return React.useContext(EditableControlContext)
}
