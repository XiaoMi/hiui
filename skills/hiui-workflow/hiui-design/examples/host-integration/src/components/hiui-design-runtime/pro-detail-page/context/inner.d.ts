import React from 'react';
import type { NormalizedProDetailPageProps } from '../hooks/use-props';
export type InnerContextValue = {
    propsRef: React.MutableRefObject<NormalizedProDetailPageProps>;
};
export declare function InnerProvider(props: React.PropsWithChildren<{
    value: InnerContextValue;
}>): import("react/jsx-runtime").JSX.Element;
/** 仅在 ProDetailPage 内部可用 */
export declare function useInnerContext(): InnerContextValue;
