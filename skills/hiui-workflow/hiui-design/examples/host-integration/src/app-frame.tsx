import React from "react";
import type { ReactNode } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { PromptCopyFloatingButton } from "./components/prompt-copy-floating-button";
import {
  type AppRouteLike as CoreAppRouteLike,
  type ShellOptions,
  TypicalPageAppFrameCore,
} from "./app-frame-core";
import { stripRouteBasePath } from "./route-base-path";

export type AppRouteLike = Omit<CoreAppRouteLike, "children"> & {
  examplePrompt?: string;
  children?: AppRouteLike[];
};

export type { ShellOptions } from "./app-frame-core";

function normalizeRoutePath(path: string | undefined) {
  if (!path) return "";
  if (path === "/") return "/";

  return path.replace(/\/+/g, "/").replace(/^\/+|\/+$/g, "");
}

function joinRoutePath(parentPath: string, routePath: string | undefined) {
  const parent = normalizeRoutePath(parentPath);
  const seg = normalizeRoutePath(routePath);

  if (seg === "/") return parent || "/";
  if (!parent || parent === "/") return seg || parent;
  if (!seg) return parent;

  return `${parent}/${seg}`;
}

function normalizeLocationPath(path: string) {
  const normalized = normalizeRoutePath(path);

  return normalized || "/";
}

function findRoutePrompt(
  routes: AppRouteLike[],
  path: string,
  parentPath = "",
): string | null {
  const normalizedPath = normalizeLocationPath(path);
  const pathname = normalizedPath === "/" ? "/" : `/${normalizedPath}`;

  for (const route of routes) {
    const currentPath = joinRoutePath(parentPath, route.path || "");

    if (
      currentPath === normalizedPath ||
      (normalizedPath === "/" && currentPath === "/")
    ) {
      return route.examplePrompt ?? null;
    }

    const pattern = currentPath === "/" ? "/" : `/${currentPath}`;
    const matched =
      currentPath && matchPath({ path: pattern, end: true }, pathname);
    if (matched) {
      return route.examplePrompt ?? null;
    }

    if (route.children?.length) {
      const childPrompt = findRoutePrompt(
        route.children,
        normalizedPath,
        currentPath,
      );
      if (childPrompt) {
        return childPrompt;
      }
    }
  }

  return null;
}

type TypicalPageAppFrameProps = {
  routes: AppRouteLike[];
  children: ReactNode;
  shellOptions?: ShellOptions;
};

export function TypicalPageAppFrame({
  routes,
  children,
  shellOptions,
}: TypicalPageAppFrameProps) {
  const location = useLocation();
  const currentPath = stripRouteBasePath(
    location.pathname,
    shellOptions?.routeBasePath,
  );
  const examplePrompt = findRoutePrompt(routes, currentPath || "/");
  const overlaySlot = examplePrompt ? (
    <PromptCopyFloatingButton prompt={examplePrompt} />
  ) : null;

  return (
    <TypicalPageAppFrameCore
      routes={routes}
      shellOptions={shellOptions}
      overlaySlot={overlaySlot}
    >
      {children}
    </TypicalPageAppFrameCore>
  );
}
