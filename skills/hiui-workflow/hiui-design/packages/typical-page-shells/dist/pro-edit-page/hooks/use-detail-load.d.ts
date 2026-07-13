import React from 'react';
import type { EnhancedFormHelpers } from '@hi-ui/schema-form';
import type { DetailRequestFn } from '../context/entry';
type UseDetailLoadParams = {
    detailRequest?: DetailRequestFn;
    formRef: React.RefObject<EnhancedFormHelpers>;
};
export declare function useLoadDetail(params: UseDetailLoadParams): {
    detailLoading: boolean;
};
export {};
