import React from 'react';
import type { NormalizedProEditPageProps } from '../hooks/use-props';
export type InnerContextValue = {
    propsRef: React.MutableRefObject<NormalizedProEditPageProps>;
};
export declare function InnerProvider(props: React.PropsWithChildren<{
    value: InnerContextValue;
}>): import("react/jsx-runtime").JSX.Element;
export declare function useInnerContext(): InnerContextValue;
