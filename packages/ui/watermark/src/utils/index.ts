import { WatermarkProps, watermarkPrefix } from '../Watermark'
import { __DEV__ } from '@hi-ui/env'
import { withDefaultProps } from '@hi-ui/react-utils'

type CanvasTextBaseline = 'alphabetic' | 'bottom' | 'hanging' | 'ideographic' | 'middle' | 'top'
type CanvasTextAlign = 'center' | 'end' | 'left' | 'right' | 'start'
interface OptionsInterface {
  textAlign: CanvasTextAlign
  fontSize: number
  color: string
  content?: string | string[]
  rotate: number
  zIndex?: number
  logo?: string | null
  grayscale?: boolean // 是否对图标进行灰度处理
  textOverflowEffect?: 'zoom' | 'cut' | 'wrap' // 当isAutoWrap 为 false 时，文本长度超出画布长度时的处理方式：  zoom - 缩小文字   cut - 截断文字
  textBaseline: CanvasTextBaseline
  density?: 'default' | 'low' | 'high'
  opacity?: number
  width: number
  height: number
}

const parseTextData = (
  ctx: CanvasRenderingContext2D,
  texts: string | string[] | undefined,
  width: number,
  isWrap: boolean
): string[] => {
  let content = []
  const lines: string[] = []
  if (Array.isArray(texts)) {
    content = texts
  } else if (typeof texts === 'string') {
    content.push(texts)
  } else {
    __DEV__ && console.warn('Only support String Or Array')
  }
  if (isWrap) {
    content.forEach((text) => {
      let curLine = ''
      for (const char of text) {
        const nextLine = curLine + char
        if (char === '\n' || ctx.measureText(nextLine).width > width) {
          lines.push(curLine)
          curLine = char === '\n' ? '' : char
        } else {
          curLine = nextLine
        }
      }
      lines.push(curLine)
    })
    return lines
  } else {
    return content
  }
}

const drawText = (ctx: CanvasRenderingContext2D, options: OptionsInterface) => {
  const { width, height, textOverflowEffect, content: text, fontSize, logo } = options
  const oldBaseLine = ctx.textBaseline
  let x = 0
  const y = 16
  let _w = width
  // canvas 文本基线是悬挂基线
  ctx.textBaseline = 'hanging'
  /**
   * LOGO 固定宽高： 32 * 32
   * 内容区域为 画布宽度 - 48 （预留左右各24的 padding）
   * 如含 LOGO ，文字的起始 X 坐标为： 24(padding-left) + 32(logo size) + 4(logo 与 text 间距)
   */
  const lineHeight = fontSize * 2
  if (logo) {
    x += 64
    _w -= 64
  }
  const lines = parseTextData(ctx, text, width, textOverflowEffect === 'wrap')

  // 计算 Y 的起始位置
  let lineY = y + ctx.canvas.height / 2 - (lineHeight * lines.length) / 2
  const initLineY = lineY
  for (const line of lines) {
    let lineX
    if (ctx.textAlign === 'center') {
      lineX = x + width + 40
    } else if (ctx.textAlign === 'right') {
      lineX = x + width + 40
    } else {
      lineX = x + 40
    }

    if (textOverflowEffect === 'zoom') {
      const size = Math.sqrt((_w * _w + height * height) / 2)
      ctx.fillText(line, lineX, lineY, size)
    } else {
      ctx.fillText(line, lineX, lineY)
    }

    lineY += lineHeight
  }
  ctx.textBaseline = oldBaseLine
  return initLineY - lineHeight / 2
}

const isChild = (parent: HTMLElement, child: HTMLElement | null) => parent === child?.parentNode

export class WatermarkGenerator {
  mutationObserverInstance: MutationObserver | null = null
  image: HTMLImageElement | null = null
  containerChild: HTMLElement | null = null

  drawLogo = (ctx: CanvasRenderingContext2D, logo: string, cb: Function) => {
    this.destroyImageEvent()
    const img = new Image()
    img.src = logo
    img.onload = () => {
      ctx.globalAlpha = 0.2
      ctx.drawImage(img, 32, ctx.canvas.height / 2 - 16, 64, 64)
      cb()
    }

    this.image = img
  }

