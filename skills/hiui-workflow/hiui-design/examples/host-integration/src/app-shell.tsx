import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TypicalPageHostBridge } from "./components/layout/typical-page-host";
import {
  LayoutContentProvider,
  type LayoutContentContextValue,
} from "./components/layout/layout-content-context";
import "./host-reset.css";

export function ExampleAppShell({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef(title);
  const [headerNode, setHeaderNode] = useState<HTMLDivElement | null>(null);
  const [footerNode, setFooterNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    titleTextRef.current = title;
  }, [title]);

  const setHeaderSlotNode = useCallback((node: HTMLDivElement | null) => {
    headerRef.current = node;
    setHeaderNode(node);
  }, []);

  const setFooterSlotNode = useCallback((node: HTMLDivElement | null) => {
    footerRef.current = node;
    setFooterNode(node);
  }, []);

  const ctxValue = useMemo<LayoutContentContextValue>(
    () => ({
      headerNode,
      headerRef,
      footerNode,
      footerRef,
      titleText: title,
      titleTextRef,
    }),
    [footerNode, headerNode, title],
  );

  return (
    <LayoutContentProvider value={ctxValue}>
      <TypicalPageHostBridge>
        <div
          data-typical-page-host=""
          style={{
            width: "100%",
            minWidth: 0,
            height: "100vh",
            minHeight: "100vh",
            background: "#f5f8fc",
            display: "flex",
            flexDirection: "column",
            fontSize: 14,
            lineHeight: "22px",
            color: "#1a1d26",
          }}
        >
          <div
            ref={setHeaderSlotNode}
            style={{
              flex: "0 0 auto",
              width: "100%",
              minWidth: 0,
              minHeight: 60,
              display: "flex",
              alignItems: "center",
              fontSize: 14,
              lineHeight: "22px",
              color: "#1a1d26",
            }}
          />
          <div
            style={{
              flex: "1 1 0%",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                flex: "1 1 0%",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {children}
            </div>
          </div>
          <div
            ref={setFooterSlotNode}
            style={{
              flex: "0 0 auto",
              fontSize: 14,
              lineHeight: "22px",
              color: "#1a1d26",
            }}
          />
        </div>
      </TypicalPageHostBridge>
    </LayoutContentProvider>
  );
}
