import React from 'react';
import { type QueryFilterProps, type FilterFieldProps } from '@hi-ui/query-filter';
import type { FieldConfigType } from '@hi-ui/schema-core';
import type { ProFieldMapType } from '@hi-ui/schema-fields';
/** 唯一转换：FieldConfigType[] → FilterFieldProps[] + defaultFormData，组件由 field.renderer.renderFormItem 提供 */
export declare function mapFields(fields: FieldConfigType[], fieldMap: ProFieldMapType): FilterFieldProps[];
export type ProListPageQueryFilterProps = {
    /** 为 false 时不渲染前置关键词框（例如筛选区仅有选择型控件、无文本检索） */
    showKeywordSearch?: boolean;
    /** 行内筛选字段名是否可见。典型列表页默认隐藏外部 label；FilterDrawer 同样复用 filterFields.label。 */
    showLabel?: boolean;
    /** 前置合并关键词检索占位符（`field="keyword"`，与典型页「多字段合并一框」一致） */
    searchPlaceholder?: string;
    prepend?: React.ReactNode | React.ReactNode[];
    append?: React.ReactNode | React.ReactNode[];
    defaultVisible?: boolean;
    drawerWidth?: number;
    drawerTitle?: React.ReactNode;
    [key: string]: unknown;
};
export type QueryFilterBridgeProps = Omit<QueryFilterProps, 'filterFields' | 'formData'> & ProListPageQueryFilterProps;
declare function QueryFilterBridge(props: QueryFilterBridgeProps): import("react/jsx-runtime").JSX.Element;
export { QueryFilterBridge as QueryFilter };
