import React from "react";
import styles from "./index.module.scss";
import { getDefaultSharedHeaderNode } from "./shared-header-node";

export type SharedHostHeaderSuppressCleanup = () => void;

export type SharedHostHeaderAdapter = {
  getHeaderNode?: () => HTMLElement | null;
  suppress?: (node: HTMLElement) => SharedHostHeaderSuppressCleanup | void;
};

export type PageOwnedMountBoundaryProps = React.PropsWithChildren<{
  adapter?: SharedHostHeaderAdapter;
  suppressSharedHeader?: boolean;
  className?: string;
}>;

const useSafeLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
const MIN_HOST_INLINE_GUTTER_PX = 16;
const MAX_HOST_GUTTER_PROBE_DEPTH = 6;
const HOST_INLINE_GUTTER_CONTRACT_VAR = "--hiui-content-inline-gutter";
const EXPLICIT_CONTENT_OUTLET_SELECTORS = [
  '[data-hiui-main-content-outlet="true"]',
  '[data-hiui-managed-host-shell="true"]',
];
const LEGACY_CONTENT_OUTLET_SELECTORS = ['[role="content"]', '[role="main-content"]'];

function getBoundaryViewportHeight() {
  if (typeof window === "undefined") return 0;

  const visualViewportHeight = Number(window.visualViewport?.height || 0);
  if (visualViewportHeight > 0) {
    return visualViewportHeight;
  }

  const innerHeight = Number(window.innerHeight || 0);
  if (innerHeight > 0) {
    return innerHeight;
  }

  return Number(document.documentElement?.clientHeight || 0);
}

function readPixelValue(rawValue: string | null | undefined) {
  const nextValue = Number.parseFloat(String(rawValue || ""));
  return Number.isFinite(nextValue) ? nextValue : 0;
}

function readElementInlineGutter(node: HTMLElement | null) {
  if (
    !node ||
    typeof window === "undefined" ||
    typeof window.getComputedStyle !== "function"
  ) {
    return 0;
  }

  const computedStyle = window.getComputedStyle(node);
  const contractInlineGutter = readPixelValue(
    computedStyle.getPropertyValue(HOST_INLINE_GUTTER_CONTRACT_VAR),
  );
  const paddingInlineEnd = readPixelValue(
    computedStyle.paddingInlineEnd || computedStyle.paddingRight,
  );
  const marginInlineEnd = readPixelValue(
    computedStyle.marginInlineEnd || computedStyle.marginRight,
  );

  return Math.max(contractInlineGutter, paddingInlineEnd, marginInlineEnd);
}

function findNearestManagedContentOutlet(boundaryNode: HTMLElement | null) {
  if (!boundaryNode || typeof boundaryNode.closest !== "function") {
    return null;
  }

  for (const selector of EXPLICIT_CONTENT_OUTLET_SELECTORS) {
    const matchedNode = boundaryNode.closest(selector);
    if (matchedNode instanceof HTMLElement) {
      return matchedNode;
    }
  }

  for (const selector of LEGACY_CONTENT_OUTLET_SELECTORS) {
    const matchedNode = boundaryNode.closest(selector);
    if (matchedNode instanceof HTMLElement) {
      return matchedNode;
    }
  }

  return null;
}

function hasSufficientHostInlineGutter(boundaryNode: HTMLElement | null) {
  const managedContentOutlet = findNearestManagedContentOutlet(boundaryNode);
  if (managedContentOutlet) {
    return (
      readElementInlineGutter(managedContentOutlet) >= MIN_HOST_INLINE_GUTTER_PX
    );
  }

  let candidate = boundaryNode?.parentElement || null;
  let depth = 0;

  while (candidate && depth < MAX_HOST_GUTTER_PROBE_DEPTH) {
    if (readElementInlineGutter(candidate) >= MIN_HOST_INLINE_GUTTER_PX) {
      return true;
    }

    candidate = candidate.parentElement;
    depth += 1;
  }

  return false;
}

