import React from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { TypicalPageAppFrame } from "@preview/app-frame";
import typicalPagePreviewRoutes from "@preview/routes/config";

const previewRouteChildren = [
  {
    index: true,
    element: <Navigate to="table/common/basic" replace />,
  },
  ...typicalPagePreviewRoutes,
];

function PreviewHost() {
  return (
    <TypicalPageAppFrame routes={typicalPagePreviewRoutes}>
      <Outlet />
    </TypicalPageAppFrame>
  );
}

export default function App() {
  return useRoutes([
    {
      path: "/",
      element: <PreviewHost />,
      children: previewRouteChildren,
    },
  ]);
}
