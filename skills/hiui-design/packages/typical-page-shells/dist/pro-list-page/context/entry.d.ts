import React from 'react';
import { type Subscription } from '@hi-ui/use-subscription';
import type { GetDataSourceBasicParamsType, GetDataSourceResType, GetDataSourceType } from '@hi-ui/schema-core';
/** 与 table-normal ListSubscriptionType 对齐：筛选、排序、分页 */
export type ListSubscriptionType = {
    filters: GetDataSourceBasicParamsType['filters'];
    sorters: GetDataSourceBasicParamsType['sorters'];
    pagination: NonNullable<GetDataSourceBasicParamsType['pagination']>;
};
/** 对外暴露的 context 类型：仅包含 subscription，由 Provider 提供 */
export type ProListPageContextValue = {
    subscription: Subscription<ListSubscriptionType>;
    listData: GetDataSourceResType;
    isListDataLoading: boolean;
    getListData: () => Promise<GetDataSourceResType>;
    refreshListData: () => Promise<GetDataSourceResType>;
};
export type ProListPageProviderProps = {
    request?: GetDataSourceType<AnyObject>;
    /** 初始每页条数，默认 20 */
    defaultPageSize?: number;
};
export declare function ProListPageProvider(props: React.PropsWithChildren<ProListPageProviderProps>): import("react/jsx-runtime").JSX.Element;
export declare function useProListPageContext(): ProListPageContextValue;
