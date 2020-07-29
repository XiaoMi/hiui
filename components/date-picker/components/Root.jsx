import React, { useRef, useContext } from 'react'
import Input from './Input'
import DPContext from '../context'
import { usePlaceholder } from '../hooks'
import classNames from 'classnames'
const Root = ({
  onTrigger,
  onMouseEnter,
  onMouseLeave,
  children,
  inputChangeEvent
}) => {
  const {
    localeDatas,
    type,
    outDate,
    placeholder,
    showTime,
    disabled
  } = useContext(DPContext)
  const inputRef = useRef(null)
  const [placeholders] = usePlaceholder({type, showTime, placeholder, localeDatas})
  const _cls = classNames(
    'hi-datepicker__input',
    `hi-datepicker__input--${type}`,
    disabled && 'hi-datepicker__input--disabled',
    showTime && 'hi-datepicker__input--middle',
    (type.includes('range') || type === 'timeperiod') && 'hi-datepicker__input--range'
  )
  return <div
    className={_cls}
    onClick={onTrigger}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    ref={inputRef}
  >
    <Input date={outDate[0]} placeholder={placeholders[0]} onChange={inputChangeEvent} dir={0} />
    {
      (type.includes('range') || type === 'timeperiod') && <>'       '<span className='hi-datepicker__input--connection'>{localeDatas.datePicker.to}</span>'       '<Input date={outDate[1]} placeholder={placeholders[1]} onChange={inputChangeEvent} dir={1} />'     '</>
    }
    {
      React.cloneElement(children, {attachEle: inputRef.current})
    }
  </div>
}

export default Root
