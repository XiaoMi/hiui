import React from 'react'
import ReactDOM from 'react-dom'
import { isNil } from 'lodash-es'
import * as Container from '@hi-ui/container'
import { uuid } from '@hi-ui/use-id'
import { getPrefixCls } from '@hi-ui/classname'
import { mergeProps } from '@hi-ui/schema-utils'
import { EnhancedDrawer, type EnhancedDrawerProps } from './component'
import { MockPlaceholder } from './placeholder'

const drawerPrefix = getPrefixCls('drawer')
const selector = `.${drawerPrefix}__portal`
const instanceCache: Record<string, () => void> = {}

function getContainer(props: Pick<DrawerApiProps, 'enableLocalContainer' | 'container' | 'width'>) {
  const { enableLocalContainer, container: containerProp } = props

  const selectorId = `${selector}__${uuid()}` // portal元素ID

  let container: HTMLElement | undefined
  if (enableLocalContainer) {
    // 启用局部容器时，必须传入 container 属性
    if (!containerProp) {
      throw new Error('DrawerApi.open enableLocalContainer 为 true 时，必须传入 container 属性')
    }
    // 启用局部容器时，会自动创建一个容器，并将传入元素插入到容器中
    else {
      container = Container.getContainer(selectorId, undefined, containerProp) as HTMLElement

      // 还需要给传入的 container 元素增加必要的样式
      if (container) {
        containerProp.style.position = 'relative'

        container.style.height = '100%'
        container.style.width = `${props.width}px`
        container.style.position = 'absolute'
        container.style.top = '0'
        container.style.right = '0'
        container.style.bottom = '0'
        // container.style.left = '0' // 靠右侧，不需要设置 left
      }
    }
  }
  // 默认情况直接创建容器即可
  else {
    container = Container.getContainer(selectorId) as HTMLElement
  }

  return {
    container: container as HTMLElement | undefined,
    selectorId,
  }
}

function parseWidth(width: string | number | undefined, dft = 400) {
  if (isNil(width)) return dft
  if (typeof width === 'number') return width
  return parseInt(width)
}

const open = (props: DrawerApiProps = {}) => {
  const {
    // props
    content,
    enableLocalContainer,
    container: containerProp,
    enableMockPlaceholder,
    refPortalContainer,
    ...rest
  } = props

  const width = parseWidth(rest.width, 400)
  let { container, selectorId } = getContainer({
    enableLocalContainer,
    container: containerProp,
    width,
  })

  // 给外部获取内部创建的 portal 容器的能力
  refPortalContainer?.(container)

  const mockPlaceholder = new MockPlaceholder({
    container: containerProp,
    enableMockPlaceholder: enableMockPlaceholder && enableLocalContainer,
    drawerWidth: width,
  })

  const close = () => {
    if (container) {
      mockPlaceholder.disable()

      ReactDOM.unmountComponentAtNode(container)
      Container.removeContainer(selectorId)
    }

    container = undefined
  }

  // 启用局部容器时，给抽屉元素增加必要的样式
  const dftStyle: React.CSSProperties = enableLocalContainer ? { position: 'absolute' } : {}
  const style = mergeProps(dftStyle, props.style)

  const ClonedEl = React.createElement(EnhancedDrawer, {
    ...rest,
    width,
    style,
    // visible: true,
    container,
    beforeClose() {
      // 关闭前禁用模拟占位功能
      mockPlaceholder.disable()

      props.beforeClose?.()
    },
    // 卸载
    onExited: () => {
      close()

      // 卸载时，如果启用局部容器，需要恢复传入容器元素的样式
      if (enableLocalContainer && containerProp) {
        containerProp.style.position = ''
      }
    },
    children: content,
  })

  requestAnimationFrame(() => {
    if (!container) return null
    ReactDOM.render(ClonedEl, container)

    // 打开后启用模拟占位功能
    mockPlaceholder.enable()
  })

  return { close, id: selectorId }
}

export type DrawerApiProps = Omit<EnhancedDrawerProps, 'content'> & {
  content?: React.ReactNode
  /**
   * 是否启用局部容器
   * - 启用时，必须主动传入 container 属性
   * - 会将传入的 container 元素插入默认创建的 portal 元素中
   * - 并给 container 元素、drawer 元素上增加必要的属性以启用局部容器能力
   */
  enableLocalContainer?: boolean
  /**
   * 是否启用模拟占位
   * - 仅在启用局部容器时有效
   * - 启用时，会在唤起抽屉时给传入的容器元素增加外边距
   * - 用于防止抽屉元素遮挡到容器内的有效内容
   * - 此功能暂时仅支持右侧抽屉
   */
  enableMockPlaceholder?: boolean
  /**
   * 获取抽屉元素的引用
   * - 魔法！用来在外部获取内部创建 portal 容器
   */
  refPortalContainer?: (container: HTMLElement | undefined) => void
}

export const DrawerApi = {
  open: (props?: DrawerApiProps) => {
    const { close, id } = open(props)
    instanceCache[id] = close
    return id
  },
  close: (id: string) => {
    if (instanceCache[id]) {
      instanceCache[id]()
      delete instanceCache[id]
    }
  },
  closeAll: () => {
    Object.keys(instanceCache).forEach((id) => {
      instanceCache[id]()
      delete instanceCache[id]
    })
  },
}
