import React from "react";

export interface GridProps {}

export type BaseProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  id?: React.ReactText;
  className?: string;
};

export interface RowProps extends BaseProps {
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-around"
    | "space-between";
  gutter?: boolean;
}

export interface ColProps extends BaseProps {
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-around"
    | "space-between";
  span?: number;
  offset?: number;
}
declare class Row extends React.Component<RowProps, any> {}
declare class Col extends React.Component<ColProps, any> {}
declare class Grid extends React.Component<GridProps, any> {
  static Row = Row;
  static Col = Col;
}
export default Grid;
