import { ChildGroupConfigType, FormGroupType, GroupConfigType } from './type'

function isForm(group: GroupConfigType): group is GroupConfigType<'form'> {
  return group.type === 'form'
}
function isTable(group: GroupConfigType): group is GroupConfigType<'table'> {
  return group.type === 'table'
}
function isDescriptions(group: GroupConfigType): group is GroupConfigType<'descriptions'> {
  return group.type === 'descriptions'
}
function isEditTable(group: GroupConfigType): group is GroupConfigType<'edit-table'> {
  return group.type === 'edit-table'
}
function isCustom(group: GroupConfigType): group is GroupConfigType<'custom'> {
  return group.type === 'custom'
}
function isChildGroups(group: GroupConfigType): group is ChildGroupConfigType {
  return group.type === 'child-groups'
}
function isSimple(group: GroupConfigType): group is GroupConfigType<'simple'> {
  return group.type === 'simple'
}
function isTabs(group: GroupConfigType): group is GroupConfigType<'tabs'> {
  return group.type === 'tabs'
}
function isGrid(group: GroupConfigType): group is GroupConfigType<'grid'> {
  return group.type === 'grid'
}

function isValidFormGroup(group: GroupConfigType): group is GroupConfigType<FormGroupType> {
  return (
    isGrid(group) ||
    isTabs(group) ||
    isCustom(group) ||
    isSimple(group) ||
    isEditTable(group) ||
    isChildGroups(group) // 这里与 FormGroupType 不完全一致，是因为 childGroups 不能是表单的直接子组，但在嵌套在网格和标签页组中也是有效的
  )
}

export const groupPredicates = {
  isForm,
  isTable,
  isDescriptions,
  isEditTable,
  isCustom,
  isChildGroups,
  isSimple,
  isTabs,
  isGrid,
  isValidFormGroup,
} as const