  render = (container: HTMLElement | null, options: WatermarkProps) => {
    if (!container) return

    const defaultProps: OptionsInterface = {
      textAlign: 'left',
      fontSize: 14,
      // @DesignToken
      color: 'rgba(95, 106, 122, 0.1)',
      rotate: -30,
      grayscale: true,
      textOverflowEffect: 'zoom',
      textBaseline: 'hanging',
      width: 420,
      height: 270,
    }

    const { density = 'default' } = options

    const nextProps = { ...defaultProps }

    if (['low', 'high'].includes(density)) {
      nextProps.width = density === 'low' ? 540 : 360
      nextProps.height = density === 'low' ? 410 : 210
    }

    // @ts-ignore
    const cOptions: OptionsInterface = withDefaultProps(options, nextProps)

    const { width, height, textAlign, textBaseline, fontSize, color, logo, rotate } = cOptions
    const key = watermarkPrefix + '-' + Math.floor(Math.random() * (9999 - 1000)) + 1000 + '__wm'
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.setAttribute('width', width + 'px')
    canvas.setAttribute('height', height + 'px')
    if (ctx) {
      ctx.textAlign = textAlign
      ctx.textBaseline = textBaseline
      ctx.font = `normal normal lighter ${Number(
        fontSize * 2
      )}px -apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","Heiti SC","WenQuanYi Micro Hei",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`
      ctx.fillStyle = color
      ctx.translate(width / 2, height / 2)
      ctx.rotate((Math.PI / 180) * rotate)
      ctx.translate(-width / 2, -height / 2)
      drawText(ctx, cOptions)
      if (logo) {
        this.drawLogo(ctx, logo, () => {
          this.toImage(canvas, key, container, cOptions)
        })
      } else {
        this.toImage(canvas, key, container, cOptions)
      }
    }
  }

  destroy = () => {
    this.destroyImageEvent()
    this.destroyMutationObserverEvent()
    this.destroyContainerChild()
  }

  destroyMutationObserverEvent = () => {
    if (this.mutationObserverInstance) {
      this.mutationObserverInstance.disconnect()
      this.mutationObserverInstance = null
    }
  }

  destroyContainerChild = () => {
    if (this.containerChild) {
      this.containerChild?.remove()
      this.containerChild = null
    }
  }

  destroyImageEvent = () => {
    if (this.image) {
      this.image.onload = null
      this.image = null
    }
  }

  toImage = (
    canvas: HTMLCanvasElement,
    key: string,
    container: HTMLElement,
    options: OptionsInterface
  ) => {
    const base64Url = canvas.toDataURL()
    const { opacity = 1 } = options
    const _top = '0px'
    const __wm = document.querySelector(`.${key}`)
    const watermarkDiv = __wm || document.createElement('div')
    const styleStr = `
      position:absolute;
      top:${_top};
      left:-50%;
      top:-50%;
      width:200%;
      height:200%;
      transform:scale(0.5);
      z-index:${options.zIndex};
      pointer-events:none;
      background-repeat:repeat;
      visibility:visible !important;
      display: block !important;
      opacity: ${opacity} !important;
      user-select:none !important;
      background-image:url('${base64Url}');
      ${
        options.grayscale
          ? '-webkit-filter: grayscale(100%);-moz-filter: grayscale(100%);-ms-filter: grayscale(100%);-o-filter: grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);_filter:none;'
          : ''
      }
      `
    watermarkDiv.setAttribute('style', styleStr)
    if (window.getComputedStyle(container).getPropertyValue('position') === 'static') {
      container.style.position = 'relative'
    }
    watermarkDiv.classList.add(key)
    container.insertBefore(watermarkDiv, container.firstChild)
    // @ts-ignore
    this.containerChild = container.firstChild
    const MutationObserver = window.MutationObserver
    if (MutationObserver) {
      const mo: MutationObserver | null = new MutationObserver(() => {
        const __wm = document.querySelector(`.${key}`)
        const cs: CSSStyleDeclaration = __wm
          ? window.getComputedStyle(__wm)
          : ({} as CSSStyleDeclaration)

        if (
          !__wm ||
          __wm.getAttribute('style') !== styleStr ||
          cs.visibility === 'hidden' ||
          cs.display === 'none' ||
          cs.opacity !== String(opacity) ||
          // @ts-ignore
          !isChild(container, container.firstChild)
        ) {
          this.destroyMutationObserverEvent()
          this.destroyContainerChild() // 监听到dom变化时 删除之前的水印元素
          this.render(container, { ...options })
        }
      })

      mo.observe(container, {
        attributes: true,
        subtree: true,
        childList: true,
      })

      this.mutationObserverInstance = mo
    }
  }
}
