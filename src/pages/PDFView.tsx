import surveyData from "./Reportes/test.json";
import PdfDocument from "../components/PDF";
import { useLocation } from "react-router-dom";

const PDFView = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  const selectedDate = query.get("selectedDate");
  const selectedCompany = query.get("selectedCompany");
  const selectedLeader = query.get("selectedLeader");
  const selectedTitle = query.get("selectedTitle");

  console.log(query)

  return <PdfDocument data={surveyData} />;
};
export default PDFView;
