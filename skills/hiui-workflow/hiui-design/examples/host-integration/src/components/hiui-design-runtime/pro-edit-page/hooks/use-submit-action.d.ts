import type { ProEditPageProviderProps } from '../context/entry';
type UseSubmitActionParams = {
    submitRequest?: ProEditPageProviderProps['submitRequest'];
};
export declare function useSubmitAction(params: UseSubmitActionParams): {
    submitAsync: (formData: Record<string, unknown>) => Promise<unknown>;
    submitLoading: boolean;
};
export {};
