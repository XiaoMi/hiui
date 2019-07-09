import React from 'react'
import Provider from '../../context'
import classnames from 'classnames'
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
  renderNode (arg, info) {
    const { up, current } = this.props
    const _c = classnames(
      'hi-stepper__item',
      arg === 'h' && up && 'hi-stepper__item--up',
      info.key <= +current && 'hi-stepper__item--active',
      info.key < +current && 'hi-stepper__item--done'
    )
    return (
      <li
        className={_c}
        key={info.key}
      >
        <div className='hi-stepper__item-content'>
          <span className='hi-stepper__icon'>
            {
              info.icon ? info.icon : (
                <span
                  className='hi-stepper__num'
                >
                  {info.key + 1}
                </span>
              )
            }
          </span>

          <span className='hi-stepper__title'> {info.title}</span>
          {
            (arg === 'v' || up) && <span className='hi-stepper__text'>{info.text}</span>
          }
        </div>
      </li>
    )
  }
  renderStepperBar () {
    const {
      current,
      list,
      vertical
    } = this.props
    const len = list.length

    return (
      <ul className='hi-stepper__list'>
        {
          list.map((v, i) => {
            let info = Object.assign({key: i, current}, v)
            if (i === len - 1) {
              info.last = true
            }

            return (
              this.renderNode(vertical ? 'v' : 'h', info)
            )
          })
        }
      </ul>
    )
  }
  render () {
    let {
      className,
      vertical,
      theme
    } = this.props
    const _className = classnames('hi-stepper', vertical ? 'hi-stepper--vertical' : 'hi-stepper--horizontal', className, theme && 'theme__' + theme)
    return (
      <div
        className={_className}
      >
        {
          this.renderStepperBar()
        }
      </div>
    )
  }
}

export default Provider(Stepper)
