import { useState, useEffect } from "react";
import PieChart from "./PieChart";
import { transformDateHour } from "../utils";
import PrintIcon from "@mui/icons-material/Print";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ColorModal from "./Reportes/Modals/ColorModal";
import GroupModal from "./Reportes/Modals/GroupModal";

const PdfDocument = ({ data }) => {
  const [showPrintButton, setShowPrintButton] = useState(true);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [colors, setColors] = useState([
    "#008f39",
    "#e6cc00",
    "#ff0000",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!showPrintButton) {
      window.print();
      setTimeout(() => {
        setShowPrintButton(true);
      }, 500);
    }
  }, [showPrintButton]);

  const handlePrint = () => {
    setShowPrintButton(false);
  };

  const handleOpenColorModal = () => {
    setShowColorModal(true);
  };

  const handleColorChange = (index, event) => {
    const newColors = [...colors];
    newColors[index] = event.target.value;
    setColors(newColors);
  };

  const handleGroupCreation = (newGroups) => {
    setGroups(newGroups);
    console.log(newGroups);
    localStorage.setItem(
      "groupPdfData",
      JSON.stringify({ data, groups: newGroups })
    );
    window.open("/admin/group-pdf", "_blank");
  };

  return (
    <>
      {showPrintButton && (
        <>
          <IconButton style={styles.printButton} onClick={handlePrint}>
            <PrintIcon />
          </IconButton>
          <Button style={styles.colorButton} onClick={handleOpenColorModal}>
            Cambiar colores del gráfico
          </Button>
          <Button
            style={styles.groupButton}
            onClick={() => setShowGroupModal(true)}
          >
            Crear Grupos
          </Button>
        </>
      )}
      <div style={styles.document}>
        <h1 style={styles.title}>{data.name}</h1>
        {data.company && <h2 style={styles.subtitle}>{data.company}</h2>}
        {data.leader && <h2 style={styles.subtitle}>{data.leader}</h2>}

        {data.questions.map((question) => (
          <div key={question.id} style={styles.section}>
            <h2 style={styles.title}>{question.question}</h2>
            <div style={styles.chartContainer}>
              <PieChart
                key={question.id}
                responses={question.responses}
                colors={colors}
              />
            </div>
          </div>
        ))}

        {data.comments && (
          <div style={styles.commentsSection}>
            <h1 style={styles.commentsTitle}>Comentarios</h1>
            <p style={styles.comment}>{data.comments}</p>
          </div>
        )}
      </div>
      <ColorModal
        open={showColorModal}
        handleClose={() => setShowColorModal(false)}
        colors={colors}
        handleColorChange={handleColorChange}
      />

      <GroupModal
        open={showGroupModal}
        handleClose={() => setShowGroupModal(false)}
        questions={data.questions.map((q) => q.question)}
        handleGroupCreation={handleGroupCreation}
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
    fontSize: "18px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "normal",
    color: "#555",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
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
  groupButton: {
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
    groupButton: {
      display: "none",
    },
  },
};

export default PdfDocument;
