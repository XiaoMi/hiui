import React, { FC, useContext, useMemo } from 'react'
import { useLocaleContext } from '@hi-ui/core'
import HiButton from '@hi-ui/button'
import DPContext from '../context'

interface FooterProps {
  disabled?: boolean
  onConfirmButtonClick: () => void
}

export const Footer: FC<FooterProps> = ({ disabled, onConfirmButtonClick }) => {
  const i18n = useLocaleContext()
  const { prefixCls, footerRender, size } = useContext(DPContext)

  const footer = useMemo(() => {
    const sureActionContent = (
      <HiButton type="primary" disabled={disabled} onClick={onConfirmButtonClick} size={size}>
        {i18n.get('datePicker.ok')}
      </HiButton>
    )

    return typeof footerRender === 'function' ? footerRender(sureActionContent) : sureActionContent
  }, [disabled, footerRender, i18n, onConfirmButtonClick, size])

  return <div className={`${prefixCls}__footer`}>{footer}</div>
}
