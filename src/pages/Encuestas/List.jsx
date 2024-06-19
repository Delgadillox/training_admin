// src/components/Encuestas/SurveyList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import LanguageIcon from "@mui/icons-material/Language";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import WebModal from "../../components/Encuestas/WebModal";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [openWebModal, setOpenWebModal] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get(
        "https://psicologia-aplicada.com/quizz/psicologia-api/quizz/getAll.php"
      );
      setSurveys(response.data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  const handleClickOpen = (id) => {
    setSelectedSurveyId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSurveyId(null);
  };

  const handleWebModalOpen = (survey) => {
    setSelectedSurvey(survey);
    setOpenWebModal(true);
  };

  const handleWebModalClose = () => {
    setOpenWebModal(false);
    setSelectedSurveyId(null);
  };

  const handleDelete = async () => {
    try {
      const call = await axios.post(
        "https://psicologia-aplicada.com/quizz/psicologia-api/quizz/deleteQuizz.php",
        {
          id: selectedSurveyId,
        }
      );
      const response = call.data;
      if (response.error) {
        return window.alert(response.errorMsg);
      }
      fetchSurveys();
      handleClose();
    } catch (error) {
      console.error("Error al eliminar la encuesta:", error);
      window.alert(
        "La encuesta se encuentra en uso actualmente, no se puede eliminar"
      );
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lista de Encuestas</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Título</th>
            <th style={styles.tableHeader}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((survey) => (
            <tr key={survey.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{survey.titulo}</td>
              <td style={styles.tableCell}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleWebModalOpen(survey)}
                  style={styles.button}
                >
                  <LanguageIcon />
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleClickOpen(survey.id)}
                  style={styles.button}
                >
                  <DeleteIcon />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Eliminación"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar esta encuesta? Esta acción no
            se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <WebModal
        open={openWebModal}
        handleClose={handleWebModalClose}
        selectedSurvey={selectedSurvey}
      />
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    borderBottom: "2px solid #ddd",
    padding: "10px",
    textAlign: "left",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
  },
  deleteButton: {
    marginLeft: "10px",
  },
};

export default SurveyList;
