import type { ComponentProps, ReactNode } from 'react';
import { Drawer } from '@hi-ui/hiui';
import styles from './index.module.scss';
export type ProFormDrawerProps = ComponentProps<typeof Drawer> & {
    bodyClassName?: string;
};
export declare function ProFormDrawer({ className, bodyClassName, children, ...drawerProps }: ProFormDrawerProps): import("react/jsx-runtime").JSX.Element;
export declare function ProDrawerFooterActions({ className, children, }: {
    className?: string;
    children?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { styles as proFormDrawerStyles };
