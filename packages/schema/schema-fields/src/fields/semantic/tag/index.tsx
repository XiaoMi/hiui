import React from 'react'
import { cx } from '@hi-ui/classname'
import { isNil, omit } from 'lodash-es'
import { Tag, type TagProps } from '@hi-ui/tag'
import { ProField, type ProFieldRenderCtx } from '../../../base'
import { Span } from '../../../components/span'
import { colorPreset } from './preset'
import type { ColorPreset, BuiltinColorEnum, SCMColorEnumPreset } from './preset'
import './index.scss'

export type ProTagProps = TagProps & {
  /** 是否显示边框 */
  bordered?: boolean
  colorPreset: Record<string, LiteralUnion<BuiltinColorEnum | SCMColorEnumPreset> | ColorPreset>
  /** 文本映射
   * - 例如：字段值为0/1，想要显示为 否/是
   * - 可以配置为：textMap: { 0: '否', 1: '是' } 或 textMap: new Map([[0, '否'], [1, '是']])
   * - Map 中 key 的类型可以是任意类型
   * - Map 中 value 的类型需要是有效的 React 子元素类型，例如：string、number、React.ReactNode 等
   */
  textMap?:
    | Record<string, string | number | React.ReactNode>
    | Map<unknown, string | number | React.ReactNode>
}

function isInvalidTagData(data: unknown) {
  if (isNil(data)) return true
  if (data === '') return true
  return false
}

export class ProTag extends ProField {
  render(data: string | string[], ctx: ProFieldRenderCtx<ProTagProps>) {
    if (isInvalidTagData(data)) return this.dftDom

    // 统一转换为数组处理
    const dataList = (Array.isArray(data) ? data : [data]).filter((el) => !isInvalidTagData(el))
    if (dataList.length === 0) return this.dftDom

    return this.renderTag(dataList, ctx)
  }

  renderTag(dataArray: string[], ctx: ProFieldRenderCtx<ProTagProps>) {
    const fieldProps = this.getFieldProps({} as ProTagProps, ctx)

    const className = cx(fieldProps.className, {
      'pro-tag--bordered': fieldProps.bordered,
    })

    const tagProps = this.getTagProps(fieldProps)

    return (
      <Span style={{ gap: 4 }}>
        {dataArray.map((data, index) => {
          const _preset = fieldProps.colorPreset?.[data]
          const text = this.getText(data, fieldProps.textMap)

          // 没有预设颜色，则显示默认Tag样式
          if (!_preset) {
            return (
              <span key={index}>
                <Tag type="default" {...tagProps} className={className}>
                  {text}
                </Tag>
              </span>
            )
          }

          // 内置类型
          const type = this.getType(_preset)
          // 自定义颜色(文字色和背景色)
          const color = this.getColor(_preset)

          return (
            <span key={index}>
              <Tag
                type={type}
                color={color?.fore}
                background={color?.back}
                {...tagProps}
                className={className}
              >
                {text}
              </Tag>
            </span>
          )
        })}
      </Span>
    )
  }

  getTagProps(props: ProTagProps) {
    return omit(props, ['bordered', 'colorPreset']) as Omit<ProTagProps, 'bordered' | 'colorPreset'>
  }

  getType(preset: ValueOf<ProTagProps['colorPreset']>) {
    if (typeof preset !== 'string') return undefined
    if (preset in colorPreset) return undefined
    return preset as Required<TagProps>['type']
  }

  getColor(preset: ValueOf<ProTagProps['colorPreset']>) {
    if (typeof preset !== 'string') return preset as ColorPreset
    if (preset in colorPreset) return colorPreset[preset as keyof typeof colorPreset] as ColorPreset
    return undefined
  }

  getText(data: string, textMap: ProTagProps['textMap']) {
    if (!textMap) return data
    if (textMap instanceof Map) return textMap.get(data) ?? data
    return textMap[data] ?? data
  }
}
