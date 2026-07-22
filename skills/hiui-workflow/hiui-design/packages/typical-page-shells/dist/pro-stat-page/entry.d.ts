import type { ComponentProps, ReactNode } from 'react';
import type { FieldConfigType } from '@hi-ui/schema-core';
import { Table } from '../pro-list-page';
import styles from './index.module.scss';
type StatOverviewBaseItem = {
    title: string;
    value?: number | string;
};
export declare function renderStatTableTextEllipsis(cellValue: unknown): import("react/jsx-runtime").JSX.Element;
type StatOverviewGridProps<T extends StatOverviewBaseItem> = {
    request: () => Promise<{
        list: T[];
    }>;
    minCardWidth?: number;
    cardGap?: number;
    renderCard?: (item: T) => ReactNode;
    getKey?: (item: T, index: number) => string;
};
export declare function StatOverviewGrid<T extends StatOverviewBaseItem>({ request, minCardWidth, cardGap, renderCard, getKey, }: StatOverviewGridProps<T>): import("react/jsx-runtime").JSX.Element | null;
type StatListPageFrameProps = {
    title: string;
    extra?: ReactNode;
    queryFields: FieldConfigType[];
    tableFields: FieldConfigType[];
    searchPlaceholder: string;
    statSection?: ReactNode;
    tableProps?: Partial<ComponentProps<typeof Table>>;
};
export declare function StatListPageFrame({ title, extra, queryFields, tableFields, searchPlaceholder, statSection, tableProps, }: StatListPageFrameProps): import("react/jsx-runtime").JSX.Element;
export { styles as proStatPageStyles };
