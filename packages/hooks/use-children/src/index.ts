import React, { Children } from 'react'
import { isFragment } from 'react-is'

export const useChildren = (children: React.ReactNode) => {}

export const toArray = (children: React.ReactNode): React.ReactElement[] => {
  let childrenList: React.ReactElement[] = []

  Children.forEach(children, (child: any) => {
    if (child === undefined || child === null || typeof child === 'boolean') return

    if (Array.isArray(child)) {
      childrenList = childrenList.concat(toArray(child))
    } else if (isFragment(child) && child.props && child.props.children) {
      childrenList = childrenList.concat(toArray(child.props.children))
    } else {
      childrenList.push(child)
    }
  })

  return childrenList
}

// function convertNodeToOption(node: React.ReactElement): OptionData {
//   const {
//     key,
//     props: { children, value, ...restProps },
//   } = node as React.ReactElement

//   return { key, value: value !== undefined ? value : key, children, ...restProps }
// }

// export function convertChildrenToData(
//   nodes: React.ReactNode,
//   optionOnly: boolean = false
// ): OptionsType {
//   return toArray(nodes)
//     .map((node: React.ReactElement, index: number): OptionData | OptionGroupData | null => {
//       if (!React.isValidElement(node) || !node.type) {
//         return null
//       }

//       const {
//         type: { isSelectOptGroup },
//         key,
//         props: { children, ...restProps },
//       } = node as React.ReactElement & {
//         type: { isSelectOptGroup?: boolean }
//       }

//       if (optionOnly || !isSelectOptGroup) {
//         return convertNodeToOption(node)
//       }

//       return {l;
//         key: `__RC_SELECT_GRP__${key === null ? index : key}__`,
//         label: key,
//         ...restProps,
//         options: convertChildrenToData(children),
//       }
//     })
//     .filter((data) => data)
// }
