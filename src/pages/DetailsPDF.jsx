import React, { useState, useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ColorModal from "../components/Reportes/Modals/ColorModal";
import PieChart from "../components/PieChart";
import BarChart3D from "../components/Reportes/BarChart3D";
import logo from "../assets/logo.jpg";

const DetailsPDF = () => {
  const [data, setData] = useState(null);
  const [groups, setGroups] = useState([]);
  const [showPrintButton, setShowPrintButton] = useState(true);
  const [showColorModal, setShowColorModal] = useState(false);
  const [colors, setColors] = useState([
    "#008f39",
    "#e6cc00",
    "#ff0000",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ]);
  const [chartType, setChartType] = useState("pie"); // Nueva variable de estado para el tipo de gráfico

  useEffect(() => {
    if (!showPrintButton) {
      window.print();
      setTimeout(() => {
        setShowPrintButton(true);
      }, 500);
    }
  }, [showPrintButton]);

  useEffect(() => {
    const storedData = localStorage.getItem("groupPdfData");
    if (storedData) {
      const { data, groups } = JSON.parse(storedData);
      setData(data);
      setGroups(groups);
    }
  }, []);

  const handlePrint = () => {
    setShowPrintButton(false);
  };

  const handleColorChange = (index, event) => {
    const newColors = [...colors];
    newColors[index] = event.target.value;
    setColors(newColors);
  };

  if (!data) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {showPrintButton && (
        <>
          <IconButton style={styles.printButton} onClick={handlePrint}>
            <PrintIcon />
          </IconButton>
          <Button
            style={styles.colorButton}
            onClick={() => setShowColorModal(true)}
          >
            Cambiar colores del gráfico
          </Button>
          {/* <Button
            style={styles.chartTypeButton}
            onClick={() => setChartType(chartType === "pie" ? "bar" : "pie")}
          >
            {chartType === "pie"
              ? "Ver Gráfico de Barras"
              : "Ver Gráfico de Pastel"}
          </Button> */}
        </>
      )}
      <div style={styles.document}>
        {groups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <h1 style={styles.title}>{group.name}</h1>
            {group.questions.map((q, questionIndex) => {
              const questionData = data.questions.find(
                (gq) => gq.question === q
              );
              if (!questionData) return null;
              return (
                <div key={questionData.id}>
                  <h2 style={styles.subtitle}>{questionData.question}</h2>
                  <div style={styles.section}>
                    <div style={styles.chartContainer}>
                      {chartType === "pie" ? (
                        <PieChart
                          responses={questionData.responses}
                          colors={colors}
                        />
                      ) : (
                        <BarChart3D
                          responses={questionData.responses}
                          colors={colors}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
        {data.comments && (
          <div style={styles.commentsSection}>
            <h1 style={styles.commentsTitle}>Comentarios</h1>
            <p style={styles.comment}>{data.comments}</p>
          </div>
        )}
      </div>
      <div style={styles.footer}>
        <img src={logo} alt="Footer" style={styles.footerImage} />
      </div>
      <ColorModal
        open={showColorModal}
        handleClose={() => setShowColorModal(false)}
        colors={colors}
        handleColorChange={handleColorChange}
      />
    </>
  );
};

const styles = {
  document: {
    flexDirection: "column",
    padding: "20px",
  },
  section: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
    pageBreakInside: "avoid",
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: "22px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "bold",
    color: "#333",
    paddingBottom: "5px",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "15px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "bold",
    color: "#333",
    paddingBottom: "5px",
  },
  chartContainer: {
    margin: "0 auto",
    height: "302px",
  },
  printButton: {
    position: "absolute",
    left: "10px",
    top: "10px",
    zIndex: 1000,
    "@media print": {
      display: "none",
    },
  },
  colorButton: {
    position: "absolute",
    right: "10px",
    top: "10px",
    zIndex: 1000,
    "@media print": {
      display: "none",
    },
  },
  chartTypeButton: {
    position: "absolute",
    right: "10px",
    top: "50px",
    zIndex: 1000,
    "@media print": {
      display: "none",
    },
  },
  commentsSection: {
    marginTop: "20px",
    padding: "10px",
    borderTop: "1px solid #ddd",
  },
  commentsTitle: {
    textAlign: "center",
    fontSize: "20px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  comment: {
    padding: "10px",
    fontSize: "16px",
    fontFamily: "Roboto, sans-serif",
    color: "#555",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    textAlign: "right",
    zIndex: -1,
  },
  footerImage: {
    width: "250px",
    height: "auto",
  },
  "@media print": {
    section: {
      pageBreakAfter: "always",
      height: "50vh",
    },
    "section:nth-of-type(2n+1)": {
      pageBreakAfter: "always",
    },
    "section:nth-of-type(2n)": {
      pageBreakAfter: "auto",
    },
    printButton: {
      display: "none",
    },
    colorButton: {
      display: "none",
    },
    chartTypeButton: {
      display: "none",
    },
    footer: {
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      textAlign: "center",
      zIndex: -1,
    },
  },
};

export default DetailsPDF;
