import type { ComponentProps, ReactNode } from 'react';
import { Drawer } from '@hi-ui/hiui';
export type ProDetailDrawerProps = ComponentProps<typeof Drawer> & {
    bodyClassName?: string;
};
export declare function ProDetailDrawer({ className, bodyClassName, children, ...drawerProps }: ProDetailDrawerProps): import("react/jsx-runtime").JSX.Element;
export declare function ProDetailDrawerBody({ className, children, }: {
    className?: string;
    children?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare const proDetailDrawerStyles: Record<string, string>;
