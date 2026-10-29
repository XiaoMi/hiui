import type { TableProps } from '@hi-ui/hiui';
type PaginationProps = NonNullable<Partial<TableProps['pagination']>>;
type TableBridgeProps = Omit<TableProps, 'data' | 'pagination'> & {
    paginationProps?: PaginationProps;
};
declare function TableBridge(props: TableBridgeProps): import("react/jsx-runtime").JSX.Element;
export { TableBridge as Table, type TableBridgeProps as TableProps, };
