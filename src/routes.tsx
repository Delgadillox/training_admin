import Layout from "./components/Layout";
import { CustomRouter } from "./types";
import Home from "./pages/Home";
import { New } from "./pages/Encuestas/Index";
import {
  Home as HomeIcon,
  Assessment,
  CreateNewFolder,
  QuestionAnswer,
  Add,
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
            icon: <CreateNewFolder />,
            id: "Generar reporte",
            path: "/admin/reportes/generar",
            element: <Home />,
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
];
