import React from 'react';
import type { GetDetailDataSourceType } from '../types';
/** 对外暴露的 context 类型 */
export type ProDetailPageContextValue = {
    loading: boolean;
    detailData: AnyObject | null;
    isDetailDataLoading: boolean;
    getDetailData: () => Promise<AnyObject | null>;
    refreshDetailData: () => Promise<AnyObject | null>;
};
export type ProDetailPageProviderProps = {
    request?: GetDetailDataSourceType;
};
export declare function ProDetailPageProvider(props: React.PropsWithChildren<ProDetailPageProviderProps>): import("react/jsx-runtime").JSX.Element;
export declare function useProDetailPageContext(): ProDetailPageContextValue;
