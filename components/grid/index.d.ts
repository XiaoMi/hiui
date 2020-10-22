import { CSSProperties } from "react"

interface GridProps {
}
interface RowProps {
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-around' | 'space-between	'
  gutter?: boolean
}
interface ColProps {
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-around' | 'space-between	'
  span?: number
  offset?: number
}
declare class Row extends React.Component<RowProps, any> {
}
declare class Col extends React.Component<ColProps, any> {
}
declare class Grid extends React.Component<GridProps, any> {
  static Row = Row
  static Col = Col
}
export default Grid
