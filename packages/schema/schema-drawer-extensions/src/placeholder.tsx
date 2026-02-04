import { Schedular } from '@hi-ui/schema-utils'

type MockPlaceholderOptsType = {
  container: HTMLElement | undefined | null
  enableMockPlaceholder?: boolean
  drawerWidth: number
}

export class MockPlaceholder {
  private container: HTMLElement
  private valid: boolean
  private drawerWidth: MockPlaceholderOptsType['drawerWidth']

  private containerPaddingRight: string

  constructor(opts: MockPlaceholderOptsType) {
    this.container = opts.container || document.body
    this.valid = !!(opts.container && opts.enableMockPlaceholder)
    this.drawerWidth = opts.drawerWidth

    this.containerPaddingRight = this.container.style.paddingRight
  }

  enable() {
    if (!this.valid) return
    // 避免多次调用时，重复设置内边距
    if (this.container.dataset.activeMockPlaceholder === 'true') return

    const paddingRight = this.drawerWidth + (parseInt(this.containerPaddingRight || '') || 0)
    this.container.style.paddingRight = `${paddingRight}px`
    this.container.style.transition = 'padding-right 0.3s'

    // 标记为已启用
    this.container.dataset.activeMockPlaceholder = 'true'
  }

  disable() {
    if (!this.valid) return

    this.container.style.paddingRight = this.containerPaddingRight || ''
    Schedular.nextMacro(() => (this.container.style.transition = ''), 20) // 20*16ms = 320ms

    // 标记为已禁用
    this.container.dataset.activeMockPlaceholder = undefined
  }
}
