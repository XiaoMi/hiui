import type { GetDetailDataSourceType } from '../types';
type UseFetchDetailParams = {
    request?: GetDetailDataSourceType;
};
export declare function useFetchDetail(params: UseFetchDetailParams): {
    detailData: AnyObject | null;
    isDetailDataLoading: boolean;
    getDetailData: () => Promise<AnyObject | null>;
    refreshDetailData: () => Promise<AnyObject | null>;
};
export {};
