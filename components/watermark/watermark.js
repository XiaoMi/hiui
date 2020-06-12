const defaultOptions = {
  id: null,
  textAlign: 'left',
  font: '16px microsoft yahei',
  color: 'rgba(128, 128, 128, 0.2)',
  content: '请勿外传',
  rotate: -30,
  zIndex: 1000,
  logo: null,
  grayLogo: true, // 是否对图标进行灰度处理
  isAutoWrap: false, // 文字是否自动换行
  textOverflowEffect: 'zoom' // 当isAutoWrap 为 false 时，文本长度超出画布长度时的处理方式：  zoom - 缩小文字   cut - 截断文字
}

const parseTextData = (ctx, texts, width, isWrap) => {
  let content = []
  let lines = []
  if (texts instanceof Array) {
    content = texts
  } else if (typeof texts === 'string') {
    content.push(texts)
  } else {
    console.warn('Only support String Or Array')
  }
  if (isWrap) {
    content.forEach((text) => {
      let curLine = ''
      for (let char of text) {
        let nextLine = curLine + char
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
const drawText = (ctx, options) => {
  let {
    width,
    _w = width,
    height,
    textOverflowEffect,
    content: text,
    isAutoWrap,
    logo
  } = options
  let oldBaseLine = ctx.textBaseline
  let x = 0
  let y = 0
  ctx.textBaseline = 'hanging'
  /**
   * LOGO 固定宽高： 32 * 32
   * 内容区域为 画布宽度 - 48 （预留左右各24的 padding）
   * 如含 LOGO ，文字的起始 X 坐标为： 24(padding-left) + 32(logo size) + 4(logo 与 text 间距)
   */
  let lineHeight = parseInt(ctx.font) // ctx.font必须以'XXpx'开头
  if (logo) {
    x += 32
    _w -= 32
  }
  const lines = parseTextData(ctx, text, width, isAutoWrap)

  // 计算 Y 的起始位置
  let lineY = y + (ctx.canvas.height) / 2 - (lineHeight * lines.length) / 2
  const initLineY = lineY
  for (let line of lines) {
    let lineX
    if (ctx.textAlign === 'center') {
      lineX = x + width / 2 + 4
    } else if (ctx.textAlign === 'right') {
      lineX = x + width + 4
    } else {
      lineX = x + 4
    }
    if (textOverflowEffect === 'zoom') {
      const size = parseInt(Math.sqrt((_w * _w + height * height) / 2))
      ctx.fillText(line, lineX, lineY, size)
    } else {
      ctx.fillText(line, lineX, lineY)
    }
    lineY += lineHeight
  }
  ctx.textBaseline = oldBaseLine
  return initLineY - lineHeight / 2
}
const drawLogo = (ctx, logo, cb) => {
  const img = new window.Image()
  img.src = logo
  img.onload = () => {
    ctx.globalAlpha = 0.2
    ctx.drawImage(img, 0, ctx.canvas.height / 2 - 16, 32, 32)
    cb()
  }
}

const toImage = (canvas, key, container, options) => {
  var base64Url = canvas.toDataURL()
  const _top = (options._top || 0) + 'px'
  const __wm = document.querySelector(`.${key}`)
  const watermarkDiv = __wm || document.createElement('div')
  const styleStr = `
  position:absolute;
  top:${_top};
  left:0;
  bottom:0;
  width:100%;
  height:100%;
  z-index:${options.zIndex};
  pointer-events:none;
  background-repeat:repeat;
  visibility:visible !important;
  display: block !important;
  opacity: 1 !important;
  background-image:url('${base64Url}');
  ${options.grayLogo ? '-webkit-filter: grayscale(100%);-moz-filter: grayscale(100%);-ms-filter: grayscale(100%);-o-filter: grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);_filter:none;' : ''}
  `
  watermarkDiv.setAttribute('style', styleStr)
  if (window.getComputedStyle(container).getPropertyValue('position') === 'static') {
    container.style.position = 'relative'
  }
  watermarkDiv.classList.add(key)
  container.insertBefore(watermarkDiv, container.firstChild)
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver
  if (MutationObserver) {
    let mo = new MutationObserver(function () {
      const __wm = document.querySelector(`.${key}`)
      const cs = __wm ? window.getComputedStyle(__wm) : {}
      if ((__wm && (__wm.getAttribute('style') !== styleStr || cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === 0)) || !__wm) {
        mo.disconnect()
        mo = null
        WaterMarker(container, JSON.parse(JSON.stringify(options)))
      }
    })
    mo.observe(container, {
      attributes: true,
      subtree: true,
      childList: true
    })
  }
}
const WaterMarker = (container, args) => {
  const _container = container || document.body
  const {density} = args
  let _markSize = {
    width: 210,
    height: 180
  }
  if (['low', 'high'].includes(density)) {
    _markSize = {
      width: density === 'low' ? 240 : 180,
      height: density === 'low' ? 210 : 150
    }
  }
  const options = Object.assign({}, defaultOptions, _markSize, args)
  const {
    id,
    width,
    height,
    textAlign,
    textBaseline,
    font,
    color,
    logo,
    rotate
  } = options
  let key = 'hi-' + Math.floor(Math.random() * (9999 - 1000)) + 1000 + '__wm'
  if (id && id.trim().length > 0 && !document.querySelector(id + '__wm')) {
    key = id + '__wm'
  }
  const canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  canvas.setAttribute('width', width + 'px')
  canvas.setAttribute('height', height + 'px')

  ctx.textAlign = textAlign
  ctx.textBaseline = textBaseline
  ctx.font = font
  ctx.fillStyle = color
  ctx.translate(width / 2, height / 2)
  ctx.rotate(Math.PI / 180 * rotate)
  ctx.translate(-width / 2, -height / 2)

  drawText(ctx, options)
  if (logo) {
    drawLogo(ctx, logo, () => {
      toImage(canvas, key, _container, options)
    })
  } else {
    toImage(canvas, key, _container, options)
  }
}

export default WaterMarker
