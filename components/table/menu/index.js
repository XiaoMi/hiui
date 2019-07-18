import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import prifix from '../prefix'
// import {scrollTop, scrollLeft} from '../tool'

class HeaderMenu extends Component {
  render () {
    let {highlighCol, freezeCol, hideCol, index, freeze} = this.props

    return (
      <div className={prifix('table-header-menu')}>
        <p onClick={(e) => highlighCol(index)} >高亮</p>
        {freeze && <p onClick={(e) => freezeCol(index)} >冻结</p>}
        <p onClick={(e) => hideCol(index)}>隐藏</p>
      </div>
    )
  }
}

let div

const hide = () => {
  if (div) {
    ReactDOM.unmountComponentAtNode(div)
    document.body.removeChild(div)
    div = null
  }
}

document.addEventListener('click', () => {
  setTimeout(hide, 0)
})
export default {
  show (e, cbs, key, freeze, size = 'normal') {
    div && hide()
    div = document.createElement('div')
    div.className = 'hi-table-header-menu-' + size
    div.style.zIndex = '99999'
    ReactDOM.render(<HeaderMenu {...cbs} index={key} freeze={freeze} />, div)
    div.style.position = 'absolute'
    div.style.left = e.pageX + 'px'
    div.style.top = e.pageY + 'px'
    document.body.appendChild(div)
  }
}
