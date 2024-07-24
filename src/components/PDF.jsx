import { useState, useEffect } from "react";
import PieChart from "./PieChart";
import PrintIcon from "@mui/icons-material/Print";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ColorModal from "./Reportes/Modals/ColorModal";
import GroupModal from "./Reportes/Modals/GroupModal";
import axios from "axios";
import logo from "../assets/logo.jpg";

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
  const [savedGroups, setSavedGroups] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const url = `https://psicologia-aplicada.com/quizz/psicologia-api/reports/getGroups.php?id=${data.id}`;
    fetch(url)
      .then((response) => response.json())
      .then((groups) => {
        let s = [];
        if (groups.length > 0) {
          s = JSON.parse(groups[0].grupo);
        }
        setSavedGroups(s);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      });
  }, []);

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

  const handleGroupCreation = (option, newGroups) => {
    setGroups(newGroups);

    const payload = {
      idEncuesta: data.id,
      groups: newGroups,
    };

    try {
      const response = axios.post(
        "https://psicologia-aplicada.com/quizz/psicologia-api/reports/insertupdateGroup.php",
        payload
      );
    } catch (e) {
      console.error(e.toString());
    }

    localStorage.setItem(
      "groupPdfData",
      JSON.stringify({ data, groups: newGroups })
    );
    if (option === 1) {
      window.open("/admin/details-pdf", "_blank");
    } else {
      window.open("/admin/group-pdf", "_blank");
    }
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
      <div style={styles.header}>
        <img src={logo} alt="Header Logo" style={styles.headerImage} />
      </div>
      <div style={styles.document}>
        <h1 style={styles.title}>{data.name}</h1>
        {data.company && <h2 style={styles.subtitle}>{data.company}</h2>}
        {data.leader && <h2 style={styles.subtitle}>{data.leader}</h2>}

        {data.questions.map((question, index) => (
          <div
            key={question.id}
            style={{
              ...styles.section,
              paddingTop: index !== 0 && index % 2 === 1 ? "70px" : "0px", // Aplica paddingTop a los índices 1, 3, 5, 7, etc.
            }}
          >
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
        groups={savedGroups}
        setGroups={setSavedGroups}
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
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    textAlign: "center",
    zIndex: 1,
  },
  headerImage: {
    width: "250px",
    height: "auto",
  },
};

export default PdfDocument;
