import React from 'react'
import { cx } from '@hi-ui/classname'
import { isNil, omit } from 'lodash-es'
import { Tag, type TagProps } from '@hi-ui/tag'
import { ProField, type ProFieldRenderCtx } from '../../../base'
import { Span } from '../../../components/span'
import './index.scss'

type ColorPreset = {
  back: TagProps['background']
  fore: TagProps['color']
}

// IPD的标签颜色规范，先记录在这里吧
// https://www.figma.com/design/R7gUHJaKDPSAaWojTrNUe2/%E7%A0%94%E4%BA%A7%E4%BE%9B%E4%B8%9A%E5%8A%A1%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83-IPD?node-id=2042-50477&node-type=frame&t=uCEcQbmB9uwVVUIQ-0
export const colorPreset = {
  blue: { back: '#EDF7FE', fore: '#0744AD' },
  yellow: { back: '#FEFCE9', fore: '#875100' },
  green: { back: '#EEFEF2', fore: '#007D3E' },
  red: { back: '#FEF1EE', fore: '#B32D36' },
  orange: { back: '#FEF5EE', fore: '#B23E1B' },
  purple: { back: '#F5EEFE', fore: '#533DAD' },
  /** 蓝绿色 */ cyan: { back: '#ECFEFC', fore: '#0C737A' },
  /** 天蓝色 */ skyblue: { back: '#ECFCFE', fore: '#006BB3' },
  /** 深紫色 */ darkPurple: { back: '#EEF2FE', fore: '#363AB3' },
  /** 蓝灰色 */ blueGray: { back: '#EEF7FE', fore: '#3C5485' },
  /** 中灰色 */ midGray: { back: '#F2F4F7', fore: '#1F2733' },
} satisfies Record<string, ColorPreset>

// 边框色 DFE2E8 0.5px

type BuiltinColorEnum = Required<TagProps>['type']

type SCMColorEnumPreset = keyof typeof colorPreset

export const ColorEnumPreset = Object.keys(colorPreset) as SCMColorEnumPreset[]

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
