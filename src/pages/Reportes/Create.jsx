import React, { useState } from "react";
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Create = () => {
  const [formData, setFormData] = useState({
    quizz: "",
    company: "",
    leader: "",
    responses: [],
    timestamp: null,
  });

  const [questions, setQuestions] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleQuizzChange = (event) => {
    const selectedQuizz = event.target.value;
    const dummyQuestions = [
      {
        id: 1,
        question: "¿Cómo calificaría nuestro servicio?",
        options: ["Excelente", "Bueno", "Regular", "Malo"],
      },
      {
        id: 2,
        question: "¿Qué tan satisfecho está con nuestro producto?",
        options: [
          "Muy satisfecho",
          "Satisfecho",
          "Neutral",
          "Insatisfecho",
          "Muy insatisfecho",
        ],
      },
    ];

    const optionsObj = dummyQuestions.map((question) => ({
      id: question.id,
      options: new Array(question.options.length).fill(0),
    }));

    setQuestions(dummyQuestions);
    setFormData({
      ...formData,
      quizz: selectedQuizz,
      responses: optionsObj,
    });
  };

  const handleResponseChange = (questionId, optionIndex, value) => {
    if (parseFloat(value) < 0) return;
    if (isNaN(parseFloat(value))) value = 0;

    const updatedResponses = formData.responses.map((response) => {
      if (response.id === questionId) {
        response.options[optionIndex] = parseInt(value);
      }
      return response;
    });
    setFormData((prevFormData) => ({
      ...prevFormData,
      responses: updatedResponses,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.quizz && formData.company && formData.leader) {
      if (validateResponses()) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          timestamp: Date.now(),
        }));
        setConfirmDialogOpen(true);
      } else {
        window.alert(`La suma de las respuesta no coincide`);
      }
    } else {
      window.alert(
        "Por favor selecciona un cuestionario, una empresa y un líder."
      );
    }
  };

  const handleConfirmDialogClose = (confirmed) => {
    if (confirmed) {
      console.log(formData);
    }
    setConfirmDialogOpen(false);
  };

  const validateResponses = () => {
    let maxNumber = 0;
    for (const response of formData.responses) {
      const sum = response?.options.reduce((acc, curr) => acc + curr, 0);
      if (maxNumber > 0 && sum !== maxNumber) {
        return false;
      }
      maxNumber = Math.max(maxNumber, sum);
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Guardar Resultados</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="quizz-label">Cuestionario</InputLabel>
            <Select
              labelId="quizz-label"
              id="quizz-select"
              label="cuestionario"
              value={formData.quizz}
              onChange={handleQuizzChange}
              fullWidth
            >
              <MenuItem value={"quizz1"}>Cuestionario 1</MenuItem>
              <MenuItem value={"quizz2"}>Cuestionario 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="company-label">Empresa</InputLabel>
            <Select
              labelId="company-label"
              id="company"
              label="empresa"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              fullWidth
            >
              <MenuItem value={"company1"}>Empresa 1</MenuItem>
              <MenuItem value={"company2"}>Empresa 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="leader-label">Líder</InputLabel>
            <Select
              labelId="leader-label"
              id="leader"
              label="líder"
              value={formData.leader}
              onChange={(e) =>
                setFormData({ ...formData, leader: e.target.value })
              }
              fullWidth
            >
              <MenuItem value={"leader1"}>Líder 1</MenuItem>
              <MenuItem value={"leader2"}>Líder 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {questions.map((question) => (
          <React.Fragment key={question.id}>
            <Grid item xs={12}>
              <Typography variant="h6">{question.question}</Typography>
            </Grid>
            {question.options.map((option, optionIndex) => (
              <Grid item xs={12} key={`${question.id}-${optionIndex}`}>
                <TextField
                  label={option}
                  variant="outlined"
                  type="number"
                  inputProps={{ min: "0", step: "1" }}
                  value={
                    formData.responses.find(
                      (response) => response.id === question.id
                    )?.options[optionIndex] || ""
                  }
                  onChange={(e) =>
                    handleResponseChange(
                      question.id,
                      optionIndex,
                      e.target.value
                    )
                  }
                  fullWidth
                />
              </Grid>
            ))}
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Guardar Respuestas
          </Button>
        </Grid>
      </Grid>
      <Dialog
        open={confirmDialogOpen}
        onClose={() => handleConfirmDialogClose(false)}
      >
        <DialogTitle>Confirmar Envío</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas enviar este formulario?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleConfirmDialogClose(false)}
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleConfirmDialogClose(true)}
            color="primary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};
export default Create;
