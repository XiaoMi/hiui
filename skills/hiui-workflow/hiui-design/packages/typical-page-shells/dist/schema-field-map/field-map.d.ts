import React from 'react';
import type { ProFieldMapType } from '@hi-ui/schema-fields';
export declare const typicalPageFieldMap: Partial<ProFieldMapType>;
export declare function useTypicalPageFieldMap(): ProFieldMapType;
type TypicalPageFieldMapProviderProps = React.PropsWithChildren<{
    fields?: Partial<ProFieldMapType>;
}>;
export declare function TypicalPageFieldMapProvider(props: TypicalPageFieldMapProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
