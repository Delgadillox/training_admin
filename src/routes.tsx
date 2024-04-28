import Layout from "./components/Layout";
import { CustomRouter } from "./types";
import Home from "./pages/Home";
import { New } from "./pages/Encuestas/Index";
import { Create, List } from "./pages/Reportes/Index";
import PDFView from "./pages/PDFView";

import {
  Home as HomeIcon,
  Assessment,
  CreateNewFolder,
  QuestionAnswer,
  Add,
  Summarize,
} from "@mui/icons-material";

export const router: CustomRouter[] = [
  {
    title: "Layout",
    path: "/admin/",
    element: <Layout />,
    children: [
      {
        icon: <HomeIcon />,
        id: "Inicio",
        index: true,
        element: <Home />,
      },
      {
        icon: <Assessment />,
        id: "Reportes",
        path: "/admin/reportes",
        children: [
          {
            icon: <Summarize />,
            id: "Ver Reportes",
            path: "/admin/reportes/ver",
            element: <List />,
          },
          {
            icon: <CreateNewFolder />,
            id: "Guardar Reporte",
            path: "/admin/reportes/generar",
            element: <Create />,
          },
        ],
      },
      {
        icon: <QuestionAnswer />,
        id: "Encuestas",
        path: "/admin/encuestas",
        children: [
          {
            icon: <Add />,
            id: "Nueva Encuesta",
            path: "/admin/encuestas/nueva",
            element: <New />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin/reporte",
    element: <PDFView />,
  },
];
