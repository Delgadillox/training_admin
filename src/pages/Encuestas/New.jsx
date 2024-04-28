import { useState } from "react";
import {
  Divider,
  Grid,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "../../styles/newQuizz.css";
import Form from "../../components/Encuestas/Form";
import axios from "axios";

function New() {
  const initialQuestion = { id: 1, question: "", options: [""] };
  const [questions, setQuestions] = useState([initialQuestion]);
  const [deleteConfirmationIndex, setDeleteConfirmationIndex] = useState(null);
  const [lastQuestionId, setLastQuestionId] = useState(1);
  const [title, setTitle] = useState("");

  const handleAddQuestion = () => {
    const newQuestionId = lastQuestionId + 1;
    setQuestions([
      ...questions,
      { id: newQuestionId, question: "", options: [""] },
    ]);
    setLastQuestionId(newQuestionId);
  };

  const handleRemoveQuestion = (index) => {
    setDeleteConfirmationIndex(index);
  };

  const handleConfirmRemoveQuestion = () => {
    const newQuestions = [...questions];
    newQuestions.splice(deleteConfirmationIndex, 1);
    setQuestions(newQuestions);
    setDeleteConfirmationIndex(null);
  };

  const handleCancelRemoveQuestion = () => {
    setDeleteConfirmationIndex(null);
  };

  const handleQuestionChange = (id, value) => {
    const newQuestions = [...questions];
    const index = newQuestions.findIndex((question) => question.id === id);
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (id) => {
    const newQuestions = [...questions];
    const index = newQuestions.findIndex((question) => question.id === id);
    newQuestions[index].options.push("");
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (questionId, optionIndex) => {
    const newQuestions = [...questions];
    const index = newQuestions.findIndex(
      (question) => question.id === questionId
    );
    newQuestions[index].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionId, optionIndex, value) => {
    const newQuestions = [...questions];
    const index = newQuestions.findIndex(
      (question) => question.id === questionId
    );
    newQuestions[index].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleConfirmSurvey = async () => {
    const isTitleValid = title.trim() !== "";
    const areQuestionsValid = questions.every((question) => {
      return (
        question.question.trim() !== "" &&
        question.options.every((option) => option.trim() !== "")
      );
    });

    if (isTitleValid && areQuestionsValid) {
      const payload = {
        title,
        questions,
      };
      const res = await axios.post(
        "https://psicologia-aplicada.com/quizz/psicologia-api/quizz/save.php",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      window.alert("Encuesta creada exitosamente");
      //clearForm();
    } else {
      console.error("Encuesta no válida");
      window.alert(
        "Por favor, asegúrate de que el título de la encuesta, todas las preguntas y opciones de respuesta tengan texto."
      );
    }
  };

  const clearForm = () => {
    setQuestions([initialQuestion]);
    setDeleteConfirmationIndex(null);
    setLastQuestionId(1);
    setTitle("");
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Crear Nueva Encuesta</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Título de la Encuesta"
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </Grid>

        <Form
          questions={questions}
          handleAddOption={handleAddOption}
          handleOptionChange={handleOptionChange}
          handleQuestionChange={handleQuestionChange}
          handleRemoveOption={handleRemoveOption}
          handleRemoveQuestion={handleRemoveQuestion}
        />

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddQuestion}
          >
            Agregar Pregunta
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleConfirmSurvey}
          >
            Crear Encuesta
          </Button>
        </Grid>
      </Grid>

      <Dialog
        open={deleteConfirmationIndex !== null}
        onClose={handleCancelRemoveQuestion}
      >
        <DialogTitle>
          ¿Estás seguro que deseas eliminar esta pregunta?
        </DialogTitle>
        <DialogContent>
          Esta acción eliminará permanentemente la pregunta y todas sus opciones
          de respuesta.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRemoveQuestion} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmRemoveQuestion} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
export default New;
