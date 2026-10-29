import { type Subscription } from '@hi-ui/use-subscription';
import type { FieldConfigType, GetDataSourceParamsType, GetDataSourceType } from '@hi-ui/schema-core';
import type { ListSubscriptionType } from '../context/entry';
type Filters = Required<GetDataSourceParamsType>['filters'];
type UseFetchListParams = {
    subscription: Subscription<ListSubscriptionType>;
    request?: GetDataSourceType<AnyObject>;
};
export declare function useFetchList(params: UseFetchListParams): {
    listData: import("@hi-ui/schema-core").GetDataSourceResType<AnyObject>;
    isListDataLoading: boolean;
    getListData: () => Promise<import("@hi-ui/schema-core").GetDataSourceResType<AnyObject>>;
    refreshListData: () => Promise<import("@hi-ui/schema-core").GetDataSourceResType<AnyObject>>;
};
export declare function toFilters(data: UnknownObject): Filters;
export declare function toValues(filters: Filters): UnknownObject;
export declare function buildEmptyFilterFormValues(queryFields: FieldConfigType[] | undefined, options: {
    includeKeyword?: boolean;
}): Record<string, unknown>;
export declare function toLegacyQueryParams(params: GetDataSourceParamsType): {
    sorters: import("@hi-ui/schema-core").SortingStateType[] | undefined;
    current: number | undefined;
    pageSize: number | undefined;
};
export {};
