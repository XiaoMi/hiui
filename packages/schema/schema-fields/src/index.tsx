import React from 'react'
import { FieldMapProvider } from './ctx'
import type { FieldMapType } from './base'

import { ProCascader, type ProCascaderProps } from './fields/basic/cascader'
import { ProCheckCascader, type ProCheckCascaderProps } from './fields/basic/check-cascader'
import { ProCheckSelect, type ProCheckSelectProps } from './fields/basic/check-select'
import { ProCheckTreeSelect, type ProCheckTreeSelectProps } from './fields/basic/check-tree-select'
import { ProCheckbox, type ProCheckboxProps } from './fields/basic/checkbox'
import { ProCounter, type ProCounterProps } from './fields/basic/counter'
import { ProDate, type ProDateProps } from './fields/semantic/date'
import { ProImage, type ProImageProps } from './fields/semantic/image'
import { ProLink, type ProLinkProps } from './fields/semantic/link'
import { ProNumber, type ProNumberProps } from './fields/semantic/number'
import { ProRadio, type ProRadioProps } from './fields/basic/radio'
import { ProRating, type ProRatingProps } from './fields/basic/rating'
import { ProSelect, type ProSelectProps } from './fields/basic/select'
import { ProSlider, type ProSliderProps } from './fields/basic/slider'
import { ProSwitch, type ProSwitchProps } from './fields/basic/switch'
import { ProTag, type ProTagProps } from './fields/semantic/tag'
import { ProText, type ProTextProps } from './fields/semantic/text'
import { ProTextArea, type ProTextAreaProps } from './fields/basic/textarea'
import { ProTimePicker, type ProTimePickerProps } from './fields/basic/time-picker'
import { ProTreeSelect, type ProTreeSelectProps } from './fields/basic/tree-select'
import { ProUpload, type ProUploadProps } from './fields/basic/upload'
// import { ProEditTable, type ProEditTableProps } from './enhance/edit-table'
import { ProNumberRange, type ProNumberRangeProps } from './fields/enhance/number-range'
// import { ProUser, type ProUserProps } from './enhance/user'

export { ProCascader, type ProCascaderProps } from './fields/basic/cascader'
export { ProCheckCascader, type ProCheckCascaderProps } from './fields/basic/check-cascader'
export { ProCheckSelect, type ProCheckSelectProps } from './fields/basic/check-select'
export { ProCheckTreeSelect, type ProCheckTreeSelectProps } from './fields/basic/check-tree-select'
export { ProCheckbox, type ProCheckboxProps } from './fields/basic/checkbox'
export { ProCounter, type ProCounterProps } from './fields/basic/counter'
export { ProDate, type ProDateProps } from './fields/semantic/date'
export { ProImage, type ProImageProps, type ImageUploadProps } from './fields/semantic/image'
export { ProLink, type ProLinkProps } from './fields/semantic/link'
export { ProNumber, type ProNumberProps } from './fields/semantic/number'
export { ProRadio, type ProRadioProps } from './fields/basic/radio'
export { ProRating, type ProRatingProps } from './fields/basic/rating'
export { ProSelect, type ProSelectProps } from './fields/basic/select'
export { ProSlider, type ProSliderProps } from './fields/basic/slider'
export { ProSwitch, type ProSwitchProps } from './fields/basic/switch'
export { ProTag, type ProTagProps } from './fields/semantic/tag'
export { ProText, type ProTextProps } from './fields/semantic/text'
export { ProTextArea, type ProTextAreaProps } from './fields/basic/textarea'
export { ProTimePicker, type ProTimePickerProps } from './fields/basic/time-picker'
export { ProTreeSelect, type ProTreeSelectProps } from './fields/basic/tree-select'
export { ProUpload, type ProUploadProps } from './fields/basic/upload'
// export { ProEditTable, type ProEditTableProps } from './enhance/edit-table'
export { ProNumberRange, type ProNumberRangeProps } from './fields/enhance/number-range'
// export { ProUser, type ProUserProps } from './enhance/user'

export const ProFieldMap = {
  cascader: ProCascader,
  'check-cascader': ProCheckCascader,
  'check-select': ProCheckSelect,
  'check-tree-select': ProCheckTreeSelect,
  checkbox: ProCheckbox,
  counter: ProCounter,
  date: ProDate,
  image: ProImage,
  link: ProLink,
  number: ProNumber,
  radio: ProRadio,
  rating: ProRating,
  select: ProSelect,
  slider: ProSlider,
  switch: ProSwitch,
  tag: ProTag,
  text: ProText,
  textarea: ProTextArea,
  'time-picker': ProTimePicker,
  'tree-select': ProTreeSelect,
  upload: ProUpload,
  // 'edit-table': ProEditTable,
  'number-range': ProNumberRange,
  // user: ProUser,
}

export type BuiltinFieldMapType = typeof ProFieldMap
export type ProFieldMapType = FieldMapType & BuiltinFieldMapType

export type ProFieldsProps = {
  cascader: ProCascaderProps
  'check-cascader': ProCheckCascaderProps
  'check-select': ProCheckSelectProps
  'check-tree-select': ProCheckTreeSelectProps
  checkbox: ProCheckboxProps
  counter: ProCounterProps
  date: ProDateProps
  image: ProImageProps
  link: ProLinkProps
  number: ProNumberProps
  radio: ProRadioProps
  rating: ProRatingProps
  select: ProSelectProps
  slider: ProSliderProps
  switch: ProSwitchProps
  tag: ProTagProps
  text: ProTextProps
  textarea: ProTextAreaProps
  'time-picker': ProTimePickerProps
  'tree-select': ProTreeSelectProps
  upload: ProUploadProps
  // 'edit-table': ProEditTableProps
  'number-range': ProNumberRangeProps
  // user: ProUserProps
}

export function BuiltinFieldMapProvider(props: React.PropsWithChildren<unknown>) {
  return <FieldMapProvider fields={ProFieldMap}>{props.children}</FieldMapProvider>
}

// TODO ProEditTable ProUser
export * from './base'
export * from './components/span'
export * from './ctx'
export * from './utils' // TODO 待拆分
export * from './components/image-preview' // TODO 待拆分
export * from './components/upload-bridge' // TODO 待拆分
export { DumbInput } from './fields/semantic/text'
export { colorPreset, ColorEnumPreset } from './fields/semantic/tag'

export * from './editable'
