import type { ComponentProps, ReactNode } from 'react';
import type { FieldConfigType } from '@hi-ui/schema-core';
import { Table } from '../pro-list-page';
import styles from './index.module.scss';
export declare function renderTableTextEllipsis(cellValue: unknown): import("react/jsx-runtime").JSX.Element;
export declare function renderTreeTableTextEllipsis(cellValue: unknown): import("react/jsx-runtime").JSX.Element;
type TablePageFrameProps = {
    title: string;
    extra?: ReactNode;
    queryFields: FieldConfigType[];
    tableFields: FieldConfigType[];
    searchPlaceholder: string;
    tableProps?: Partial<ComponentProps<typeof Table>>;
    children?: ReactNode;
};
export declare function TablePageFrame({ title, extra, queryFields, tableFields, searchPlaceholder, tableProps, children, }: TablePageFrameProps): import("react/jsx-runtime").JSX.Element;
export { styles as proTablePageStyles };
