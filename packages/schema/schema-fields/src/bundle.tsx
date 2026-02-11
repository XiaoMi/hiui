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

// TODO ProEditTable ProUser

export {
  ProCascader,
  ProCheckCascader,
  ProCheckSelect,
  ProCheckTreeSelect,
  ProCheckbox,
  ProCounter,
  ProDate,
  ProImage,
  ProLink,
  ProNumber,
  ProRadio,
  ProRating,
  ProSelect,
  ProSlider,
  ProSwitch,
  ProTag,
  ProText,
  ProTextArea,
  ProTimePicker,
  ProTreeSelect,
  ProUpload,
  // ProEditTable,
  ProNumberRange,
  // ProUser,
}

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
// TODO ProEditTable ProUser

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
