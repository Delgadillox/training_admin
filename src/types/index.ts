import { RouteObject } from "react-router-dom";
// En ./types/index.ts
export interface CustomRouter {
  title?: string;
  path: string;
  element: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  index?: boolean;
  children?: CustomRouter[];
}

export type CustomRouteObject = {
  icon: JSX.Element;
  children?: CustomRouteObject[];
} & RouteObject;