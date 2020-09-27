import React from 'react'
import classNames from 'classnames'

import './style/index'
import './iconfont.js'

// 旧版本 icon name 兼容映射
const legacyMap = {
  top: 'to-top',
  bottom: 'to-bottom',
  'check-circle-o': 'check-circle',
  'close-circle-o': 'close-circle',
  ratio: 'equal-proportion',
  stattistics: 'pie-chart',
  freezing: 'freeze-column',
  caveat: 'warning',
  noapi: 'show-code',
  api: 'close-code',
  web: 'webpage',
  voice: 'audio',
  usergroup: 'users',
  'upload-cloud': 'cloud-upload',
  telephone: 'phone',
  store: 'shop',
  set: 'setting',
  repeat: 'time-rewind',
  qr: 'qr-code',
  plugin: 'duplicate',
  prompt: 'bell',
  process: 'diagram',
  'problem-circle-o': 'question-circle',
  position: 'location',
  pic: 'picture',
  pc: 'monitor',
  move: 'drag',
  'move-to': 'folder-move',
  more: 'ellipsis',
  'more-circle-o': 'ellipsis-circle',
  mark: 'pin',
  'mail-delivery': 'mail-send',
  linechart: 'bar-chart',
  label: 'tag',
  internet: 'global',
  info: 'document-exclamation',
  'info-circle-o': 'info-circle',
  hide: 'eye-invisible',
  component: 'relation',
  data: 'data-monitor',
  'money-circle-o': 'rmb'
}

const Icon = ({ name, filled = false, className, style = {}, onClick }) => {
  return (
    <svg
      className={classNames(className, 'hi-icon', `icon-${name}`)}
      aria-hidden="true"
      onClick={(e) => {
        onClick && onClick(e)
      }}
      style={{
        ...style,
        fill: style.color,
        height: style.fontSize,
        width: style.fontSize,
        cursor: style.cursor
      }}
    >
      <use xlinkHref={`#icon${legacyMap[name] || name}-${filled ? 'filled' : 'outlined'}`} />
    </svg>
  )
}
export default Icon
