import React, { useState, useEffect } from "react";
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
import axios from "axios";

const Create = () => {
  const initialState = {
    quizz: "",
    company: "",
    leader: "",
    responses: [],
    timestamp: null,
  }
  const [quizzes, setQuizzes] = useState([]);  
  const [companies, setCompanies] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [questions, setQuestions] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const getResults = async() => {
      const endpoints = ["https://psicologia-aplicada.com/quizz/psicologia-api/quizz/getAll.php", "https://psicologia-aplicada.com/quizz/psicologia-api/api/getPlants.php"];
      const responses = await Promise.all(endpoints.map(url=>axios.get(url)));
      const results = await Promise.all(responses.map(res => {
        return res.data;
      }));
     
      const [quizzes, companies] = results;
      console.log(results);
      const parsedQuizzes = quizzes.map(quiz => ({
        ...quiz,
        preguntas: JSON.parse(quiz.preguntas)
      }));

      setQuizzes(parsedQuizzes);
      setCompanies(companies);
    }
    
    getResults();
  }, [])
  

  const handleQuizzChange = (event) => {
    const selectedQuizz = event.target.value;
    const questions = quizzes.find(
      (quizz) => quizz.id === selectedQuizz
    )?.preguntas;
    if (!questions) return;

    const optionsObj = questions.map((question) => ({
      id: question.id,
      options: new Array(question.options.length).fill(0),
    }));

    setQuestions(questions);
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

  const handleCompanyChange = async (event) => {
    const newCompanyId = event.target.value;

    try {
      const response = await axios.get(`https://psicologia-aplicada.com/quizz/psicologia-api/api/getLideres.php?plant=${newCompanyId}`);
      setLeaders(response.data);  
    } catch (error) {
      console.error('Error fetching leaders:', error);
    }
  
    setFormData({ ...formData, company: newCompanyId, leader: "" });
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

  const handleConfirmDialogClose = async(confirmed) => {
    if (confirmed) {
      console.log(formData);
      try {
        const res = await axios.post(
          "https://psicologia-aplicada.com/quizz/psicologia-api/reports/saveReport.php",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        window.alert("Reporte creado correctamente");
        clearState();
      } catch (error) {
        console.log(formData, error);
        window.alert(
          "Ha ocurrido un error, por favor contactar al administrador"
        );
      }
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

  const clearState = () => {
    setFormData(initialState);
    setQuestions([]);
    setConfirmDialogOpen(false);
    setQuizzes([]);
    setCompanies([]);
    setLeaders([]);
  }

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
              {quizzes.length > 0 && quizzes.map((quizz) => (
                <MenuItem key={quizz.id} value={quizz.id}>
                  {quizz.titulo}
                </MenuItem>
              ))}
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
              onChange={handleCompanyChange}
              fullWidth
            >
              {companies.length > 0 && companies.map((company) => (
                <MenuItem key={company.IdPlanta} value={company.IdPlanta}>
                  {company.Planta}
                </MenuItem>
              ))}
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
              {leaders.length > 0 && leaders.map((leader) => (
                <MenuItem key={leader.idLider} value={leader.idLider}>
                  {leader.Nombre}
                </MenuItem>
              ))}
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
