import Layout from "./components/Layout";
import { CustomRouter } from "./types";

export const router: CustomRouter[] = [
  {
    path: "/",
    children: [],
    element: <Layout />,
  },
];
