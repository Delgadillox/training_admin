import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { router } from "./routes";

const browserRouter = createBrowserRouter(router, {
  basename: "/admin",
});
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={browserRouter} />
  </React.StrictMode>
);
