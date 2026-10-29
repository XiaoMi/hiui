import React from "react";
import { createPortal } from "react-dom";
import { useLayoutContentContext } from "./layout-content-context";

type SlotPortalProps = {
  children: React.ReactNode;
};

export function HostPageFooterPortal({ children }: SlotPortalProps) {
  const { footerNode } = useLayoutContentContext();

  const element = children as React.ReactElement;
  if (!React.isValidElement(element)) return null;
  if (!footerNode) return null;

  return createPortal(element, footerNode);
}
