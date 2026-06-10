import type { ComponentType, PropsWithChildren, ReactNode } from 'react';
export type TypicalPagePortalProps = {
    children: ReactNode;
};
export type TypicalPagePortalComponent = ComponentType<TypicalPagePortalProps>;
type TypicalPageHostContextValue = {
    HeaderPortal: TypicalPagePortalComponent;
    FooterPortal: TypicalPagePortalComponent;
};
export type TypicalPageHostProviderProps = PropsWithChildren<{
    headerPortal?: TypicalPagePortalComponent;
    footerPortal?: TypicalPagePortalComponent;
}>;
export declare function TypicalPageHostProvider({ children, headerPortal, footerPortal, }: TypicalPageHostProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useTypicalPageHost(): TypicalPageHostContextValue;
export declare function TypicalPageHeaderPortal({ children }: TypicalPagePortalProps): import("react/jsx-runtime").JSX.Element;
export declare function TypicalPageFooterPortal({ children }: TypicalPagePortalProps): import("react/jsx-runtime").JSX.Element;
export {};
