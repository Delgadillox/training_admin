// src/components/Encuestas/SurveyList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

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

  const handleDelete = async () => {
    try {
      const call = await axios.post(
        "https://psicologia-aplicada.com/quizz/psicologia-api/api/deletePlant.php",
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
      console.error("Error al eliminar la empresa:", error);
      window.alert("Ha ocurrido un error, por favor contacta al administrador");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lista de Encuestas</h1>
      <ul style={styles.list}>
        {surveys.map((survey) => (
          <li key={survey.id} style={styles.listItem}>
            <span>{survey.titulo}</span>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleClickOpen(survey.id)}
              style={styles.deleteButton}
            >
              <DeleteIcon />
            </Button>
          </li>
        ))}
      </ul>
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
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  deleteButton: {
    marginLeft: "10px",
  },
};

export default SurveyList;
