import React from 'react'

/**
 * Props
 * @prop  id         {string}            id
 * @prop  className  {string}            className
 * @prop  list       {array}             显示步骤的信息
 * [
 *   {
 *      src   {string}  sign图标地址（可选）
 *      title {string}  步骤名称
 *      text  {string}  步骤描述
 *   }
 * ]
 * @prop  current    {string | number}   当前步骤位置
 * @prop  vertical   {boolean}           是否竖直显示
 * @prop  up         {string}            sign显示位置
 */
class Stepper extends React.Component {
  renderTransverseNode (info) {
    const { up, current } = this.props

    return (
      <li
        className={`hi-stepper-node-trans ${up ? 'hi-stepper-up' : ''} ${info.last ? 'hi-stepper-node-trans-last' : ''} ${info.key === 0 ? 'hi-stepper-node-trans-first' : ''} ${info.key <= +current ? 'active' : ''}`}
        key={info.key}
      >
        <div
          className='hi-stepper-node-trans-box'
        >
          <span
            className='hi-stepper-sign'
          >
            {
              info.icon
                ? (
                  info.icon
                )
                : (
                  <span
                    className='hi-stepper-num'
                  >
                    {info.key + 1}
                  </span>
                )
            }
          </span>

          <span
            className='hi-stepper-title'
          >
            {info.title}
          </span>
          {
            up && (
              <span
                className='hi-stepper-text'
              >
                {info.text}
              </span>
            )
          }
        </div>

      </li>
    )
  }

  renderTransverse () {
    const {
      current,
      list
    } = this.props
    const len = list.length

    return (
      <ul
        className='hi-stepper-transverse'
      >
        {
          list.map((v, i) => {
            let info = Object.assign({key: i, current}, v)
            if (i === len - 1) {
              info.last = true
            }

            return (
              this.renderTransverseNode(info)
            )
          })
        }
      </ul>
    )
  }

  renderVerticalNode (info) {
    const { current } = this.props

    return (
      <li
        className={`hi-stepper-node-vertical ${info.last ? 'hi-stepper-node-vertical-last' : ''} ${info.key <= +current ? 'active' : ''} ${info.key < +current ? 'active-line' : ''}`}
        key={info.key}
      >
        <div className='hi-stepper-sign'>
          {
            info.icon
              ? (
                info.icon
              )
              : (
                <span
                  className='hi-stepper-num'
                >
                  {info.key + 1}
                </span>
              )
          }
          <span className='hi-stepper-title'>{info.title}</span>
        </div>
        <div className='hi-stepper-text'>
          {info.text}
        </div>
      </li>
    )
  }

  renderVertical () {
    const {
      current,
      list
    } = this.props
    const len = list.length

    return (
      <ul className='hi-stepper-vertical'>
        {
          list.map((v, i) => {
            let info = Object.assign({key: i, current}, v)
            if (i === len - 1) {
              info.last = true
            }

            return (
              this.renderVerticalNode(info)
            )
          })
        }
      </ul>
    )
  }

  render () {
    let {
      id,
      className,
      vertical
    } = this.props

    return (
      <div
        id={id || ''}
        className={`hi-stepper ${className || ''}`}
      >
        {
          vertical ? this.renderVertical() : this.renderTransverse()
        }
      </div>
    )
  }
}

export default Stepper
