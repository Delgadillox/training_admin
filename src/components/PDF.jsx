import { useState, useEffect } from "react";
import PieChart from "./PieChart";
import { transformDateHour } from "../utils";
import PrintIcon from "@mui/icons-material/Print";
import IconButton from "@mui/material/IconButton";

const PdfDocument = ({ data }) => {
  const [showPrintButton, setShowPrintButton] = useState(true);

  useEffect(() => {
    if (!showPrintButton) {
      window.print();
      setTimeout(() => {
        setShowPrintButton(true); // Restablecer el botón para que se muestre después de imprimir
      }, 500);
    }
  }, [showPrintButton]);

  const handlePrint = () => {
    setShowPrintButton(false);
  };

  return (
    <>
      {showPrintButton && (
        <IconButton style={styles.printButton} onClick={handlePrint}>
          <PrintIcon />
        </IconButton>
      )}
      <div style={styles.document}>
        <h1 style={styles.title}>{data.name}</h1>
        {data.company && <h2 style={styles.subtitle}>{data.company}</h2>}
        {data.leader && <h2 style={styles.subtitle}>{data.leader}</h2>}

        {data.questions.map((question) => (
          <div key={question.id} style={styles.section}>
            <h2 style={styles.title}>{question.question}</h2>
            <div style={styles.chartContainer}>
              <PieChart key={question.id} responses={question.responses} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const styles = {
  document: {
    flexDirection: "column",
  },
  section: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px", // Espacio entre secciones
    pageBreakInside: "avoid", // Evita cortes dentro de la sección
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: "22px", // más grande para destacar
    fontFamily: "Roboto, sans-serif",
    fontWeight: "bold",
    color: "#333",
    paddingBottom: "5px",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "18px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "normal",
    color: "#555",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  },
  chartContainer: {
    margin: "0 auto", // Centra el gráfico
    height: "302px",
  },
  printButton: {
    position: "absolute", // Cambio de 'display' a 'position'
    left: "10px", // Posición desde la izquierda
    top: "10px", // Posición desde la parte superior
    zIndex: 1000, // Asegura que esté sobre otros elementos
    "@media print": {
      display: "none",
    },
  },
  "@media print": {
    section: {
      pageBreakAfter: "always", // Inserta un salto de página después de cada sección
      height: "50vh", // Asegura que cada sección use solo la mitad de la página verticalmente
    },
    // Esconde el tercer elemento y siguientes pares para evitar que aparezcan en la misma página
    "section:nth-of-type(2n+1)": {
      pageBreakAfter: "always",
    },
    "section:nth-of-type(2n)": {
      pageBreakAfter: "auto",
    },
    printButton: {
      display: "none", // Oculta el botón de impresión en el modo de impresión
    },
  },
};

export default PdfDocument;
