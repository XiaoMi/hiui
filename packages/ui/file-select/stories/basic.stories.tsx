import React from 'react'
import FileSelect from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="file-select-basic__wrap">
        <FileSelect onSelect={console.log}>Upload</FileSelect>
      </div>
    </>
  )
}
