import { RouteObject } from "react-router-dom";
export type CustomRouter = {
  path: string;
  element: JSX.Element;
  children: RouteObject[];
};
