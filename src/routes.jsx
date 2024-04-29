import Layout from "./components/Layout";
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

export const router = [
  {
    title: "Layout",
    path: "/",
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
        path: "/reportes",
        children: [
          {
            icon: <Summarize />,
            id: "Ver Reportes",
            path: "/reportes/ver",
            element: <List />,
          },
          {
            icon: <CreateNewFolder />,
            id: "Guardar Reporte",
            path: "/reportes/generar",
            element: <Create />,
          },
        ],
      },
      {
        icon: <QuestionAnswer />,
        id: "Encuestas",
        path: "/encuestas",
        children: [
          {
            icon: <Add />,
            id: "Nueva Encuesta",
            path: "/encuestas/nueva",
            element: <New />,
          },
        ],
      },
    ],
  },
  {
    path: "/reporte",
    element: <PDFView />,
  }
];