function joinClassNames(...tokens: Array<string | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function defaultSuppressSharedHeader(
  node: HTMLElement,
): SharedHostHeaderSuppressCleanup {
  const previous = {
    ariaHidden: node.getAttribute("aria-hidden"),
    display: node.style.display,
    height: node.style.height,
    minHeight: node.style.minHeight,
    overflow: node.style.overflow,
    pointerEvents: node.style.pointerEvents,
  };

  node.setAttribute("aria-hidden", "true");
  node.setAttribute("data-page-owned-header-suppressed", "true");
  node.style.display = "none";
  node.style.height = "0";
  node.style.minHeight = "0";
  node.style.overflow = "hidden";
  node.style.pointerEvents = "none";

  return () => {
    if (previous.ariaHidden == null) {
      node.removeAttribute("aria-hidden");
    } else {
      node.setAttribute("aria-hidden", previous.ariaHidden);
    }
    node.removeAttribute("data-page-owned-header-suppressed");
    node.style.display = previous.display;
    node.style.height = previous.height;
    node.style.minHeight = previous.minHeight;
    node.style.overflow = previous.overflow;
    node.style.pointerEvents = previous.pointerEvents;
  };
}

export function useSharedHostHeaderSuppression(
  adapter?: SharedHostHeaderAdapter,
  enabled = true,
  boundaryRef?: React.RefObject<HTMLElement | null>,
) {
  useSafeLayoutEffect(() => {
    if (!enabled) return undefined;

    const resolvedAdapter = adapter || {
      getHeaderNode: () =>
        getDefaultSharedHeaderNode(boundaryRef?.current || null),
      suppress: defaultSuppressSharedHeader,
    };
    const headerNode = resolvedAdapter.getHeaderNode?.();
    if (!headerNode) return undefined;

    const cleanup =
      resolvedAdapter.suppress?.(headerNode) ||
      defaultSuppressSharedHeader(headerNode);
    return typeof cleanup === "function" ? cleanup : undefined;
  }, [adapter, boundaryRef, enabled]);
}

export function useMountRegionFill(className = "") {
  return joinClassNames(styles.mountBoundary, className);
}

function writeMountBoundaryInlineGutter(boundaryNode: HTMLElement | null) {
  if (!boundaryNode) return;

  if (hasSufficientHostInlineGutter(boundaryNode)) {
    boundaryNode.setAttribute("data-page-owned-inline-gutter-source", "host");
    boundaryNode.style.setProperty("--page-owned-inline-gutter", "0px");
    return;
  }

  boundaryNode.setAttribute("data-page-owned-inline-gutter-source", "fallback");
  boundaryNode.style.setProperty(
    "--page-owned-inline-gutter",
    `${MIN_HOST_INLINE_GUTTER_PX}px`,
  );
}

function writeMountBoundaryViewportHeight(boundaryNode: HTMLElement | null) {
  if (!boundaryNode) return;

  const viewportHeight = getBoundaryViewportHeight();
  if (!(viewportHeight > 0)) return;

  const rect = boundaryNode.getBoundingClientRect();
  const topOffset = Math.max(rect.top, 0);
  const availableHeight = Math.max(0, Math.round(viewportHeight - topOffset));

  if (availableHeight > 0) {
    boundaryNode.style.setProperty(
      "--page-owned-available-height",
      `${availableHeight}px`,
    );
    return;
  }

  boundaryNode.style.removeProperty("--page-owned-available-height");
}

export function useMountBoundaryViewportHeight(
  boundaryRef: React.RefObject<HTMLElement | null>,
  enabled = true,
) {
  useSafeLayoutEffect(() => {
    if (!enabled || typeof window === "undefined") return undefined;

    const boundaryNode = boundaryRef.current;
    if (!boundaryNode) return undefined;

    let frameId = 0;
    const scheduleUpdate = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        writeMountBoundaryViewportHeight(boundaryNode);
        writeMountBoundaryInlineGutter(boundaryNode);
      });
    };

    scheduleUpdate();

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            scheduleUpdate();
          });
    resizeObserver?.observe(boundaryNode);
    if (boundaryNode.parentElement) {
      resizeObserver?.observe(boundaryNode.parentElement);
    }

    const visualViewport = window.visualViewport;
    const listenerOptions = false;
    window.addEventListener("resize", scheduleUpdate, listenerOptions);
    window.addEventListener(
      "orientationchange",
      scheduleUpdate,
      listenerOptions,
    );
    window.addEventListener("scroll", scheduleUpdate, listenerOptions);
    visualViewport?.addEventListener("resize", scheduleUpdate, listenerOptions);
    visualViewport?.addEventListener("scroll", scheduleUpdate, listenerOptions);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleUpdate, listenerOptions);
      window.removeEventListener(
        "orientationchange",
        scheduleUpdate,
        listenerOptions,
      );
      window.removeEventListener("scroll", scheduleUpdate, listenerOptions);
      visualViewport?.removeEventListener(
        "resize",
        scheduleUpdate,
        listenerOptions,
      );
      visualViewport?.removeEventListener(
        "scroll",
        scheduleUpdate,
        listenerOptions,
      );
      boundaryNode.style.removeProperty("--page-owned-available-height");
      boundaryNode.style.removeProperty("--page-owned-inline-gutter");
      boundaryNode.removeAttribute("data-page-owned-inline-gutter-source");
    };
  }, [boundaryRef, enabled]);
}

export function PageOwnedMountBoundary({
  adapter,
  suppressSharedHeader = true,
  className,
  children,
}: PageOwnedMountBoundaryProps) {
  const boundaryRef = React.useRef<HTMLDivElement>(null);
  useSharedHostHeaderSuppression(adapter, suppressSharedHeader, boundaryRef);
  useMountBoundaryViewportHeight(boundaryRef);
  const boundaryClassName = useMountRegionFill(className);

  return (
    <div
      ref={boundaryRef}
      className={boundaryClassName}
      data-page-owned-mount-boundary="true"
    >
      {children}
    </div>
  );
}
