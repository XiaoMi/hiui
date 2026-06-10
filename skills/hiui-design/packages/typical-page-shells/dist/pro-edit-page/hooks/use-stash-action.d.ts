import type { ProEditPageProviderProps } from '../context/entry';
type UseStashActionParams = {
    stashRequest?: ProEditPageProviderProps['stashRequest'];
};
export declare function useStashAction(params: UseStashActionParams): {
    stashAsync: (formData: Record<string, unknown>) => Promise<unknown>;
    stashLoading: boolean;
};
export {};
