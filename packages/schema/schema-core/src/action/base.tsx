import React from 'react'
import { isValidElementType } from 'react-is'
import type { ButtonProps } from '@hi-ui/button'
import { mergeProps } from '@hi-ui/schema-utils'
import type { ActionConfigType } from './type'

export class ActionCreator<
  TData extends AnyObject = AnyObject,
  TCtx extends AnyObject = AnyObject
> {
  private _val: ActionConfigType<TData, TCtx>

  protected _mergeVal(val: Partial<ActionConfigType<TData, TCtx>>) {
    this._val = mergeProps(this._val, val as ActionConfigType<TData, TCtx>)
    return this
  }

  constructor(text: string, type: ButtonProps['type'] = 'secondary') {
    this._val = {
      text,
      type,
      onClick: function onActionClick() {
        // ActionConfigType empty placeholder
      },
    }
  }

  Appearance(appearance?: ButtonProps['appearance']) {
    return this._mergeVal({ appearance })
  }

  Icon(icon?: React.ReactNode | React.ComponentType) {
    if (isValidElementType(icon)) {
      const Icon = icon
      return this._mergeVal({ icon: <Icon /> })
    }

    return this._mergeVal({ icon })
  }

  Config(config: Partial<ActionConfigType<TData, TCtx>>) {
    return this._mergeVal(config)
  }

  Disabled(disabled?: ActionConfigType<TData, TCtx>['disabled']) {
    return this._mergeVal({ disabled })
  }

  Visible(visible?: ActionConfigType<TData, TCtx>['visible']) {
    return this._mergeVal({ visible })
  }

  onClick(onClick: ActionConfigType<TData, TCtx>['onClick']) {
    return this._mergeVal({ onClick })
  }

  get val() {
    return this._val
  }
}
