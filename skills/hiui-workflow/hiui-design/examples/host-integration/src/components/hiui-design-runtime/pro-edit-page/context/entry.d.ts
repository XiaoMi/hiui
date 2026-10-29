import React from 'react';
import type { EnhancedFormHelpers } from '@hi-ui/schema-form';
/** 提交/暂存接口：成功返回任意，失败 throw */
export type EditRequestFn = (formData: Record<string, unknown>) => Promise<unknown>;
/** 加载详情接口：成功返回表单数据用于回填，失败 throw；无入参，上下文由用户自行组装 */
export type DetailRequestFn = () => Promise<Record<string, unknown>>;
export type ProEditPageContextType = {
    /** 表单 ref，由 FormBridge 内部的 SchemaForm 赋值 */
    formRef: React.RefObject<EnhancedFormHelpers>;
    loading: {
        submitLoading: boolean;
        stashLoading: boolean;
        detailLoading: boolean;
    };
    submitAsync: (formData: Record<string, unknown>) => Promise<unknown>;
    stashAsync: (formData: Record<string, unknown>) => Promise<unknown>;
};
export type ProEditPageProviderProps = {
    /** 提交接口 */
    submitRequest?: EditRequestFn;
    /** 暂存接口 */
    stashRequest?: EditRequestFn;
    /** 加载详情接口（编辑模式） */
    detailRequest?: DetailRequestFn;
};
export declare function ProEditPageProvider(props: React.PropsWithChildren<ProEditPageProviderProps>): import("react/jsx-runtime").JSX.Element;
export declare function useProEditPageContext(): ProEditPageContextType;
