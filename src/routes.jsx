import Layout from "./components/Layout";
import Home from "./pages/Home";
import { New, List as ListQuizz } from "./pages/Encuestas/Index";
import { Create, List } from "./pages/Reportes/Index";
import { Companies } from "./pages/Admin/Index";
import PDFView from "./pages/PDFView";
import GroupPDF from "./pages/GroupPDF";
import DetailsPDF from "./pages/DetailsPDF";
import DynamicView from "./pages/Reportes/DynamicView";

import {
  Home as HomeIcon,
  Assessment,
  CreateNewFolder,
  QuestionAnswer,
  Add,
  Summarize,
  GroupAdd,
  AdminPanelSettings,
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
        path: "/",
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
          {
            icon: <Summarize />,
            id: "Ver Encuestas",
            path: "/encuestas/ver",
            element: <ListQuizz />,
          },
        ],
      },
      {
        icon: <AdminPanelSettings />,
        id: "Admin",
        path: "/panel",
        children: [
          {
            icon: <GroupAdd />,
            id: "Registrar líder/empresa",
            path: "/panel/leaders",
            element: <Companies />,
          },
        ],
      },
    ],
  },
  {
    path: "/reporte",
    element: <PDFView />,
  },
  {
    path: "/reporteDinamico",
    element: <DynamicView />,
  },
  {
    path: "/group-pdf",
    element: <GroupPDF />,
  },
  {
    path: "/details-pdf",
    element: <DetailsPDF />,
  },
];
