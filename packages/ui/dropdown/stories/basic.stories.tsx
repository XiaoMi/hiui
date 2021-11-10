import React from 'react'
import Dropdown, { DropdownButton, DropdownMenu, DropdownMenuItem } from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="dropdown-basic__wrap">
        <Dropdown trigger="click" triggerButton={<DropdownButton>Dropdown</DropdownButton>}>
          <DropdownMenu>
            <DropdownMenuItem value="0-0">0-0</DropdownMenuItem>
            <DropdownMenuItem
              value="0-1"
              menu={
                <DropdownMenu>
                  <DropdownMenuItem value="0-1-0">0-1-0</DropdownMenuItem>
                  <DropdownMenuItem value="0-1-1">0-1-1</DropdownMenuItem>
                </DropdownMenu>
              }
            >
              0-1
            </DropdownMenuItem>
            <DropdownMenuItem
              value="0-2"
              menu={
                <DropdownMenu>
                  <DropdownMenuItem value="0-2-0">0-2-0</DropdownMenuItem>
                  <DropdownMenuItem value="0-2-1">0-2-1</DropdownMenuItem>
                </DropdownMenu>
              }
            >
              0-2
            </DropdownMenuItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  )
}
