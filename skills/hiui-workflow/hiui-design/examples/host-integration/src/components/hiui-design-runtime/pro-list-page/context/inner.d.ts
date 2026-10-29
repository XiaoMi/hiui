import React from 'react';
import type { NormalizedProListPageProps } from '../hooks/use-props';
export type InnerContextValue = {
    propsRef: React.MutableRefObject<NormalizedProListPageProps>;
};
export declare function InnerProvider(props: React.PropsWithChildren<{
    value: InnerContextValue;
}>): import("react/jsx-runtime").JSX.Element;
/** 仅在 EntryProvider 内部可用，外部调用返回 null */
export declare function useInnerContext(): InnerContextValue;
