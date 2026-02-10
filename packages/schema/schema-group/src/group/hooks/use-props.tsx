import { useLatest } from 'ahooks'
import { cx } from '@hi-ui/classname'
import type { ReadonlyRefObject } from '@hi-ui/use-ref-state'
import { useGroupMap } from '../../group-context/ctx'
import type { GroupMapType } from '../../group-context'
import type { SchemaGroupProps } from '../entry'
import { clsPrefix } from '../_utils'

// 标准化后的 props 类型
export type NormalizedProps = Omit<ReturnType<typeof getNormalizedProps>, 'groupMap'> & {
  groupMap: GroupMapType
}

export function getNormalizedProps(props: SchemaGroupProps) {
  // const {} = props
  const className = cx(clsPrefix, props.className)

  return {
    ...props,
    className,
  }
}

export function usePropsRef(props: SchemaGroupProps) {
  const _nextProps = getNormalizedProps(props)

  const groupMap = useGroupMap({ groupMap: _nextProps.groupMap })

  const nextProps: NormalizedProps = {
    ..._nextProps,
    groupMap,
  }

  const propsRef = useLatest(nextProps) as ReadonlyRefObject<NormalizedProps>

  return { propsRef }
}
