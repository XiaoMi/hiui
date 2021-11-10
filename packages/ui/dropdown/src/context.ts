import { createContext, useContext } from 'react'
import { UseDropdownReturn } from './use-dropdown'
interface DropDownContext extends UseDropdownReturn {}

const dropDownContext = createContext<DropDownContext | null>(null)

export const DropDownProvider = dropDownContext.Provider

export const useDropDownContext = () => {
  const context = useContext(dropDownContext)

  if (!context) {
    throw new Error('The dropDownContext is not defined, Maybe it should be wrapped in Dropdown.')
  }

  return context
}
