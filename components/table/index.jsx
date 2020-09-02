import React from 'react'
import TableLagecy from './table-legacy/table-v2'
import Table from './Table'

const TableWrapper = ({ legacyV2, ...props }) => {
  const WrapperComponent = legacyV2 ? TableLagecy : Table
  return <WrapperComponent {...props} />
}
export default TableWrapper
