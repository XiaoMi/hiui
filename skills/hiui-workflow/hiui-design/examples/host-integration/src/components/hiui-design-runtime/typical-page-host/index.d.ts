import type { ComponentType, PropsWithChildren, ReactNode } from 'react';
export type TypicalPagePortalProps = {
    children: ReactNode;
};
export type TypicalPagePortalComponent = ComponentType<TypicalPagePortalProps>;
export type TypicalPageOverlayContainerResolver = () => HTMLElement | null;
type TypicalPageHostContextValue = {
    HeaderPortal: TypicalPagePortalComponent;
    FooterPortal: TypicalPagePortalComponent;
    getOverlayContainer: TypicalPageOverlayContainerResolver;
};
export type TypicalPageHostProviderProps = PropsWithChildren<{
    headerPortal?: TypicalPagePortalComponent;
    footerPortal?: TypicalPagePortalComponent;
    getOverlayContainer?: TypicalPageOverlayContainerResolver;
}>;
export declare function TypicalPageHostProvider({ children, headerPortal, footerPortal, getOverlayContainer, }: TypicalPageHostProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useTypicalPageHost(): TypicalPageHostContextValue;
export declare function TypicalPageHeaderPortal({ children }: TypicalPagePortalProps): import("react/jsx-runtime").JSX.Element;
export declare function TypicalPageFooterPortal({ children }: TypicalPagePortalProps): import("react/jsx-runtime").JSX.Element;
export declare function useTypicalPageOverlayContainer(): HTMLElement | null;
export declare function resolveTypicalPageOverlayContainer(): HTMLElement | null;
export {};
