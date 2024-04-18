import Layout from "./components/Layout";
import { CustomRouter } from "./types";
import Index from "./pages/Index";

export const router: CustomRouter[] = [
  {
    title: "Layout",
    path: "/admin/",
    element: <Layout />,
    children: [
      {
        id: "Inicio",
        path: "/admin/",
        index: true,
        element: <Index />,
      },
    ],
  },
];
